// Main entry point
(function() {
    const canvas = document.getElementById('gameCanvas');
    const game = new Game(canvas);

    let lastTime = performance.now();

    function gameLoop(currentTime) {
        const dt = Math.min(currentTime - lastTime, 100);
        lastTime = currentTime;

        // Clear
        game.renderer.clear();

        // Update
        game.update(dt);

        // Reset tooltip
        game.tooltipItem = null;

        // Render based on screen
        if (game.screen === 'title') {
            TitleScreen.render(game);
        } else {
            // Animated background per screen + weather
            BackgroundRenderer.render(game.renderer, game.screen, currentTime);
            if (game.screen !== 'combat') {
                BackgroundRenderer.renderWeather(game.renderer, game.day, currentTime);
            }

            // Render current screen
            switch(game.screen) {
                case 'shop': ShopUI.render(game); break;
                case 'craft': CraftingUI.render(game); break;
                case 'explore': ExploreUI.render(game); break;
                case 'combat': CombatUI.render(game); break;
                case 'inventory': InventoryUI.render(game); break;
                case 'skills': SkillsUI.render(game); break;
                case 'quest': QuestUI.render(game); break;
                case 'map': MapUI.render(game); break;
            }

            // Screen transition fade
            if (game._screenTransition > 0) {
                game.renderer.setAlpha(game._screenTransition * 0.06);
                game.renderer.fillRect(0, 44, 1200, 712, '#0a0520');
                game.renderer.resetAlpha();
                game._screenTransition--;
            }

            // HUD always on top
            HUD.render(game);

            // Particles on top
            game.particles.render(game.renderer);

            // Screen flash overlay
            game.renderer.renderFlash();

            // Combat vignette
            if (game.screen === 'combat') {
                game.renderer.vignette(0.25);
            }

            // Pause overlay
            if (game.paused) {
                game.renderer.setAlpha(0.3);
                game.renderer.fillRect(0, 44, 1200, 712, '#000');
                game.renderer.resetAlpha();
                const pausePulse = Math.sin(Date.now() / 500) * 0.2 + 0.8;
                game.renderer.setAlpha(pausePulse);
                game.renderer.textBold('⏸ PAUSED', 600, 380, '#fff', 32, 'center');
                game.renderer.text('Press Space to resume', 600, 420, '#aaa', 14, 'center');
                game.renderer.resetAlpha();
            }

            // Tooltip
            if (game.tooltipItem) {
                game.renderer.tooltip(game.input.mouseX + 15, game.input.mouseY + 15, game.tooltipItem);
            }

            // Tutorial overlay
            if (game.showTutorial) {
                HUD.renderTutorial(game);
            }

            // Settings overlay
            if (SettingsUI.visible) {
                SettingsUI.render(game);
            }

            // Dialog on top of everything
            if (game.dialogMessage) {
                DialogUI.render(game);
            }
        }

        // End frame
        game.renderer.endFrame();
        game.input.endFrame();

        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
})();
