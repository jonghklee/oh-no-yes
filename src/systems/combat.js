// Turn-based combat system
class CombatSystem {
    constructor() {
        this.active = false;
        this.player = null;
        this.enemy = null;
        this.turn = 'player'; // player or enemy
        this.log = [];
        this.state = 'idle'; // idle, playerTurn, enemyTurn, victory, defeat
        this.turnTimer = 0;
        this.combo = 0;
        this.usedPotions = [];
        this.enemyBuffs = [];
        this.playerBuffs = [];
        this.animating = false;
        this.animTimer = 0;
        this.playerShake = 0;
        this.enemyShake = 0;
    }

    startBattle(playerStats, enemyData) {
        this.active = true;
        this.player = {
            ...playerStats,
            currentHp: playerStats.maxHp,
            currentMp: playerStats.maxMp || 0,
            buffs: [],
            debuffs: []
        };
        this.enemy = {
            ...Utils.deepClone(enemyData),
            currentHp: enemyData.hp,
            maxHp: enemyData.hp,
            buffs: [],
            debuffs: []
        };
        this.turn = this.player.speed >= this.enemy.speed ? 'player' : 'enemy';
        this.state = this.turn + 'Turn';
        this.log = [];
        this.combo = 0;
        this.usedPotions = [];
        // Assign elemental type to enemy based on area
        const elements = ['fire', 'ice', 'nature', 'dark', 'physical'];
        this.enemy.element = this.enemy.element || elements[Math.floor(this.enemy.name.length * 7 + this.enemy.atk) % elements.length];

        this.addLog(`A wild ${this.enemy.name} appears!`);
        return true;
    }

    playerAttack() {
        if (this.state !== 'playerTurn' || this.animating) return;

        let damage = Math.max(1, this.player.atk - this.enemy.def * 0.5);
        let isCrit = false;

        // Crit check
        if (Math.random() < (this.player.critRate || 0)) {
            damage *= 1.5 + (this.player.critDmg || 0);
            isCrit = true;
        }

        // Combo bonus (escalating)
        this.combo++;
        if (this.combo > 1) {
            const comboMult = 1 + (this.combo - 1) * 0.08; // 8% per combo (was 5%)
            damage *= comboMult;
        }

        damage = Math.round(damage);

        // Apply damage
        this.enemy.currentHp = Math.max(0, this.enemy.currentHp - damage);
        this.enemyShake = 10;

        // Lifesteal
        if (this.player.lifesteal) {
            const heal = Math.round(damage * this.player.lifesteal);
            this.player.currentHp = Math.min(this.player.maxHp, this.player.currentHp + heal);
        }

        const critText = isCrit ? ' CRITICAL!' : '';
        this.addLog(`You deal ${damage} damage!${critText}`);

        // Check victory
        if (this.enemy.currentHp <= 0) {
            this.state = 'victory';
            this.addLog(`${this.enemy.name} defeated!`);
            return { type: 'victory', damage, isCrit };
        }

        this.startEnemyTurn();
        return { type: 'hit', damage, isCrit };
    }

    playerPowerStrike() {
        if (this.state !== 'playerTurn' || this.animating) return;
        const mpCost = 8;
        if (this.player.currentMp < mpCost) {
            this.addLog('Not enough MP!');
            return null;
        }
        this.player.currentMp -= mpCost;

        let damage = Math.max(1, this.player.atk * 2 - this.enemy.def * 0.3);
        const isCrit = Math.random() < (this.player.critRate || 0) + 0.1;
        if (isCrit) damage *= 1.5 + (this.player.critDmg || 0);
        damage = Math.round(damage);

        this.enemy.currentHp = Math.max(0, this.enemy.currentHp - damage);
        this.enemyShake = 15;
        this.addLog(`Power Strike! ${damage} damage!${isCrit ? ' CRITICAL!' : ''}`);

        if (this.enemy.currentHp <= 0) {
            this.state = 'victory';
            this.addLog(`${this.enemy.name} defeated!`);
            return { type: 'victory', damage, isCrit };
        }
        this.startEnemyTurn();
        return { type: 'hit', damage, isCrit };
    }

