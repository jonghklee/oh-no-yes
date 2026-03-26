// Mystery Chest / Gambling System - the "Oh No... Yes!" moment
class MysteryChestSystem {
    constructor() {
        this.totalOpened = 0;
        this.legendaryFound = 0;
        this.jackpots = 0;
    }

    getChestTypes() {
        return [
            {
                id: 'bronze', name: 'Bronze Chest', icon: '🟤',
                cost: 50, color: '#cd7f32',
                description: 'Common items with a small chance of something good.',
                lootTable: [
                    { weight: 40, rarity: 'common', items: ['wood', 'stone', 'herb', 'leather', 'cloth', 'copper_ore'], qty: [3, 8] },
                    { weight: 30, rarity: 'common', items: ['iron_ore', 'health_potion', 'bread'], qty: [2, 5] },
                    { weight: 20, rarity: 'uncommon', items: ['moonflower', 'silk', 'silver_ore', 'crystal'], qty: [1, 3] },
                    { weight: 8, rarity: 'rare', items: ['ruby', 'sapphire', 'emerald', 'enchanted_wood'], qty: [1, 1] },
                    { weight: 2, rarity: 'epic', items: ['gold_ore', 'diamond', 'mithril_ore'], qty: [1, 1] }
                ]
            },
            {
                id: 'silver', name: 'Silver Chest', icon: '⬜',
                cost: 200, color: '#c0c0c0',
                description: 'Better odds for rare items.',
                lootTable: [
                    { weight: 25, rarity: 'common', items: ['iron_ore', 'health_potion', 'mana_potion'], qty: [3, 6] },
                    { weight: 35, rarity: 'uncommon', items: ['moonflower', 'silk', 'silver_ore', 'crystal', 'steel_ingot'], qty: [2, 4] },
                    { weight: 25, rarity: 'rare', items: ['ruby', 'sapphire', 'emerald', 'enchanted_wood', 'ancient_bone'], qty: [1, 2] },
                    { weight: 12, rarity: 'epic', items: ['gold_ore', 'diamond', 'mithril_ore', 'dragon_scale'], qty: [1, 2] },
                    { weight: 3, rarity: 'legendary', items: ['void_essence', 'phoenix_feather'], qty: [1, 1] }
                ]
            },
            {
                id: 'gold', name: 'Gold Chest', icon: '🟡',
                cost: 500, color: '#ffd700',
                description: 'High chance of rare+ items. Jackpot possible!',
                lootTable: [
                    { weight: 15, rarity: 'uncommon', items: ['crystal', 'silk', 'silver_ore', 'strength_elixir'], qty: [3, 6] },
                    { weight: 35, rarity: 'rare', items: ['ruby', 'sapphire', 'emerald', 'enchanted_wood', 'crystal_staff'], qty: [1, 3] },
                    { weight: 30, rarity: 'epic', items: ['gold_ore', 'diamond', 'mithril_ore', 'dragon_scale'], qty: [1, 3] },
                    { weight: 15, rarity: 'legendary', items: ['void_essence', 'phoenix_feather'], qty: [1, 2] },
                    { weight: 5, rarity: 'jackpot', gold: [2000, 5000], items: ['diamond', 'phoenix_feather', 'void_essence'], qty: [2, 5] }
                ]
            }
        ];
    }

    openChest(chestId, playerGold) {
        const chestType = this.getChestTypes().find(c => c.id === chestId);
        if (!chestType) return null;
        if (playerGold < chestType.cost) return { error: 'Not enough gold!' };

        this.totalOpened++;

        // Roll loot
        const totalWeight = chestType.lootTable.reduce((sum, entry) => sum + entry.weight, 0);
        let roll = Math.random() * totalWeight;
        let selectedEntry = chestType.lootTable[0];

        for (const entry of chestType.lootTable) {
            roll -= entry.weight;
            if (roll <= 0) {
                selectedEntry = entry;
                break;
            }
        }

        const result = {
            cost: chestType.cost,
            chestName: chestType.name,
            rarity: selectedEntry.rarity,
            items: [],
            bonusGold: 0,
            isJackpot: selectedEntry.rarity === 'jackpot'
        };

        // Generate items
        if (selectedEntry.items) {
            const numItems = selectedEntry.rarity === 'jackpot' ? 3 : Utils.random(1, 2);
            for (let i = 0; i < numItems; i++) {
                const item = Utils.choice(selectedEntry.items);
                const qty = Utils.random(selectedEntry.qty[0], selectedEntry.qty[1]);
                result.items.push({ item, qty });
            }
        }

        // Jackpot gold
        if (selectedEntry.gold) {
            result.bonusGold = Utils.random(selectedEntry.gold[0], selectedEntry.gold[1]);
            this.jackpots++;
        }

        if (selectedEntry.rarity === 'legendary' || selectedEntry.rarity === 'jackpot') {
            this.legendaryFound++;
        }

        return result;
    }

    serialize() {
        return {
            totalOpened: this.totalOpened,
            legendaryFound: this.legendaryFound,
            jackpots: this.jackpots
        };
    }

    deserialize(data) {
        Object.assign(this, data || {});
    }
}
