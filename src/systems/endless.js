// Endless Dungeon System - infinite scaling challenge for endgame
class EndlessDungeon {
    constructor() {
        this.active = false;
        this.floor = 0;
        this.highestFloor = 0;
        this.currentEnemy = null;
        this.rewards = [];
        this.modifiers = [];
        this.streak = 0;
        this.totalRuns = 0;
        this.bestStreak = 0;
    }

    canEnter(playerLevel) {
        return playerLevel >= 10; // Unlock at level 10
    }

    enter() {
        this.active = true;
        this.floor = 0;
        this.rewards = [];
        this.streak = 0;
        this.modifiers = [];
        this.totalRuns++;
        return this.nextFloor();
    }

    nextFloor() {
        this.floor++;
        if (this.floor > this.highestFloor) {
            this.highestFloor = this.floor;
        }

        // Every 5 floors, add a modifier
        if (this.floor % 5 === 0) {
            this.addRandomModifier();
        }

        // Generate enemy for this floor
        this.currentEnemy = this.generateEnemy();

        // Every 10 floors is a boss, every 25 is a MEGA boss
        if (this.floor % 25 === 0) {
            this.currentEnemy.boss = true;
            this.currentEnemy.megaBoss = true;
            this.currentEnemy.name = `🔥 MEGA: ${this.getFloorTitle()} ${this.currentEnemy.name}`;
            this.currentEnemy.hp = Math.round(this.currentEnemy.hp * 4);
            this.currentEnemy.atk = Math.round(this.currentEnemy.atk * 2);
            this.currentEnemy.def = Math.round(this.currentEnemy.def * 1.8);
            this.currentEnemy.xp = Math.round(this.currentEnemy.xp * 10);
            this.currentEnemy.gold = [this.currentEnemy.gold[0] * 8, this.currentEnemy.gold[1] * 8];
        } else if (this.floor % 10 === 0) {
            this.currentEnemy.boss = true;
            this.currentEnemy.name = `${this.getFloorTitle()} ${this.currentEnemy.name}`;
            this.currentEnemy.hp = Math.round(this.currentEnemy.hp * 2);
            this.currentEnemy.atk = Math.round(this.currentEnemy.atk * 1.5);
            this.currentEnemy.def = Math.round(this.currentEnemy.def * 1.3);
            this.currentEnemy.xp = Math.round(this.currentEnemy.xp * 3);
            this.currentEnemy.gold = [this.currentEnemy.gold[0] * 3, this.currentEnemy.gold[1] * 3];
        }

        return this.currentEnemy;
    }

    getFloorTitle() {
        if (this.floor >= 100) return 'Eternal';
        if (this.floor >= 80) return 'Abyssal';
        if (this.floor >= 60) return 'Void';
        if (this.floor >= 40) return 'Infernal';
        if (this.floor >= 20) return 'Elite';
        return 'Champion';
    }

    generateEnemy() {
        const allEnemies = Object.values(EnemyDB).filter(e => !e.finalBoss);
        const base = Utils.deepClone(Utils.choice(allEnemies));

        // Scale with floor - exponential growth
        const scale = 1 + this.floor * 0.15 + Math.pow(this.floor, 1.3) * 0.02;

        base.hp = Math.round(base.hp * scale);
        base.atk = Math.round(base.atk * scale);
        base.def = Math.round(base.def * scale);
        base.xp = Math.round(base.xp * (1 + this.floor * 0.1));
        base.gold = [
            Math.round(base.gold[0] * (1 + this.floor * 0.1)),
            Math.round(base.gold[1] * (1 + this.floor * 0.1))
        ];

        // Apply modifiers
        for (const mod of this.modifiers) {
            if (mod.type === 'enemyHp') base.hp = Math.round(base.hp * mod.value);
            if (mod.type === 'enemyAtk') base.atk = Math.round(base.atk * mod.value);
            if (mod.type === 'enemyDef') base.def = Math.round(base.def * mod.value);
        }

        // Add floor indicator
        base.name = `F${this.floor} ${base.name}`;

        return base;
    }

