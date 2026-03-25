// Enchantment system

const EnchantmentTier = {
    BASIC: 'basic',
    ADVANCED: 'advanced',
    LEGENDARY: 'legendary'
};

const EnchantmentSlot = {
    WEAPON: 'weapon',
    ARMOR: 'armor',
    ACCESSORY: 'accessory',
    ANY: 'any'
};

const EnchantmentTierColors = {
    basic: '#4caf50',
    advanced: '#2196f3',
    legendary: '#ff9800'
};

const EnchantmentDB = {
    // === WEAPON ENCHANTMENTS (Basic) ===
    fire: {
        id: 'fire', name: 'Flame', tier: EnchantmentTier.BASIC,
        slot: EnchantmentSlot.WEAPON, icon: '🔥',
        description: 'Imbues weapon with fire, dealing burn damage over 3 seconds.',
        effect: { type: 'burn', damagePerTick: 3, ticks: 3, interval: 1000 },
        stats: { atk: 2 },
        cost: { gold: 200, materials: [{ item: 'ruby', qty: 1 }, { item: 'crystal', qty: 2 }] },
        minLevel: 1
    },
    ice: {
        id: 'ice', name: 'Frost', tier: EnchantmentTier.BASIC,
        slot: EnchantmentSlot.WEAPON, icon: '❄',
        description: 'Coats weapon in frost, slowing enemy attack speed by 15%.',
        effect: { type: 'slow', speedReduction: 0.15, duration: 3000 },
        stats: { atk: 1 },
        cost: { gold: 200, materials: [{ item: 'sapphire', qty: 1 }, { item: 'crystal', qty: 2 }] },
        minLevel: 1
    },
    lightning: {
        id: 'lightning', name: 'Storm', tier: EnchantmentTier.BASIC,
        slot: EnchantmentSlot.WEAPON, icon: '⚡',
        description: 'Strikes with lightning that chains to a nearby enemy for 50% damage.',
        effect: { type: 'chain', chainTargets: 1, chainDamageRatio: 0.5 },
        stats: { atk: 3 },
        cost: { gold: 250, materials: [{ item: 'crystal', qty: 3 }, { item: 'iron_ingot', qty: 2 }] },
        minLevel: 2
    },
    holy: {
        id: 'holy', name: 'Holy Light', tier: EnchantmentTier.BASIC,
        slot: EnchantmentSlot.WEAPON, icon: '✝',
        description: 'Deals 50% bonus damage against undead enemies.',
        effect: { type: 'bane', targetType: 'undead', bonusDamage: 0.5 },
        stats: { atk: 2 },
        cost: { gold: 180, materials: [{ item: 'moonflower', qty: 2 }, { item: 'crystal', qty: 1 }] },
        minLevel: 1
    },

    // === WEAPON ENCHANTMENTS (Advanced) ===
    vampiric: {
        id: 'vampiric', name: 'Vampiric', tier: EnchantmentTier.ADVANCED,
        slot: EnchantmentSlot.WEAPON, icon: '🩸',
        description: 'Heals the wielder for 10% of damage dealt.',
        effect: { type: 'lifesteal', ratio: 0.10 },
        stats: { atk: 3 },
        cost: { gold: 500, materials: [{ item: 'ruby', qty: 2 }, { item: 'ancient_bone', qty: 1 }, { item: 'crystal', qty: 3 }] },
        minLevel: 4
    },
    void_strike: {
        id: 'void_strike', name: 'Void Strike', tier: EnchantmentTier.ADVANCED,
        slot: EnchantmentSlot.WEAPON, icon: '🌑',
        description: 'Attacks ignore 25% of enemy defense.',
        effect: { type: 'armorPen', ratio: 0.25 },
        stats: { atk: 4 },
        cost: { gold: 600, materials: [{ item: 'void_essence', qty: 1 }, { item: 'diamond', qty: 1 }] },
        minLevel: 5
    },
    berserk: {
        id: 'berserk', name: 'Berserk', tier: EnchantmentTier.ADVANCED,
        slot: EnchantmentSlot.WEAPON, icon: '💢',
        description: 'Gain up to +30% ATK as HP decreases below 50%.',
        effect: { type: 'berserk', maxBonus: 0.30, hpThreshold: 0.5 },
        stats: { atk: 5 },
        cost: { gold: 550, materials: [{ item: 'ruby', qty: 3 }, { item: 'dragon_scale', qty: 1 }] },
        minLevel: 5
    },

    // === ARMOR ENCHANTMENTS (Basic) ===
    thorns: {
        id: 'thorns', name: 'Thorns', tier: EnchantmentTier.BASIC,
        slot: EnchantmentSlot.ARMOR, icon: '🌹',
        description: 'Reflects 15% of melee damage taken back to the attacker.',
        effect: { type: 'reflect', ratio: 0.15 },
        stats: { def: 1 },
        cost: { gold: 200, materials: [{ item: 'iron_ingot', qty: 3 }, { item: 'crystal', qty: 1 }] },
        minLevel: 1
    },
    regeneration: {
        id: 'regeneration', name: 'Regeneration', tier: EnchantmentTier.BASIC,
        slot: EnchantmentSlot.ARMOR, icon: '💚',
        description: 'Restores 2 HP every 5 seconds during combat.',
        effect: { type: 'regen', hpPerTick: 2, interval: 5000 },
        stats: { def: 1 },
        cost: { gold: 220, materials: [{ item: 'emerald', qty: 1 }, { item: 'herb', qty: 5 }] },
        minLevel: 1
    },
    fortitude: {
        id: 'fortitude', name: 'Fortitude', tier: EnchantmentTier.BASIC,
        slot: EnchantmentSlot.ARMOR, icon: '🏰',
        description: 'Reduces all incoming damage by a flat 2 points.',
        effect: { type: 'flatReduction', value: 2 },
        stats: { def: 3 },
        cost: { gold: 250, materials: [{ item: 'steel_ingot', qty: 2 }, { item: 'stone', qty: 10 }] },
        minLevel: 2
    },

    // === ARMOR ENCHANTMENTS (Advanced) ===
    elemental_resist: {
        id: 'elemental_resist', name: 'Elemental Ward', tier: EnchantmentTier.ADVANCED,
        slot: EnchantmentSlot.ARMOR, icon: '🌈',
        description: 'Reduces fire, ice, and lightning damage taken by 20%.',
        effect: { type: 'elementalResist', elements: ['fire', 'ice', 'lightning'], ratio: 0.20 },
        stats: { def: 4 },
        cost: { gold: 500, materials: [{ item: 'ruby', qty: 1 }, { item: 'sapphire', qty: 1 }, { item: 'crystal', qty: 3 }] },
        minLevel: 4
    },
    evasion: {
        id: 'evasion', name: 'Evasion', tier: EnchantmentTier.ADVANCED,
        slot: EnchantmentSlot.ARMOR, icon: '💨',
        description: 'Grants a 10% chance to completely dodge an attack.',
        effect: { type: 'dodge', chance: 0.10 },
        stats: { def: 2 },
        cost: { gold: 450, materials: [{ item: 'silk', qty: 4 }, { item: 'emerald', qty: 2 }] },
        minLevel: 4
    },

    // === ACCESSORY ENCHANTMENTS (Basic) ===
    luck: {
        id: 'luck', name: 'Fortune', tier: EnchantmentTier.BASIC,
        slot: EnchantmentSlot.ACCESSORY, icon: '🍀',
        description: 'Increases rare item drop chance by 10%.',
        effect: { type: 'dropBonus', ratio: 0.10 },
        stats: {},
        cost: { gold: 300, materials: [{ item: 'emerald', qty: 1 }, { item: 'moonflower', qty: 2 }] },
        minLevel: 2
    },
    wisdom: {
        id: 'wisdom', name: 'Wisdom', tier: EnchantmentTier.BASIC,
        slot: EnchantmentSlot.ACCESSORY, icon: '📖',
        description: 'Increases experience gained from all sources by 8%.',
        effect: { type: 'xpBonus', ratio: 0.08 },
        stats: {},
        cost: { gold: 280, materials: [{ item: 'sapphire', qty: 1 }, { item: 'moonflower', qty: 1 }] },
        minLevel: 2
    },
    prosperity: {
        id: 'prosperity', name: 'Prosperity', tier: EnchantmentTier.BASIC,
        slot: EnchantmentSlot.ACCESSORY, icon: '💰',
        description: 'Increases gold earned from all sources by 10%.',
        effect: { type: 'goldBonus', ratio: 0.10 },
        stats: {},
        cost: { gold: 350, materials: [{ item: 'gold_ore', qty: 3 }, { item: 'crystal', qty: 2 }] },
        minLevel: 3
    },
    swift: {
        id: 'swift', name: 'Swiftness', tier: EnchantmentTier.BASIC,
        slot: EnchantmentSlot.ACCESSORY, icon: '🌪',
        description: 'Increases attack speed by 10%.',
        effect: { type: 'attackSpeed', ratio: 0.10 },
        stats: { atk: 1 },
        cost: { gold: 260, materials: [{ item: 'silk', qty: 2 }, { item: 'crystal', qty: 2 }] },
        minLevel: 2
    },

    // === ACCESSORY ENCHANTMENTS (Advanced) ===
    vitality: {
        id: 'vitality', name: 'Vitality', tier: EnchantmentTier.ADVANCED,
        slot: EnchantmentSlot.ACCESSORY, icon: '❤',
        description: 'Increases maximum HP by 15%.',
        effect: { type: 'maxHpBonus', ratio: 0.15 },
        stats: { def: 2 },
        cost: { gold: 480, materials: [{ item: 'ruby', qty: 2 }, { item: 'ancient_bone', qty: 1 }] },
        minLevel: 4
    },
    focus: {
        id: 'focus', name: 'Focus', tier: EnchantmentTier.ADVANCED,
        slot: EnchantmentSlot.ACCESSORY, icon: '🎯',
        description: 'Increases critical hit chance by 8%.',
        effect: { type: 'critChance', value: 0.08 },
        stats: { atk: 2 },
        cost: { gold: 500, materials: [{ item: 'diamond', qty: 1 }, { item: 'crystal', qty: 2 }] },
        minLevel: 5
    },

    // === LEGENDARY ENCHANTMENTS (Any Slot) ===
    chaos: {
        id: 'chaos', name: 'Chaos', tier: EnchantmentTier.LEGENDARY,
        slot: EnchantmentSlot.ANY, icon: '🌀',
        description: 'Each hit triggers a random effect: burn, freeze, shock, heal, or critical.',
        effect: {
            type: 'chaos',
            possibleEffects: [
                { type: 'burn', damagePerTick: 5, ticks: 2, interval: 1000 },
                { type: 'slow', speedReduction: 0.25, duration: 2000 },
                { type: 'chain', chainTargets: 2, chainDamageRatio: 0.3 },
                { type: 'lifesteal', ratio: 0.20 },
                { type: 'criticalHit', multiplier: 2.0 }
            ]
        },
        stats: { atk: 5, def: 5 },
        cost: { gold: 2000, materials: [{ item: 'void_essence', qty: 2 }, { item: 'dragon_scale', qty: 2 }, { item: 'diamond', qty: 2 }] },
        minLevel: 8
    },
    transcendence: {
        id: 'transcendence', name: 'Transcendence', tier: EnchantmentTier.LEGENDARY,
        slot: EnchantmentSlot.ANY, icon: '✨',
        description: 'Empowers the bearer with +8 to all stats and 5% bonus to all gains.',
        effect: { type: 'allBonus', statBonus: 8, gainBonus: 0.05 },
        stats: { atk: 8, def: 8 },
        cost: { gold: 3000, materials: [{ item: 'void_essence', qty: 3 }, { item: 'phoenix_feather', qty: 1 }, { item: 'diamond', qty: 3 }] },
        minLevel: 9
    },
    phoenix: {
        id: 'phoenix', name: 'Phoenix', tier: EnchantmentTier.LEGENDARY,
        slot: EnchantmentSlot.ANY, icon: '🔥',
        description: 'Upon receiving a fatal blow, revive once per battle with 30% HP.',
        effect: { type: 'revive', hpRatio: 0.30, usesPerBattle: 1 },
        stats: { def: 6 },
        cost: { gold: 2500, materials: [{ item: 'phoenix_feather', qty: 2 }, { item: 'ruby', qty: 3 }, { item: 'dragon_scale', qty: 1 }] },
        minLevel: 8
    }
};

