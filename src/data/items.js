// Item database
const ItemRarity = {
    COMMON: 'common',
    UNCOMMON: 'uncommon',
    RARE: 'rare',
    EPIC: 'epic',
    LEGENDARY: 'legendary'
};

const RarityColors = {
    common: '#9e9e9e',
    uncommon: '#4caf50',
    rare: '#2196f3',
    epic: '#9c27b0',
    legendary: '#ff9800'
};

const RarityMultiplier = {
    common: 1,
    uncommon: 1.5,
    rare: 2.5,
    epic: 4,
    legendary: 8
};

const ItemCategory = {
    MATERIAL: 'material',
    POTION: 'potion',
    WEAPON: 'weapon',
    ARMOR: 'armor',
    ACCESSORY: 'accessory',
    FOOD: 'food',
    TOOL: 'tool',
    GEM: 'gem',
    SCROLL: 'scroll',
    ARTIFACT: 'artifact',
    QUEST: 'quest'
};

const CategoryIcons = {
    material: '◆',
    potion: '◉',
    weapon: '⚔',
    armor: '🛡',
    accessory: '◈',
    food: '♨',
    tool: '⚒',
    gem: '◇',
    scroll: '📜',
    artifact: '✧',
    quest: '★'
};

// Base items database
const ItemDB = {
    // === MATERIALS ===
    wood: {
        id: 'wood', name: 'Wood', category: ItemCategory.MATERIAL,
        rarity: ItemRarity.COMMON, basePrice: 5, icon: '🪵',
        description: 'Basic building material from the forest.',
        sources: ['Whispering Woods', 'Sunlit Meadow']
    },
    stone: {
        id: 'stone', name: 'Stone', category: ItemCategory.MATERIAL,
        rarity: ItemRarity.COMMON, basePrice: 4, icon: '🪨',
        description: 'Common stone found everywhere.',
        sources: ['Rocky Hills', 'Crystal Caves']
    },
    iron_ore: {
        id: 'iron_ore', name: 'Iron Ore', category: ItemCategory.MATERIAL,
        rarity: ItemRarity.COMMON, basePrice: 12, icon: '⛏',
        description: 'Raw iron ore, needs smelting.',
        sources: ['Rocky Hills', 'Dwarven Mines']
    },
    copper_ore: {
        id: 'copper_ore', name: 'Copper Ore', category: ItemCategory.MATERIAL,
        rarity: ItemRarity.COMMON, basePrice: 8, icon: '🟤',
        description: 'Soft copper ore for basic crafting.',
        sources: ['Rocky Hills', 'Sunlit Meadow']
    },
    silver_ore: {
        id: 'silver_ore', name: 'Silver Ore', category: ItemCategory.MATERIAL,
        rarity: ItemRarity.UNCOMMON, basePrice: 25, icon: '⬜',
        description: 'Precious silver ore.',
        sources: ['Dwarven Mines', 'Crystal Caves']
    },
    gold_ore: {
        id: 'gold_ore', name: 'Gold Ore', category: ItemCategory.MATERIAL,
        rarity: ItemRarity.RARE, basePrice: 50, icon: '🟡',
        description: 'Valuable gold ore.',
        sources: ['Dwarven Mines', 'Dragon Peak']
    },
    mithril_ore: {
        id: 'mithril_ore', name: 'Mithril Ore', category: ItemCategory.MATERIAL,
        rarity: ItemRarity.EPIC, basePrice: 150, icon: '💎',
        description: 'Legendary light metal ore.',
        sources: ['Dragon Peak', 'Void Depths']
    },
    herb: {
        id: 'herb', name: 'Wild Herb', category: ItemCategory.MATERIAL,
        rarity: ItemRarity.COMMON, basePrice: 3, icon: '🌿',
        description: 'Common medicinal herb.',
        sources: ['Whispering Woods', 'Sunlit Meadow']
    },
    moonflower: {
        id: 'moonflower', name: 'Moonflower', category: ItemCategory.MATERIAL,
        rarity: ItemRarity.UNCOMMON, basePrice: 20, icon: '🌸',
        description: 'Rare flower that blooms under moonlight.',
        sources: ['Enchanted Glade', 'Whispering Woods']
    },
    dragon_scale: {
        id: 'dragon_scale', name: 'Dragon Scale', category: ItemCategory.MATERIAL,
        rarity: ItemRarity.EPIC, basePrice: 200, icon: '🐉',
        description: 'Scale from a mighty dragon.',
        sources: ['Dragon Peak']
    },
    void_essence: {
        id: 'void_essence', name: 'Void Essence', category: ItemCategory.MATERIAL,
        rarity: ItemRarity.LEGENDARY, basePrice: 500, icon: '🌑',
        description: 'Pure essence from the void between worlds.',
        sources: ['Void Depths']
    },
    leather: {
        id: 'leather', name: 'Leather', category: ItemCategory.MATERIAL,
        rarity: ItemRarity.COMMON, basePrice: 8, icon: '🟫',
        description: 'Tanned animal hide.',
        sources: ['Whispering Woods', 'Rocky Hills']
    },
    silk: {
        id: 'silk', name: 'Spider Silk', category: ItemCategory.MATERIAL,
        rarity: ItemRarity.UNCOMMON, basePrice: 30, icon: '🕸',
        description: 'Strong and beautiful silk thread.',
        sources: ['Crystal Caves', 'Enchanted Glade']
    },
    crystal: {
        id: 'crystal', name: 'Crystal Shard', category: ItemCategory.MATERIAL,
        rarity: ItemRarity.UNCOMMON, basePrice: 35, icon: '🔮',
        description: 'A glowing crystal fragment.',
        sources: ['Crystal Caves']
    },
    ancient_bone: {
        id: 'ancient_bone', name: 'Ancient Bone', category: ItemCategory.MATERIAL,
        rarity: ItemRarity.RARE, basePrice: 60, icon: '🦴',
        description: 'Bone from a creature long extinct.',
        sources: ['Haunted Ruins', 'Void Depths']
    },
    phoenix_feather: {
        id: 'phoenix_feather', name: 'Phoenix Feather', category: ItemCategory.MATERIAL,
        rarity: ItemRarity.LEGENDARY, basePrice: 800, icon: '🔥',
        description: 'A feather that burns eternally.',
        sources: ['Dragon Peak']
    },
    iron_ingot: {
        id: 'iron_ingot', name: 'Iron Ingot', category: ItemCategory.MATERIAL,
        rarity: ItemRarity.COMMON, basePrice: 25, icon: '🔩',
        description: 'Smelted iron bar.',
        crafted: true
    },
    steel_ingot: {
        id: 'steel_ingot', name: 'Steel Ingot', category: ItemCategory.MATERIAL,
        rarity: ItemRarity.UNCOMMON, basePrice: 45, icon: '⬛',
        description: 'Strong steel alloy.',
        crafted: true
    },
    cloth: {
        id: 'cloth', name: 'Cloth', category: ItemCategory.MATERIAL,
        rarity: ItemRarity.COMMON, basePrice: 6, icon: '🧵',
        description: 'Woven fabric.',
        sources: ['Sunlit Meadow']
    },
    enchanted_wood: {
        id: 'enchanted_wood', name: 'Enchanted Wood', category: ItemCategory.MATERIAL,
        rarity: ItemRarity.RARE, basePrice: 40, icon: '✨',
        description: 'Wood infused with magical energy.',
        sources: ['Enchanted Glade']
    },

    // === GEMS ===
    ruby: {
        id: 'ruby', name: 'Ruby', category: ItemCategory.GEM,
        rarity: ItemRarity.RARE, basePrice: 80, icon: '❤',
        description: 'A brilliant red gem.',
        sources: ['Crystal Caves', 'Dwarven Mines']
    },
    sapphire: {
        id: 'sapphire', name: 'Sapphire', category: ItemCategory.GEM,
        rarity: ItemRarity.RARE, basePrice: 85, icon: '💙',
        description: 'A deep blue gem.',
        sources: ['Crystal Caves', 'Dwarven Mines']
    },
    emerald: {
        id: 'emerald', name: 'Emerald', category: ItemCategory.GEM,
        rarity: ItemRarity.RARE, basePrice: 90, icon: '💚',
        description: 'A vivid green gem.',
        sources: ['Enchanted Glade', 'Crystal Caves']
    },
    diamond: {
        id: 'diamond', name: 'Diamond', category: ItemCategory.GEM,
        rarity: ItemRarity.EPIC, basePrice: 250, icon: '💠',
        description: 'The hardest and most precious gem.',
        sources: ['Dwarven Mines', 'Dragon Peak']
    },

    // === POTIONS ===
    health_potion: {
        id: 'health_potion', name: 'Health Potion', category: ItemCategory.POTION,
        rarity: ItemRarity.COMMON, basePrice: 15, icon: '🧪',
        description: 'Restores 30 HP.',
        effect: { type: 'heal', value: 30 }, crafted: true
    },
    mana_potion: {
        id: 'mana_potion', name: 'Mana Potion', category: ItemCategory.POTION,
        rarity: ItemRarity.COMMON, basePrice: 18, icon: '💧',
        description: 'Restores 20 MP.',
        effect: { type: 'mana', value: 20 }, crafted: true
    },
    strength_elixir: {
        id: 'strength_elixir', name: 'Strength Elixir', category: ItemCategory.POTION,
        rarity: ItemRarity.UNCOMMON, basePrice: 40, icon: '💪',
        description: 'Boosts ATK by 5 for the battle.',
        effect: { type: 'buff', stat: 'atk', value: 5 }, crafted: true
    },
    shield_potion: {
        id: 'shield_potion', name: 'Shield Potion', category: ItemCategory.POTION,
        rarity: ItemRarity.UNCOMMON, basePrice: 40, icon: '🛡',
        description: 'Boosts DEF by 5 for the battle.',
        effect: { type: 'buff', stat: 'def', value: 5 }, crafted: true
    },
    elixir_of_life: {
        id: 'elixir_of_life', name: 'Elixir of Life', category: ItemCategory.POTION,
        rarity: ItemRarity.EPIC, basePrice: 200, icon: '✨',
        description: 'Fully restores HP and MP.',
        effect: { type: 'fullRestore' }, crafted: true
    },

    // === FOOD ===
    bread: {
        id: 'bread', name: 'Fresh Bread', category: ItemCategory.FOOD,
        rarity: ItemRarity.COMMON, basePrice: 5, icon: '🍞',
        description: 'Simple but filling bread.',
        effect: { type: 'heal', value: 10 }, crafted: true
    },
    stew: {
        id: 'stew', name: 'Hearty Stew', category: ItemCategory.FOOD,
        rarity: ItemRarity.UNCOMMON, basePrice: 20, icon: '🍲',
        description: 'Warm stew that boosts exploration stamina.',
        effect: { type: 'stamina', value: 20 }, crafted: true
    },
    feast: {
        id: 'feast', name: 'Grand Feast', category: ItemCategory.FOOD,
        rarity: ItemRarity.RARE, basePrice: 80, icon: '🍗',
        description: 'A magnificent feast. All stats +3 for the day.',
        effect: { type: 'allBuff', value: 3 }, crafted: true
    },

    // === WEAPONS ===
    wooden_sword: {
        id: 'wooden_sword', name: 'Wooden Sword', category: ItemCategory.WEAPON,
        rarity: ItemRarity.COMMON, basePrice: 20, icon: '🗡',
        description: 'A basic training sword.',
        stats: { atk: 3 }, crafted: true
    },
    iron_sword: {
        id: 'iron_sword', name: 'Iron Sword', category: ItemCategory.WEAPON,
        rarity: ItemRarity.COMMON, basePrice: 50, icon: '⚔',
        description: 'A reliable iron sword.',
        stats: { atk: 8 }, crafted: true
    },
    steel_sword: {
        id: 'steel_sword', name: 'Steel Sword', category: ItemCategory.WEAPON,
        rarity: ItemRarity.UNCOMMON, basePrice: 120, icon: '⚔',
        description: 'A sharp steel blade.',
        stats: { atk: 15 }, crafted: true
    },
    crystal_staff: {
        id: 'crystal_staff', name: 'Crystal Staff', category: ItemCategory.WEAPON,
        rarity: ItemRarity.RARE, basePrice: 200, icon: '🔮',
        description: 'A staff that channels magical energy.',
        stats: { atk: 12, matk: 20 }, crafted: true
    },
    dragon_blade: {
        id: 'dragon_blade', name: 'Dragon Blade', category: ItemCategory.WEAPON,
        rarity: ItemRarity.EPIC, basePrice: 500, icon: '🗡',
        description: 'Forged from dragon scales and fire.',
        stats: { atk: 30, critRate: 0.1 }, crafted: true
    },
    void_scythe: {
        id: 'void_scythe', name: 'Void Scythe', category: ItemCategory.WEAPON,
        rarity: ItemRarity.LEGENDARY, basePrice: 1500, icon: '⚔',
        description: 'A weapon that cuts through reality itself.',
        stats: { atk: 50, critRate: 0.15, lifesteal: 0.1 }, crafted: true
    },
    hunting_bow: {
        id: 'hunting_bow', name: 'Hunting Bow', category: ItemCategory.WEAPON,
        rarity: ItemRarity.COMMON, basePrice: 35, icon: '🏹',
        description: 'A simple but effective bow.',
        stats: { atk: 6, critRate: 0.05 }, crafted: true
    },
    enchanted_bow: {
        id: 'enchanted_bow', name: 'Enchanted Bow', category: ItemCategory.WEAPON,
        rarity: ItemRarity.RARE, basePrice: 250, icon: '🏹',
        description: 'Arrows seek their target magically.',
        stats: { atk: 18, critRate: 0.15, accuracy: 0.2 }, crafted: true
    },

    // === ARMOR ===
    leather_armor: {
        id: 'leather_armor', name: 'Leather Armor', category: ItemCategory.ARMOR,
        rarity: ItemRarity.COMMON, basePrice: 30, icon: '🦺',
        description: 'Basic leather protection.',
        stats: { def: 5 }, crafted: true
    },
    iron_armor: {
        id: 'iron_armor', name: 'Iron Armor', category: ItemCategory.ARMOR,
        rarity: ItemRarity.COMMON, basePrice: 80, icon: '🛡',
        description: 'Sturdy iron plate armor.',
        stats: { def: 12 }, crafted: true
    },
    steel_armor: {
        id: 'steel_armor', name: 'Steel Armor', category: ItemCategory.ARMOR,
        rarity: ItemRarity.UNCOMMON, basePrice: 180, icon: '🛡',
        description: 'Heavy but protective steel armor.',
        stats: { def: 20 }, crafted: true
    },
    mithril_armor: {
        id: 'mithril_armor', name: 'Mithril Armor', category: ItemCategory.ARMOR,
        rarity: ItemRarity.EPIC, basePrice: 600, icon: '🛡',
        description: 'Light as silk, strong as steel.',
        stats: { def: 35, speed: 5 }, crafted: true
    },
    dragon_armor: {
        id: 'dragon_armor', name: 'Dragon Scale Armor', category: ItemCategory.ARMOR,
        rarity: ItemRarity.LEGENDARY, basePrice: 2000, icon: '🛡',
        description: 'Impervious to fire and most weapons.',
        stats: { def: 50, fireRes: 0.5 }, crafted: true
    },
    silk_robe: {
        id: 'silk_robe', name: 'Silk Robe', category: ItemCategory.ARMOR,
        rarity: ItemRarity.UNCOMMON, basePrice: 100, icon: '👘',
        description: 'A robe that enhances magical ability.',
        stats: { def: 5, mdef: 15, matk: 5 }, crafted: true
    },

    // === ACCESSORIES ===
    copper_ring: {
        id: 'copper_ring', name: 'Copper Ring', category: ItemCategory.ACCESSORY,
        rarity: ItemRarity.COMMON, basePrice: 15, icon: '💍',
        description: 'A simple copper ring.',
        stats: { atk: 1, def: 1 }, crafted: true
    },
    silver_necklace: {
        id: 'silver_necklace', name: 'Silver Necklace', category: ItemCategory.ACCESSORY,
        rarity: ItemRarity.UNCOMMON, basePrice: 60, icon: '📿',
        description: 'An elegant silver necklace.',
        stats: { mdef: 5, mp: 10 }, crafted: true
    },
    ruby_amulet: {
        id: 'ruby_amulet', name: 'Ruby Amulet', category: ItemCategory.ACCESSORY,
        rarity: ItemRarity.RARE, basePrice: 200, icon: '❤',
        description: 'Increases max HP.',
        stats: { hp: 30, def: 3 }, crafted: true
    },
    merchant_badge: {
        id: 'merchant_badge', name: "Merchant's Badge", category: ItemCategory.ACCESSORY,
        rarity: ItemRarity.RARE, basePrice: 300, icon: '🏅',
        description: 'Increases selling prices by 10%.',
        stats: { sellBonus: 0.1 }, crafted: true
    },
    lucky_charm: {
        id: 'lucky_charm', name: 'Lucky Charm', category: ItemCategory.ACCESSORY,
        rarity: ItemRarity.UNCOMMON, basePrice: 75, icon: '🍀',
        description: 'Increases luck and drop rates.',
        stats: { luck: 5, dropBonus: 0.05 }, crafted: true
    },

    // === SCROLLS ===
    scroll_fire: {
        id: 'scroll_fire', name: 'Fire Scroll', category: ItemCategory.SCROLL,
        rarity: ItemRarity.UNCOMMON, basePrice: 30, icon: '📜',
        description: 'Deals 25 fire damage to an enemy.',
        effect: { type: 'damage', element: 'fire', value: 25 }, crafted: true
    },
    scroll_ice: {
        id: 'scroll_ice', name: 'Ice Scroll', category: ItemCategory.SCROLL,
        rarity: ItemRarity.UNCOMMON, basePrice: 30, icon: '📜',
        description: 'Deals 25 ice damage and slows.',
        effect: { type: 'damage', element: 'ice', value: 25, slow: true }, crafted: true
    },
    scroll_teleport: {
        id: 'scroll_teleport', name: 'Teleport Scroll', category: ItemCategory.SCROLL,
        rarity: ItemRarity.RARE, basePrice: 100, icon: '📜',
        description: 'Instantly escape from exploration.',
        effect: { type: 'teleport' }, crafted: true
    },

    // === TOOLS ===
    pickaxe: {
        id: 'pickaxe', name: 'Pickaxe', category: ItemCategory.TOOL,
        rarity: ItemRarity.COMMON, basePrice: 25, icon: '⛏',
        description: 'For mining ores. +10% ore drops.',
        stats: { oreBonus: 0.1 }, crafted: true
    },
    golden_pickaxe: {
        id: 'golden_pickaxe', name: 'Golden Pickaxe', category: ItemCategory.TOOL,
        rarity: ItemRarity.RARE, basePrice: 150, icon: '⛏',
        description: 'Superior mining tool. +25% ore drops.',
        stats: { oreBonus: 0.25 }, crafted: true
    },
    herb_pouch: {
        id: 'herb_pouch', name: 'Herb Pouch', category: ItemCategory.TOOL,
        rarity: ItemRarity.COMMON, basePrice: 20, icon: '👝',
        description: 'Carry more herbs. +10% herb drops.',
        stats: { herbBonus: 0.1 }, crafted: true
    },

    // === ARTIFACTS ===
    merchants_compass: {
        id: 'merchants_compass', name: "Merchant's Compass", category: ItemCategory.ARTIFACT,
        rarity: ItemRarity.EPIC, basePrice: 0, icon: '🧭',
        description: 'Shows the best trade routes. Cannot be sold.',
        stats: { tradeSight: true }, quest: true
    },
    crown_of_commerce: {
        id: 'crown_of_commerce', name: 'Crown of Commerce', category: ItemCategory.ARTIFACT,
        rarity: ItemRarity.LEGENDARY, basePrice: 0, icon: '👑',
        description: 'The ultimate symbol of merchant mastery.',
        stats: { sellBonus: 0.25, buyDiscount: 0.15 }, quest: true
    },
};

// Get item with quality variation
function getItemWithQuality(itemId) {
    const base = ItemDB[itemId];
    if (!base) return null;
    const item = Utils.deepClone(base);
    item.uid = Utils.generateId();
    item.quality = 1.0;
    // Small quality variation
    if (Math.random() < 0.3) {
        item.quality = Utils.randomFloat(0.8, 1.5);
        if (item.quality > 1.2) item.qualityLabel = 'Fine';
        if (item.quality > 1.4) item.qualityLabel = 'Superior';
        if (item.quality < 0.9) item.qualityLabel = 'Crude';
    }
    return item;
}
