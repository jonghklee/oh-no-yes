// Milestone Reward System - major goals with big rewards
class MilestoneSystem {
    constructor() {
        this.claimed = new Set();
    }

    getMilestones(game) {
        return [
            // Gold milestones
            { id: 'gold_1k', name: 'First 1,000 Gold', icon: '🪙', condition: game.totalGold >= 1000,
              reward: { gold: 200, skillPoints: 1 }, category: 'Gold' },
            { id: 'gold_10k', name: '10,000 Gold Club', icon: '💰', condition: game.totalGold >= 10000,
              reward: { gold: 1000, skillPoints: 2 }, category: 'Gold' },
            { id: 'gold_100k', name: '100K Mogul', icon: '🏦', condition: game.totalGold >= 100000,
              reward: { gold: 5000, skillPoints: 3 }, category: 'Gold' },
            { id: 'gold_1m', name: 'Millionaire', icon: '👑', condition: game.totalGold >= 1000000,
              reward: { gold: 50000, skillPoints: 5 }, category: 'Gold' },

            // Level milestones
            { id: 'level_5', name: 'Level 5', icon: '⭐', condition: game.level >= 5,
              reward: { gold: 100, xp: 50 }, category: 'Level' },
            { id: 'level_10', name: 'Level 10', icon: '⭐', condition: game.level >= 10,
              reward: { gold: 500, xp: 200 }, category: 'Level' },
            { id: 'level_20', name: 'Level 20', icon: '⭐', condition: game.level >= 20,
              reward: { gold: 2000, skillPoints: 2 }, category: 'Level' },
            { id: 'level_30', name: 'Level 30', icon: '🌟', condition: game.level >= 30,
              reward: { gold: 5000, skillPoints: 5 }, category: 'Level' },

            // Day milestones
            { id: 'day_30', name: 'One Month', icon: '📅', condition: game.day >= 30,
              reward: { gold: 500 }, category: 'Time' },
            { id: 'day_100', name: 'Centurion', icon: '📅', condition: game.day >= 100,
              reward: { gold: 2000, skillPoints: 1 }, category: 'Time' },
            { id: 'day_365', name: 'One Year', icon: '🎂', condition: game.day >= 365,
              reward: { gold: 10000, skillPoints: 3 }, category: 'Time' },

            // Sales milestones
            { id: 'sales_10', name: '10 Sales', icon: '📈', condition: game.shop.totalSales >= 10,
              reward: { gold: 100 }, category: 'Sales' },
            { id: 'sales_100', name: '100 Sales', icon: '📈', condition: game.shop.totalSales >= 100,
              reward: { gold: 1000, skillPoints: 1 }, category: 'Sales' },
            { id: 'sales_500', name: '500 Sales', icon: '📈', condition: game.shop.totalSales >= 500,
              reward: { gold: 5000, skillPoints: 2 }, category: 'Sales' },

            // Crafting milestones
            { id: 'crafts_50', name: '50 Crafts', icon: '🔨', condition: game.crafting.totalCrafts >= 50,
              reward: { gold: 500, xp: 200 }, category: 'Crafting' },
            { id: 'crafts_200', name: '200 Crafts', icon: '🔨', condition: game.crafting.totalCrafts >= 200,
              reward: { gold: 2000, skillPoints: 2 }, category: 'Crafting' },

            // Exploration milestones
            { id: 'areas_5', name: '5 Areas Explored', icon: '🗺', condition: game.exploration.areasVisited.size >= 5,
              reward: { gold: 1000, xp: 500 }, category: 'Exploration' },
            { id: 'areas_all', name: 'World Explorer', icon: '🌍', condition: game.exploration.areasVisited.size >= 9,
              reward: { gold: 5000, skillPoints: 3 }, category: 'Exploration' },
            { id: 'bosses_5', name: '5 Bosses Defeated', icon: '💀', condition: game.exploration.bossesDefeated.size >= 5,
              reward: { gold: 3000, skillPoints: 2 }, category: 'Exploration' },

            // Endless milestones
            { id: 'endless_10', name: 'Endless F10', icon: '🏰', condition: game.endless.highestFloor >= 10,
              reward: { gold: 1000, xp: 500 }, category: 'Endless' },
            { id: 'endless_50', name: 'Endless F50', icon: '🏰', condition: game.endless.highestFloor >= 50,
              reward: { gold: 10000, skillPoints: 3 }, category: 'Endless' },
            { id: 'endless_100', name: 'Endless F100', icon: '🏰', condition: game.endless.highestFloor >= 100,
              reward: { gold: 50000, skillPoints: 5 }, category: 'Endless' },

            // Special
            { id: 'rep_100', name: '100 Reputation', icon: '⭐', condition: game.reputation.reputation >= 100,
              reward: { gold: 2000 }, category: 'Special' },
            { id: 'chest_10', name: '10 Chests Opened', icon: '🎁', condition: game.mystery.totalOpened >= 10,
              reward: { gold: 500 }, category: 'Special' },
            { id: 'daily_7', name: '7 Day Streak', icon: '🔥', condition: game.daily.bestStreak >= 7,
              reward: { gold: 1000, skillPoints: 1 }, category: 'Special' },
        ];
    }

    getClaimable(game) {
        return this.getMilestones(game).filter(m => m.condition && !this.claimed.has(m.id));
    }

    claim(id, game) {
        const milestone = this.getMilestones(game).find(m => m.id === id);
        if (!milestone || this.claimed.has(id) || !milestone.condition) return null;
        this.claimed.add(id);
        return milestone.reward;
    }

    getProgress(game) {
        const all = this.getMilestones(game);
        return {
            total: all.length,
            completed: all.filter(m => m.condition).length,
            claimed: this.claimed.size
        };
    }

    serialize() {
        return { claimed: [...this.claimed] };
    }

    deserialize(data) {
        this.claimed = new Set(data?.claimed || []);
    }
}
