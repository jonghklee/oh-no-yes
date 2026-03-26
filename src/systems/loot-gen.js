// Procedural Loot Generator - creates random equipment from combat
class LootGenerator {
    static prefixes = {
        common: ['Worn', 'Old', 'Simple', 'Basic', 'Plain'],
        uncommon: ['Sturdy', 'Sharp', 'Tempered', 'Fine', 'Polished'],
        rare: ['Enchanted', 'Glowing', 'Mystic', 'Ancient', 'Runic'],
        epic: ['Radiant', 'Legendary', 'Divine', 'Eternal', 'Celestial'],
        legendary: ['Void-Touched', 'Dragon-Forged', 'Astral', 'Primordial', 'Godly']
    };

    static weaponTypes = [
        { name: 'Sword', icon: '⚔', baseStat: 'atk', baseValue: 5 },
        { name: 'Bow', icon: '🏹', baseStat: 'atk', baseValue: 4, bonusStat: 'critRate', bonusValue: 0.03 },
        { name: 'Staff', icon: '🔮', baseStat: 'atk', baseValue: 3, bonusStat: 'matk', bonusValue: 5 },
        { name: 'Dagger', icon: '🗡', baseStat: 'atk', baseValue: 3, bonusStat: 'speed', bonusValue: 2 },
        { name: 'Axe', icon: '🪓', baseStat: 'atk', baseValue: 6, bonusStat: 'critDmg', bonusValue: 0.1 },
    ];

    static armorTypes = [
        { name: 'Armor', icon: '🛡', baseStat: 'def', baseValue: 5 },
        { name: 'Robe', icon: '👘', baseStat: 'def', baseValue: 2, bonusStat: 'mdef', bonusValue: 5 },
        { name: 'Shield', icon: '🛡', baseStat: 'def', baseValue: 7 },
    ];

    static accessoryTypes = [
        { name: 'Ring', icon: '💍', baseStat: 'atk', baseValue: 2, bonusStat: 'def', bonusValue: 2 },
        { name: 'Amulet', icon: '📿', baseStat: 'hp', baseValue: 15 },
        { name: 'Charm', icon: '🍀', baseStat: 'luck', baseValue: 3 },
    ];

    // Chance to drop equipment based on enemy difficulty
    static shouldDrop(enemyDifficulty) {
        const baseChance = 0.03 + enemyDifficulty * 0.02; // 3% base + 2% per difficulty
        return Math.random() < Math.min(baseChance, 0.25);
    }

    static generate(enemyLevel, areaId) {
        // Determine rarity based on enemy level
        const rarityRoll = Math.random();
        let rarity;
        if (rarityRoll < 0.01 && enemyLevel >= 20) rarity = 'legendary';
        else if (rarityRoll < 0.05 && enemyLevel >= 15) rarity = 'epic';
        else if (rarityRoll < 0.2 && enemyLevel >= 8) rarity = 'rare';
        else if (rarityRoll < 0.5) rarity = 'uncommon';
        else rarity = 'common';

        // Determine slot
        const slotRoll = Math.random();
        let slot, typePool;
        if (slotRoll < 0.4) { slot = 'weapon'; typePool = LootGenerator.weaponTypes; }
        else if (slotRoll < 0.7) { slot = 'armor'; typePool = LootGenerator.armorTypes; }
        else { slot = 'accessory'; typePool = LootGenerator.accessoryTypes; }

        const type = Utils.choice(typePool);
        const prefix = Utils.choice(LootGenerator.prefixes[rarity]);
        const rarityMult = RarityMultiplier[rarity] || 1;
        const levelMult = 1 + (enemyLevel - 1) * 0.15;

        // Build stats
        const stats = {};
        stats[type.baseStat] = Math.round(type.baseValue * rarityMult * levelMult);
        if (type.bonusStat) {
            stats[type.bonusStat] = typeof type.bonusValue === 'number' && type.bonusValue < 1
                ? Math.round(type.bonusValue * rarityMult * 100) / 100
                : Math.round(type.bonusValue * rarityMult * levelMult);
        }

        // Random bonus stat for rare+
        if (['rare', 'epic', 'legendary'].includes(rarity)) {
            const bonusStats = ['hp', 'critRate', 'dodge', 'lifesteal', 'speed'];
            const bs = Utils.choice(bonusStats);
            if (!stats[bs]) {
                stats[bs] = bs === 'hp' ? Math.round(10 * rarityMult) :
                            bs === 'speed' ? Math.round(2 * rarityMult) :
                            Math.round(0.03 * rarityMult * 100) / 100;
            }
        }

        const name = `${prefix} ${type.name}`;
        const basePrice = Math.round(20 * rarityMult * levelMult);
        const category = slot === 'weapon' ? 'weapon' : slot === 'armor' ? 'armor' : 'accessory';

        // Create a unique item ID
        const uid = `gen_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`;

        // Register in ItemDB temporarily
        ItemDB[uid] = {
            id: uid, name, category, rarity, basePrice,
            icon: type.icon, stats, generated: true,
            description: `${rarity.charAt(0).toUpperCase() + rarity.slice(1)} ${type.name} found in battle.`
        };

        return uid;
    }
}
