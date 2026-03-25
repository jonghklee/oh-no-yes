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

        // Leave
        const leaveHover = inp.isOver(30, 620, 200, 40);
        r.button(30, 620, 200, 40, '🚪 Leave', leaveHover, false, '#5a2020');
        if (inp.clickedIn(30, 620, 200, 40)) {
            exploration.endExploration();
            game.audio.click();
        }

        // Gathered items panel
        r.panel(620, 115, 570, 640, '💎 Gathered Items');
        const gathered = {};
        for (const g of exploration.gatheredItems) {
            if (gathered[g.item]) gathered[g.item] += g.qty;
            else gathered[g.item] = g.qty;
        }
        let gy = 150;
        for (const [itemId, qty] of Object.entries(gathered)) {
            const item = ItemDB[itemId];
            if (item && gy < 730) {
                r.text(`${item.icon} ${item.name} x${qty}`, 640, gy, RarityColors[item.rarity], 12);
                gy += 22;
            }
        }
        if (Object.keys(gathered).length === 0) {
            r.text('Nothing gathered yet...', 700, 300, '#666', 13);
        }
    }

    static handleEvent(game, eventType) {
        switch(eventType) {
            case 'found_chest':
                const gold = Utils.random(20, 100) * game.level;
                game.addGold(gold);
                game.notify(`Found a treasure chest! +${gold}g`, '#ffd700');
                break;
            case 'herb_patch':
            case 'flower_field':
                game.inventory.addItem('herb', Utils.random(3, 8));
                game.notify('Found a patch of herbs!', '#44ff44');
                break;
            case 'ore_vein':
            case 'gem_vein':
                game.inventory.addItem('iron_ore', Utils.random(2, 5));
                game.notify('Found a rich ore vein!', '#ff8844');
                break;
            case 'ancient_shrine':
            case 'magic_spring':
                game.addXp(Utils.random(20, 50) * game.level);
                game.notify('Ancient power flows through you! +XP', '#8844ff');
                break;
            default:
                game.notify(`Discovered: ${eventType.replace(/_/g, ' ')}`, '#aaaaff');
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

        // Completed quests count
        r.panel(600, 415, 590, 340, '🏆 Completed');
        r.text(`Total Completed: ${quests.completedQuests.size}`, 620, 450, '#ffd700', 13);

        let cy = 475;
        [...quests.completedQuests].forEach(qid => {
            const q = QuestDB[qid];
            if (q && cy < 730) {
                r.text(`✓ ${q.name}`, 620, cy, '#88ff88', 11);
                cy += 18;
            }
        });
    }
}
