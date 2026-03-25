// Prestige / New Game+ system
const PrestigeUpgrades = {
    starting_gold: {
        id: 'starting_gold', name: 'Starting Gold Bonus',
        description: 'Start each run with bonus gold (+10% of lifetime earnings per level).',
        maxLevel: 10, costPerLevel: [1, 2, 3, 5, 8, 12, 18, 25, 35, 50],
        effect: { startingGoldPercent: 10 }
    },
    xp_multiplier: {
        id: 'xp_multiplier', name: 'XP Multiplier',
        description: 'Gain bonus XP from all sources (+5% per level).',
        maxLevel: 20, costPerLevel: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10],
        effect: { xpMultiplier: 5 }
    },
    gold_multiplier: {
        id: 'gold_multiplier', name: 'Gold Multiplier',
        description: 'Earn bonus gold from all sources (+5% per level).',
        maxLevel: 20, costPerLevel: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10],
        effect: { goldMultiplier: 5 }
    },
    drop_rate: {
        id: 'drop_rate', name: 'Drop Rate Bonus',
        description: 'Increase item drop rates (+3% per level).',
        maxLevel: 15, costPerLevel: [2, 3, 4, 5, 7, 9, 11, 14, 17, 20, 24, 28, 33, 38, 45],
        effect: { dropRateBonus: 3 }
    },
    starting_level: {
        id: 'starting_level', name: 'Starting Level',
        description: 'Start each run at a higher level (+1 per level).',
        maxLevel: 10, costPerLevel: [3, 5, 8, 12, 18, 25, 35, 50, 70, 100],
        effect: { startingLevel: 1 }
    },
    unlock_all_stations: {
        id: 'unlock_all_stations', name: 'Unlock All Stations',
        description: 'Start each run with all crafting stations unlocked.',
        maxLevel: 1, costPerLevel: [50],
        effect: { unlockAllStations: true }
    },
    pet_slot: {
        id: 'pet_slot', name: 'Pet Slot Bonus',
        description: 'Gain additional pet slots (+1 per level).',
        maxLevel: 5, costPerLevel: [5, 10, 20, 35, 55],
        effect: { petSlotBonus: 1 }
    },
    skill_point: {
        id: 'skill_point', name: 'Skill Point Bonus',
        description: 'Start each run with bonus skill points (+1 per level).',
        maxLevel: 10, costPerLevel: [2, 4, 6, 9, 12, 16, 20, 25, 30, 40],
        effect: { skillPointBonus: 1 }
    },
    crafting_retention: {
        id: 'crafting_retention', name: 'Crafting Level Retention',
        description: 'Retain a percentage of your crafting level after prestige (+20% per level).',
        maxLevel: 5, costPerLevel: [5, 10, 20, 40, 75],
        effect: { craftingRetentionPercent: 20 }
    },
    exploration_stamina: {
        id: 'exploration_stamina', name: 'Exploration Stamina Bonus',
        description: 'Start each run with bonus exploration stamina (+5 per level).',
        maxLevel: 10, costPerLevel: [1, 2, 3, 5, 7, 10, 13, 17, 22, 28],
        effect: { staminaBonus: 5 }
    }
};

class PrestigeSystem {
    constructor() {
        this.prestigeLevel = 0;
        this.prestigePoints = 0;
        this.totalPrestigePointsEarned = 0;
        this.upgradeLevels = {};
        this.lifetimeStats = {
            totalGoldEarned: 0,
            totalQuestsCompleted: 0,
            totalBossesDefeated: 0,
            totalCraftsMade: 0
        };

        for (const id of Object.keys(PrestigeUpgrades)) {
            this.upgradeLevels[id] = 0;
        }
    }

    calculatePrestigePoints(gameState) {
        let points = 0;

        // Gold earned contribution: 1 point per 5,000 gold
        const goldEarned = gameState.totalGoldEarned || 0;
        points += Math.floor(goldEarned / 5000);

        // Quests completed contribution: 1 point per 3 quests
        const questsCompleted = gameState.questsCompleted || 0;
        points += Math.floor(questsCompleted / 3);

        // Bosses defeated contribution: 3 points per boss
        const bossesDefeated = gameState.bossesDefeated || 0;
        points += bossesDefeated * 3;

        // Crafts made contribution: 1 point per 20 crafts
        const craftsMade = gameState.totalCrafts || 0;
        points += Math.floor(craftsMade / 20);

        // Prestige level scaling: +10% bonus per existing prestige level
        const bonus = 1 + (this.prestigeLevel * 0.10);
        points = Math.floor(points * bonus);

        return Math.max(0, points);
    }

