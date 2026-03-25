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

        // Title
        const titleY = 200 + Math.sin(time * 1.5) * 8;
        r.textBold('Oh No Yes!', 600, titleY, '#ffd700', 56, 'center');
        r.text('Merchant Adventure RPG', 600, titleY + 60, '#b090d0', 22, 'center');

        // Subtitle with animation
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

        // Continue button
        if (hasSave) {
            const contBtnY = btnY + 65;
            const contHover = inp.isOver(450, contBtnY, 300, 50);
            r.roundRect(450, contBtnY, 300, 50, 8, contHover ? '#2a5020' : '#1e4018', '#408030', 2);
            r.textBold('📂  Continue', 600, contBtnY + 15, '#88ff88', 20, 'center');
            if (inp.clickedIn(450, contBtnY, 300, 50)) {
                game.audio.init();
                game.audio.click();
                game.loadGame();
            }
        }

        // Version & credits
        r.text('v1.0 - Made with ❤', 600, 700, '#444', 11, 'center');

        // Controls hint
        r.text('Keys: 1-7 switch tabs | Space: pause | +/- speed', 600, 730, '#333', 10, 'center');

        // Dialog overlay
        if (game.dialogMessage) {
            DialogUI.render(game);
        }
    }
}
