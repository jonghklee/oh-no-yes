// Exploration screen UI
class ExploreUI {
    static selectedArea = null;
    static explorationStep = 0;

    static render(game) {
        const r = game.renderer;
        const inp = game.input;
        const exploration = game.exploration;
        const bonuses = game.getSkillBonuses();

        r.gradientRect(0, 50, 1200, 700, '#12081f', '#1a0a2e');

        if (exploration.active) {
            ExploreUI.renderExploration(game);
            return;
        }

        // === Area Selection ===
        r.panel(10, 55, 1180, 700, '🗺 World Map - Select Area to Explore');

        const areas = Object.entries(AreaDB);
        const cols = 3;
        const cardW = 370;
        const cardH = 190;
        const margin = 15;

        areas.forEach(([id, area], i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const ax = 25 + col * (cardW + margin);
            const ay = 90 + row * (cardH + margin);

            const unlocked = game.level >= area.unlockLevel;
            const hovered = inp.isOver(ax, ay, cardW, cardH);
            const canExplore = exploration.canExplore(id, game.level);

            r.roundRect(ax, ay, cardW, cardH, 8,
                hovered && unlocked ? 'rgba(60,30,100,0.6)' : 'rgba(20,10,40,0.4)',
                unlocked ? area.color : '#333', 2);

            if (!unlocked) {
                r.setAlpha(0.4);
            }

            // Area header
            r.text(area.icon, ax + 15, ay + 10, '#fff', 28);
            r.textBold(area.name, ax + 55, ay + 10, unlocked ? '#fff' : '#666', 16);

            // Difficulty
            const stars = '★'.repeat(area.difficulty) + '☆'.repeat(10 - area.difficulty);
            r.text(stars, ax + 55, ay + 32, '#ffd700', 10);

            // Description
            r.text(area.description, ax + 15, ay + 55, unlocked ? '#aaa' : '#444', 10);

            // Info
            r.text(`Stamina: ${area.staminaCost}⚡`, ax + 15, ay + 80, '#44ddff', 10);
            r.text(`Floors: ${area.floors}`, ax + 140, ay + 80, '#aaa', 10);
            r.text(`Unlock: Lv.${area.unlockLevel}`, ax + 240, ay + 80, unlocked ? '#88ff88' : '#ff6666', 10);

            // Progress
            const maxFloor = exploration.maxFloorReached[id] || 0;
            if (maxFloor > 0) {
                r.progressBar(ax + 15, ay + 100, 200, 10, maxFloor, area.floors, area.color, '#222');
                r.text(`Floor ${maxFloor}/${area.floors}`, ax + 220, ay + 98, '#aaa', 9);
            }

            // Boss defeated
            const bossEnemy = area.enemies.find(e => EnemyDB[e]?.boss);
            if (bossEnemy && exploration.bossesDefeated.has(bossEnemy)) {
                r.text('👑 Boss Defeated', ax + 15, ay + 120, '#ffd700', 10);
            }

            // Loot preview
            r.text('Drops:', ax + 15, ay + 140, '#888', 9);
            const drops = area.gatherables.slice(0, 5).map(g => ItemDB[g.item]?.icon || '?').join(' ');
            r.text(drops, ax + 60, ay + 138, '#fff', 12);

            // Enemy preview
            r.text('Enemies:', ax + 15, ay + 160, '#888', 9);
            const enemies = area.enemies.slice(0, 3).map(e => EnemyDB[e]?.icon || '?').join(' ');
            r.text(enemies, ax + 70, ay + 158, '#fff', 12);

            if (!unlocked) r.resetAlpha();

            // Click to explore
            if (hovered && inp.clicked && canExplore.can) {
                exploration.startExploration(id, game.level, bonuses);
                game.audio.discover();
                game.quests.updateProgress('explore', { area: id, count: 1 });
            }
        });

        // Stamina info
        r.text(`⚡ Stamina: ${exploration.stamina}/${exploration.maxStamina}`, 20, 730, '#44ddff', 13);
        r.text('Stamina recovers each day', 200, 732, '#666', 10);

        // Rest button
        if (exploration.stamina < exploration.maxStamina) {
            const restCost = 50;
            const restHover = inp.isOver(450, 725, 150, 28);
            r.button(450, 725, 150, 28, `💤 Rest (${restCost}g)`, restHover, game.gold < restCost);
            if (game.gold >= restCost && inp.clickedIn(450, 725, 150, 28)) {
                game.spendGold(restCost);
                exploration.restStamina(exploration.maxStamina);
                game.audio.heal();
                game.notify('Fully rested!', '#44ddff');
            }
        }

        // === ENDLESS DUNGEON ===
        const canEndless = game.endless.canEnter(game.level);
        if (canEndless) {
            r.roundRect(700, 715, 300, 35, 6, 'rgba(80,20,80,0.7)', '#ff44ff', 2);
            r.text('🏰', 715, 720, '#fff', 18);
            r.textBold('Endless Dungeon', 745, 720, '#ff44ff', 14);
            r.text(`Best: F${game.endless.highestFloor}`, 900, 723, '#aaa', 10);
            const edHover = inp.isOver(700, 715, 300, 35);
            if (edHover) {
                r.roundRect(700, 715, 300, 35, 6, 'rgba(120,30,120,0.5)');
            }
            if (inp.clickedIn(700, 715, 300, 35)) {
                const enemy = game.endless.enter();
                game.combat.startBattle(game.getPlayerStats(), enemy);
                game.switchScreen('combat');
                game.notify('Entering Endless Dungeon! How far can you go?', '#ff44ff', 4000);
                game.audio.discover();
            }
        } else if (game.level >= 5) {
            r.text('🏰 Endless Dungeon unlocks at Lv.10', 700, 725, '#555', 11);
        }

        // Weekly boss challenge
        if (game.weeklyBoss) {
            r.roundRect(1020, 715, 170, 35, 6, 'rgba(80,60,20,0.7)', '#ffd700', 2);
            r.textBold('⭐ Weekly Boss', 1035, 720, '#ffd700', 12);
            const wbHover = inp.isOver(1020, 715, 170, 35);
            if (wbHover) r.roundRect(1020, 715, 170, 35, 6, 'rgba(120,90,30,0.5)');
            if (inp.clickedIn(1020, 715, 170, 35)) {
                game.combat.startBattle(game.getPlayerStats(), game.weeklyBoss);
                game.switchScreen('combat');
                game.notify(`Fighting ${game.weeklyBoss.name}! 5x rewards!`, '#ffd700', 4000);
                game.weeklyBoss = null; // One attempt per week
                game.audio.discover();
            }
        }
    }

