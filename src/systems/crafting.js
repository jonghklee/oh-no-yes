// Crafting system
class CraftingSystem {
    constructor() {
        this.level = 1;
        this.xp = 0;
        this.totalCrafts = 0;
        this.unlockedStations = { workbench: true, forge: false, alchemy: false, kitchen: false, enchanting: false };
        this.craftQueue = [];
        this.currentCraft = null;
        this.craftTimer = 0;
        this.discoveredRecipes = new Set(['wooden_sword', 'leather_armor', 'copper_ring', 'bread', 'health_potion', 'iron_ingot', 'herb_pouch']);
    }

    canCraft(recipeId, inventory) {
        const recipe = RecipeDB[recipeId];
        if (!recipe) return { can: false, reason: 'Recipe not found' };
        if (!this.unlockedStations[recipe.station]) return { can: false, reason: `Need ${CraftingStations[recipe.station].name}` };
        if (this.level < recipe.level) return { can: false, reason: `Need crafting level ${recipe.level}` };
        if (!this.discoveredRecipes.has(recipeId)) return { can: false, reason: 'Recipe not discovered' };

        for (const ing of recipe.ingredients) {
            if (!inventory.hasItem(ing.item, ing.qty)) {
                const need = ing.qty - inventory.getCount(ing.item);
                return { can: false, reason: `Need ${need} more ${ItemDB[ing.item]?.name || ing.item}` };
            }
        }
        return { can: true };
    }

    startCraft(recipeId, inventory, skillBonuses = {}) {
        const check = this.canCraft(recipeId, inventory);
        if (!check.can) return check;

        const recipe = RecipeDB[recipeId];

        // Consume ingredients (with resource save chance)
        for (const ing of recipe.ingredients) {
            let consumed = ing.qty;
            if (skillBonuses.resourceSave && Math.random() < skillBonuses.resourceSave) {
                consumed = Math.max(1, Math.floor(consumed * 0.5));
            }
            inventory.removeItem(ing.item, consumed);
        }

        // Calculate craft time
        let time = recipe.time;
        if (skillBonuses.craftSpeed) time = Math.max(1, Math.round(time * skillBonuses.craftSpeed));

        this.currentCraft = {
            recipe: recipeId,
            timeRemaining: time,
            totalTime: time,
            bonuses: skillBonuses
        };

        return { can: true, started: true };
    }

    queueCraft(recipeId, count, inventory, skillBonuses = {}) {
        for (let i = 0; i < count; i++) {
            this.craftQueue.push({ recipe: recipeId, bonuses: skillBonuses });
        }
        // Start first if not crafting
        if (!this.currentCraft) {
            return this.startNextFromQueue(inventory, skillBonuses);
        }
        return { can: true, queued: count };
    }

    startNextFromQueue(inventory, skillBonuses) {
        if (this.craftQueue.length === 0) return null;
        const next = this.craftQueue[0];
        const result = this.startCraft(next.recipe, inventory, next.bonuses || skillBonuses);
        if (result.can) {
            this.craftQueue.shift();
        } else {
            this.craftQueue = []; // Clear queue if can't continue
        }
        return result;
    }

    update(dt, inventory, skillBonuses) {
        if (!this.currentCraft) {
            // Try next in queue
            if (this.craftQueue.length > 0 && inventory) {
                this.startNextFromQueue(inventory, skillBonuses);
            }
            return null;
        }

        this.currentCraft.timeRemaining -= dt / 1000;
        if (this.currentCraft.timeRemaining <= 0) {
            const result = this.completeCraft();
            // Auto-start next queue item
            if (this.craftQueue.length > 0 && inventory) {
                this.startNextFromQueue(inventory, skillBonuses);
            }
            return result;
        }
        return null;
    }

    completeCraft() {
        if (!this.currentCraft) return null;

        const recipe = RecipeDB[this.currentCraft.recipe];
        const bonuses = this.currentCraft.bonuses;
        let qty = recipe.resultQty;

        // Double craft chance
        if (bonuses.doubleCraft && Math.random() < bonuses.doubleCraft) {
            qty *= 2;
        }

        // Quality bonus
        let quality = 1.0;
        if (bonuses.qualityBonus) quality += bonuses.qualityBonus;
        quality += Utils.randomFloat(-0.1, 0.1);

        // XP
        let xpGain = recipe.xp;
        if (bonuses.craftXpBonus) xpGain = Math.round(xpGain * (1 + bonuses.craftXpBonus));

        this.xp += xpGain;
        this.totalCrafts++;

        // Level up check
        let leveledUp = false;
        while (this.xp >= getXpForLevel(this.level)) {
            this.xp -= getXpForLevel(this.level);
            this.level++;
            leveledUp = true;
        }

        // Discover new recipes based on level
        this.checkNewRecipes();

        const result = {
            itemId: recipe.result,
            qty,
            quality,
            xpGain,
            leveledUp,
            newLevel: this.level
        };

        this.currentCraft = null;
        return result;
    }

    checkNewRecipes() {
        for (const [id, recipe] of Object.entries(RecipeDB)) {
            if (!this.discoveredRecipes.has(id) && this.level >= recipe.level && this.unlockedStations[recipe.station]) {
                this.discoveredRecipes.add(id);
            }
        }
    }

    unlockStation(stationId, gold) {
        const station = CraftingStations[stationId];
        if (!station || this.unlockedStations[stationId]) return { success: false, reason: 'Already unlocked' };
        if (gold < station.unlockCost) return { success: false, reason: `Need ${station.unlockCost}g` };

        this.unlockedStations[stationId] = true;
        this.checkNewRecipes();
        return { success: true, cost: station.unlockCost };
    }

    getAvailableRecipes() {
        return Object.values(RecipeDB).filter(r =>
            this.discoveredRecipes.has(r.id) && this.unlockedStations[r.station]
        );
    }

    getCraftProgress() {
        if (!this.currentCraft) return null;
        return {
            recipe: RecipeDB[this.currentCraft.recipe],
            progress: 1 - (this.currentCraft.timeRemaining / this.currentCraft.totalTime),
            timeRemaining: Math.ceil(this.currentCraft.timeRemaining)
        };
    }

    serialize() {
        return {
            level: this.level,
            xp: this.xp,
            totalCrafts: this.totalCrafts,
            unlockedStations: this.unlockedStations,
            currentCraft: this.currentCraft,
            discoveredRecipes: [...this.discoveredRecipes]
        };
    }

    deserialize(data) {
        this.level = data.level || 1;
        this.xp = data.xp || 0;
        this.totalCrafts = data.totalCrafts || 0;
        this.unlockedStations = data.unlockedStations || { workbench: true };
        this.currentCraft = data.currentCraft;
        this.discoveredRecipes = new Set(data.discoveredRecipes || ['wooden_sword', 'leather_armor', 'copper_ring', 'bread', 'health_potion', 'iron_ingot']);
    }
}
