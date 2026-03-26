// Save/Load system with data management
class SaveSystem {
    constructor() {
        this.saveKey = 'ohnoyes_save';
        this.autoSaveInterval = 30000; // 30 seconds
        this.lastSave = 0;
    }

    save(gameState) {
        try {
            // Clean up generated items from ItemDB before save to prevent bloat
            this.cleanGeneratedItems(gameState);
            const data = JSON.stringify(gameState);
            localStorage.setItem(this.saveKey, data);
            this.lastSave = Date.now();
            return true;
        } catch (e) {
            console.error('Save failed:', e);
            // If save fails due to quota, try cleaning more aggressively
            if (e.name === 'QuotaExceededError') {
                this.cleanGeneratedItems(gameState, true);
                try {
                    localStorage.setItem(this.saveKey, JSON.stringify(gameState));
                    return true;
                } catch(e2) {
                    return false;
                }
            }
            return false;
        }
    }

    cleanGeneratedItems(gameState, aggressive = false) {
        // Remove generated items from inventory that aren't equipped
        if (gameState.inventory && gameState.inventory.items) {
            const items = gameState.inventory.items;
            const equipped = gameState.inventory.equipment || {};
            const equippedIds = new Set(Object.values(equipped).filter(e => e).map(e => e.id));

            let genCount = 0;
            for (const [id, item] of Object.entries(items)) {
                if (id.startsWith('gen_')) genCount++;
            }

            // Only clean if too many generated items (keep 50, or 20 in aggressive mode)
            const limit = aggressive ? 20 : 50;
            if (genCount > limit) {
                const genItems = Object.entries(items)
                    .filter(([id]) => id.startsWith('gen_') && !equippedIds.has(id))
                    .sort((a, b) => (a[1].basePrice || 0) - (b[1].basePrice || 0));

                const toRemove = genCount - limit;
                for (let i = 0; i < Math.min(toRemove, genItems.length); i++) {
                    delete items[genItems[i][0]];
                }
            }
        }
    }

    load() {
        try {
            const data = localStorage.getItem(this.saveKey);
            if (!data) return null;
            const parsed = JSON.parse(data);

            // Re-register any generated items in ItemDB
            if (parsed.inventory && parsed.inventory.items) {
                for (const [id, item] of Object.entries(parsed.inventory.items)) {
                    if (id.startsWith('gen_') && !ItemDB[id]) {
                        ItemDB[id] = item;
                    }
                }
            }
            // Also check equipment
            if (parsed.inventory && parsed.inventory.equipment) {
                for (const equip of Object.values(parsed.inventory.equipment)) {
                    if (equip && equip.id && equip.id.startsWith('gen_') && !ItemDB[equip.id]) {
                        ItemDB[equip.id] = equip;
                    }
                }
            }

            return parsed;
        } catch (e) {
            console.error('Load failed:', e);
            return null;
        }
    }

    hasSave() {
        return localStorage.getItem(this.saveKey) !== null;
    }

    deleteSave() {
        localStorage.removeItem(this.saveKey);
    }

    shouldAutoSave(now) {
        return now - this.lastSave >= this.autoSaveInterval;
    }

    getSaveSize() {
        const data = localStorage.getItem(this.saveKey);
        return data ? (data.length / 1024).toFixed(1) + 'KB' : '0KB';
    }
}
