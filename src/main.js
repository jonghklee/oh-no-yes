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
            // Animated background per screen
            BackgroundRenderer.render(game.renderer, game.screen, currentTime);

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

            // HUD always on top
            HUD.render(game);

            // Particles on top
            game.particles.render(game.renderer);

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