    static renderExploration(game) {
        const r = game.renderer;
        const inp = game.input;
        const exploration = game.exploration;
        const area = exploration.currentArea;

        // Background based on area
        r.gradientRect(0, 50, 1200, 700, area.color + '44', '#1a0a2e');

        // Area header
        r.panel(10, 55, 1180, 50, null);
        r.text(`${area.icon} ${area.name} - Floor ${exploration.currentFloor}/${area.floors}`, 20, 70, '#fff', 16);
        r.progressBar(400, 72, 200, 12, exploration.currentFloor, area.floors, area.color, '#222');
        r.text(`⚡ ${exploration.stamina}`, 620, 70, '#44ddff', 13);

        // Exploration log
        r.panel(10, 115, 600, 400, '📋 Exploration Log');
        exploration.explorationLog.forEach((msg, i) => {
            const y = 148 + i * 20;
            if (y < 500) {
                r.text(`▸ ${msg}`, 25, y, '#ccc', 11);
            }
        });

        // Action buttons
        r.panel(10, 525, 600, 230, '⚡ Actions');

        // Explore step
        const stepHover = inp.isOver(30, 558, 200, 45);
        r.button(30, 558, 200, 45, '🔍 Search Area', stepHover);
        if (inp.clickedIn(30, 558, 200, 45)) {
            const result = exploration.exploreStep(game.getSkillBonuses());
            if (result) {
                game.audio.discover();
                if (result.type === 'combat') {
                    game.combat.startBattle(game.getPlayerStats(), result.enemy);
                    game.switchScreen('combat');
                } else if (result.type === 'gather') {
                    for (const g of result.items) {
                        game.inventory.addItem(g.item, g.qty);
                        game.codex.discoverItem(g.item);
                        game.trackDaily('gather', g.qty);
                    }
                    // Synergy
                    game._dailyActivities = game._dailyActivities || new Set();
                    game._dailyActivities.add('gather');
                    game.checkSynergyBonus();
                    // Auto-discover recipes from gathered materials
                    const newRecipes = game.crafting.discoverByMaterials(game.inventory);
                    if (newRecipes.length > 0) {
                        const names = newRecipes.map(r => RecipeDB[r] ? ItemDB[RecipeDB[r].result]?.name : r).filter(Boolean);
                        game.notify(`📖 New recipe${names.length > 1 ? 's' : ''}: ${names.join(', ')}!`, '#44aaff', 4000);
                    }
                } else if (result.type === 'event') {
                    ExploreUI.handleEvent(game, result.event);
                }
            }
        }

        // Advance floor
        if (exploration.currentFloor < area.floors) {
            const advHover = inp.isOver(250, 558, 200, 45);
            r.button(250, 558, 200, 45, '⬆ Next Floor', advHover);
            if (inp.clickedIn(250, 558, 200, 45)) {
                exploration.advanceFloor();
                game.audio.click();
                game.quests.updateProgress('reachFloor', { area: area.id, floor: exploration.currentFloor });
            }
        }

        // Leave with summary
        const leaveHover = inp.isOver(30, 620, 200, 40);
        r.button(30, 620, 200, 40, '🚪 Leave', leaveHover, false, '#5a2020');
        if (inp.clickedIn(30, 620, 200, 40)) {
            const results = exploration.endExploration();
            const itemCount = results.items.length;
            game.notify(`Exploration complete! Floor ${results.floorsExplored}, ${itemCount} items gathered.`, '#44ddff', 4000);
            game.audio.click();
        }

        // Quick actions
        const restoreHover = inp.isOver(30, 668, 200, 30);
        r.button(30, 668, 200, 30, `🧪 Use Potion (${game.inventory.getCount('health_potion')})`, restoreHover,
            !game.inventory.hasItem('health_potion', 1), '#2a4a2a');
        if (game.inventory.hasItem('health_potion', 1) && inp.clickedIn(30, 668, 200, 30)) {
            game.inventory.removeItem('health_potion', 1);
            game.audio.heal();
            game.notify('Used Health Potion! Ready for more!', '#44ff44');
        }

        // Gathered items panel
        r.panel(620, 115, 570, 640, '💎 Gathered Items');
        const gathered = {};
        let totalLootValue = 0;
        for (const g of exploration.gatheredItems) {
            if (gathered[g.item]) gathered[g.item] += g.qty;
            else gathered[g.item] = g.qty;
        }
        let gy = 150;
        let uniqueItems = 0;
        for (const [itemId, qty] of Object.entries(gathered)) {
            const item = ItemDB[itemId];
            if (item && gy < 710) {
                const value = (item.basePrice || 0) * qty;
                totalLootValue += value;
                uniqueItems++;
                r.text(`${item.icon} ${item.name} x${qty}`, 640, gy, RarityColors[item.rarity], 12);
                r.text(`${value}g`, 1150, gy, '#ffd700', 10, 'right');
                gy += 22;
            }
        }
        if (Object.keys(gathered).length === 0) {
            r.text('Nothing gathered yet...', 700, 300, '#666', 13);
        } else {
            // Loot summary
            r.line(640, gy + 5, 1160, gy + 5, '#3d1e6d');
            r.textBold(`Total Value: ${Utils.formatGold(totalLootValue)}g`, 640, gy + 10, '#ffd700', 13);
            r.text(`${uniqueItems} unique items`, 900, gy + 12, '#888', 10);

            // Quick sell all button
            const sellAllHover = inp.isOver(640, gy + 35, 200, 30);
            r.button(640, gy + 35, 200, 30, `💰 Sell All (${Utils.formatGold(totalLootValue)}g)`, sellAllHover, false, '#5a5020');
            if (inp.clickedIn(640, gy + 35, 200, 30)) {
                let totalSold = 0;
                for (const [itemId, qty] of Object.entries(gathered)) {
                    for (let s = 0; s < qty; s++) {
                        if (game.inventory.hasItem(itemId, 1)) {
                            game.sellItem(itemId);
                            totalSold++;
                        }
                    }
                }
                game.notify(`Sold ${totalSold} gathered items!`, '#ffd700');
                game.particles.goldGain(900, gy + 50, totalLootValue);
            }
        }
    }

