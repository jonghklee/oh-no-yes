// Main game state and logic
class Game {
    constructor(canvas) {
        this.renderer = new Renderer(canvas);
        this.input = new Input(canvas);
        this.audio = new AudioSystem();
        this.particles = new ParticleSystem();
        this.animations = new AnimationSystem();
        this.saveSystem = new SaveSystem();

        // Game systems
        this.economy = new Economy();
        this.inventory = new Inventory();
        this.crafting = new CraftingSystem();
        this.combat = new CombatSystem();
        this.shop = new ShopSystem();
        this.exploration = new ExplorationSystem();
        this.skills = new SkillSystem();
        this.reputation = new ReputationSystem();
        this.quests = new QuestSystem();

        // Player state
        this.gold = 100;
        this.level = 1;
        this.xp = 0;
        this.day = 1;
        this.totalGold = 100;
        this.baseStats = {
            maxHp: 50, maxMp: 20, atk: 5, def: 3, speed: 5,
            critRate: 0.05, critDmg: 0.5, dodge: 0, counter: 0,
            lifesteal: 0
        };

        // UI state
        this.screen = 'title'; // title, shop, craft, explore, combat, inventory, skills, map, quest
        this.previousScreen = 'shop';
        this.notifications = [];
        this.dialogMessage = null;
        this.scrollOffset = 0;
        this.selectedItem = null;
        this.hoveredItem = null;
        this.tooltipItem = null;
        this.dayPhase = 'morning'; // morning, afternoon, evening
        this.dayTimer = 0;
        this.phaseLength = 30000; // 30 seconds per phase
        this.paused = false;
        this.gameSpeed = 1;
        this.showTutorial = true;
        this.tutorialStep = 0;

        // Initialize
        this.quests.autoAcceptMainQuests();
    }

    getPlayerStats() {
        const equipStats = this.inventory.getEquipStats();
        const skillBonuses = this.skills.getBonuses();
        return {
            maxHp: this.baseStats.maxHp + (equipStats.hp || 0) + (skillBonuses.maxHp || 0),
            maxMp: this.baseStats.maxMp + (equipStats.mp || 0),
            atk: this.baseStats.atk + (equipStats.atk || 0) + (skillBonuses.atk || 0),
            def: this.baseStats.def + (equipStats.def || 0) + (skillBonuses.def || 0),
            speed: this.baseStats.speed + (equipStats.speed || 0),
            critRate: this.baseStats.critRate + (equipStats.critRate || 0) + (skillBonuses.critRate || 0),
            critDmg: this.baseStats.critDmg + (equipStats.critDmg || 0) + (skillBonuses.critDmg || 0),
            dodge: this.baseStats.dodge + (equipStats.dodge || 0) + (skillBonuses.dodge || 0),
            counter: this.baseStats.counter + (skillBonuses.counter || 0),
            lifesteal: this.baseStats.lifesteal + (equipStats.lifesteal || 0) + (skillBonuses.lifesteal || 0),
            matk: equipStats.matk || 0,
            mdef: (equipStats.mdef || 0) + (skillBonuses.mdef || 0)
        };
    }

    getSkillBonuses() {
        const skillBonuses = this.skills.getBonuses();
        const equipStats = this.inventory.getEquipStats();
        return {
            ...skillBonuses,
            sellBonus: (skillBonuses.sellBonus || 0) + (equipStats.sellBonus || 0),
            buyDiscount: (skillBonuses.buyDiscount || 0) + (equipStats.buyDiscount || 0),
            luck: (skillBonuses.luck || 0) + (equipStats.luck || 0),
            dropBonus: (skillBonuses.dropBonus || 0) + (equipStats.dropBonus || 0),
            oreBonus: (skillBonuses.oreBonus || 0) + (equipStats.oreBonus || 0),
            herbBonus: (skillBonuses.herbBonus || 0) + (equipStats.herbBonus || 0)
        };
    }

    addGold(amount) {
        this.gold += amount;
        this.totalGold += amount;
        this.quests.updateProgress('totalGold', { count: this.totalGold });
        this.quests.updateProgress('earnGold', { count: amount });
    }

    spendGold(amount) {
        if (this.gold < amount) return false;
        this.gold -= amount;
        return true;
    }

    addXp(amount) {
        this.xp += amount;
        while (this.xp >= getXpForLevel(this.level)) {
            this.xp -= getXpForLevel(this.level);
            this.level++;
            this.skills.addPoints(getSkillPointsForLevel(this.level));
            this.baseStats.maxHp += 5;
            this.baseStats.atk += 1;
            this.baseStats.def += 1;
            this.notify(`Level Up! You are now level ${this.level}!`, '#ffd700');
            this.audio.levelUp();
        }
    }

