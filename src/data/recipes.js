// Crafting recipes
const RecipeDB = {
    // === SMELTING ===
    iron_ingot: {
        id: 'iron_ingot', result: 'iron_ingot', resultQty: 1,
        ingredients: [{ item: 'iron_ore', qty: 3 }],
        station: 'forge', level: 1, xp: 10, time: 5,
        category: 'smelting'
    },
    steel_ingot: {
        id: 'steel_ingot', result: 'steel_ingot', resultQty: 1,
        ingredients: [{ item: 'iron_ingot', qty: 2 }, { item: 'wood', qty: 1 }],
        station: 'forge', level: 5, xp: 25, time: 10,
        category: 'smelting'
    },

    // === POTIONS ===
    health_potion: {
        id: 'health_potion', result: 'health_potion', resultQty: 1,
        ingredients: [{ item: 'herb', qty: 3 }],
        station: 'alchemy', level: 1, xp: 8, time: 3,
        category: 'alchemy'
    },
    mana_potion: {
        id: 'mana_potion', result: 'mana_potion', resultQty: 1,
        ingredients: [{ item: 'moonflower', qty: 1 }, { item: 'herb', qty: 2 }],
        station: 'alchemy', level: 3, xp: 15, time: 5,
        category: 'alchemy'
    },
    strength_elixir: {
        id: 'strength_elixir', result: 'strength_elixir', resultQty: 1,
        ingredients: [{ item: 'herb', qty: 5 }, { item: 'iron_ore', qty: 1 }],
        station: 'alchemy', level: 5, xp: 25, time: 8,
        category: 'alchemy'
    },
    shield_potion: {
        id: 'shield_potion', result: 'shield_potion', resultQty: 1,
        ingredients: [{ item: 'herb', qty: 5 }, { item: 'stone', qty: 3 }],
        station: 'alchemy', level: 5, xp: 25, time: 8,
        category: 'alchemy'
    },
    elixir_of_life: {
        id: 'elixir_of_life', result: 'elixir_of_life', resultQty: 1,
        ingredients: [{ item: 'moonflower', qty: 5 }, { item: 'phoenix_feather', qty: 1 }, { item: 'crystal', qty: 3 }],
        station: 'alchemy', level: 15, xp: 100, time: 20,
        category: 'alchemy'
    },

    // === FOOD ===
    bread: {
        id: 'bread', result: 'bread', resultQty: 2,
        ingredients: [{ item: 'herb', qty: 2 }],
        station: 'kitchen', level: 1, xp: 5, time: 2,
        category: 'cooking'
    },
    stew: {
        id: 'stew', result: 'stew', resultQty: 1,
        ingredients: [{ item: 'herb', qty: 3 }, { item: 'leather', qty: 1 }],
        station: 'kitchen', level: 3, xp: 15, time: 5,
        category: 'cooking'
    },
    feast: {
        id: 'feast', result: 'feast', resultQty: 1,
        ingredients: [{ item: 'herb', qty: 10 }, { item: 'moonflower', qty: 2 }, { item: 'leather', qty: 3 }],
        station: 'kitchen', level: 10, xp: 50, time: 15,
        category: 'cooking'
    },

    // === WEAPONS ===
    wooden_sword: {
        id: 'wooden_sword', result: 'wooden_sword', resultQty: 1,
        ingredients: [{ item: 'wood', qty: 5 }],
        station: 'workbench', level: 1, xp: 10, time: 5,
        category: 'weaponcraft'
    },
    iron_sword: {
        id: 'iron_sword', result: 'iron_sword', resultQty: 1,
        ingredients: [{ item: 'iron_ingot', qty: 3 }, { item: 'wood', qty: 2 }],
        station: 'forge', level: 3, xp: 25, time: 10,
        category: 'weaponcraft'
    },
    steel_sword: {
        id: 'steel_sword', result: 'steel_sword', resultQty: 1,
        ingredients: [{ item: 'steel_ingot', qty: 3 }, { item: 'leather', qty: 2 }],
        station: 'forge', level: 8, xp: 50, time: 15,
        category: 'weaponcraft'
    },
    hunting_bow: {
        id: 'hunting_bow', result: 'hunting_bow', resultQty: 1,
        ingredients: [{ item: 'wood', qty: 4 }, { item: 'silk', qty: 1 }],
        station: 'workbench', level: 2, xp: 15, time: 8,
        category: 'weaponcraft'
    },
    crystal_staff: {
        id: 'crystal_staff', result: 'crystal_staff', resultQty: 1,
        ingredients: [{ item: 'enchanted_wood', qty: 3 }, { item: 'crystal', qty: 5 }],
        station: 'enchanting', level: 10, xp: 60, time: 15,
        category: 'weaponcraft'
    },
    enchanted_bow: {
        id: 'enchanted_bow', result: 'enchanted_bow', resultQty: 1,
        ingredients: [{ item: 'enchanted_wood', qty: 3 }, { item: 'silk', qty: 3 }, { item: 'crystal', qty: 2 }],
        station: 'enchanting', level: 12, xp: 70, time: 18,
        category: 'weaponcraft'
    },
    dragon_blade: {
        id: 'dragon_blade', result: 'dragon_blade', resultQty: 1,
        ingredients: [{ item: 'dragon_scale', qty: 5 }, { item: 'steel_ingot', qty: 5 }, { item: 'ruby', qty: 2 }],
        station: 'forge', level: 18, xp: 150, time: 30,
        category: 'weaponcraft'
    },
    void_scythe: {
        id: 'void_scythe', result: 'void_scythe', resultQty: 1,
        ingredients: [{ item: 'void_essence', qty: 10 }, { item: 'mithril_ore', qty: 5 }, { item: 'diamond', qty: 3 }],
        station: 'forge', level: 25, xp: 300, time: 60,
        category: 'weaponcraft'
    },

    // === ARMOR ===
    leather_armor: {
        id: 'leather_armor', result: 'leather_armor', resultQty: 1,
        ingredients: [{ item: 'leather', qty: 5 }],
        station: 'workbench', level: 1, xp: 10, time: 5,
        category: 'armorcraft'
    },
    iron_armor: {
        id: 'iron_armor', result: 'iron_armor', resultQty: 1,
        ingredients: [{ item: 'iron_ingot', qty: 5 }, { item: 'leather', qty: 3 }],
        station: 'forge', level: 4, xp: 30, time: 12,
        category: 'armorcraft'
    },
    steel_armor: {
        id: 'steel_armor', result: 'steel_armor', resultQty: 1,
        ingredients: [{ item: 'steel_ingot', qty: 5 }, { item: 'leather', qty: 3 }],
        station: 'forge', level: 9, xp: 55, time: 18,
        category: 'armorcraft'
    },
    silk_robe: {
        id: 'silk_robe', result: 'silk_robe', resultQty: 1,
        ingredients: [{ item: 'silk', qty: 5 }, { item: 'moonflower', qty: 2 }],
        station: 'workbench', level: 6, xp: 35, time: 10,
        category: 'armorcraft'
    },
    mithril_armor: {
        id: 'mithril_armor', result: 'mithril_armor', resultQty: 1,
        ingredients: [{ item: 'mithril_ore', qty: 8 }, { item: 'silk', qty: 3 }, { item: 'sapphire', qty: 2 }],
        station: 'forge', level: 20, xp: 180, time: 35,
        category: 'armorcraft'
    },
    dragon_armor: {
        id: 'dragon_armor', result: 'dragon_armor', resultQty: 1,
        ingredients: [{ item: 'dragon_scale', qty: 10 }, { item: 'mithril_ore', qty: 5 }, { item: 'diamond', qty: 2 }],
        station: 'forge', level: 25, xp: 300, time: 60,
        category: 'armorcraft'
    },

    // === ACCESSORIES ===
    copper_ring: {
        id: 'copper_ring', result: 'copper_ring', resultQty: 1,
        ingredients: [{ item: 'copper_ore', qty: 3 }],
        station: 'workbench', level: 1, xp: 8, time: 3,
        category: 'jewelry'
    },
    silver_necklace: {
        id: 'silver_necklace', result: 'silver_necklace', resultQty: 1,
        ingredients: [{ item: 'silver_ore', qty: 3 }, { item: 'silk', qty: 1 }],
        station: 'workbench', level: 5, xp: 25, time: 8,
        category: 'jewelry'
    },
    ruby_amulet: {
        id: 'ruby_amulet', result: 'ruby_amulet', resultQty: 1,
        ingredients: [{ item: 'gold_ore', qty: 2 }, { item: 'ruby', qty: 1 }],
        station: 'enchanting', level: 10, xp: 50, time: 12,
        category: 'jewelry'
    },
    lucky_charm: {
        id: 'lucky_charm', result: 'lucky_charm', resultQty: 1,
        ingredients: [{ item: 'crystal', qty: 2 }, { item: 'moonflower', qty: 3 }],
        station: 'enchanting', level: 7, xp: 30, time: 8,
        category: 'jewelry'
    },
    merchant_badge: {
        id: 'merchant_badge', result: 'merchant_badge', resultQty: 1,
        ingredients: [{ item: 'gold_ore', qty: 5 }, { item: 'diamond', qty: 1 }, { item: 'silk', qty: 2 }],
        station: 'enchanting', level: 15, xp: 80, time: 20,
        category: 'jewelry'
    },

    // === SCROLLS ===
    scroll_fire: {
        id: 'scroll_fire', result: 'scroll_fire', resultQty: 1,
        ingredients: [{ item: 'cloth', qty: 1 }, { item: 'ruby', qty: 1 }],
        station: 'enchanting', level: 5, xp: 20, time: 5,
        category: 'enchanting'
    },
    scroll_ice: {
        id: 'scroll_ice', result: 'scroll_ice', resultQty: 1,
        ingredients: [{ item: 'cloth', qty: 1 }, { item: 'sapphire', qty: 1 }],
        station: 'enchanting', level: 5, xp: 20, time: 5,
        category: 'enchanting'
    },

    // === TOOLS ===
    pickaxe: {
        id: 'pickaxe', result: 'pickaxe', resultQty: 1,
        ingredients: [{ item: 'iron_ingot', qty: 2 }, { item: 'wood', qty: 3 }],
        station: 'forge', level: 2, xp: 12, time: 5,
        category: 'tools'
    },
    golden_pickaxe: {
        id: 'golden_pickaxe', result: 'golden_pickaxe', resultQty: 1,
        ingredients: [{ item: 'gold_ore', qty: 5 }, { item: 'enchanted_wood', qty: 2 }],
        station: 'forge', level: 12, xp: 60, time: 15,
        category: 'tools'
    },
    herb_pouch: {
        id: 'herb_pouch', result: 'herb_pouch', resultQty: 1,
        ingredients: [{ item: 'leather', qty: 3 }, { item: 'silk', qty: 1 }],
        station: 'workbench', level: 2, xp: 10, time: 3,
        category: 'tools'
    },
};

const CraftingStations = {
    workbench: { name: 'Workbench', icon: '🔨', unlockCost: 0, description: 'Basic crafting station.' },
    forge: { name: 'Forge', icon: '🔥', unlockCost: 200, description: 'For smelting and metalwork.' },
    alchemy: { name: 'Alchemy Lab', icon: '⚗', unlockCost: 300, description: 'Brew potions and elixirs.' },
    kitchen: { name: 'Kitchen', icon: '🍳', unlockCost: 150, description: 'Cook food for buffs.' },
    enchanting: { name: 'Enchanting Table', icon: '✨', unlockCost: 500, description: 'Create magical items.' },
};
