// Combat screen UI
class CombatUI {
    static render(game) {
        const r = game.renderer;
        const inp = game.input;
        const combat = game.combat;

        if (!combat.active && combat.state !== 'victory' && combat.state !== 'defeat') return;

        // Background
        r.gradientRect(0, 50, 1200, 700, '#0a0520', '#1a0a2e');

        // Arena effect - more dramatic for bosses
        const time = Date.now() / 1000;
        const isBoss = combat.enemy.boss;
        const arenaColor = isBoss ? '#802020' : '#4a2080';
        const arenaCount = isBoss ? 8 : 5;
        r.setAlpha(isBoss ? 0.15 : 0.1);
        for (let i = 0; i < arenaCount; i++) {
            const spd = isBoss ? 1.5 : 1;
            r.circle(600 + Math.sin(time * spd + i) * 250, 350 + Math.cos(time * spd + i) * 120,
                50 + Math.sin(time * 2 + i) * 25, arenaColor);
        }
        r.resetAlpha();

        // Boss intro warning text (first 3 seconds of battle)
        if (isBoss && combat.log.length <= 2) {
            const introAlpha = Math.sin(time * 4) * 0.3 + 0.7;
            r.setAlpha(introAlpha);
            r.textBold('⚠ BOSS BATTLE ⚠', 600, 60, '#ff4444', 20, 'center');
            r.resetAlpha();
        }

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

        // Endless dungeon indicator
        if (game.endless.active) {
            r.roundRect(450, 55, 300, 25, 4, 'rgba(80,20,80,0.7)', '#ff44ff');
            r.textBold(`🏰 Endless Dungeon - Floor ${game.endless.floor}`, 600, 59, '#ff44ff', 12, 'center');
            r.text(`Best: F${game.endless.highestFloor} | Streak: ${game.endless.streak}`, 600, 82, '#aaa', 10, 'center');
            // Active modifiers
            if (game.endless.modifiers.length > 0) {
                const modText = game.endless.modifiers.map(m => `${m.icon}${m.name}`).join(' ');
                r.text(modText, 600, 96, '#ff8844', 9, 'center');
            }
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

        // Status effect indicators on player
        if (combat.player.defending) {
            r.text('🛡', px + 50, py, '#4488ff', 16);
        }

        // Turn indicator glow
        if (combat.state === 'playerTurn') {
            const glowAlpha = Math.sin(Date.now() / 300) * 0.3 + 0.5;
            r.setAlpha(glowAlpha);
            r.strokeRect(px - 65, py - 15, 130, 140, '#44ff44', 2);
            r.resetAlpha();
            r.text('▶ YOUR TURN', px, py - 20, '#44ff44', 10, 'center');
        } else if (combat.state === 'enemyTurn') {
            const glowAlpha = Math.sin(Date.now() / 200) * 0.3 + 0.5;
            r.setAlpha(glowAlpha);
            r.strokeRect(ex - 65, ey - 15, 130, 140, '#ff4444', 2);
            r.resetAlpha();
            r.text('▶ ENEMY TURN', ex, ey - 35, '#ff4444', 10, 'center');
        }

        // Enemy ATK/DEF
        r.text(`ATK: ${combat.enemy.atk}`, ex - 55, ey + 135, '#ff8844', 9);
        r.text(`DEF: ${combat.enemy.def}`, ex + 5, ey + 135, '#4488ff', 9);

        // === COMBAT LOG ===
        r.panel(30, 520, 500, 200, '📋 Battle Log');
        combat.log.forEach((msg, i) => {
            const alpha = (i + 1) / combat.log.length;
            r.setAlpha(alpha);
            r.text(msg, 45, 550 + i * 20, '#ddd', 11);
            r.resetAlpha();
        });

        // Auto-combat toggle
        if (!CombatUI._autoCombat) CombatUI._autoCombat = false;
        const autoHover = inp.isOver(960, 520, 80, 22);
        r.roundRect(960, 520, 80, 22, 3,
            CombatUI._autoCombat ? '#2a5a2a' : (autoHover ? 'rgba(40,60,40,0.5)' : 'rgba(20,30,20,0.3)'),
            CombatUI._autoCombat ? '#44aa44' : '#444');
        r.text(`🤖 Auto: ${CombatUI._autoCombat ? 'ON' : 'OFF'}`, 968, 524, CombatUI._autoCombat ? '#88ff88' : '#888', 9);
        if (inp.clickedIn(960, 520, 80, 22)) {
            CombatUI._autoCombat = !CombatUI._autoCombat;
            game.audio.click();
        }

        // Auto-combat logic
        if (CombatUI._autoCombat && combat.state === 'playerTurn' && !combat.animating) {
            // Auto-attack (or use potion if low HP)
            if (combat.player.currentHp < combat.player.maxHp * 0.3 && game.inventory.hasItem('health_potion', 1)) {
                const potion = game.inventory.items['health_potion'];
                if (potion && combat.playerUsePotion(potion)) {
                    game.inventory.removeItem('health_potion', 1);
                    game.audio.heal();
                }
            } else {
                const result = combat.playerAttack();
                if (result) {
                    game.audio[result.isCrit ? 'crit' : 'hit']();
                    game.particles.damage(ex, ey + 30, result.damage, result.isCrit);
                    r.shake(result.isCrit ? 300 : 150);
                    if (result.isCrit) r.flash('#ff4444', 150);
                    if (result.type === 'victory') {
                        game.audio.victory();
                        r.flash('#ffd700', 300);
                    }
                }
            }
        }

        // === ACTIONS ===
        if (combat.state === 'playerTurn') {
            r.panel(550, 520, 400, 210, '⚡ Actions');

            // Attack
            const atkHover = inp.isOver(570, 555, 170, 40);
            r.button(570, 555, 170, 40, '⚔ Attack', atkHover);
            if (inp.clickedIn(570, 555, 170, 40)) {
                const result = combat.playerAttack();
                if (result) {
                    game.audio[result.isCrit ? 'crit' : 'hit']();
                    game.particles.damage(ex, ey + 30, result.damage, result.isCrit);
                    r.shake(result.isCrit ? 300 : 150);
                    if (result.isCrit) {
                        r.flash('#ff4444', 150); // Red flash on crit
                        game.particles.burst(ex, ey + 30, 8, '#ff4444', 3);
                    }
                    if (result.type === 'victory') {
                        game.audio.victory();
                        r.flash('#ffd700', 300); // Gold flash on victory
                        game.particles.levelUpEffect(ex, ey);
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

            // MP bar
            r.text(`MP: ${combat.player.currentMp}/${combat.player.maxMp || 20}`, 570, 600, '#4488ff', 11);
            r.progressBar(630, 602, 80, 8, combat.player.currentMp, combat.player.maxMp || 20, '#4488ff', '#222');

            // Special abilities
            const abilities = [
                { name: '⚡ Power Strike', cost: 8, action: () => {
                    const r = combat.playerPowerStrike();
                    if (r) { game.audio.crit(); game.particles.damage(ex, ey + 30, r.damage, r.isCrit); game.renderer.shake(250); }
                }},
                { name: '✂ Double Slash', cost: 5, action: () => {
                    const r = combat.playerDoubleSlash();
                    if (r) { game.audio.hit(); game.particles.damage(ex, ey + 30, r.damage, false); game.renderer.shake(150); }
                }},
                { name: '📢 War Cry', cost: 10, action: () => {
                    const r = combat.playerWarCry();
                    if (r) { game.audio.levelUp(); game.particles.floatingText(px, py, 'BUFF!', '#ffd700'); }
                }}
            ];

            abilities.forEach((ab, i) => {
                const abx = 570 + i * 130;
                const aby = 618;
                const canUse = combat.player.currentMp >= ab.cost;
                const abHover = inp.isOver(abx, aby, 120, 28);
                r.button(abx, aby, 120, 28, `${ab.name} (${ab.cost})`, abHover, !canUse, '#2a3a5a');
                if (canUse && inp.clickedIn(abx, aby, 120, 28)) { ab.action(); }
            });

            // Potions
            const potions = game.inventory.getItemsByCategory('potion');
            if (potions.length > 0) {
                let potY = 653;
                potions.slice(0, 3).forEach((potion, i) => {
                    const potHover = inp.isOver(570 + i * 130, potY, 120, 26);
                    r.button(570 + i * 130, potY, 120, 26,
                        `${potion.icon} ${potion.name.split(' ')[0]} (${potion.quantity})`, potHover, false, '#2a4a2a');
                    if (inp.clickedIn(570 + i * 130, potY, 120, 26)) {
                        if (combat.playerUsePotion(potion)) {
                            game.inventory.removeItem(potion.id, 1);
                            game.audio.heal();
                        }
                    }
                });
            }

            // Flee
            const fleeHover = inp.isOver(570, 690, 170, 28);
            r.button(570, 690, 170, 28, '🏃 Flee', fleeHover, false, '#5a2020');
            if (inp.clickedIn(570, 690, 170, 28)) {
                if (game.endless.active) {
                    // Leaving endless dungeon
                    const result = game.endless.leave();
                    game.combat.active = false;
                    game.screen = 'explore';
                    game.notify(`Escaped! Cleared ${result.floorsCleared} floors.`, '#ff44ff');
                } else {
                    const bonuses = game.getSkillBonuses();
                    const fled = combat.playerFlee(bonuses.guaranteedEscape);
                    if (fled) {
                        game.screen = game.exploration.active ? 'explore' : game.previousScreen;
                    }
                }
                game.audio.click();
            }
        } else if (combat.state === 'enemyTurn') {
            r.panel(550, 520, 400, 200, '⏳ Enemy Turn');
            r.text(`${combat.enemy.name} is acting...`, 650, 600, '#ff8888', 14, 'center');
        }

        // === VICTORY / DEFEAT ===
        if (combat.state === 'victory') {
            // Animated victory banner
            const victoryPulse = Math.sin(Date.now() / 200) * 0.1 + 0.9;
            r.setAlpha(0.75);
            r.fillRect(0, 240, 1200, 220, '#000');
            r.resetAlpha();

            r.setAlpha(victoryPulse);
            r.textBold('⚔ VICTORY! ⚔', 600, 280, '#ffd700', 42, 'center');
            r.resetAlpha();

            // Show enemy name
            r.text(`${combat.enemy.name} defeated!`, 600, 330, '#aaa', 14, 'center');

            // Reward preview
            const enemy = combat.enemy;
            const goldPreview = `~${Utils.random(enemy.gold[0], enemy.gold[1])}g`;
            r.text(`🪙 ${goldPreview}  ⭐ ${enemy.xp} XP`, 600, 355, '#ffd700', 12, 'center');

            const collectHover = inp.isOver(500, 390, 200, 45);
            r.button(500, 390, 200, 45, '💰 Collect Rewards', collectHover);
            if (inp.clickedIn(500, 390, 200, 45)) {
                game.collectCombatRewards();
                game.audio.coin();
            }
        }

        if (combat.state === 'defeat') {
            r.setAlpha(0.75);
            r.fillRect(0, 240, 1200, 220, '#000');
            r.resetAlpha();
            const defeatPulse = Math.sin(Date.now() / 300) * 0.1 + 0.9;
            r.setAlpha(defeatPulse);
            r.textBold('💀 DEFEATED 💀', 600, 280, '#ff4444', 42, 'center');
            r.resetAlpha();
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