    static handleEvent(game, eventType) {
        switch(eventType) {
            case 'found_chest': {
                const gold = Utils.random(20, 100) * game.level;
                game.showDialog(`You found a treasure chest! It contains ${gold}g. But it might be trapped...`, [
                    { label: `Open it! (+${gold}g)`, action: () => {
                        if (Math.random() < 0.8) {
                            game.addGold(gold);
                            game.notify(`Got ${gold}g from the chest!`, '#ffd700');
                        } else {
                            const dmg = Math.round(gold * 0.3);
                            game.notify(`Trap! Lost ${dmg}g but found ${Math.round(gold * 0.5)}g`, '#ff8844');
                            game.addGold(Math.round(gold * 0.5));
                        }
                        game.dismissDialog();
                    }},
                    { label: 'Leave it', action: () => {
                        game.notify('You cautiously moved on.', '#aaa');
                        game.dismissDialog();
                    }}
                ]);
                break;
            }
            case 'herb_patch':
            case 'flower_field': {
                const qty = Utils.random(3, 8);
                game.inventory.addItem('herb', qty);
                game.notify(`Found a patch of herbs! +${qty}`, '#44ff44');
                break;
            }
            case 'ore_vein':
            case 'gem_vein': {
                const oreQty = Utils.random(2, 5);
                game.inventory.addItem('iron_ore', oreQty);
                if (Math.random() < 0.15) {
                    game.inventory.addItem('silver_ore', 1);
                    game.notify(`Rich vein! +${oreQty} Iron Ore, +1 Silver Ore!`, '#ff8844');
                } else {
                    game.notify(`Found ore! +${oreQty} Iron Ore`, '#ff8844');
                }
                break;
            }
            case 'ancient_shrine':
            case 'magic_spring': {
                game.showDialog('You discover a magical spring. Its waters shimmer with power.', [
                    { label: 'Drink (+XP)', action: () => {
                        const xp = Utils.random(20, 50) * game.level;
                        game.addXp(xp);
                        game.notify(`Gained ${xp} XP!`, '#8844ff');
                        game.dismissDialog();
                    }},
                    { label: 'Fill a bottle (+Potion)', action: () => {
                        game.inventory.addItem('health_potion', 2);
                        game.notify('Collected 2 Health Potions!', '#44ff44');
                        game.dismissDialog();
                    }}
                ]);
                break;
            }
            case 'ghost_merchant': {
                game.showDialog('A ghostly merchant appears! "I have rare wares... for a price."', [
                    { label: 'Trade 100g for rare item', action: () => {
                        if (game.gold >= 100) {
                            game.spendGold(100);
                            const rareItems = ['moonflower', 'crystal', 'silk', 'silver_ore', 'enchanted_wood'];
                            const item = Utils.choice(rareItems);
                            const qty = Utils.random(2, 5);
                            game.inventory.addItem(item, qty);
                            game.notify(`Bought ${qty}x ${ItemDB[item]?.name}!`, '#8844ff');
                        } else {
                            game.notify('Not enough gold!', '#ff4444');
                        }
                        game.dismissDialog();
                    }},
                    { label: 'Decline', action: () => {
                        game.notify('The ghost fades away...', '#888');
                        game.dismissDialog();
                    }}
                ]);
                break;
            }
            case 'traveler':
            case 'hermit': {
                game.showDialog('You meet a weary traveler. They offer knowledge in exchange for supplies.', [
                    { label: 'Give 5 herbs (+Rep, +XP)', action: () => {
                        if (game.inventory.hasItem('herb', 5)) {
                            game.inventory.removeItem('herb', 5);
                            game.reputation.addReputation(5);
                            game.addXp(30 * game.level);
                            game.notify('Reputation +5, XP gained!', '#ffaa44');
                        } else {
                            game.notify('Not enough herbs!', '#ff4444');
                        }
                        game.dismissDialog();
                    }},
                    { label: 'Just chat', action: () => {
                        game.addXp(10);
                        game.notify('Pleasant conversation. +10 XP', '#aaa');
                        game.dismissDialog();
                    }}
                ]);
                break;
            }
            case 'treasure_room':
            case 'treasure_hoard': {
                const treasureGold = Utils.random(100, 500) * game.level;
                game.addGold(treasureGold);
                game.notify(`Treasure room! +${treasureGold}g!`, '#ffd700');
                // Also chance for gems
                if (Math.random() < 0.3) {
                    const gems = ['ruby', 'sapphire', 'emerald'];
                    const gem = Utils.choice(gems);
                    game.inventory.addItem(gem, 1);
                    game.notify(`Also found a ${ItemDB[gem]?.name}!`, '#ff44ff');
                }
                break;
            }
            default:
                game.addXp(Utils.random(5, 15) * game.level);
                game.notify(`Discovered: ${eventType.replace(/_/g, ' ')} (+XP)`, '#aaaaff');
        }
    }
}