class EnchantmentSystem {
    constructor() {
        this.enchantedItems = new Map(); // itemId -> enchantId
        this.enchantLevel = 1;
        this.enchantXp = 0;
        this.totalEnchants = 0;
        this.removeCostMultiplier = 0.5; // removing costs 50% of original gold
    }

    canEnchant(itemId, enchantId, inventory) {
        const enchant = EnchantmentDB[enchantId];
        if (!enchant) return { can: false, reason: 'Enchantment not found' };

        const item = ItemDB[itemId];
        if (!item) return { can: false, reason: 'Item not found' };

        // Check slot compatibility
        if (enchant.slot !== EnchantmentSlot.ANY) {
            if (item.category !== enchant.slot) {
                return { can: false, reason: `This enchantment requires a ${enchant.slot} item` };
            }
        } else {
            const validCategories = [ItemCategory.WEAPON, ItemCategory.ARMOR, ItemCategory.ACCESSORY];
            if (!validCategories.includes(item.category)) {
                return { can: false, reason: 'Can only enchant equipment (weapon, armor, accessory)' };
            }
        }

        // Check if already enchanted
        if (this.enchantedItems.has(itemId)) {
            return { can: false, reason: 'Item already enchanted. Remove current enchantment first.' };
        }

        // Check enchant level
        if (this.enchantLevel < enchant.minLevel) {
            return { can: false, reason: `Need enchantment level ${enchant.minLevel} (current: ${this.enchantLevel})` };
        }

        // Check gold
        if (!inventory.hasGold || inventory.gold < enchant.cost.gold) {
            return { can: false, reason: `Need ${enchant.cost.gold} gold` };
        }

        // Check materials
        for (const mat of enchant.cost.materials) {
            if (!inventory.hasItem(mat.item, mat.qty)) {
                const have = inventory.getCount(mat.item);
                const need = mat.qty - have;
                return { can: false, reason: `Need ${need} more ${ItemDB[mat.item]?.name || mat.item}` };
            }
        }

        return { can: true };
    }

