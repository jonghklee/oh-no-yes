// HUD - always visible overlay
class HUD {
    static render(game) {
        const r = game.renderer;
        const inp = game.input;

        // Top bar background
        r.gradientRect(0, 0, 1200, 44, 'rgba(20,10,40,0.95)', 'rgba(20,10,40,0.7)');
        r.line(0, 44, 1200, 44, '#3d1e6d', 2);

        // Gold with change flash
        r.text('💰', 10, 12, '#ffd700', 18);
        r.textBold(Utils.formatGold(game.gold) + 'g', 34, 14, '#ffd700', 15);

        // Gold change indicator
        if (!HUD._lastGold) HUD._lastGold = game.gold;
        if (game.gold !== HUD._lastGold) {
            const diff = game.gold - HUD._lastGold;
            HUD._goldChangeText = diff > 0 ? `+${Utils.formatGold(diff)}` : `${Utils.formatGold(diff)}`;
            HUD._goldChangeColor = diff > 0 ? '#44ff44' : '#ff4444';
            HUD._goldChangeTimer = 60;
            HUD._lastGold = game.gold;
        }
        if (HUD._goldChangeTimer > 0) {
            r.setAlpha(HUD._goldChangeTimer / 60);
            r.text(HUD._goldChangeText, 34, 30, HUD._goldChangeColor, 9);
            r.resetAlpha();
            HUD._goldChangeTimer--;
        }

        // Level with XP change flash
        r.text(`Lv.${game.level}`, 140, 14, '#fff', 13);
        const xpNeeded = getXpForLevel(game.level);
        r.progressBar(185, 16, 80, 12, game.xp, xpNeeded, '#6644aa', '#222', '#444');

        // XP change indicator
        if (!HUD._lastXp) HUD._lastXp = game.xp;
        if (game.xp !== HUD._lastXp) {
            HUD._xpChangeTimer = 40;
            HUD._lastXp = game.xp;
        }
        if (HUD._xpChangeTimer > 0) {
            r.setAlpha(HUD._xpChangeTimer / 40);
            r.progressBar(185, 16, 80, 12, game.xp, xpNeeded, '#aa66ff', '#222');
            r.resetAlpha();
            HUD._xpChangeTimer--;
        }
        r.text(`${game.xp}/${xpNeeded}`, 190, 16, '#ddd', 9);

        // Mini income sparkline (last 7 days)
        const incomeData = game.statsTracker.dailyIncome.slice(-7);
        if (incomeData.length > 1) {
            const sparkX = 270, sparkW = 15, sparkH = 10;
            const max = Math.max(1, ...incomeData);
            r.setAlpha(0.5);
            for (let si = 1; si < incomeData.length; si++) {
                const x1 = sparkX + ((si-1)/(incomeData.length-1))*sparkW;
                const y1 = 32 - (incomeData[si-1]/max)*sparkH;
                const x2 = sparkX + (si/(incomeData.length-1))*sparkW;
                const y2 = 32 - (incomeData[si]/max)*sparkH;
                r.line(x1, y1, x2, y2, '#ffd700', 1);
            }
            r.resetAlpha();
        }

        // Day & Season
        const season = getSeason(game.day);
        const dayInSeason = getDayInSeason(game.day);
        r.text(`${season.icon} Day ${game.day}`, 290, 14, season.color, 13);
        r.text(`(${season.name} ${dayInSeason}/30)`, 370, 14, '#aaa', 11);

        // Day phase with timer
        const phaseIcons = { morning: '🌅', afternoon: '☀', evening: '🌙' };
        const phaseProgress = game.dayTimer / game.phaseLength;
        r.text(`${phaseIcons[game.dayPhase]} ${game.dayPhase}`, 490, 14, '#ddd', 12);
        r.progressBar(570, 18, 50, 8, phaseProgress, 1, '#4a3080', '#222');

        // Weather indicator
        const weatherSeed = (game.day * 7 + 3) % 10;
        const weatherIcon = weatherSeed < 3 ? '☀' : weatherSeed < 5 ? '🌧' : weatherSeed < 7 ? '❄' : weatherSeed < 9 ? '🌫' : '💨';
        r.text(weatherIcon, 625, 14, '#888', 11);

        // Stamina with color
        const stamPct = game.exploration.stamina / game.exploration.maxStamina;
        const stamColor = stamPct > 0.5 ? '#44ddff' : stamPct > 0.25 ? '#dddd44' : '#ff4444';
        r.text(`⚡ ${game.exploration.stamina}/${game.exploration.maxStamina}`, 645, 14, stamColor, 12);

        // Reputation
        r.text(`⭐ ${game.reputation.getDisplayTitle()}`, 750, 14, '#ffaa44', 12);

        // Crafting level + queue indicator
        r.text(`🔨 Craft Lv.${game.crafting.level}`, 920, 14, '#4488ff', 11);
        const craftProgress = game.crafting.getCraftProgress();
        if (craftProgress) {
            r.progressBar(920, 30, 60, 5, craftProgress.progress, 1, '#4488ff', '#222');
            if (game.crafting.craftQueue.length > 0) {
                r.text(`+${game.crafting.craftQueue.length}`, 985, 27, '#4488ff', 8);
            }
        }

        // Speed control with color
        const speedColor = game.gameSpeed === 1 ? '#3d1e6d' : game.gameSpeed === 2 ? '#2a5a2a' : '#5a4a20';
        const speedBtn = r.button(1050, 8, 30, 28, `${game.gameSpeed}x`, inp.isOver(1050, 8, 30, 28), false, speedColor);
        if (inp.clickedIn(1050, 8, 30, 28)) {
            game.gameSpeed = game.gameSpeed >= 3 ? 1 : game.gameSpeed + 1;
            game.audio.click();
        }

        // Pause with visual state
        const pauseColor = game.paused ? '#5a2020' : '#3d1e6d';
        const pauseBtn = r.button(1090, 8, 30, 28, game.paused ? '▶' : '⏸', inp.isOver(1090, 8, 30, 28), false, pauseColor);
        if (inp.clickedIn(1090, 8, 30, 28)) {
            game.paused = !game.paused;
            game.audio.click();
        }

        // Save indicator
        if (game._saveIndicator > 0) {
            r.setAlpha(game._saveIndicator / 40);
            r.text('💾', 1120, 14, '#44ff44', 11);
            r.resetAlpha();
        }

        // Settings button
        const settingsHover = inp.isOver(1150, 8, 30, 28);
        r.text('⚙', 1155, 12, settingsHover ? '#fff' : '#666', 14);
        if (inp.clickedIn(1150, 8, 30, 28)) {
            SettingsUI.toggle();
            game.audio.click();
        }

        // Login reward cycle indicator
        const lrDay = game.loginRewards.getDayInCycle();
        r.text(`📅${lrDay}/7`, 960, 14, lrDay === 7 ? '#ffd700' : '#888', 10);

        // Daily challenge mini-display
        const dc = game.daily.currentChallenge;
        if (dc && !game.daily.completedToday) {
            r.roundRect(1000, 2, 40, 40, 4, 'rgba(30,60,80,0.8)', '#44ddff');
            r.text('📋', 1010, 8, '#fff', 16);
            r.text(`${dc.progress}/${dc.target}`, 1020, 26, '#44ddff', 8, 'center');
        } else if (dc && game.daily.completedToday) {
            r.roundRect(1000, 2, 40, 40, 4, 'rgba(30,80,30,0.8)', '#44ff44');
            r.text('✅', 1010, 10, '#fff', 16);
        }

        // Active events banner
        if (game.economy.activeEvents.length > 0) {
            r.gradientRect(0, 44, 1200, 22, 'rgba(40,20,60,0.8)', 'rgba(40,20,60,0.3)');
            let ex = 10;
            for (const event of game.economy.activeEvents) {
                const color = event.type === 'positive' ? '#44ff44' : event.type === 'negative' ? '#ff4444' : '#ffaa44';
                r.text(`${event.icon} ${event.name} (${event.duration}d)`, ex, 47, color, 11);
                ex += r.measureText(`${event.icon} ${event.name} (${event.duration}d)`, 11) + 20;
            }
        }

        // Navigation tabs
        HUD.renderNav(game);

        // Notifications
        HUD.renderNotifications(game);
    }