    notify(message, color = '#fff', duration = 3000) {
        this.notifications.push({ message, color, duration, timer: duration });
    }

    showDialog(message, options = null) {
        this.dialogMessage = { message, options };
    }

    dismissDialog() {
        this.dialogMessage = null;
    }

    advanceDay() {
        this.day++;
        this.dayPhase = 'morning';
        this.dayTimer = 0;

        // Update systems
        this.economy.updatePrices(this.day);
        this.shop.newDay();
        this.exploration.newDay();

        // Check for events
        for (const event of this.economy.activeEvents) {
            if (event.effects.instantGold) {
                const gold = Utils.random(event.effects.instantGold[0], event.effects.instantGold[1]);
                this.addGold(gold);
                this.notify(`${event.name}: Found ${gold}g!`, '#ffd700');
            }
            if (event.effects.freeSkillPoint) {
                this.skills.addPoints(1);
                this.notify(`${event.name}: +1 Skill Point!`, '#44aaff');
            }
        }

        // Season notification
        const season = getSeason(this.day);
        const dayInSeason = getDayInSeason(this.day);
        if (dayInSeason === 1) {
            this.notify(`${season.icon} ${season.name} has begun!`, season.color);
        }

        // Event notifications
        for (const event of this.economy.activeEvents) {
            this.notify(`${event.icon} ${event.name}`, event.type === 'positive' ? '#44ff44' : event.type === 'negative' ? '#ff4444' : '#ffaa44');
        }

        // Quest updates
        this.quests.autoAcceptMainQuests();
        this.reputation.addReputation(1); // small daily reputation

        // Auto-save
        this.saveGame();
    }

    update(dt) {
        if (this.screen === 'title') return;
        if (this.paused) return;

        dt *= this.gameSpeed;

        // Update day timer
        this.dayTimer += dt;
        if (this.dayTimer >= this.phaseLength) {
            this.dayTimer = 0;
            if (this.dayPhase === 'morning') this.dayPhase = 'afternoon';
            else if (this.dayPhase === 'afternoon') this.dayPhase = 'evening';
            else {
                this.advanceDay();
            }
        }

        // Update systems
        this.particles.update();
        this.animations.update(dt);

        if (this.screen === 'shop') {
            const results = this.shop.update(dt, this.day, this.reputation.reputation, this.economy, this.getSkillBonuses());
            for (const r of results) {
                if (r.type === 'customerLeft') {
                    this.reputation.loseReputation(1);
                }
            }
        }

        if (this.screen === 'craft') {
            const result = this.crafting.update(dt);
            if (result) {
                this.inventory.addItem(result.itemId, result.qty);
                this.notify(`Crafted ${ItemDB[result.itemId]?.name || result.itemId} x${result.qty}!`, '#44aaff');
                this.audio.craft();
                this.quests.updateProgress('craft', { count: 1 });
                this.quests.updateProgress('totalCrafts', { count: this.crafting.totalCrafts });
                if (RecipeDB[result.itemId]) {
                    this.quests.updateProgress('craftCategory', { category: RecipeDB[result.itemId].category, count: 1 });
                }
                if (result.leveledUp) {
                    this.notify(`Crafting level up! Level ${result.newLevel}`, '#ffd700');
                }
            }
        }

        if (this.screen === 'combat') {
            const result = this.combat.update(dt);
            if (result) {
                this.handleCombatResult(result);
            }
        }

        // Update notifications
        for (let i = this.notifications.length - 1; i >= 0; i--) {
            this.notifications[i].timer -= dt;
            if (this.notifications[i].timer <= 0) {
                this.notifications.splice(i, 1);
            }
        }

        // Auto-save check
        if (this.saveSystem.shouldAutoSave(Date.now())) {
            this.saveGame();
        }

        // Check completed quests
        const completed = this.quests.updateProgress('totalGold', { count: 0 }); // re-check
        for (const qid of completed) {
            this.notify(`Quest complete: ${QuestDB[qid]?.name}!`, '#ffd700');
        }
    }

    handleCombatResult(result) {
        if (result.playerDefeated) {
            this.audio.defeat();
            this.exploration.onCombatDefeat();
            // Lose some gold
            const lost = Math.round(this.gold * 0.1);
            this.gold -= lost;
            this.notify(`Defeated! Lost ${lost}g`, '#ff4444');
            setTimeout(() => { this.screen = this.previousScreen; }, 2000);
        }
    }