    enchantItem(itemId, enchantId, inventory) {
        const check = this.canEnchant(itemId, enchantId, inventory);
        if (!check.can) return check;

        const enchant = EnchantmentDB[enchantId];

        // Consume gold
        inventory.gold -= enchant.cost.gold;

        // Consume materials
        for (const mat of enchant.cost.materials) {
            inventory.removeItem(mat.item, mat.qty);
        }

        // Apply enchantment
        this.enchantedItems.set(itemId, enchantId);
        this.totalEnchants++;

        // Grant XP
        const xpGain = this._getXpForEnchant(enchant);
        this.enchantXp += xpGain;

        // Level up check
        let leveledUp = false;
        while (this.enchantXp >= this._getXpForLevel(this.enchantLevel)) {
            this.enchantXp -= this._getXpForLevel(this.enchantLevel);
            this.enchantLevel++;
            leveledUp = true;
        }

        return {
            success: true,
            enchant: enchant.name,
            itemId,
            xpGain,
            leveledUp,
            newLevel: this.enchantLevel
        };
    }

    removeEnchant(itemId, inventory) {
        if (!this.enchantedItems.has(itemId)) {
            return { success: false, reason: 'Item is not enchanted' };
        }

        const enchantId = this.enchantedItems.get(itemId);
        const enchant = EnchantmentDB[enchantId];
        const removeCost = Math.floor(enchant.cost.gold * this.removeCostMultiplier);

        if (inventory.gold < removeCost) {
            return { success: false, reason: `Need ${removeCost} gold to remove enchantment` };
        }

        inventory.gold -= removeCost;
        this.enchantedItems.delete(itemId);

        return {
            success: true,
            removed: enchant.name,
            cost: removeCost
        };
    }

