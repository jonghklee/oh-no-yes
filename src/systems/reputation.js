// Reputation system
class ReputationSystem {
    constructor() {
        this.reputation = 0;
        this.title = 'Unknown Merchant';
        this.titles = [
            { threshold: 0, title: 'Unknown Merchant' },
            { threshold: 10, title: 'Novice Trader' },
            { threshold: 30, title: 'Reliable Merchant' },
            { threshold: 50, title: 'Skilled Merchant' },
            { threshold: 80, title: 'Renowned Trader' },
            { threshold: 120, title: 'Master Merchant' },
            { threshold: 200, title: 'Grand Merchant' },
            { threshold: 350, title: 'Legendary Merchant' },
            { threshold: 500, title: 'Merchant King' }
        ];
    }

    addReputation(amount) {
        this.reputation += amount;
        this.updateTitle();
    }

    loseReputation(amount) {
        this.reputation = Math.max(0, this.reputation - amount);
        this.updateTitle();
    }

    updateTitle() {
        for (let i = this.titles.length - 1; i >= 0; i--) {
            if (this.reputation >= this.titles[i].threshold) {
                this.title = this.titles[i].title;
                return;
            }
        }
    }

    getNextTitle() {
        for (const t of this.titles) {
            if (this.reputation < t.threshold) return t;
        }
        return null;
    }

    serialize() {
        return { reputation: this.reputation };
    }

    deserialize(data) {
        this.reputation = data.reputation || 0;
        this.updateTitle();
    }
}