    playerDoubleSlash() {
        if (this.state !== 'playerTurn' || this.animating) return;
        const mpCost = 5;
        if (this.player.currentMp < mpCost) {
            this.addLog('Not enough MP!');
            return null;
        }
        this.player.currentMp -= mpCost;

        let totalDmg = 0;
        for (let i = 0; i < 2; i++) {
            let dmg = Math.max(1, this.player.atk * 0.7 - this.enemy.def * 0.4);
            dmg = Math.round(dmg);
            this.enemy.currentHp = Math.max(0, this.enemy.currentHp - dmg);
            totalDmg += dmg;
        }
        this.enemyShake = 12;
        this.addLog(`Double Slash! ${totalDmg} total damage!`);

        if (this.enemy.currentHp <= 0) {
            this.state = 'victory';
            this.addLog(`${this.enemy.name} defeated!`);
            return { type: 'victory', damage: totalDmg, isCrit: false };
        }
        this.startEnemyTurn();
        return { type: 'hit', damage: totalDmg, isCrit: false };
    }

    playerWarCry() {
        if (this.state !== 'playerTurn' || this.animating) return;
        const mpCost = 10;
        if (this.player.currentMp < mpCost) {
            this.addLog('Not enough MP!');
            return null;
        }
        this.player.currentMp -= mpCost;

        const atkBuff = Math.round(this.player.atk * 0.3);
        const defBuff = Math.round(this.player.def * 0.2);
        this.player.atk += atkBuff;
        this.player.def += defBuff;
        this.addLog(`War Cry! ATK +${atkBuff}, DEF +${defBuff} for this battle!`);

        this.startEnemyTurn();
        return { type: 'buff', atkBuff, defBuff };
    }

    playerUsePotion(potionItem) {
        if (this.state !== 'playerTurn' || this.animating) return false;
        if (!potionItem || !potionItem.effect) return false;

        const effect = potionItem.effect;
        if (effect.type === 'heal') {
            this.player.currentHp = Math.min(this.player.maxHp, this.player.currentHp + effect.value);
            this.addLog(`Healed ${effect.value} HP!`);
        } else if (effect.type === 'mana') {
            this.player.currentMp = Math.min(this.player.maxMp || 50, this.player.currentMp + effect.value);
            this.addLog(`Restored ${effect.value} MP!`);
        } else if (effect.type === 'buff') {
            this.player[effect.stat] = (this.player[effect.stat] || 0) + effect.value;
            this.addLog(`${effect.stat.toUpperCase()} +${effect.value}!`);
        } else if (effect.type === 'fullRestore') {
            this.player.currentHp = this.player.maxHp;
            this.player.currentMp = this.player.maxMp || 50;
            this.addLog('Fully restored!');
        }

        this.startEnemyTurn();
        return true;
    }

    playerUseScroll(scrollItem) {
        if (this.state !== 'playerTurn' || this.animating) return null;
        if (!scrollItem || !scrollItem.effect) return null;

        const effect = scrollItem.effect;
        if (effect.type !== 'damage') return null;

        let damage = effect.value || 25;

        // Elemental weakness check
        const weaknesses = { fire: 'ice', ice: 'nature', nature: 'fire', dark: 'nature' };
        const isWeak = this.enemy.element && weaknesses[this.enemy.element] === effect.element;
        const isStrong = this.enemy.element === effect.element;

        if (isWeak) {
            damage *= 2;
            this.addLog(`${effect.element} scroll! Super effective! ${damage} damage!`);
        } else if (isStrong) {
            damage = Math.round(damage * 0.5);
            this.addLog(`${effect.element} scroll... Not very effective. ${damage} damage.`);
        } else {
            this.addLog(`${effect.element} scroll! ${damage} damage!`);
        }

        this.enemy.currentHp = Math.max(0, this.enemy.currentHp - damage);
        this.enemyShake = 12;

        if (this.enemy.currentHp <= 0) {
            this.state = 'victory';
            this.addLog(`${this.enemy.name} defeated!`);
            return { type: 'victory', damage, isWeak };
        }

        this.startEnemyTurn();
        return { type: 'scrollHit', damage, isWeak, element: effect.element };
    }

    playerDefend() {
        if (this.state !== 'playerTurn' || this.animating) return;

        this.player.defending = true;
        this.addLog('You brace for impact! (DEF x2 this turn)');
        this.startEnemyTurn();
    }

    playerFlee(guaranteedEscape = false) {
        if (this.state !== 'playerTurn') return false;

        const escapeChance = guaranteedEscape ? 1.0 :
            0.3 + (this.player.speed - this.enemy.speed) * 0.05;

        if (Math.random() < escapeChance) {
            this.state = 'fled';
            this.addLog('You escaped!');
            this.active = false;
            return true;
        }

        this.addLog('Failed to escape!');
        this.startEnemyTurn();
        return false;
    }

    startEnemyTurn() {
        this.state = 'enemyTurn';
        this.animating = true;
        this.animTimer = 500; // 500ms delay before enemy acts
    }