// Quest UI
class QuestUI {
    static render(game) {
        const r = game.renderer;
        const inp = game.input;
        const quests = game.quests;

        r.gradientRect(0, 50, 1200, 700, '#12081f', '#1a0a2e');

        // Active quests
        r.panel(10, 55, 580, 700, '📋 Active Quests');

        const active = quests.getActiveQuestList();
        let ay = 90;
        if (active.length === 0) {
            r.text('No active quests. Check available quests!', 100, 200, '#666', 13);
        }

        active.forEach(({ id, quest, state }) => {
            if (ay > 720) return;
            const hovered = inp.isOver(20, ay, 560, 80);
            r.roundRect(20, ay, 560, 80, 6,
                hovered ? 'rgba(60,30,100,0.5)' : 'rgba(20,10,40,0.3)',
                state.completed ? '#ffd700' : '#3d1e6d');

            // Quest type badge
            const typeColors = { main: '#ff4444', side: '#4488ff', daily: '#44ff44', achievement: '#ffd700' };
            r.roundRect(30, ay + 5, 50, 18, 3, typeColors[quest.type]);
            r.text(quest.type, 55, ay + 7, '#fff', 9, 'center');

            r.textBold(quest.name, 90, ay + 5, '#fff', 13);
            r.text(quest.description, 30, ay + 28, '#aaa', 10);

            // Progress
            quest.objectives.forEach((obj, oi) => {
                const current = Math.min(state.progress[oi], obj.count);
                r.text(`${obj.type}: ${current}/${obj.count}`, 30, ay + 48 + oi * 14, current >= obj.count ? '#88ff88' : '#ff8888', 10);
                r.progressBar(200, ay + 50 + oi * 14, 100, 8, current, obj.count, current >= obj.count ? '#44ff44' : '#4488ff');
            });

            // Claim button
            if (state.completed) {
                const claimHover = inp.isOver(420, ay + 25, 140, 30);
                r.button(420, ay + 25, 140, 30, '🎁 Claim Reward', claimHover);
                if (inp.clickedIn(420, ay + 25, 140, 30)) {
                    const rewards = quests.claimReward(id);
                    if (rewards) {
                        if (rewards.gold) game.addGold(rewards.gold);
                        if (rewards.xp) game.addXp(rewards.xp);
                        if (rewards.reputation) game.reputation.addReputation(rewards.reputation);
                        if (rewards.skillPoints) game.skills.addPoints(rewards.skillPoints);
                        if (rewards.items) {
                            rewards.items.forEach(item => game.inventory.addItem(item.id, item.qty));
                        }
                        game.audio.victory();
                        game.notify(`Quest complete! Rewards claimed!`, '#ffd700');
                    }
                }
            }

            ay += 90;
        });

        // Available quests
        r.panel(600, 55, 590, 350, '📜 Available Quests');
        const available = quests.getAvailableQuestList();

        let avY = 90;
        available.forEach(({ id, quest }) => {
            if (avY > 380) return;
            const hovered = inp.isOver(610, avY, 570, 55);
            r.roundRect(610, avY, 570, 55, 4,
                hovered ? 'rgba(60,30,100,0.5)' : 'rgba(20,10,40,0.3)', '#3d1e6d');

            const typeColors = { main: '#ff4444', side: '#4488ff', daily: '#44ff44', achievement: '#ffd700' };
            r.roundRect(620, avY + 5, 50, 18, 3, typeColors[quest.type]);
            r.text(quest.type, 645, avY + 7, '#fff', 9, 'center');

            r.textBold(quest.name, 680, avY + 5, '#fff', 12);
            r.text(quest.description, 620, avY + 28, '#aaa', 10);

            // Rewards preview
            const rewardText = [];
            if (quest.rewards.gold) rewardText.push(`${quest.rewards.gold}g`);
            if (quest.rewards.xp) rewardText.push(`${quest.rewards.xp} XP`);
            r.text(`Rewards: ${rewardText.join(', ')}`, 620, avY + 42, '#ffd700', 9);

            // Accept button
            const acceptHover = inp.isOver(1060, avY + 10, 100, 30);
            r.button(1060, avY + 10, 100, 30, '✅ Accept', acceptHover);
            if (inp.clickedIn(1060, avY + 10, 100, 30)) {
                quests.acceptQuest(id);
                game.audio.click();
                game.notify(`Accepted: ${quest.name}`, '#44ff44');
            }

            avY += 60;
        });

        // Completed quests & Stats
        r.panel(600, 415, 295, 340, '🏆 Completed');
        r.text(`Total: ${quests.completedQuests.size}`, 620, 445, '#ffd700', 11);

        let cy = 465;
        [...quests.completedQuests].forEach(qid => {
            const q = QuestDB[qid];
            if (q && cy < 730) {
                r.text(`✓ ${q.name}`, 615, cy, '#88ff88', 10);
                cy += 16;
            }
        });

        // Game Progress Dashboard
        r.panel(900, 415, 290, 340, '📈 Progress Dashboard');
        const stats = game.getStats();

        // Overall completion percentage
        const completionFactors = [
            { name: 'Areas', current: stats.areasExplored, max: 9 },
            { name: 'Bosses', current: stats.bossesDefeated, max: 9 },
            { name: 'Achievements', current: game.achievements.getUnlockedCount(), max: game.achievements.getTotalCount() },
            { name: 'Milestones', current: game.milestones.claimed.size, max: 25 },
            { name: 'Codex', current: game.codex.getDiscoveryPercent(), max: 100 },
        ];
        const overallPct = Math.round(completionFactors.reduce((sum, f) => sum + (f.current / f.max), 0) / completionFactors.length * 100);

        r.textBold(`Overall: ${overallPct}%`, 915, 445, '#ffd700', 13);
        r.progressBar(915, 463, 260, 12, overallPct, 100, '#ffd700', '#222');

        // Individual progress bars
        let py = 485;
        completionFactors.forEach(f => {
            const pct = Math.round(f.current / f.max * 100);
            r.text(`${f.name}:`, 915, py, '#888', 9);
            r.progressBar(980, py + 2, 130, 8, f.current, f.max, pct >= 100 ? '#44ff44' : '#4488ff', '#222');
            r.text(`${f.current}/${f.max}`, 1120, py, '#aaa', 9, 'right');
            py += 18;
        });

        // Key stats
        py += 5;
        const keyStats = [
            { label: 'Day', value: stats.playDays, color: '#fff' },
            { label: 'Gold', value: Utils.formatGold(stats.totalGold), color: '#ffd700' },
            { label: 'Sales', value: stats.totalSales, color: '#88ff88' },
            { label: 'Endless', value: `F${game.endless.highestFloor}`, color: '#ff44ff' },
            { label: 'Chests', value: game.mystery.totalOpened, color: '#44ddff' },
            { label: 'Fusions', value: game.fusion.totalFusions, color: '#aa88ff' },
        ];
        keyStats.forEach((s, i) => {
            const sx = 915 + (i % 2) * 140;
            const sy = py + Math.floor(i / 2) * 16;
            r.text(`${s.label}: `, sx, sy, '#666', 9);
            r.text(s.value.toString(), sx + 50, sy, s.color, 9);
        });

        // Next goal suggestion
        py += Math.ceil(keyStats.length / 2) * 16 + 10;
        r.text('Next Goal:', 915, py, '#888', 10);
        let nextGoal = 'Keep exploring!';
        if (stats.areasExplored < 3) nextGoal = 'Explore more areas (need Lv.5+)';
        else if (stats.bossesDefeated < 1) nextGoal = 'Defeat your first boss!';
        else if (game.crafting.level < 5) nextGoal = 'Reach Crafting Lv.5';
        else if (game.endless.highestFloor < 10) nextGoal = 'Reach Endless F10';
        else if (stats.areasExplored < 9) nextGoal = 'Explore all 9 areas';
        else if (game.endless.highestFloor < 50) nextGoal = 'Reach Endless F50';
        else nextGoal = 'Prestige for New Game+!';
        r.text(`→ ${nextGoal}`, 915, py + 14, '#ffaa44', 9);

        // New Game+ button
        if (game.canPrestige()) {
            const ngHover = inp.isOver(920, 720, 250, 28);
            r.button(920, 720, 250, 28, `⭐ New Game+ (P${(game.prestigeLevel || 0) + 1})`, ngHover, false, '#5a2080');
            if (inp.clickedIn(920, 720, 250, 28)) {
                game.showDialog('Start New Game+? Keep 10% gold, gain permanent stat bonuses!', [
                    { label: 'Prestige!', action: () => { game.startPrestige(); game.dismissDialog(); } },
                    { label: 'Not yet', action: () => game.dismissDialog() }
                ]);
            }
        }
    }
}