    collectCombatRewards() {
        const rewards = this.combat.getRewards();
        if (!rewards) return;

        const bonuses = this.getSkillBonuses();

        // Gold
        let gold = rewards.gold;
        if (bonuses.goldBonus) gold = Math.round(gold * (1 + bonuses.goldBonus));
        this.addGold(gold);
        this.audio.coin();

        // XP
        this.addXp(rewards.xp);

        // Drops
        for (const drop of rewards.drops) {
            let qty = drop.qty;
            if (bonuses.lootBonus) qty = Math.round(qty * (1 + bonuses.lootBonus));
            qty = Math.max(1, qty);
            this.inventory.addItem(drop.item, qty);
        }

        // Quest progress
        this.quests.updateProgress('defeatBoss', { boss: this.combat.enemy?.id });

        // Reputation
        if (rewards.isBoss) {
            this.reputation.addReputation(10);
            this.audio.victory();
        }

        // Return to exploration
        if (this.exploration.active) {
            this.exploration.onCombatVictory(this.combat.enemy?.id);
            this.screen = 'explore';
        } else {
            this.screen = this.previousScreen;
        }

        this.notify(`+${gold}g, +${rewards.xp} XP!`, '#ffd700');
    }

    switchScreen(screen) {
        if (this.combat.active && screen !== 'combat') return; // can't leave combat
        this.previousScreen = this.screen;
        this.screen = screen;
        this.scrollOffset = 0;
        this.selectedItem = null;
        this.audio.click();
    }

    sellItem(itemId) {
        const bonuses = this.getSkillBonuses();
        const price = this.economy.getSellPrice(itemId, 1.0, bonuses);
        if (!this.inventory.removeItem(itemId, 1)) return false;

        this.addGold(price);
        this.audio.sell();
        this.quests.updateProgress('sell', { count: 1 });
        this.quests.updateProgress('totalSales', { count: this.shop.totalSales + 1 });
        this.reputation.addReputation(1);
        this.particles.goldGain(600, 400, price);
        return true;
    }

    saveGame() {
        const state = {
            gold: this.gold,
            level: this.level,
            xp: this.xp,
            day: this.day,
            totalGold: this.totalGold,
            baseStats: this.baseStats,
            dayPhase: this.dayPhase,
            gameSpeed: this.gameSpeed,
            showTutorial: this.showTutorial,
            tutorialStep: this.tutorialStep,
            inventory: this.inventory.serialize(),
            economy: this.economy.serialize(),
            crafting: this.crafting.serialize(),
            shop: this.shop.serialize(),
            exploration: this.exploration.serialize(),
            skills: this.skills.serialize(),
            reputation: this.reputation.serialize(),
            quests: this.quests.serialize()
        };
        this.saveSystem.save(state);
    }

    loadGame() {
        const data = this.saveSystem.load();
        if (!data) return false;

        this.gold = data.gold || 100;
        this.level = data.level || 1;
        this.xp = data.xp || 0;
        this.day = data.day || 1;
        this.totalGold = data.totalGold || this.gold;
        this.baseStats = data.baseStats || this.baseStats;
        this.dayPhase = data.dayPhase || 'morning';
        this.gameSpeed = data.gameSpeed || 1;
        this.showTutorial = data.showTutorial !== undefined ? data.showTutorial : true;
        this.tutorialStep = data.tutorialStep || 0;

        if (data.inventory) this.inventory.deserialize(data.inventory);
        if (data.economy) this.economy.deserialize(data.economy);
        if (data.crafting) this.crafting.deserialize(data.crafting);
        if (data.shop) this.shop.deserialize(data.shop);
        if (data.exploration) this.exploration.deserialize(data.exploration);
        if (data.skills) this.skills.deserialize(data.skills);
        if (data.reputation) this.reputation.deserialize(data.reputation);
        if (data.quests) this.quests.deserialize(data.quests);

        this.economy.updatePrices(this.day);
        this.screen = 'shop';
        return true;
    }

    newGame() {
        // Give starting items
        this.inventory.addItem('wood', 10);
        this.inventory.addItem('herb', 5);
        this.inventory.addItem('stone', 5);
        this.inventory.addItem('leather', 3);
        this.inventory.addItem('health_potion', 3);
        this.inventory.addItem('wooden_sword', 1);
        this.inventory.equip('wooden_sword');

        this.economy.updatePrices(1);
        this.screen = 'shop';
        this.audio.init();

        this.notify('Welcome to Oh No Yes! Build your merchant empire!', '#ffd700', 5000);
    }
}