    updateEnemyTurn(dt) {
        if (this.state !== 'enemyTurn' || !this.animating) return null;

        this.animTimer -= dt;
        if (this.animTimer > 0) return null;

        this.animating = false;
        return this.enemyAct();
    }

    enemyAct() {
        // Choose ability
        const abilities = this.enemy.abilities || ['tackle'];
        const abilityId = Utils.choice(abilities);
        const ability = AbilityDB[abilityId] || AbilityDB.tackle;

        let result = { type: 'enemyAttack', ability: ability.name };

        if (ability.type === 'heal') {
            const heal = Math.round(this.enemy.maxHp * (ability.healPercent || 0.1));
            this.enemy.currentHp = Math.min(this.enemy.maxHp, this.enemy.currentHp + heal);
            this.addLog(`${this.enemy.name} heals for ${heal}!`);
            result.healed = heal;
        } else if (ability.type === 'buff') {
            this.addLog(`${this.enemy.name} uses ${ability.name}!`);
            result.buff = ability.buff;
        } else {
            // Damage attack
            let damage = Math.round(this.enemy.atk * (ability.damage || 1.0));
            let playerDef = this.player.def;
            if (this.player.defending) playerDef *= 2;

            if (!ability.ignoresDef) {
                damage = Math.max(1, damage - playerDef * 0.5);
            }

            // Dodge check
            if (this.player.dodge && Math.random() < this.player.dodge) {
                this.addLog(`You dodged ${this.enemy.name}'s ${ability.name}!`);
                result.dodged = true;
            } else {
                // Multi-hit
                const hits = ability.hits || 1;
                let totalDmg = 0;
                for (let i = 0; i < hits; i++) {
                    const hitDmg = Math.round(damage / hits);
                    totalDmg += hitDmg;
                }

                this.player.currentHp = Math.max(0, this.player.currentHp - totalDmg);
                this.playerShake = 10;
                this.addLog(`${this.enemy.name} uses ${ability.name}! ${totalDmg} damage!`);

                // Lifesteal
                if (ability.lifesteal) {
                    const stolen = Math.round(totalDmg * 0.5);
                    this.enemy.currentHp = Math.min(this.enemy.maxHp, this.enemy.currentHp + stolen);
                }

                // Counter attack
                if (this.player.counter && Math.random() < this.player.counter) {
                    const counterDmg = Math.round(this.player.atk * 0.5);
                    this.enemy.currentHp = Math.max(0, this.enemy.currentHp - counterDmg);
                    this.addLog(`You counter for ${counterDmg}!`);
                    this.enemyShake = 5;
                }

                result.damage = totalDmg;
            }
        }

        // Status effects
        if (ability.effect) {
            result.statusEffect = ability.effect;
        }

        // Check defeat
        if (this.player.currentHp <= 0) {
            this.state = 'defeat';
            this.addLog('You were defeated...');
            result.playerDefeated = true;
            return result;
        }

        // Check if enemy died (from counter)
        if (this.enemy.currentHp <= 0) {
            this.state = 'victory';
            this.addLog(`${this.enemy.name} defeated!`);
            result.type = 'victory';
            return result;
        }

        // Back to player turn + MP regen
        this.player.defending = false;
        this.state = 'playerTurn';
        this.combo = 0;
        // Passive MP regen (2 per turn)
        if (this.player.currentMp < (this.player.maxMp || 20)) {
            this.player.currentMp = Math.min(this.player.maxMp || 20, this.player.currentMp + 2);
        }
        return result;
    }

    getRewards() {
        if (this.state !== 'victory') return null;

        const enemy = this.enemy;
        const gold = Utils.random(enemy.gold[0], enemy.gold[1]);
        const xp = enemy.xp;
        const drops = [];

        for (const drop of (enemy.drops || [])) {
            if (Math.random() < drop.chance) {
                const qty = Utils.random(drop.qty[0], drop.qty[1]);
                drops.push({ item: drop.item, qty });
            }
        }

        this.active = false;
        return { gold, xp, drops, enemyName: enemy.name, isBoss: enemy.boss || false };
    }

    addLog(msg) {
        this.log.push(msg);
        if (this.log.length > 8) this.log.shift();
    }

    update(dt) {
        if (this.playerShake > 0) this.playerShake -= dt / 50;
        if (this.enemyShake > 0) this.enemyShake -= dt / 50;
        if (this.state === 'enemyTurn') return this.updateEnemyTurn(dt);
        return null;
    }
}
