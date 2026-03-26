// Settings overlay
class SettingsUI {
    static visible = false;

    static toggle() {
        SettingsUI.visible = !SettingsUI.visible;
    }

    static render(game) {
        if (!SettingsUI.visible) return;

        const r = game.renderer;
        const inp = game.input;

        // Overlay
        r.setAlpha(0.7);
        r.fillRect(0, 0, 1200, 800, '#000');
        r.resetAlpha();

        // Settings panel
        const pw = 500, ph = 450;
        const px = (1200 - pw) / 2, py = (800 - ph) / 2;
        r.roundRect(px, py, pw, ph, 12, 'rgba(20,10,40,0.98)', '#5a3090', 2);
        r.textBold('⚙ Settings', px + pw / 2, py + 15, '#ffd700', 20, 'center');

        let sy = py + 55;

        // === SOUND ===
        r.textBold('Sound', px + 20, sy, '#ddd', 14);
        sy += 25;

        // Master volume
        r.text('Master Volume:', px + 30, sy, '#aaa', 12);
        const volBarX = px + 180, volBarW = 250;
        r.progressBar(volBarX, sy + 2, volBarW, 14, game.audio.volume, 1.0, '#4488ff', '#222');
        r.text(`${Math.round(game.audio.volume * 100)}%`, volBarX + volBarW + 10, sy, '#fff', 12);

        // Click to change volume
        if (inp.clickedIn(volBarX, sy, volBarW, 16)) {
            const relX = inp.mouseX - volBarX;
            game.audio.volume = Utils.clamp(relX / volBarW, 0, 1);
        }
        sy += 30;

        // Music toggle
        r.text('Music:', px + 30, sy, '#aaa', 12);
        const musicOn = game.audio.musicPlaying;
        const musicHover = inp.isOver(px + 180, sy - 2, 80, 22);
        r.button(px + 180, sy - 2, 80, 22, musicOn ? '🔊 ON' : '🔇 OFF', musicHover,
            false, musicOn ? '#2a5a2a' : '#5a2a2a');
        if (inp.clickedIn(px + 180, sy - 2, 80, 22)) {
            if (musicOn) game.audio.stopMusic();
            else game.audio.startMusic('shop');
            game.audio.click();
        }
        sy += 30;

        // Sound effects toggle
        r.text('Sound FX:', px + 30, sy, '#aaa', 12);
        const sfxHover = inp.isOver(px + 180, sy - 2, 80, 22);
        r.button(px + 180, sy - 2, 80, 22, game.audio.enabled ? '🔊 ON' : '🔇 OFF', sfxHover,
            false, game.audio.enabled ? '#2a5a2a' : '#5a2a2a');
        if (inp.clickedIn(px + 180, sy - 2, 80, 22)) {
            game.audio.enabled = !game.audio.enabled;
        }
        sy += 40;

        // === DISPLAY ===
        r.textBold('Display', px + 20, sy, '#ddd', 14);
        sy += 25;

        // Game speed
        r.text('Game Speed:', px + 30, sy, '#aaa', 12);
        [1, 2, 3].forEach((spd, i) => {
            const bx = px + 180 + i * 60;
            const active = game.gameSpeed === spd;
            const hov = inp.isOver(bx, sy - 2, 50, 22);
            r.button(bx, sy - 2, 50, 22, `${spd}x`, hov, false, active ? '#2a5a2a' : '#3d1e6d');
            if (inp.clickedIn(bx, sy - 2, 50, 22)) {
                game.gameSpeed = spd;
                game.audio.click();
            }
        });
        sy += 40;

        // === DATA ===
        r.textBold('Data', px + 20, sy, '#ddd', 14);
        sy += 25;

        // Save
        const saveHover = inp.isOver(px + 30, sy, 140, 30);
        r.button(px + 30, sy, 140, 30, '💾 Save Game', saveHover);
        if (inp.clickedIn(px + 30, sy, 140, 30)) {
            game.saveGame();
            game.notify('Game saved!', '#44ff44');
            game.audio.click();
        }

        // Delete save
        const delHover = inp.isOver(px + 190, sy, 140, 30);
        r.button(px + 190, sy, 140, 30, '🗑 Delete Save', delHover, false, '#5a2020');
        if (inp.clickedIn(px + 190, sy, 140, 30)) {
            game.showDialog('Delete your save? This cannot be undone!', [
                { label: 'Delete', action: () => {
                    game.saveSystem.deleteSave();
                    game.notify('Save deleted.', '#ff4444');
                    game.dismissDialog();
                }},
                { label: 'Cancel', action: () => game.dismissDialog() }
            ]);
        }
        sy += 50;

        // === STATS ===
        r.textBold('Game Stats', px + 20, sy, '#ddd', 14);
        sy += 22;
        const stats = game.getStats();
        r.text(`Days: ${stats.playDays} | Level: ${game.level} | Gold: ${Utils.formatGold(stats.totalGold)}`, px + 30, sy, '#888', 10);
        sy += 16;
        r.text(`Sales: ${stats.totalSales} | Crafts: ${stats.totalCrafts} | Bosses: ${stats.bossesDefeated}`, px + 30, sy, '#888', 10);
        sy += 16;
        r.text(`Achievements: ${game.achievements.getUnlockedCount()}/${game.achievements.getTotalCount()}`, px + 30, sy, '#ffd700', 10);
        sy += 16;
        r.text(`Endless Best: F${game.endless.highestFloor} | Chests: ${game.mystery.totalOpened}`, px + 30, sy, '#888', 10);

        // Close button
        const closeHover = inp.isOver(px + pw - 35, py + 5, 30, 25);
        r.roundRect(px + pw - 35, py + 5, 30, 25, 4, closeHover ? '#5a3090' : 'transparent');
        r.text('✕', px + pw - 20, py + 8, '#fff', 14, 'center');
        if (inp.clickedIn(px + pw - 35, py + 5, 30, 25) || inp.justPressed('Escape')) {
            SettingsUI.visible = false;
            game.audio.click();
        }
    }
}
