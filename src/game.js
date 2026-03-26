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
        this.milestones = new MilestoneSystem();
        this.luckySpin = new LuckySpinSystem();
        this.fusion = new FusionSystem();
        this.marketOrders = new MarketOrderSystem();
        this.challengeMode = new ChallengeModeSystem();
        this.statsTracker = new StatsTracker();
        this.loginRewards = new LoginRewardSystem();
        this.enhance = new EnhanceSystem();
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
        this.playtimeMs = 0; // total playtime in milliseconds
        this.sessions = 0;

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
        const prevGold = this.gold;
        this.gold += amount;
        this.totalGold += amount;
        this.quests.updateProgress('totalGold', { count: this.totalGold });
        this.quests.updateProgress('earnGold', { count: amount });

        // Gold milestone celebrations
        const milestones = [
            { threshold: 1000, name: '1K Gold!', color: '#ffd700' },
            { threshold: 5000, name: '5K Gold!', color: '#ffd700' },
            { threshold: 10000, name: '10K Gold!', color: '#ff8844' },
            { threshold: 50000, name: '50K Gold!', color: '#ff44ff' },
            { threshold: 100000, name: '100K Gold!', color: '#ff44ff' },
            { threshold: 500000, name: '500K Gold!', color: '#44ffff' },
            { threshold: 1000000, name: 'MILLIONAIRE!', color: '#ffd700' },
        ];
        for (const m of milestones) {
            if (prevGold < m.threshold && this.gold >= m.threshold) {
                this.notify(`🎉 ${m.name} Total gold: ${Utils.formatGold(this.gold)}!`, m.color, 5000);
                this.audio.victory();
                this.particles.burst(600, 400, 20, m.color, 4);
                this.renderer.flash(m.color, 200);
                break;
            }
        }
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

        // Record daily stats
        this.statsTracker.recordDay(
            this.shop.dailyEarnings,
            this.shop.dailySales,
            this.crafting.totalCrafts // cumulative but that's ok
        );

        // Reset daily synergy
        this._dailyActivities = new Set();
        this._synergy3Claimed = false;
        this._synergy4Claimed = false;

        // Market order processing
        const orderResults = this.marketOrders.processOrders(this.economy, this.inventory, this.getSkillBonuses());
        for (const or of orderResults) {
            if (or.type === 'sold') {
                this.addGold(or.gold);
                this.notify(`📊 Auto-sold ${or.qty}x ${ItemDB[or.item]?.name || or.item} for ${or.gold}g`, '#44ddff');
            } else if (or.type === 'alert') {
                this.notify(`📊 Price Alert: ${ItemDB[or.item]?.name} is now ${or.price}g (${or.direction})!`, '#ffaa44');
            }
        }

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

        // Daily login reward
        if (this.loginRewards.canClaim(this.day)) {
            const reward = this.loginRewards.claim(this.day);
            if (reward) {
                if (reward.type === 'gold') {
                    this.addGold(reward.value);
                    this.notify(`📅 Day ${this.loginRewards.getDayInCycle()}/7: ${reward.icon} +${reward.value}g!`, '#ffd700', 4000);
                } else if (reward.type === 'item') {
                    this.inventory.addItem(reward.item, reward.qty);
                    this.notify(`📅 Day ${this.loginRewards.getDayInCycle()}/7: ${reward.icon} ${reward.name}!`, '#44ff44', 4000);
                } else if (reward.type === 'skillPoint') {
                    this.skills.addPoints(reward.value);
                    this.notify(`📅 Day ${this.loginRewards.getDayInCycle()}/7: ${reward.icon} +1 Skill Point!`, '#ff44ff', 4000);
                } else if (reward.type === 'mega') {
                    this.addGold(reward.gold);
                    for (const item of reward.items) this.inventory.addItem(item.item, item.qty);
                    this.notify(`📅 Day 7/7: ${reward.icon} MEGA REWARD! +${reward.gold}g + items!`, '#ffd700', 5000);
                    this.audio.victory();
                    this.particles.burst(600, 400, 25, '#ffd700', 5);
                }
            }
        }

        // Lucky spin reminder
        if (this.luckySpin.canSpin(this.day)) {
            this.notify('🎰 Daily Lucky Spin available! Check Shop tab.', '#ff44ff');
        }

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
            this.notify(`${season.icon} ${season.name} has begun!`, season.color, 5000);
            this.renderer.flash(season.color, 300);
            this.particles.burst(600, 400, 15, season.color, 3);
            this.audio.discover();
        }

        // Event notifications
        for (const event of this.economy.activeEvents) {
            this.notify(`${event.icon} ${event.name}`, event.type === 'positive' ? '#44ff44' : event.type === 'negative' ? '#ff4444' : '#ffaa44');
        }

        // Quest updates
        this.quests.autoAcceptMainQuests();
        this.reputation.addReputation(1);

        // Monthly bonus (first day of each month/season)
        if (getDayInSeason(this.day) === 1) {
            const monthBonus = Math.round(100 * this.level * (1 + this.day * 0.01));
            this.addGold(monthBonus);
            this.notify(`🗓 New Month! Monthly bonus: +${monthBonus}g`, '#44ddff', 4000);
        }

        // Secret events on special days
        if (this.day === 100) {
            this.notify('🌟 Day 100! A mysterious merchant appears...', '#ff44ff', 5000);
            this.inventory.addItem('diamond', 3);
            this.addGold(5000);
            this.notify('🎁 Gift: 3x Diamond + 5000g!', '#ffd700');
        }
        if (this.day === 365) {
            this.notify('🎂 One year anniversary! The gods bestow a gift!', '#ffd700', 5000);
            this.inventory.addItem('phoenix_feather', 2);
            this.inventory.addItem('void_essence', 5);
            this.skills.addPoints(5);
            this.notify('🎁 Gift: 2x Phoenix Feather + 5x Void Essence + 5 SP!', '#ffd700');
        }
        if (this.day % 77 === 0 && this.day > 0) {
            // Lucky day every 77 days
            const luckyGold = Math.round(this.gold * 0.1);
            this.addGold(luckyGold);
            this.notify(`🍀 Lucky Day ${this.day}! +${luckyGold}g (10% of current gold)!`, '#44ff44');
            this.particles.burst(600, 400, 15, '#44ff44', 3);
        }

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

        // Challenge mode update
        if (this.challengeMode.active) {
            const challengeResult = this.challengeMode.update(dt);
            if (challengeResult) {
                // Challenge completed
                if (challengeResult.reward.gold) this.addGold(challengeResult.reward.gold);
                if (challengeResult.reward.xp) this.addXp(challengeResult.reward.xp);
                const recordText = challengeResult.isNewRecord ? ' 🏆 NEW RECORD!' : '';
                this.notify(`${challengeResult.challenge.icon} ${challengeResult.challenge.name}: Score ${challengeResult.score}!${recordText}`, '#ff44ff', 5000);
                this.notify(`Reward: +${challengeResult.reward.gold}g, +${challengeResult.reward.xp}XP`, '#ffd700');
                this.audio.victory();
                this.particles.burst(600, 400, 20, '#ff44ff', 4);
            }
        }

        // Lucky spin update
        const spinResult = this.luckySpin.update(dt);
        if (spinResult) {
            // Apply spin result
            if (spinResult.type === 'gold') { this.addGold(spinResult.value); }
            if (spinResult.type === 'xp') { this.addXp(spinResult.value); }
            if (spinResult.type === 'skillPoint') { this.skills.addPoints(spinResult.value); }
            if (spinResult.type === 'item') { this.inventory.addItem(spinResult.item, spinResult.qty); }
            if (spinResult.type === 'stamina') { this.exploration.restStamina(this.exploration.maxStamina); }
            this.notify(`🎰 Lucky Spin: ${spinResult.name}!`, spinResult.color, 4000);
            if (spinResult.value >= 500 || spinResult.type === 'skillPoint') {
                this.audio.victory();
                this.particles.burst(600, 400, 20, spinResult.color, 4);
                this.renderer.shake(300);
            } else {
                this.audio.coin();
                this.particles.sparkle(600, 400, spinResult.color);
            }
        }

        // Playtime tracking
        this.playtimeMs += dt;

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

        // Random shop micro-events (every ~45 seconds)
        this._shopEventTimer = (this._shopEventTimer || 0) + dt;
        if (this._shopEventTimer > 45000 && this.screen === 'shop' && Math.random() < 0.3) {
            this._shopEventTimer = 0;
            const events = [
                { msg: '🎭 A street performer attracts crowds! +20% customer rate for 30s.', effect: () => { this.shop.customerTimer += this.shop.customerInterval * 0.5; } },
                { msg: '💨 A gust of wind reveals a coin! +' + Utils.random(5, 20) * this.level + 'g', effect: () => { this.addGold(Utils.random(5, 20) * this.level); } },
                { msg: '📦 A lost package arrives at your door!', effect: () => {
                    const items = ['herb', 'iron_ore', 'wood', 'stone', 'leather', 'copper_ore'];
                    const item = Utils.choice(items);
                    this.inventory.addItem(item, Utils.random(2, 5));
                    this.notify(`Found: ${ItemDB[item]?.icon} ${ItemDB[item]?.name}!`, '#44ff44');
                }},
                { msg: '⭐ A customer left a positive review! +3 reputation.', effect: () => { this.reputation.addReputation(3); } },
            ];
            const event = Utils.choice(events);
            this.notify(event.msg, '#aaaaff', 3000);
            event.effect();
        }

        if (this.screen === 'shop') {
            const results = this.shop.update(dt, this.day, this.reputation.reputation, this.economy, this.getSkillBonuses());
            for (const r of results) {
                if (r.type === 'customerLeft') {
                    this.reputation.loseReputation(1);
                    if (r.reason) {
                        this.notify(`${r.customer.icon} ${r.customer.name} left: "${r.reason}"`, '#888', 2000);
                    }
                }
            }
        }

        // Crafting runs on all screens (not just craft tab)
        {
            const result = this.crafting.update(dt, this.inventory, this.getSkillBonuses());
            if (result) {
                this.inventory.addItem(result.itemId, result.qty);
                this.notify(`Crafted ${ItemDB[result.itemId]?.name || result.itemId} x${result.qty}!`, '#44aaff');
                this.audio.craft();
                if (this.screen === 'craft') this.particles.craftEffect(900, 400);
                this.quests.updateProgress('craft', { count: 1 });
                this.quests.updateProgress('totalCrafts', { count: this.crafting.totalCrafts });
                this.trackDaily('craft', 1);
                this.challengeMode.addScore('crafts', 1);
                this.codex.discoverItem(result.itemId);
                if (RecipeDB[result.itemId]) {
                    this.quests.updateProgress('craftCategory', { category: RecipeDB[result.itemId].category, count: 1 });
                }
                if (result.leveledUp) {
                    this.notify(`Crafting level up! Level ${result.newLevel}`, '#ffd700');
                    this.particles.levelUpEffect(600, 400);
                }

                // Auto-stock crafted items to shop if enabled and item is sellable
                if (this.shop.autoRestock) {
                    const item = ItemDB[result.itemId];
                    if (item && item.basePrice > 0 && !item.quest && item.crafted) {
                        if (this.shop.displayItems.length < this.shop.maxDisplay) {
                            this.shop.addToDisplay(result.itemId, result.qty, this.inventory);
                            this.notify(`Auto-stocked ${item.name} to shop!`, '#44aaff');
                        }
                    }
                }

                // Synergy tracking
                this._dailyActivities = this._dailyActivities || new Set();
                this._dailyActivities.add('craft');
                this.checkSynergyBonus();
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

            // Check milestones
            const claimable = this.milestones.getClaimable(this);
            for (const milestone of claimable) {
                const reward = this.milestones.claim(milestone.id, this);
                if (reward) {
                    if (reward.gold) this.addGold(reward.gold);
                    if (reward.xp) this.addXp(reward.xp);
                    if (reward.skillPoints) this.skills.addPoints(reward.skillPoints);
                    this.notify(`🎯 Milestone: ${milestone.name}! ${reward.gold ? '+' + reward.gold + 'g ' : ''}${reward.skillPoints ? '+' + reward.skillPoints + ' SP' : ''}`, '#ff44ff', 5000);
                    this.audio.victory();
                    this.particles.burst(600, 400, 15, '#ff44ff', 4);
                    // Earn title from special milestones
                    const titleMilestones = { gold_1m: 'Millionaire', endless_100: 'Abyssal Champion', areas_all: 'World Explorer', level_30: 'Grandmaster' };
                    if (titleMilestones[milestone.id]) {
                        this.reputation.addEarnedTitle(titleMilestones[milestone.id]);
                        this.notify(`🏅 Title earned: ${titleMilestones[milestone.id]}!`, '#ffd700', 4000);
                    }
                }
            }
        }
    }

    handleCombatResult(result) {
        // Visual feedback for enemy actions
        if (result.dodged) {
            this.particles.floatingText(350, 350, 'DODGE!', '#44ffff', 18, 40);
            this.audio.click();
        }
        if (result.damage && !result.dodged) {
            this.particles.damage(350, 370, result.damage, false);
            this.renderer.shake(100);
            if (result.damage > 20) this.renderer.flash('#ff0000', 80);
        }
        if (result.statusEffect) {
            this.particles.floatingText(350, 320, result.statusEffect.toUpperCase(), '#ff8844', 12, 30);
        }

        if (result.playerDefeated) {
            this.audio.defeat();
            this._combatStreak = 0; // Reset streak on defeat
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

        // Combat win streak
        this._combatStreak = (this._combatStreak || 0) + 1;
        const streakBonus = Math.min(this._combatStreak * 0.05, 0.5); // Up to 50% bonus
        if (this._combatStreak >= 3 && this._combatStreak % 3 === 0) {
            this.notify(`⚔ Win Streak x${this._combatStreak}! +${Math.round(streakBonus * 100)}% rewards!`, '#ff8844');
            this.particles.burst(600, 300, 8, '#ff8844', 2);
        }

        const bonuses = this.getSkillBonuses();

        // Gold (with streak bonus)
        let gold = rewards.gold;
        if (bonuses.goldBonus) gold = Math.round(gold * (1 + bonuses.goldBonus));
        gold = Math.round(gold * (1 + streakBonus));
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

        // Equipment drop chance
        const area = this.exploration.currentArea;
        const difficulty = area ? area.difficulty : (this.combat.enemy?.boss ? 8 : 3);
        if (LootGenerator.shouldDrop(difficulty)) {
            const enemyLevel = Math.max(1, Math.round(difficulty * 3));
            const itemId = LootGenerator.generate(enemyLevel, area?.id);
            this.inventory.addItem(itemId, 1);
            const item = ItemDB[itemId];
            this.notify(`⚔ Equipment drop: ${item.icon} ${item.name}!`, RarityColors[item.rarity], 4000);
            this.particles.burst(600, 400, 10, RarityColors[item.rarity], 3);
            this.audio.discover();
        }

        // Quest progress
        this.quests.updateProgress('defeatBoss', { boss: this.combat.enemy?.id });

        // Reputation, daily progress & codex
        if (rewards.isBoss) {
            this.reputation.addReputation(10);
            this.audio.victory();

            // Check for final boss defeat → ending scene + secrets
            if (this.combat.enemy?.id === 'void_lord' || this.combat.enemy?.finalBoss) {
                // Unlock secret recipes
                const secrets = this.crafting.unlockSecretRecipes();
                if (secrets.length > 0) {
                    this.notify('🔓 Secret recipes unlocked! Check Craft tab!', '#ff44ff', 6000);
                }
                this.triggerEnding();
            }
        }
        this.trackDaily('defeat', 1);
        this.challengeMode.addScore('kills', 1);
        if (this.combat.enemy) this.codex.discoverEnemy(this.combat.enemy.id);
        this._dailyActivities = this._dailyActivities || new Set();
        this._dailyActivities.add('combat');
        this.checkSynergyBonus();
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
        if (this.combat.active && screen !== 'combat') return;
        if (this.screen === screen) return; // Already on this screen
        this.previousScreen = this.screen;
        this.screen = screen;
        this._screenTransition = 8; // Fade frames
        this.audio.tabSwitch();
        this.scrollOffset = 0;
        this.selectedItem = null;
        this.audio.click();
    }

    triggerEnding() {
        const stats = this.getStats();
        const ptMin = Math.floor(this.playtimeMs / 60000);
        const ptH = Math.floor(ptMin / 60);
        const ptM = ptMin % 60;

        setTimeout(() => {
            this.showDialog(
                '🎉 CONGRATULATIONS! 🎉\n\n' +
                'You defeated the Void Lord and saved reality!\n' +
                'The merchant world is at peace... for now.\n\n' +
                `📊 Your Journey:\n` +
                `⏱ Playtime: ${ptH}h ${ptM}m | 📅 Days: ${stats.playDays}\n` +
                `💰 Gold Earned: ${Utils.formatGold(stats.totalGold)} | 📈 Sales: ${stats.totalSales}\n` +
                `🔨 Crafts: ${stats.totalCrafts} | ⚔ Bosses: ${stats.bossesDefeated}\n` +
                `🏰 Endless Best: F${this.endless.highestFloor}\n\n` +
                `⭐ New Game+ is now available!\n` +
                `Continue playing or Prestige for permanent bonuses.`,
                [
                    { label: '⭐ New Game+', action: () => {
                        this.startPrestige();
                        this.dismissDialog();
                    }},
                    { label: 'Keep Playing', action: () => this.dismissDialog() }
                ]
            );
        }, 2000);

        // Epic celebration
        this.renderer.flash('#ffd700', 500);
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.particles.burst(
                    200 + Math.random() * 800,
                    200 + Math.random() * 400,
                    15, Utils.choice(['#ffd700', '#ff44ff', '#44ffff', '#44ff44', '#ff4444']), 4
                );
            }, i * 300);
        }
    }

    checkSynergyBonus() {
        if (!this._dailyActivities) return;
        const acts = this._dailyActivities;
        const count = acts.size;

        // Synergy bonuses at 3+ different activities
        if (count === 3 && !this._synergy3Claimed) {
            this._synergy3Claimed = true;
            const bonus = Math.round(50 * this.level);
            this.addGold(bonus);
            this.notify(`🔗 Synergy x3! Sell+Craft+Gather! +${bonus}g`, '#ff88ff');
            this.particles.burst(600, 400, 10, '#ff88ff', 3);
        }
        if (count === 4 && !this._synergy4Claimed) {
            this._synergy4Claimed = true;
            const bonus = Math.round(150 * this.level);
            this.addGold(bonus);
            this.addXp(50 * this.level);
            this.notify(`🔗 Synergy x4! All activities! +${bonus}g +XP!`, '#ff44ff');
            this.particles.burst(600, 400, 15, '#ff44ff', 4);
            this.audio.victory();
        }
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
        this.challengeMode.addScore('sales', 1);
        this.challengeMode.addScore('gold', price);

        // Synergy tracking
        this._dailyActivities = this._dailyActivities || new Set();
        this._dailyActivities.add('sell');
        this.checkSynergyBonus();
        return true;
    }

    saveGame() {
        const state = {
            lastSaveTime: Date.now(),
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
            playtimeMs: this.playtimeMs,
            sessions: this.sessions,
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
            bank: this.bank.serialize(),
            milestones: this.milestones.serialize(),
            luckySpin: this.luckySpin.serialize(),
            fusion: this.fusion.serialize(),
            marketOrders: this.marketOrders.serialize(),
            challengeMode: this.challengeMode.serialize(),
            statsTracker: this.statsTracker.serialize(),
            loginRewards: this.loginRewards.serialize(),
            enhance: this.enhance.serialize()
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
        this.playtimeMs = data.playtimeMs || 0;
        this.sessions = (data.sessions || 0) + 1;

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
        if (data.milestones) this.milestones.deserialize(data.milestones);
        if (data.luckySpin) this.luckySpin.deserialize(data.luckySpin);
        if (data.fusion) this.fusion.deserialize(data.fusion);
        if (data.marketOrders) this.marketOrders.deserialize(data.marketOrders);
        if (data.challengeMode) this.challengeMode.deserialize(data.challengeMode);
        if (data.statsTracker) this.statsTracker.deserialize(data.statsTracker);
        if (data.loginRewards) this.loginRewards.deserialize(data.loginRewards);
        if (data.enhance) this.enhance.deserialize(data.enhance);

        this.economy.updatePrices(this.day);
        this.screen = 'shop';
        this.audio.init();
        this.audio.startMusic('shop');

        // Offline earnings calculation
        if (data.lastSaveTime) {
            const elapsed = Date.now() - data.lastSaveTime;
            const hours = elapsed / (1000 * 60 * 60);
            if (hours >= 0.1) { // At least 6 minutes away
                const offlineEarnings = this.calculateOfflineEarnings(hours);
                if (offlineEarnings.totalGold > 0 || offlineEarnings.bankInterest > 0) {
                    const totalOffline = offlineEarnings.totalGold + offlineEarnings.bankInterest;
                    this.addGold(totalOffline);
                    const timeText = hours >= 1 ? `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}m` : `${Math.round(hours * 60)}m`;
                    setTimeout(() => {
                        this.showDialog(
                            `Welcome back! You were away for ${timeText}.\n\n` +
                            `💰 Shop earnings: ${offlineEarnings.totalGold}g\n` +
                            `🏦 Bank interest: ${offlineEarnings.bankInterest}g\n` +
                            `\nTotal: +${totalOffline}g`, null);
                    }, 300);
                }
            }
        }

        return true;
    }

    calculateOfflineEarnings(hours) {
        // Passive income while away (capped at 24 hours)
        const cappedHours = Math.min(hours, 24);

        // Shop earnings: based on reputation and shop level
        const shopRate = (this.reputation.reputation * 0.5 + this.shop.shopLevel * 10) * cappedHours;
        const shopGold = Math.round(shopRate);

        // Bank interest: compound for each hour
        let bankInterest = 0;
        if (this.bank.deposits > 0) {
            const hourlyRate = this.bank.interestRate / 24;
            bankInterest = Math.round(this.bank.deposits * hourlyRate * cappedHours);
            this.bank.accumulatedInterest += bankInterest;
        }

        return { totalGold: shopGold, bankInterest };
    }

    newGame() {
        // Give generous starting items for a fun first session
        this.inventory.addItem('wood', 15);
        this.inventory.addItem('herb', 10);
        this.inventory.addItem('stone', 8);
        this.inventory.addItem('leather', 5);
        this.inventory.addItem('copper_ore', 5);
        this.inventory.addItem('health_potion', 5);
        this.inventory.addItem('bread', 3);
        this.inventory.addItem('wooden_sword', 1);
        this.inventory.addItem('leather_armor', 1);
        this.inventory.equip('wooden_sword');
        this.inventory.equip('leather_armor');
        this.gold = 150;
        this.sessions = 1;

        this.economy.updatePrices(1);
        this.screen = 'shop';
        this.audio.init();
        this.audio.startMusic('shop');

        // Auto-stock some starting items to shop display for immediate action
        this.shop.addToDisplay('wood', 3, this.inventory);
        this.shop.addToDisplay('stone', 2, this.inventory);
        this.shop.addToDisplay('herb', 3, this.inventory);
        this.shop.addToDisplay('leather', 2, this.inventory);

        // Apply prestige bonuses with special unlocks
        if (this.prestigeLevel > 0) {
            const p = this.prestigeLevel;
            this.gold += p * 500;
            this.baseStats.maxHp += p * 10;
            this.baseStats.maxMp += p * 5;
            this.baseStats.atk += p * 2;
            this.baseStats.def += p * 2;
            this.baseStats.speed += Math.floor(p / 2);
            this.skills.addPoints(p * 2);

            // Prestige-specific unlocks
            const unlocks = [];
            if (p >= 1) { this.exploration.maxStamina += 10; unlocks.push('+10 Max Stamina'); }
            if (p >= 2) { this.shop.maxDisplay += 4; unlocks.push('+4 Display Slots'); }
            if (p >= 3) { this.tradeRoutes.maxActiveCaravans++; unlocks.push('+1 Max Caravan'); }
            if (p >= 4) { this.bank.interestRate += 0.005; unlocks.push('+0.5% Bank Rate'); }
            if (p >= 5) { this.baseStats.critRate += 0.03; unlocks.push('+3% Crit Rate'); }
            if (p >= 7) { this.baseStats.lifesteal += 0.02; unlocks.push('+2% Lifesteal'); }
            if (p >= 10) { this.baseStats.dodge += 0.05; unlocks.push('+5% Dodge'); }

            this.notify(`New Game+ ${p}! ${unlocks.join(', ')}`, '#ff44ff', 6000);
        } else {
            // Welcome dialog for new players
            setTimeout(() => {
                this.showDialog(
                    'Welcome to Oh No Yes! 🏪\n\n' +
                    'Your shop is already stocked with items to sell!\n' +
                    'Wait for customers, then Accept their offers.\n\n' +
                    '📋 Tips: Explore (tab 3) for materials, Craft (tab 2) for goods,\n' +
                    'sell everything for profit. Press 1-7 to switch tabs!', null);
            }, 500);
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