    getEnchantedStats(enchantId) {
        const enchant = EnchantmentDB[enchantId];
        if (!enchant) return {};
        return { ...enchant.stats };
    }

    getItemEnchant(itemId) {
        const enchantId = this.enchantedItems.get(itemId);
        if (!enchantId) return null;
        return EnchantmentDB[enchantId] || null;
    }

    getItemEnchantEffect(itemId) {
        const enchant = this.getItemEnchant(itemId);
        if (!enchant) return null;
        return enchant.effect;
    }

    getAvailableEnchantments(itemCategory) {
        return Object.values(EnchantmentDB).filter(e => {
            if (this.enchantLevel < e.minLevel) return false;
            if (e.slot === EnchantmentSlot.ANY) return true;
            return e.slot === itemCategory;
        });
    }

    processCombatEffect(enchantId, damage, attacker, defender) {
        const enchant = EnchantmentDB[enchantId];
        if (!enchant) return null;

        const effect = enchant.effect;

        switch (effect.type) {
            case 'burn':
                return { type: 'burn', totalDamage: effect.damagePerTick * effect.ticks, ticks: effect.ticks, interval: effect.interval };
            case 'slow':
                return { type: 'slow', speedReduction: effect.speedReduction, duration: effect.duration };
            case 'chain':
                return { type: 'chain', targets: effect.chainTargets, damage: Math.floor(damage * effect.chainDamageRatio) };
            case 'lifesteal':
                return { type: 'heal', value: Math.floor(damage * effect.ratio) };
            case 'armorPen':
                return { type: 'armorPen', ratio: effect.ratio };
            case 'bane':
                if (defender && defender.type === effect.targetType) {
                    return { type: 'bonusDamage', value: Math.floor(damage * effect.bonusDamage) };
                }
                return null;
            case 'berserk': {
                const hpRatio = attacker ? attacker.hp / attacker.maxHp : 1;
                if (hpRatio < effect.hpThreshold) {
                    const missingRatio = 1 - (hpRatio / effect.hpThreshold);
                    return { type: 'atkBoost', ratio: effect.maxBonus * missingRatio };
                }
                return null;
            }
            case 'reflect':
                return { type: 'reflect', damage: Math.floor(damage * effect.ratio) };
            case 'regen':
                return { type: 'regen', hpPerTick: effect.hpPerTick, interval: effect.interval };
            case 'flatReduction':
                return { type: 'damageReduce', value: effect.value };
            case 'dodge':
                return Math.random() < effect.chance ? { type: 'dodge' } : null;
            case 'chaos': {
                const chosen = effect.possibleEffects[Math.floor(Math.random() * effect.possibleEffects.length)];
                return this._processChaosEffect(chosen, damage);
            }
            case 'revive':
                return { type: 'revive', hpRatio: effect.hpRatio, uses: effect.usesPerBattle };
            case 'allBonus':
                return { type: 'allBonus', statBonus: effect.statBonus, gainBonus: effect.gainBonus };
            default:
                return null;
        }
    }

