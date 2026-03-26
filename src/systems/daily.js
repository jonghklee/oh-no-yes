// Daily Challenge System
class DailyChallengeSystem {
    constructor() {
        this.currentChallenge = null;
        this.completedToday = false;
        this.totalCompleted = 0;
        this.streak = 0;
        this.bestStreak = 0;
        this.lastDay = 0;
    }

    generateChallenge(day, playerLevel) {
        if (day === this.lastDay && this.currentChallenge) return this.currentChallenge;

        // Reset for new day
        if (day !== this.lastDay) {
            if (this.completedToday) {
                this.streak++;
                if (this.streak > this.bestStreak) this.bestStreak = this.streak;
            } else if (this.lastDay > 0) {
                this.streak = 0;
            }
            this.completedToday = false;
            this.lastDay = day;
        }

        // Seed RNG with day for consistency
        const seed = day * 7 + 13;
        const challenges = this.getChallengePool(playerLevel);
        const idx = seed % challenges.length;
        const template = challenges[idx];

        // Scale difficulty with level
        const scale = 1 + (playerLevel - 1) * 0.15;

        this.currentChallenge = {
            ...template,
            target: Math.round(template.baseTarget * scale),
            progress: 0,
            reward: {
                gold: Math.round(template.baseReward.gold * scale * (1 + this.streak * 0.1)),
                xp: Math.round(template.baseReward.xp * scale),
                bonus: this.streak >= 3 ? 'skillPoint' : null
            }
        };

        return this.currentChallenge;
    }

    getChallengePool(level) {
        const pool = [
            {
                id: 'sell_items', name: 'Sales Rush',
                desc: 'Sell {target} items today.',
                icon: '💰', type: 'sell',
                baseTarget: 5, baseReward: { gold: 100, xp: 50 }
            },
            {
                id: 'craft_items', name: 'Craft Day',
                desc: 'Craft {target} items today.',
                icon: '🔨', type: 'craft',
                baseTarget: 3, baseReward: { gold: 80, xp: 40 }
            },
            {
                id: 'earn_gold', name: 'Gold Rush',
                desc: 'Earn {target}g from sales today.',
                icon: '🪙', type: 'earnGold',
                baseTarget: 200, baseReward: { gold: 150, xp: 60 }
            },
            {
                id: 'gather', name: 'Gathering Spree',
                desc: 'Gather {target} items from exploration.',
                icon: '🌿', type: 'gather',
                baseTarget: 8, baseReward: { gold: 120, xp: 45 }
            },
            {
                id: 'defeat_enemies', name: 'Monster Hunter',
                desc: 'Defeat {target} enemies.',
                icon: '⚔', type: 'defeat',
                baseTarget: 3, baseReward: { gold: 130, xp: 70 }
            },
            {
                id: 'haggle', name: 'Bargain Hunter',
                desc: 'Successfully haggle {target} times.',
                icon: '🤝', type: 'haggle',
                baseTarget: 3, baseReward: { gold: 90, xp: 35 }
            },
        ];

        if (level >= 10) {
            pool.push({
                id: 'endless_floors', name: 'Dungeon Dive',
                desc: 'Clear {target} floors in Endless Dungeon.',
                icon: '🏰', type: 'endlessFloors',
                baseTarget: 5, baseReward: { gold: 200, xp: 100 }
            });
        }

        return pool;
    }

    addProgress(type, amount = 1) {
        if (!this.currentChallenge || this.completedToday) return false;
        if (this.currentChallenge.type !== type) return false;

        this.currentChallenge.progress += amount;

        if (this.currentChallenge.progress >= this.currentChallenge.target) {
            this.completedToday = true;
            this.totalCompleted++;
            return true; // completed!
        }
        return false;
    }

    serialize() {
        return {
            currentChallenge: this.currentChallenge,
            completedToday: this.completedToday,
            totalCompleted: this.totalCompleted,
            streak: this.streak,
            bestStreak: this.bestStreak,
            lastDay: this.lastDay
        };
    }

    deserialize(data) {
        Object.assign(this, data);
    }
}
