// Title screen
class TitleScreen {
    static render(game) {
        const r = game.renderer;
        const inp = game.input;

        // Background
        const time = Date.now() / 1000;
        r.gradientRect(0, 0, 1200, 800, '#0a0520', '#1a0a2e');

        // Animated stars
        for (let i = 0; i < 50; i++) {
            const x = (Math.sin(time * 0.3 + i * 73.7) * 0.5 + 0.5) * 1200;
            const y = (Math.cos(time * 0.2 + i * 31.3) * 0.5 + 0.5) * 800;
            const brightness = Math.sin(time * 2 + i) * 0.3 + 0.7;
            r.setAlpha(brightness);
            r.circle(x, y, 1 + Math.sin(time + i) * 0.5, '#fff');
            r.resetAlpha();
        }

        // Title with glow effect
        const titleY = 200 + Math.sin(time * 1.5) * 8;

        // Title glow
        const glowSize = Math.sin(time * 2) * 5 + 15;
        r.setAlpha(0.08);
        r.circle(600, titleY + 25, glowSize + 60, '#ffd700');
        r.resetAlpha();

        // Title shadow
        r.textBold('Oh No Yes!', 602, titleY + 2, '#000', 56, 'center');
        // Main title
        r.textBold('Oh No Yes!', 600, titleY, '#ffd700', 56, 'center');

        // Subtitle with shimmer
        r.text('Merchant Adventure RPG', 600, titleY + 60, '#b090d0', 22, 'center');

        // Tagline with animation
        const subAlpha = Math.sin(time * 2) * 0.3 + 0.7;
        r.setAlpha(subAlpha);
        r.text('Build your empire. Explore the world. Craft legendary items.', 600, titleY + 95, '#8070a0', 14, 'center');
        r.resetAlpha();

        // Buttons
        const btnY = 420;
        const hasSave = game.saveSystem.hasSave();

        // New Game button
        const newBtnHover = inp.isOver(450, btnY, 300, 50);
        r.roundRect(450, btnY, 300, 50, 8, newBtnHover ? '#4a2080' : '#3d1e6d', '#6040a0', 2);
        r.textBold('🎮  New Game', 600, btnY + 15, '#fff', 20, 'center');
        if (inp.clickedIn(450, btnY, 300, 50)) {
            if (hasSave) {
                game.showDialog('Start a new game? This will overwrite your save.', [
                    { label: 'Yes, start new', action: () => { game.saveSystem.deleteSave(); game.newGame(); game.dismissDialog(); } },
                    { label: 'Cancel', action: () => game.dismissDialog() }
                ]);
            } else {
                game.newGame();
            }
            game.audio.init();
            game.audio.click();
        }

        // Continue button with save preview
        if (hasSave) {
            const contBtnY = btnY + 65;
            const contHover = inp.isOver(450, contBtnY, 300, 70);
            r.roundRect(450, contBtnY, 300, 70, 8, contHover ? '#2a5020' : '#1e4018', '#408030', 2);
            r.textBold('📂  Continue', 600, contBtnY + 10, '#88ff88', 20, 'center');

            // Save preview
            try {
                const saveData = JSON.parse(localStorage.getItem('ohnoyes_save'));
                if (saveData) {
                    const ptMin = Math.floor((saveData.playtimeMs || 0) / 60000);
                    const ptH = Math.floor(ptMin / 60);
                    const ptM = ptMin % 60;
                    const preview = `Lv.${saveData.level || 1} | Day ${saveData.day || 1} | ${Utils.formatGold(saveData.gold || 0)}g | ${ptH}h${ptM}m`;
                    r.text(preview, 600, contBtnY + 38, '#6a9a6a', 11, 'center');
                    if (saveData.prestigeLevel > 0) {
                        r.text(`⭐ Prestige ${saveData.prestigeLevel}`, 600, contBtnY + 53, '#aa88ff', 9, 'center');
                    }
                }
            } catch(e) {}

            if (inp.clickedIn(450, contBtnY, 300, 70)) {
                game.audio.init();
                game.audio.click();
                game.loadGame();
            }
        }

        // Version & credits
        r.text('v3.5 - Made with ❤', 600, 680, '#444', 11, 'center');

        // Gameplay tips (rotate every 4 seconds)
        const tips = [
            '💡 Stock items in your shop display for customers to buy!',
            '💡 Explore areas to gather crafting materials.',
            '💡 Counter-offer in negotiations for better deals!',
            '💡 Seasonal recipes give bonus yields - check the season!',
            '💡 Trade routes provide passive income while you play.',
            '💡 Mystery chests can contain jackpot rewards!',
            '💡 Complete daily challenges for streak bonuses.',
            '💡 Upgrade your shop to attract better customers.',
            '💡 The Endless Dungeon unlocks at level 10.',
            '💡 Use Power Strike (8 MP) for massive damage in combat!',
            '💡 Bulk sell common materials from the inventory screen.',
            '💡 Higher reputation attracts nobles and collectors.',
            '💡 New Game+ keeps permanent stat bonuses!',
            '💡 Press 1-7 to quickly switch between tabs.',
            '💡 Check Market tab for price trends and best deals.',
        ];
        const tipIdx = Math.floor(time / 4000) % tips.length;
        r.text(tips[tipIdx], 600, 710, '#555', 11, 'center');

        // Controls hint
        r.text('Keys: 1-7 switch tabs | Space: pause | ⚙ settings', 600, 735, '#333', 10, 'center');

        // Dialog overlay
        if (game.dialogMessage) {
            DialogUI.render(game);
        }
    }
}
