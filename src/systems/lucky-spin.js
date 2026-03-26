// Lucky Spin - daily free reward roulette
class LuckySpinSystem {
    constructor() {
        this.lastSpinDay = 0;
        this.totalSpins = 0;
        this.spinning = false;
        this.spinResult = null;
        this.spinTimer = 0;
        this.currentSlot = 0;
    }

    canSpin(day) {
        return day > this.lastSpinDay;
    }

    startSpin(day) {
        if (!this.canSpin(day)) return false;
        this.spinning = true;
        this.spinTimer = 2000; // 2 seconds of spinning
        this.spinResult = null;
        this.lastSpinDay = day;
        this.totalSpins++;
        return true;
    }

    update(dt) {
        if (!this.spinning) return null;
        this.spinTimer -= dt;
        this.currentSlot = Math.floor(Date.now() / 80) % this.getSlots().length;

        if (this.spinTimer <= 0) {
            this.spinning = false;
            // Pick result
            const slots = this.getSlots();
            const weights = slots.map(s => s.weight);
            const total = weights.reduce((a, b) => a + b, 0);
            let roll = Math.random() * total;
            for (let i = 0; i < slots.length; i++) {
                roll -= weights[i];
                if (roll <= 0) {
                    this.spinResult = slots[i];
                    this.currentSlot = i;
                    return this.spinResult;
                }
            }
            this.spinResult = slots[slots.length - 1];
            return this.spinResult;
        }
        return null;
    }

    getSlots() {
        return [
            { name: '50 Gold', icon: '🪙', type: 'gold', value: 50, color: '#ffd700', weight: 25 },
            { name: '100 Gold', icon: '💰', type: 'gold', value: 100, color: '#ffd700', weight: 20 },
            { name: '250 Gold', icon: '💎', type: 'gold', value: 250, color: '#ffd700', weight: 10 },
            { name: '500 Gold', icon: '👑', type: 'gold', value: 500, color: '#ffd700', weight: 5 },
            { name: 'Health Potion x3', icon: '🧪', type: 'item', item: 'health_potion', qty: 3, color: '#44ff44', weight: 15 },
            { name: 'Crystal x2', icon: '🔮', type: 'item', item: 'crystal', qty: 2, color: '#4488ff', weight: 10 },
            { name: 'Moonflower x3', icon: '🌸', type: 'item', item: 'moonflower', qty: 3, color: '#ff88ff', weight: 10 },
            { name: '+50 XP', icon: '⭐', type: 'xp', value: 50, color: '#44aaff', weight: 15 },
            { name: '+1 Skill Point', icon: '🎯', type: 'skillPoint', value: 1, color: '#ff44ff', weight: 3 },
            { name: 'JACKPOT 2000g!', icon: '🎰', type: 'gold', value: 2000, color: '#ff4444', weight: 2 },
            { name: 'Ruby', icon: '❤', type: 'item', item: 'ruby', qty: 1, color: '#ff4444', weight: 5 },
            { name: 'Full Stamina', icon: '⚡', type: 'stamina', color: '#44ddff', weight: 8 },
        ];
    }

    collectResult() {
        const result = this.spinResult;
        this.spinResult = null;
        return result;
    }

    serialize() {
        return { lastSpinDay: this.lastSpinDay, totalSpins: this.totalSpins };
    }

    deserialize(data) {
        Object.assign(this, data || {});
    }
}
