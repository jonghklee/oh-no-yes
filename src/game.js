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
        this.endless = new EndlessDungeon();
        this.daily = new DailyChallengeSystem();
        this.codex = new Codex();
        this.mystery = new MysteryChestSystem();
        this.tradeRoutes = new TradeRouteSystem();
        this.bank = new BankSystem();
        this.enchantment = new EnchantmentSystem();
        this.prestige = new PrestigeSystem();
        this.pets = new PetSystem();
        this.achievements = new AchievementSystem();
        this.npcRelations = new NpcRelationshipSystem();

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
        this.prestigeLevel = 0;

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
            this.particles.levelUpEffect(600, 400);
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
        // End-of-day summary (before resetting daily stats)
        const daySummary = {
            sales: this.shop.dailySales,
            earnings: this.shop.dailyEarnings,
            dailyDone: this.daily.completedToday
        };

        this.day++;
        this.dayPhase = 'morning';
        this.dayTimer = 0;

        // Show brief summary notification
        if (daySummary.sales > 0 || daySummary.earnings > 0) {
            let summary = `Day ${this.day - 1} recap: ${daySummary.sales} sales, ${daySummary.earnings}g earned`;
            if (daySummary.dailyDone) summary += ' ✅ Daily done!';
            this.notify(summary, '#aaaaff', 4000);
        }

        // Update systems
        this.economy.updatePrices(this.day);
        this.shop.newDay();
        this.exploration.newDay();

        // Bank interest processing
        this.bank.updateMaxDeposit(this.reputation.reputation);
        const bankResults = this.bank.processDailyInterest();
        for (const br of bankResults) {
            if (br.type === 'interest' && br.amount > 0) {
                this.notify(`🏦 Bank interest: +${br.amount}g (total: ${br.total}g)`, '#44ddff');
            }
            if (br.type === 'loanInterest') {
                if (br.daysLeft <= 5) {
                    this.notify(`⚠ Loan due in ${br.daysLeft} days! (${br.remaining}g)`, '#ff4444');
                }
            }
            if (br.type === 'forcedRepayment') {
                this.notify(`🏦 Loan forcibly collected: -${br.amount}g from deposits`, '#ff4444');
            }
        }

        // Check trade route returns
        const returns = this.tradeRoutes.checkReturns(this.day);
        for (const ret of returns) {
            if (ret.success) {
                this.addGold(ret.profit);
                this.notify(`${ret.icon} ${ret.message}`, '#44ff44', 5000);
                this.audio.coin();
            } else {
                this.notify(`${ret.icon} ${ret.message}`, '#ff4444', 5000);
            }
        }

        // Generate daily challenge
        const challenge = this.daily.generateChallenge(this.day, this.level);
        this.notify(`📋 Daily: ${challenge.name} - ${challenge.desc.replace('{target}', challenge.target)}`, '#44ddff', 5000);

        // Weekly boss challenge (every 7 days)
        if (this.day % 7 === 0 && this.level >= 5) {
            const weeklyBosses = Object.values(EnemyDB).filter(e => e.boss || e.miniBoss);
            const weeklyBoss = Utils.choice(weeklyBosses);
            if (weeklyBoss) {
                this.weeklyBoss = Utils.deepClone(weeklyBoss);
                this.weeklyBoss.hp = Math.round(this.weeklyBoss.hp * (1.5 + this.day * 0.01));
                this.weeklyBoss.atk = Math.round(this.weeklyBoss.atk * (1.3 + this.day * 0.005));
                this.weeklyBoss.name = `⭐ Weekly: ${this.weeklyBoss.name}`;
                this.weeklyBoss.xp *= 5;
                this.weeklyBoss.gold = [this.weeklyBoss.gold[0] * 5, this.weeklyBoss.gold[1] * 5];
                this.notify('⭐ Weekly Boss Challenge available! Check Explore tab.', '#ff44ff', 5000);
            }
        }

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

        // Handle keyboard shortcuts (before pause check)
        if (this.input.justPressed(' ')) {
            this.paused = !this.paused;
            this.audio.click();
        }
        if (this.input.justPressed('Escape')) {
            if (SettingsUI.visible) {
                SettingsUI.visible = false;
            } else if (this.dialogMessage) {
                this.dismissDialog();
            } else if (this.exploration.active) {
                this.exploration.endExploration();
            }
        }

        // Tab switching (always available, even when paused)
        if (!this.combat.active && !SettingsUI.visible) {
            const tabs = ['shop', 'craft', 'explore', 'inventory', 'skills', 'quest', 'map'];
            for (let i = 0; i < tabs.length; i++) {
                if (this.input.justPressed((i + 1).toString())) {
                    this.switchScreen(tabs[i]);
                }
            }
        }

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

        // Sell combo timer decay
        if (this._sellCombo && this._sellCombo.timer > 0) {
            this._sellCombo.timer -= dt;
            if (this._sellCombo.timer <= 0) {
                this._sellCombo = { category: null, count: 0, timer: 0 };
            }
        }

        // Music mood based on screen
        const moodMap = { shop: 'shop', craft: 'shop', inventory: 'shop', skills: 'shop',
                          explore: 'explore', map: 'shop', quest: 'shop', combat: 'combat', title: 'title' };
        const targetMood = moodMap[this.screen] || 'shop';
        if (this.audio.musicPlaying) {
            this.audio.setMood(targetMood);
        }

        if (this.screen === 'shop') {
            const results = this.shop.update(dt, this.day, this.reputation.reputation, this.economy, this.getSkillBonuses());
            for (const r of results) {
                if (r.type === 'customerLeft') {
                    this.reputation.loseReputation(1);
                }
            }
        }

        if (this.screen === 'craft') {
            const result = this.crafting.update(dt, this.inventory, this.getSkillBonuses());
            if (result) {
                this.inventory.addItem(result.itemId, result.qty);
                this.notify(`Crafted ${ItemDB[result.itemId]?.name || result.itemId} x${result.qty}!`, '#44aaff');
                this.audio.craft();
                this.particles.craftEffect(900, 400);
                this.quests.updateProgress('craft', { count: 1 });
                this.quests.updateProgress('totalCrafts', { count: this.crafting.totalCrafts });
                this.trackDaily('craft', 1);
                this.codex.discoverItem(result.itemId);
                if (RecipeDB[result.itemId]) {
                    this.quests.updateProgress('craftCategory', { category: RecipeDB[result.itemId].category, count: 1 });
                }
                if (result.leveledUp) {
                    this.notify(`Crafting level up! Level ${result.newLevel}`, '#ffd700');
                    this.particles.levelUpEffect(600, 400);
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

        // Check achievements (every 2 seconds to save performance)
        this._achTimer = (this._achTimer || 0) + dt;
        if (this._achTimer > 2000) {
            this._achTimer = 0;
            const achState = {
                totalSales: this.shop.totalSales,
                totalGoldEarned: this.totalGold,
                totalCrafts: this.crafting.totalCrafts,
                playerLevel: this.level,
                day: this.day,
                prestigeLevel: this.prestigeLevel || 0,
                allStationsUnlocked: Object.values(this.crafting.unlockedStations).every(v => v),
                allAreasVisited: this.exploration.areasVisited.size >= 9,
                defeatedBosses: [...this.exploration.bossesDefeated],
                uniqueItemsOwned: Object.keys(this.inventory.items).length,
                maxCraftingLevel: this.crafting.level >= 25
            };
            const newAch = this.achievements.checkAll(achState);
            for (const ach of newAch) {
                this.notify(`🏆 Achievement: ${ach.name}!`, '#ffd700', 5000);
                this.audio.victory();
                // Apply rewards
                if (ach.reward) {
                    if (ach.reward.gold) this.addGold(ach.reward.gold);
                    if (ach.reward.xp) this.addXp(ach.reward.xp);
                    if (ach.reward.skillPoints) this.skills.addPoints(ach.reward.skillPoints);
                }
            }
        }
    }

    handleCombatResult(result) {
        if (result.playerDefeated) {
            this.audio.defeat();
            if (this.endless.active) {
                const endResult = this.endless.onDefeat();
                this.notify(`Endless Dungeon: Cleared ${endResult.floorsCleared} floors!`, '#ff44ff');
                if (endResult.isNewRecord) this.notify('New record!', '#ffd700');
                setTimeout(() => { this.screen = 'explore'; }, 2000);
            } else {
                this.exploration.onCombatDefeat();
                const lost = Math.round(this.gold * 0.1);
                this.gold -= lost;
                this.notify(`Defeated! Lost ${lost}g`, '#ff4444');
                setTimeout(() => { this.screen = this.previousScreen; }, 2000);
            }
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

        // Reputation, daily progress & codex
        if (rewards.isBoss) {
            this.reputation.addReputation(10);
            this.audio.victory();
        }
        this.trackDaily('defeat', 1);
        if (this.combat.enemy) this.codex.discoverEnemy(this.combat.enemy.id);
        for (const drop of rewards.drops) {
            this.codex.discoverItem(drop.item);
        }

        // Return to exploration or endless dungeon
        if (this.endless.active) {
            // Endless dungeon: get floor reward and advance
            const floorReward = this.endless.onVictory();
            this.addGold(floorReward.gold);
            this.addXp(floorReward.xp);
            for (const item of floorReward.items) {
                this.inventory.addItem(item.item, item.qty);
            }
            // Start next floor
            const nextEnemy = this.endless.nextFloor();
            this.combat.startBattle(this.getPlayerStats(), nextEnemy);
            // Stay in combat screen
            this.notify(`Floor ${this.endless.floor - 1} cleared! +${floorReward.gold}g`, '#ff44ff');
        } else if (this.exploration.active) {
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

    trackDaily(type, amount = 1) {
        if (!this.daily.currentChallenge) return;
        const completed = this.daily.addProgress(type, amount);
        if (completed) {
            const reward = this.daily.currentChallenge.reward;
            this.addGold(reward.gold);
            this.addXp(reward.xp);
            if (reward.bonus === 'skillPoint') {
                this.skills.addPoints(1);
                this.notify('🎁 Streak bonus: +1 Skill Point!', '#ff44ff');
            }
            this.notify(`📋 Daily Challenge Complete! +${reward.gold}g, +${reward.xp}XP`, '#44ddff', 4000);
            this.audio.victory();
        }
    }

    sellItem(itemId) {
        const bonuses = this.getSkillBonuses();
        let price = this.economy.getSellPrice(itemId, 1.0, bonuses);

        // Sell combo system - selling items of same category in sequence gives bonus
        const item = ItemDB[itemId];
        if (item) {
            if (!this._sellCombo) this._sellCombo = { category: null, count: 0, timer: 0 };
            if (item.category === this._sellCombo.category && this._sellCombo.timer > 0) {
                this._sellCombo.count++;
                const comboBonus = Math.min(0.5, this._sellCombo.count * 0.05); // up to 50% bonus
                const bonusGold = Math.round(price * comboBonus);
                price += bonusGold;
                if (this._sellCombo.count >= 3 && this._sellCombo.count % 3 === 0) {
                    this.notify(`🔥 Sell Combo x${this._sellCombo.count}! +${Math.round(comboBonus * 100)}% bonus!`, '#ff8844');
                    this.particles.burst(600, 400, 8, '#ff8844', 2);
                }
            } else {
                this._sellCombo = { category: item.category, count: 1, timer: 3000 };
            }
            this._sellCombo.timer = 3000; // Reset timer on each sell
        }

        if (!this.inventory.removeItem(itemId, 1)) return false;

        this.addGold(price);
        this.audio.sell();
        this.quests.updateProgress('sell', { count: 1 });
        this.quests.updateProgress('totalSales', { count: this.shop.totalSales + 1 });
        this.reputation.addReputation(1);
        this.particles.goldGain(600, 400, price);
        this.trackDaily('sell', 1);
        this.trackDaily('earnGold', price);
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
            prestigeLevel: this.prestigeLevel,
            inventory: this.inventory.serialize(),
            economy: this.economy.serialize(),
            crafting: this.crafting.serialize(),
            shop: this.shop.serialize(),
            exploration: this.exploration.serialize(),
            skills: this.skills.serialize(),
            reputation: this.reputation.serialize(),
            quests: this.quests.serialize(),
            enchantment: this.enchantment.serialize(),
            prestige: this.prestige.serialize(),
            endless: this.endless.serialize(),
            achievements: this.achievements.serialize(),
            daily: this.daily.serialize(),
            codex: this.codex.serialize(),
            mystery: this.mystery.serialize(),
            tradeRoutes: this.tradeRoutes.serialize(),
            bank: this.bank.serialize()
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
        // Skip tutorial on saves past day 3
        this.showTutorial = (data.day || 1) <= 3 ? (data.showTutorial !== undefined ? data.showTutorial : true) : false;
        this.tutorialStep = data.tutorialStep || 0;
        this.prestigeLevel = data.prestigeLevel || 0;

        if (data.inventory) this.inventory.deserialize(data.inventory);
        if (data.economy) this.economy.deserialize(data.economy);
        if (data.crafting) this.crafting.deserialize(data.crafting);
        if (data.shop) this.shop.deserialize(data.shop);
        if (data.exploration) this.exploration.deserialize(data.exploration);
        if (data.skills) this.skills.deserialize(data.skills);
        if (data.reputation) this.reputation.deserialize(data.reputation);
        if (data.quests) this.quests.deserialize(data.quests);
        if (data.enchantment) this.enchantment.deserialize(data.enchantment);
        if (data.prestige) this.prestige.deserialize(data.prestige);
        if (data.endless) this.endless.deserialize(data.endless);
        if (data.achievements) this.achievements.deserialize(data.achievements);
        if (data.daily) this.daily.deserialize(data.daily);
        if (data.codex) this.codex.deserialize(data.codex);
        if (data.mystery) this.mystery.deserialize(data.mystery);
        if (data.tradeRoutes) this.tradeRoutes.deserialize(data.tradeRoutes);
        if (data.bank) this.bank.deserialize(data.bank);

        this.economy.updatePrices(this.day);
        this.screen = 'shop';
        this.audio.init();
        this.audio.startMusic('shop');
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
        this.audio.startMusic('shop');

        // Apply prestige bonuses
        if (this.prestigeLevel > 0) {
            this.gold += this.prestigeLevel * 500;
            this.baseStats.maxHp += this.prestigeLevel * 10;
            this.baseStats.atk += this.prestigeLevel * 2;
            this.baseStats.def += this.prestigeLevel * 2;
            this.skills.addPoints(this.prestigeLevel * 2);
            this.notify(`New Game+ ${this.prestigeLevel}! Prestige bonuses applied!`, '#ff44ff', 5000);
        } else {
            this.notify('Welcome to Oh No Yes! Build your merchant empire!', '#ffd700', 5000);
        }
    }

    // New Game+ / Prestige system
    canPrestige() {
        return this.quests.completedQuests.has('void_beckons') || this.level >= 30;
    }

    startPrestige() {
        if (!this.canPrestige()) return false;

        this.prestigeLevel = (this.prestigeLevel || 0) + 1;
        const keepGold = Math.floor(this.gold * 0.1); // Keep 10% gold

        // Reset most systems but keep prestige bonuses
        const prestigeLevel = this.prestigeLevel;

        this.gold = keepGold;
        this.level = 1;
        this.xp = 0;
        this.day = 1;
        this.totalGold = keepGold;
        this.dayPhase = 'morning';
        this.dayTimer = 0;
        this.baseStats = {
            maxHp: 50, maxMp: 20, atk: 5, def: 3, speed: 5,
            critRate: 0.05, critDmg: 0.5, dodge: 0, counter: 0,
            lifesteal: 0
        };

        this.inventory = new Inventory();
        this.economy = new Economy();
        this.crafting = new CraftingSystem();
        this.shop = new ShopSystem();
        this.exploration = new ExplorationSystem();
        this.skills = new SkillSystem();
        this.reputation = new ReputationSystem();
        this.quests = new QuestSystem();

        this.quests.autoAcceptMainQuests();
        this.prestigeLevel = prestigeLevel;
        this.newGame();
        this.saveGame();
        return true;
    }

    // Statistics for display
    getStats() {
        return {
            totalGold: this.totalGold,
            totalSales: this.shop.totalSales,
            totalCrafts: this.crafting.totalCrafts,
            areasExplored: this.exploration.areasVisited.size,
            bossesDefeated: this.exploration.bossesDefeated.size,
            questsCompleted: this.quests.completedQuests.size,
            reputation: this.reputation.reputation,
            prestigeLevel: this.prestigeLevel || 0,
            playDays: this.day
        };
    }
}
