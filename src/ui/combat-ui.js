// Combat screen UI
class CombatUI {
    static render(game) {
        const r = game.renderer;
        const inp = game.input;
        const combat = game.combat;

        if (!combat.active && combat.state !== 'victory' && combat.state !== 'defeat') return;

        // Background
        r.gradientRect(0, 50, 1200, 700, '#0a0520', '#1a0a2e');

        // Arena effect
        const time = Date.now() / 1000;
        r.setAlpha(0.1);
        for (let i = 0; i < 5; i++) {
            r.circle(600 + Math.sin(time + i) * 200, 350 + Math.cos(time + i) * 100,
                50 + Math.sin(time * 2 + i) * 20, '#4a2080');
        }
        r.resetAlpha();

        // === ENEMY ===
        const ex = 750 + (combat.enemyShake > 0 ? Utils.random(-3, 3) : 0);
        const ey = 180;

        // Enemy sprite area
        r.roundRect(ex - 60, ey - 10, 120, 130, 8, 'rgba(40,20,60,0.5)', '#5a3090');
        r.text(combat.enemy.icon, ex, ey + 20, '#fff', 50, 'center');
        r.textBold(combat.enemy.name, ex, ey + 90, '#fff', 14, 'center');

        // Enemy HP bar
        r.progressBar(ex - 60, ey + 110, 120, 16, combat.enemy.currentHp, combat.enemy.maxHp, '#ff4444', '#333');
        r.text(`${combat.enemy.currentHp}/${combat.enemy.maxHp}`, ex, ey + 112, '#fff', 9, 'center');

        if (combat.enemy.boss) {
            r.text('👑 BOSS', ex, ey - 25, '#ffd700', 12, 'center');
        }

        // === PLAYER ===
        const px = 350 + (combat.playerShake > 0 ? Utils.random(-3, 3) : 0);
        const py = 320;

        r.roundRect(px - 60, py - 10, 120, 130, 8, 'rgba(20,40,60,0.5)', '#305090');
        r.text('⚔', px, py + 20, '#fff', 50, 'center');
        r.textBold('You', px, py + 90, '#fff', 14, 'center');

        // Player HP bar
        r.progressBar(px - 60, py + 110, 120, 16, combat.player.currentHp, combat.player.maxHp, '#44aa44', '#333');
        r.text(`${combat.player.currentHp}/${combat.player.maxHp}`, px, py + 112, '#fff', 9, 'center');

        // Player stats
        r.text(`ATK: ${combat.player.atk}`, px - 55, py + 135, '#ff8844', 10);
        r.text(`DEF: ${combat.player.def}`, px + 5, py + 135, '#4488ff', 10);

        // === COMBAT LOG ===
        r.panel(30, 520, 500, 200, '📋 Battle Log');
        combat.log.forEach((msg, i) => {
            const alpha = (i + 1) / combat.log.length;
            r.setAlpha(alpha);
            r.text(msg, 45, 550 + i * 20, '#ddd', 11);
            r.resetAlpha();
        });

        // === ACTIONS ===
        if (combat.state === 'playerTurn') {
            r.panel(550, 520, 400, 200, '⚡ Actions');

            // Attack
            const atkHover = inp.isOver(570, 555, 170, 40);
            r.button(570, 555, 170, 40, '⚔ Attack', atkHover);
            if (inp.clickedIn(570, 555, 170, 40)) {
                const result = combat.playerAttack();
                if (result) {
                    game.audio[result.isCrit ? 'crit' : 'hit']();
                    game.particles.damage(ex, ey + 30, result.damage, result.isCrit);
                    r.shake(result.isCrit ? 300 : 150);
                    if (result.type === 'victory') {
                        game.audio.victory();
                    }
                }
            }

            // Defend
            const defHover = inp.isOver(760, 555, 170, 40);
            r.button(760, 555, 170, 40, '🛡 Defend', defHover);
            if (inp.clickedIn(760, 555, 170, 40)) {
                combat.playerDefend();
                game.audio.click();
            }

            // Use Potion
            const potions = game.inventory.getItemsByCategory('potion');
            if (potions.length > 0) {
                let potY = 610;
                potions.slice(0, 3).forEach((potion, i) => {
                    const potHover = inp.isOver(570 + i * 130, potY, 120, 30);
                    r.button(570 + i * 130, potY, 120, 30,
                        `${potion.icon} ${potion.name.split(' ')[0]} (${potion.quantity})`, potHover);
                    if (inp.clickedIn(570 + i * 130, potY, 120, 30)) {
                        if (combat.playerUsePotion(potion)) {
                            game.inventory.removeItem(potion.id, 1);
                            game.audio.heal();
                        }
                    }
                });
            }

            // Flee
            const fleeHover = inp.isOver(570, 660, 170, 35);
            r.button(570, 660, 170, 35, '🏃 Flee', fleeHover, false, '#5a2020');
            if (inp.clickedIn(570, 660, 170, 35)) {
                const bonuses = game.getSkillBonuses();
                const fled = combat.playerFlee(bonuses.guaranteedEscape);
                if (fled) {
                    game.screen = game.exploration.active ? 'explore' : game.previousScreen;
                }
                game.audio.click();
            }
        } else if (combat.state === 'enemyTurn') {
            r.panel(550, 520, 400, 200, '⏳ Enemy Turn');
            r.text(`${combat.enemy.name} is acting...`, 650, 600, '#ff8888', 14, 'center');
        }

        // === VICTORY / DEFEAT ===
        if (combat.state === 'victory') {
            r.setAlpha(0.7);
            r.fillRect(0, 250, 1200, 200, '#000');
            r.resetAlpha();
            r.textBold('⚔ VICTORY! ⚔', 600, 290, '#ffd700', 36, 'center');

            const rewards = combat.combat?.getRewards ? null : null; // preview

            const collectHover = inp.isOver(500, 380, 200, 45);
            r.button(500, 380, 200, 45, '💰 Collect Rewards', collectHover);
            if (inp.clickedIn(500, 380, 200, 45)) {
                game.collectCombatRewards();
                game.audio.coin();
            }
        }

        if (combat.state === 'defeat') {
            r.setAlpha(0.7);
            r.fillRect(0, 250, 1200, 200, '#000');
            r.resetAlpha();
            r.textBold('💀 DEFEATED 💀', 600, 290, '#ff4444', 36, 'center');
            r.text('You lost 10% of your gold...', 600, 340, '#ff8888', 14, 'center');

            const retHover = inp.isOver(500, 380, 200, 45);
            r.button(500, 380, 200, 45, '🏠 Return', retHover);
            if (inp.clickedIn(500, 380, 200, 45)) {
                game.combat.active = false;
                game.screen = game.previousScreen;
                game.audio.click();
            }
        }

        // Particles
        game.particles.render(r);
    }
}