    addRandomModifier() {
        const mods = [
            { name: 'Fortified', desc: 'Enemies have +30% HP', type: 'enemyHp', value: 1.3, icon: '❤' },
            { name: 'Empowered', desc: 'Enemies deal +20% damage', type: 'enemyAtk', value: 1.2, icon: '⚔' },
            { name: 'Armored', desc: 'Enemies have +25% defense', type: 'enemyDef', value: 1.25, icon: '🛡' },
            { name: 'Wealthy', desc: 'Enemies drop 2x gold', type: 'goldMult', value: 2.0, icon: '💰' },
            { name: 'Generous', desc: 'Better item drops', type: 'lootMult', value: 1.5, icon: '🎁' },
            { name: 'Fast', desc: 'Enemies are quicker', type: 'enemySpeed', value: 1.3, icon: '💨' }
        ];

        const mod = Utils.choice(mods);
        this.modifiers.push(mod);
        return mod;
    }

    getFloorReward() {
        const baseGold = 20 + this.floor * 10;
        const baseXp = 10 + this.floor * 5;

        let goldMult = 1;
        let lootMult = 1;
        for (const mod of this.modifiers) {
            if (mod.type === 'goldMult') goldMult *= mod.value;
            if (mod.type === 'lootMult') lootMult *= mod.value;
        }

        const reward = {
            gold: Math.round(baseGold * goldMult),
            xp: baseXp,
            items: []
        };

        // Item drops based on floor
        const dropChance = Math.min(0.8, 0.3 + this.floor * 0.01) * lootMult;
        if (Math.random() < dropChance) {
            const possibleDrops = this.getFloorDrops();
            const drop = Utils.choice(possibleDrops);
            reward.items.push({ item: drop, qty: 1 });
        }

        // Mega boss floor bonus (every 25)
        if (this.floor % 25 === 0) {
            reward.gold *= 8;
            reward.xp *= 5;
            reward.items.push({ item: 'diamond', qty: Utils.random(2, 5) });
            reward.items.push({ item: Utils.choice(['void_essence', 'phoenix_feather', 'mithril_ore']), qty: Utils.random(3, 8) });
            reward.megaBoss = true;
        }
        // Boss floor bonus
        else if (this.floor % 10 === 0) {
            reward.gold *= 3;
            reward.xp *= 2;
            // Guaranteed rare+ drop
            const rareDrops = ['ruby', 'sapphire', 'emerald', 'crystal', 'moonflower', 'enchanted_wood', 'dragon_scale'];
            reward.items.push({ item: Utils.choice(rareDrops), qty: Utils.random(1, 3) });
        }

        // Milestone rewards
        if (this.floor === 25) reward.items.push({ item: 'diamond', qty: 1 });
        if (this.floor === 50) reward.items.push({ item: 'mithril_ore', qty: 5 });
        if (this.floor === 75) reward.items.push({ item: 'phoenix_feather', qty: 1 });
        if (this.floor === 100) reward.items.push({ item: 'void_essence', qty: 10 });

        this.rewards.push(reward);
        return reward;
    }

    getFloorDrops() {
        if (this.floor >= 50) return ['diamond', 'mithril_ore', 'dragon_scale', 'void_essence', 'phoenix_feather'];
        if (this.floor >= 30) return ['gold_ore', 'ruby', 'sapphire', 'emerald', 'crystal', 'enchanted_wood'];
        if (this.floor >= 15) return ['silver_ore', 'crystal', 'silk', 'moonflower', 'ancient_bone'];
        return ['iron_ore', 'copper_ore', 'leather', 'herb', 'stone', 'wood'];
    }

    onVictory() {
        this.streak++;
        if (this.streak > this.bestStreak) this.bestStreak = this.streak;
        return this.getFloorReward();
    }

    onDefeat() {
        this.active = false;
        const result = {
            floorsCleared: this.floor - 1,
            totalRewards: this.rewards,
            streak: this.streak,
            isNewRecord: this.floor - 1 >= this.highestFloor
        };
        return result;
    }

    leave() {
        this.active = false;
        return {
            floorsCleared: this.floor - 1,
            totalRewards: this.rewards,
            streak: this.streak
        };
    }

    serialize() {
        return {
            highestFloor: this.highestFloor,
            totalRuns: this.totalRuns,
            bestStreak: this.bestStreak
        };
    }

    deserialize(data) {
        this.highestFloor = data.highestFloor || 0;
        this.totalRuns = data.totalRuns || 0;
        this.bestStreak = data.bestStreak || 0;
    }
}
