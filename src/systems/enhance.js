// Equipment Enhancement System - upgrade gear with materials
class EnhanceSystem {
    constructor() {
        this.totalEnhancements = 0;
    }

    canEnhance(item) {
        if (!item || !item.stats) return false;
        if (!['weapon', 'armor', 'accessory'].includes(item.category)) return false;
        const level = item.enhanceLevel || 0;
        return level < 10; // Max +10
    }

    getEnhanceCost(item) {
        const level = (item.enhanceLevel || 0) + 1;
        const rarityMult = { common: 1, uncommon: 2, rare: 3, epic: 5, legendary: 8 };
        const mult = rarityMult[item.rarity] || 1;
        return {
            gold: Math.round(50 * level * mult),
            material: level <= 3 ? 'iron_ore' : level <= 6 ? 'crystal' : level <= 8 ? 'mithril_ore' : 'void_essence',
            materialQty: Math.ceil(level * mult * 0.5),
            successRate: Math.max(0.3, 1 - (level - 1) * 0.08) // 100% → 30% at +10
        };
    }

    enhance(item, inventory, gold) {
        if (!this.canEnhance(item)) return { error: 'Cannot enhance this item' };

        const cost = this.getEnhanceCost(item);
        if (gold < cost.gold) return { error: `Need ${cost.gold}g` };
        if (!inventory.hasItem(cost.material, cost.materialQty)) {
            return { error: `Need ${cost.materialQty}x ${ItemDB[cost.material]?.name || cost.material}` };
        }

        // Consume resources
        inventory.removeItem(cost.material, cost.materialQty);

        // Roll for success
        if (Math.random() > cost.successRate) {
            return {
                success: false,
                cost: cost.gold,
                message: 'Enhancement failed! Materials lost.'
            };
        }

        // Success - boost all stats by 10-15%
        const level = (item.enhanceLevel || 0) + 1;
        item.enhanceLevel = level;
        item.name = item.name.replace(/\s*\+\d+$/, '') + ` +${level}`;

        for (const [stat, val] of Object.entries(item.stats)) {
            if (typeof val === 'number') {
                const boost = val < 1 ? 0.01 : Math.ceil(val * 0.12);
                item.stats[stat] = val < 1
                    ? Math.round((val + boost) * 100) / 100
                    : val + boost;
            }
        }

        // Increase base price
        item.basePrice = Math.round((item.basePrice || 10) * 1.15);

        this.totalEnhancements++;

        return {
            success: true,
            cost: cost.gold,
            newLevel: level,
            message: `Enhanced to +${level}!`
        };
    }

    serialize() {
        return { totalEnhancements: this.totalEnhancements };
    }

    deserialize(data) {
        this.totalEnhancements = data?.totalEnhancements || 0;
    }
}