    static renderNav(game) {
        const r = game.renderer;
        const inp = game.input;
        const y = 755;

        r.gradientRect(0, y, 1200, 45, 'rgba(20,10,40,0.7)', 'rgba(20,10,40,0.95)');
        r.line(0, y, 1200, y, '#3d1e6d', 2);

        const tabs = [
            { id: 'shop', icon: '🏪', label: 'Shop', key: '1' },
            { id: 'craft', icon: '🔨', label: 'Craft', key: '2' },
            { id: 'explore', icon: '🗺', label: 'Explore', key: '3' },
            { id: 'inventory', icon: '🎒', label: 'Items', key: '4' },
            { id: 'skills', icon: '⭐', label: 'Skills', key: '5' },
            { id: 'quest', icon: '📋', label: 'Quests', key: '6' },
            { id: 'map', icon: '🌍', label: 'Market', key: '7' }
        ];

        const tabWidth = 150;
        const startX = (1200 - tabs.length * tabWidth) / 2;

        tabs.forEach((tab, i) => {
            const tx = startX + i * tabWidth;
            const isActive = game.screen === tab.id;
            const isHovered = inp.isOver(tx, y + 2, tabWidth - 4, 40);
            const bg = isActive ? '#3d1e6d' : (isHovered ? 'rgba(61,30,109,0.5)' : 'transparent');
            const textColor = isActive ? '#fff' : (isHovered ? '#ddd' : '#888');

            r.roundRect(tx + 2, y + 4, tabWidth - 4, 36, 4, bg);
            r.text(`${tab.icon} ${tab.label}`, tx + tabWidth / 2, y + 12, textColor, 13, 'center');
            r.text(tab.key, tx + tabWidth - 12, y + 26, '#555', 9, 'right');

            // Notification badge with pulse for skills
            const badge = HUD.getTabBadge(game, tab.id);
            if (badge > 0 && !isActive) {
                const pulseSize = tab.id === 'skills' ? 8 + Math.sin(Date.now() / 300) * 2 : 8;
                r.circle(tx + tabWidth - 12, y + 10, pulseSize, '#ff4444');
                r.text(badge > 9 ? '!' : badge.toString(), tx + tabWidth - 12, y + 5, '#fff', 9, 'center');
            }

            if (inp.clickedIn(tx, y + 2, tabWidth - 4, 40)) {
                game.switchScreen(tab.id);
            }
        });
    }

