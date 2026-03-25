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
        return stats;
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