    _processChaosEffect(chosen, damage) {
        switch (chosen.type) {
            case 'burn':
                return { type: 'burn', totalDamage: chosen.damagePerTick * chosen.ticks, ticks: chosen.ticks, interval: chosen.interval };
            case 'slow':
                return { type: 'slow', speedReduction: chosen.speedReduction, duration: chosen.duration };
            case 'chain':
                return { type: 'chain', targets: chosen.chainTargets, damage: Math.floor(damage * chosen.chainDamageRatio) };
            case 'lifesteal':
                return { type: 'heal', value: Math.floor(damage * chosen.ratio) };
            case 'criticalHit':
                return { type: 'bonusDamage', value: Math.floor(damage * (chosen.multiplier - 1)) };
            default:
                return null;
        }
    }

    _getXpForEnchant(enchant) {
        const tierXp = { basic: 15, advanced: 35, legendary: 100 };
        return tierXp[enchant.tier] || 15;
    }

    _getXpForLevel(level) {
        return Math.floor(80 * Math.pow(1.4, level - 1));
    }

    serialize() {
        return {
            enchantedItems: Array.from(this.enchantedItems.entries()),
            enchantLevel: this.enchantLevel,
            enchantXp: this.enchantXp,
            totalEnchants: this.totalEnchants
        };
    }

    deserialize(data) {
        this.enchantedItems = new Map(data.enchantedItems || []);
        this.enchantLevel = data.enchantLevel || 1;
        this.enchantXp = data.enchantXp || 0;
        this.totalEnchants = data.totalEnchants || 0;
    }
}