    static getTabBadge(game, tabId) {
        switch (tabId) {
            case 'quest': {
                // Count claimable quest rewards
                return game.quests.getActiveQuestList().filter(q => q.state.completed).length;
            }
            case 'skills': {
                return game.skills.skillPoints > 0 ? game.skills.skillPoints : 0;
            }
            case 'craft': {
                // Has completed craft
                return game.crafting.currentCraft === null && game.crafting.craftQueue.length > 0 ? 1 : 0;
            }
            case 'map': {
                // Bank interest to collect
                return game.bank.accumulatedInterest > 0 ? 1 : 0;
            }
            case 'explore': {
                // Weekly boss available
                return game.weeklyBoss ? 1 : 0;
            }
            default:
                return 0;
        }
    }

    static renderNotifications(game) {
        const r = game.renderer;
        const notifs = game.notifications;
        for (let i = 0; i < notifs.length; i++) {
            const n = notifs[i];
            const alpha = Math.min(1, n.timer / 500);
            const y = 70 + i * 28;
            r.setAlpha(alpha);
            r.roundRect(400, y, 400, 24, 4, 'rgba(10,5,25,0.9)', n.color);
            r.text(n.message, 600, y + 5, n.color, 12, 'center');
            r.resetAlpha();
        }
    }

    static renderTutorial(game) {
        if (!game.showTutorial || game.screen === 'title') return;

        const r = game.renderer;
        const inp = game.input;

        const tutorials = [
            {
                screen: 'shop', step: 0,
                title: 'Welcome to Your Shop!',
                text: 'Click items in "Quick Stock" to add them to your display.\nCustomers will browse and offer to buy displayed items.',
                highlight: { x: 10, y: 330, w: 380, h: 70 }
            },
            {
                screen: 'shop', step: 1,
                title: 'Negotiations',
                text: 'When customers offer, you can Accept, Haggle for more,\nor Refuse. Happy customers boost your reputation!',
                highlight: { x: 400, y: 400, w: 790, h: 200 }
            },
            {
                screen: 'craft', step: 2,
                title: 'Crafting',
                text: 'Craft items to sell or use! Unlock new stations\nfor advanced recipes. Crafting levels up over time.',
                highlight: { x: 200, y: 55, w: 500, h: 700 }
            },
            {
                screen: 'explore', step: 3,
                title: 'Exploration',
                text: 'Explore areas to gather materials and fight enemies.\nHigher floors have better loot but tougher foes!',
                highlight: { x: 25, y: 90, w: 370, h: 190 }
            },
        ];

        const current = tutorials.find(t => t.step === game.tutorialStep);
        if (!current) {
            game.showTutorial = false;
            return;
        }
        if (current.screen !== game.screen) return;

        // Dim everything except highlight
        r.setAlpha(0.5);
        r.fillRect(0, 44, 1200, 711, '#000');
        r.resetAlpha();

        // Highlight area
        if (current.highlight) {
            const h = current.highlight;
            r.strokeRect(h.x, h.y, h.w, h.h, '#ffd700', 3);
        }

        // Tutorial box
        const bx = 350, by = 300, bw = 500, bh = 140;
        r.roundRect(bx, by, bw, bh, 10, 'rgba(20,10,50,0.98)', '#ffd700', 2);
        r.textBold(current.title, bx + bw / 2, by + 15, '#ffd700', 18, 'center');

        const lines = current.text.split('\n');
        lines.forEach((line, i) => {
            r.text(line, bx + bw / 2, by + 50 + i * 20, '#ddd', 12, 'center');
        });

        // Next/Skip buttons
        const nextHover = inp.isOver(bx + bw / 2 - 60, by + bh - 40, 120, 30);
        r.button(bx + bw / 2 - 60, by + bh - 40, 120, 30, 'Got it!', nextHover);
        if (inp.clickedIn(bx + bw / 2 - 60, by + bh - 40, 120, 30)) {
            game.tutorialStep++;
            game.audio.click();
        }

        const skipHover = inp.isOver(bx + bw - 80, by + 5, 70, 22);
        r.roundRect(bx + bw - 80, by + 5, 70, 22, 3, skipHover ? '#5a3090' : 'transparent');
        r.text('Skip all', bx + bw - 45, by + 8, '#888', 10, 'center');
        if (inp.clickedIn(bx + bw - 80, by + 5, 70, 22)) {
            game.showTutorial = false;
            game.audio.click();
        }
    }
}
