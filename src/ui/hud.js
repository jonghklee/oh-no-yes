// HUD - always visible overlay
class HUD {
    static render(game) {
        const r = game.renderer;
        const inp = game.input;

        // Top bar background
        r.gradientRect(0, 0, 1200, 44, 'rgba(20,10,40,0.95)', 'rgba(20,10,40,0.7)');
        r.line(0, 44, 1200, 44, '#3d1e6d', 2);

        // Gold
        r.text('💰', 10, 12, '#ffd700', 18);
        r.textBold(Utils.formatGold(game.gold) + 'g', 34, 14, '#ffd700', 15);

        // Level
        r.text(`Lv.${game.level}`, 140, 14, '#fff', 13);
        const xpNeeded = getXpForLevel(game.level);
        r.progressBar(185, 16, 80, 12, game.xp, xpNeeded, '#6644aa', '#222', '#444');
        r.text(`${game.xp}/${xpNeeded}`, 190, 16, '#ddd', 9);

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

        // Stamina
        r.text(`⚡ ${game.exploration.stamina}/${game.exploration.maxStamina}`, 640, 14, '#44ddff', 12);

        // Reputation
        r.text(`⭐ ${game.reputation.title}`, 750, 14, '#ffaa44', 12);

        // Crafting level
        r.text(`🔨 Craft Lv.${game.crafting.level}`, 920, 14, '#4488ff', 11);

        // Speed control
        const speedColors = { 1: '#aaa', 2: '#88ff88', 3: '#ffaa44' };
        const speedBtn = r.button(1050, 8, 30, 28, `${game.gameSpeed}x`, inp.isOver(1050, 8, 30, 28));
        if (inp.clickedIn(1050, 8, 30, 28)) {
            game.gameSpeed = game.gameSpeed >= 3 ? 1 : game.gameSpeed + 1;
            game.audio.click();
        }

        // Pause
        const pauseBtn = r.button(1090, 8, 30, 28, game.paused ? '▶' : '⏸', inp.isOver(1090, 8, 30, 28));
        if (inp.clickedIn(1090, 8, 30, 28)) {
            game.paused = !game.paused;
            game.audio.click();
        }

        // Save indicator
        r.text('💾', 1135, 14, '#666', 12);
        if (inp.clickedIn(1135, 8, 30, 28)) {
            game.saveGame();
            game.notify('Game saved!', '#44ff44');
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

            if (inp.clickedIn(tx, y + 2, tabWidth - 4, 40) || inp.justPressed(tab.key)) {
                game.switchScreen(tab.id);
            }
        });
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
}
