// Item Fusion System - combine 3 items of same rarity → 1 of next rarity
class FusionSystem {
    constructor() {
        this.totalFusions = 0;
    }

    // Get fusion results for a given rarity
    getFusionResult(rarity) {
        const upgradePaths = {
            common: [
                { item: 'moonflower', weight: 3 },
                { item: 'silk', weight: 3 },
                { item: 'silver_ore', weight: 3 },
                { item: 'crystal', weight: 2 },
                { item: 'iron_ingot', weight: 4 },
                { item: 'steel_ingot', weight: 2 },
            ],
            uncommon: [
                { item: 'ruby', weight: 3 },
                { item: 'sapphire', weight: 3 },
                { item: 'emerald', weight: 3 },
                { item: 'enchanted_wood', weight: 3 },
                { item: 'gold_ore', weight: 3 },
                { item: 'ancient_bone', weight: 2 },
            ],
            rare: [
                { item: 'diamond', weight: 3 },
                { item: 'mithril_ore', weight: 3 },
                { item: 'dragon_scale', weight: 2 },
            ],
            epic: [
                { item: 'void_essence', weight: 3 },
                { item: 'phoenix_feather', weight: 2 },
            ]
        };

        const options = upgradePaths[rarity];
        if (!options) return null;

        const totalWeight = options.reduce((sum, o) => sum + o.weight, 0);
        let roll = Math.random() * totalWeight;
        for (const opt of options) {
            roll -= opt.weight;
            if (roll <= 0) return opt.item;
        }
        return options[0].item;
    }

    // Get items that can be fused (3+ of same rarity)
    getFusableItems(inventory) {
        const fusable = [];
        const items = inventory.getItemList();
        const rarityOrder = ['common', 'uncommon', 'rare', 'epic'];

        for (const item of items) {
            if (item.quantity >= 3 && rarityOrder.includes(item.rarity) && item.category === 'material') {
                fusable.push({
                    id: item.id,
                    name: item.name,
                    icon: item.icon,
                    rarity: item.rarity,
                    quantity: item.quantity,
                    maxFusions: Math.floor(item.quantity / 3),
                    resultRarity: rarityOrder[rarityOrder.indexOf(item.rarity) + 1] || 'legendary'
                });
            }
        }
        return fusable;
    }

    fuse(itemId, inventory) {
        if (!inventory.hasItem(itemId, 3)) return { error: 'Need 3 items to fuse' };

        const item = ItemDB[itemId];
        if (!item) return { error: 'Item not found' };

        const resultItemId = this.getFusionResult(item.rarity);
        if (!resultItemId) return { error: 'Cannot fuse this rarity' };

        inventory.removeItem(itemId, 3);
        inventory.addItem(resultItemId, 1);
        this.totalFusions++;

        const resultItem = ItemDB[resultItemId];
        return {
            success: true,
            consumed: { id: itemId, name: item.name, qty: 3 },
            result: { id: resultItemId, name: resultItem?.name || resultItemId, rarity: resultItem?.rarity || 'unknown', icon: resultItem?.icon || '?' }
        };
    }

    serialize() {
        return { totalFusions: this.totalFusions };
    }

    deserialize(data) {
        this.totalFusions = data?.totalFusions || 0;
    }
}