    canPrestige(gameState) {
        const bossesDefeated = gameState.bossesDefeated || 0;
        const currentDay = gameState.day || 0;
        return bossesDefeated >= 1 && currentDay > 30;
    }

    performPrestige(game) {
        const gameState = game.state || game;

        if (!this.canPrestige(gameState)) return false;

        // Calculate and award prestige points
        const earned = this.calculatePrestigePoints(gameState);
        this.prestigePoints += earned;
        this.totalPrestigePointsEarned += earned;

        // Track lifetime stats
        this.lifetimeStats.totalGoldEarned += gameState.totalGoldEarned || 0;
        this.lifetimeStats.totalQuestsCompleted += gameState.questsCompleted || 0;
        this.lifetimeStats.totalBossesDefeated += gameState.bossesDefeated || 0;
        this.lifetimeStats.totalCraftsMade += gameState.totalCrafts || 0;

        // Increment prestige level
        this.prestigeLevel++;

        // Get bonuses to apply to new run
        const bonuses = this.getPrestigeBonuses();

        // Reset game state (caller is responsible for actual reset)
        // Return bonuses so the game can apply them
        return {
            prestigeLevel: this.prestigeLevel,
            pointsEarned: earned,
            totalPoints: this.prestigePoints,
            bonuses: bonuses
        };
    }

    getPrestigeBonuses() {
        const bonuses = {
            startingGoldPercent: 0,
            xpMultiplier: 0,
            goldMultiplier: 0,
            dropRateBonus: 0,
            startingLevel: 0,
            unlockAllStations: false,
            petSlotBonus: 0,
            skillPointBonus: 0,
            craftingRetentionPercent: 0,
            staminaBonus: 0
        };

        for (const [upgradeId, level] of Object.entries(this.upgradeLevels)) {
            if (level <= 0) continue;
            const upgrade = PrestigeUpgrades[upgradeId];
            if (!upgrade) continue;

            for (const [key, val] of Object.entries(upgrade.effect)) {
                if (typeof val === 'boolean') {
                    bonuses[key] = level > 0;
                } else {
                    bonuses[key] = (bonuses[key] || 0) + val * level;
                }
            }
        }

        return bonuses;
    }

    buyUpgrade(upgradeId) {
        const upgrade = PrestigeUpgrades[upgradeId];
        if (!upgrade) return false;

        const currentLevel = this.upgradeLevels[upgradeId] || 0;
        if (currentLevel >= upgrade.maxLevel) return false;

        const cost = upgrade.costPerLevel[currentLevel];
        if (this.prestigePoints < cost) return false;

        this.prestigePoints -= cost;
        this.upgradeLevels[upgradeId] = currentLevel + 1;
        return true;
    }

    getPrestigeShopItems() {
        const items = [];
        for (const [id, upgrade] of Object.entries(PrestigeUpgrades)) {
            const currentLevel = this.upgradeLevels[id] || 0;
            const maxed = currentLevel >= upgrade.maxLevel;
            const cost = maxed ? null : upgrade.costPerLevel[currentLevel];

            items.push({
                id: id,
                name: upgrade.name,
                description: upgrade.description,
                currentLevel: currentLevel,
                maxLevel: upgrade.maxLevel,
                cost: cost,
                maxed: maxed,
                canAfford: !maxed && this.prestigePoints >= cost,
                effectPerLevel: upgrade.effect
            });
        }
        return items;
    }

    serialize() {
        return {
            prestigeLevel: this.prestigeLevel,
            prestigePoints: this.prestigePoints,
            totalPrestigePointsEarned: this.totalPrestigePointsEarned,
            upgradeLevels: { ...this.upgradeLevels },
            lifetimeStats: { ...this.lifetimeStats }
        };
    }

    deserialize(data) {
        this.prestigeLevel = data.prestigeLevel || 0;
        this.prestigePoints = data.prestigePoints || 0;
        this.totalPrestigePointsEarned = data.totalPrestigePointsEarned || 0;
        this.upgradeLevels = {};
        for (const id of Object.keys(PrestigeUpgrades)) {
            this.upgradeLevels[id] = (data.upgradeLevels && data.upgradeLevels[id]) || 0;
        }
        this.lifetimeStats = {
            totalGoldEarned: (data.lifetimeStats && data.lifetimeStats.totalGoldEarned) || 0,
            totalQuestsCompleted: (data.lifetimeStats && data.lifetimeStats.totalQuestsCompleted) || 0,
            totalBossesDefeated: (data.lifetimeStats && data.lifetimeStats.totalBossesDefeated) || 0,
            totalCraftsMade: (data.lifetimeStats && data.lifetimeStats.totalCraftsMade) || 0
        };
    }
}
