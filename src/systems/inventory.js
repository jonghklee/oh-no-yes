// Inventory management
class Inventory {
    constructor(maxSlots = 40) {
        this.items = {}; // { itemId: { ...itemData, quantity: n } }
        this.maxSlots = maxSlots;
        this.equipment = {
            weapon: null,
            armor: null,
            accessory: null,
            tool: null
        };
    }

    addItem(itemId, qty = 1) {
        if (this.items[itemId]) {
            this.items[itemId].quantity += qty;
        } else {
            if (this.getUsedSlots() >= this.maxSlots) return false;
            const item = Utils.deepClone(ItemDB[itemId]);
            if (!item) return false;
            item.quantity = qty;
            this.items[itemId] = item;
        }
        return true;
    }

    removeItem(itemId, qty = 1) {
        if (!this.items[itemId] || this.items[itemId].quantity < qty) return false;
        this.items[itemId].quantity -= qty;
        if (this.items[itemId].quantity <= 0) {
            delete this.items[itemId];
        }
        return true;
    }

    hasItem(itemId, qty = 1) {
        return this.items[itemId] && this.items[itemId].quantity >= qty;
    }

    getCount(itemId) {
        return this.items[itemId] ? this.items[itemId].quantity : 0;
    }

    getUsedSlots() {
        return Object.keys(this.items).length;
    }

    getItemList() {
        return Object.values(this.items).sort((a, b) => {
            // Sort by category, then rarity, then name
            if (a.category !== b.category) return a.category.localeCompare(b.category);
            const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
            if (a.rarity !== b.rarity) return rarityOrder.indexOf(b.rarity) - rarityOrder.indexOf(a.rarity);
            return a.name.localeCompare(b.name);
        });
    }

    getItemsByCategory(category) {
        return Object.values(this.items).filter(i => i.category === category);
    }

    equip(itemId) {
        const item = this.items[itemId];
        if (!item) return false;
        const slot = item.category === 'weapon' ? 'weapon' :
                     item.category === 'armor' ? 'armor' :
                     item.category === 'accessory' ? 'accessory' :
                     item.category === 'tool' ? 'tool' : null;
        if (!slot) return false;

        // Unequip current
        if (this.equipment[slot]) {
            // Already equipped same item
            if (this.equipment[slot].id === itemId) return false;
        }

        this.equipment[slot] = Utils.deepClone(item);
        return true;
    }

    unequip(slot) {
        if (!this.equipment[slot]) return false;
        this.equipment[slot] = null;
        return true;
    }

    getEquipStats() {
        const stats = { atk: 0, def: 0, hp: 0, mp: 0, matk: 0, mdef: 0, speed: 0,
                       critRate: 0, critDmg: 0, lifesteal: 0, dodge: 0,
                       sellBonus: 0, buyDiscount: 0, luck: 0, dropBonus: 0,
                       oreBonus: 0, herbBonus: 0 };
        for (const equip of Object.values(this.equipment)) {
            if (equip && equip.stats) {
                for (const [stat, val] of Object.entries(equip.stats)) {
                    if (stats[stat] !== undefined) stats[stat] += val;
                }
            }
        }

        // Set bonuses - matching rarity across all slots
        const setBonus = this.getSetBonus();
        if (setBonus) {
            for (const [stat, val] of Object.entries(setBonus.bonus)) {
                if (stats[stat] !== undefined) stats[stat] += val;
            }
        }

        return stats;
    }

    getSetBonus() {
        const equipped = Object.values(this.equipment).filter(e => e);
        if (equipped.length < 2) return null;

        // Check for matching rarity set
        const rarities = equipped.map(e => e.rarity);
        const allSame = rarities.every(r => r === rarities[0]);

        if (allSame && equipped.length >= 3) {
            const rarity = rarities[0];
            const setBonuses = {
                common: { name: 'Common Set', bonus: { def: 2, atk: 2 } },
                uncommon: { name: 'Uncommon Set', bonus: { def: 5, atk: 5, hp: 10 } },
                rare: { name: 'Rare Set', bonus: { def: 8, atk: 8, hp: 20, critRate: 0.05 } },
                epic: { name: 'Epic Set', bonus: { def: 15, atk: 15, hp: 40, critRate: 0.1, lifesteal: 0.05 } },
                legendary: { name: 'Legendary Set', bonus: { def: 25, atk: 25, hp: 80, critRate: 0.15, lifesteal: 0.1, dodge: 0.1 } }
            };
            return setBonuses[rarity] || null;
        }

        // Check for 2-piece matching
        if (equipped.length >= 2) {
            const rarityCount = {};
            rarities.forEach(r => rarityCount[r] = (rarityCount[r] || 0) + 1);
            const maxRarity = Object.entries(rarityCount).sort((a, b) => b[1] - a[1])[0];
            if (maxRarity && maxRarity[1] >= 2) {
                return { name: `${maxRarity[0]} x2`, bonus: { atk: 2, def: 2 } };
            }
        }

        return null;
    }

    serialize() {
        return {
            items: this.items,
            maxSlots: this.maxSlots,
            equipment: this.equipment
        };
    }

    deserialize(data) {
        this.items = data.items || {};
        this.maxSlots = data.maxSlots || 40;
        this.equipment = data.equipment || { weapon: null, armor: null, accessory: null, tool: null };
    }
}
