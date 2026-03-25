// Quest system
const QuestType = {
    MAIN: 'main',
    SIDE: 'side',
    DAILY: 'daily',
    ACHIEVEMENT: 'achievement'
};

const QuestDB = {
    // === MAIN QUESTS ===
    first_sale: {
        id: 'first_sale', name: 'First Steps', type: QuestType.MAIN,
        description: 'Sell your first item to a customer.',
        objectives: [{ type: 'sell', count: 1 }],
        rewards: { gold: 50, xp: 20 },
        unlocks: ['learn_crafting'], chapter: 1
    },
    learn_crafting: {
        id: 'learn_crafting', name: 'The Art of Crafting', type: QuestType.MAIN,
        description: 'Craft your first item at the workbench.',
        objectives: [{ type: 'craft', count: 1 }],
        rewards: { gold: 100, xp: 30 },
        unlocks: ['first_expedition'], chapter: 1
    },
    first_expedition: {
        id: 'first_expedition', name: 'Into the Wild', type: QuestType.MAIN,
        description: 'Complete your first exploration in Whispering Woods.',
        objectives: [{ type: 'explore', area: 'whispering_woods', count: 1 }],
        rewards: { gold: 150, xp: 50, items: [{ id: 'iron_sword', qty: 1 }] },
        unlocks: ['supply_demand'], chapter: 1
    },
    supply_demand: {
        id: 'supply_demand', name: 'Supply and Demand', type: QuestType.MAIN,
        description: 'Earn 500 gold from selling items.',
        objectives: [{ type: 'earnGold', count: 500 }],
        rewards: { gold: 200, xp: 80 },
        unlocks: ['expand_shop'], chapter: 2
    },
    expand_shop: {
        id: 'expand_shop', name: 'Growing Business', type: QuestType.MAIN,
        description: 'Unlock the Forge crafting station.',
        objectives: [{ type: 'unlockStation', station: 'forge' }],
        rewards: { gold: 300, xp: 100, skillPoints: 1 },
        unlocks: ['deeper_exploration'], chapter: 2
    },
    deeper_exploration: {
        id: 'deeper_exploration', name: 'Deeper Exploration', type: QuestType.MAIN,
        description: 'Reach floor 5 of Rocky Hills.',
        objectives: [{ type: 'reachFloor', area: 'rocky_hills', floor: 5 }],
        rewards: { gold: 500, xp: 200 },
        unlocks: ['crystal_quest'], chapter: 3
    },
    crystal_quest: {
        id: 'crystal_quest', name: 'Crystal Clear', type: QuestType.MAIN,
        description: 'Defeat the Crystal Guardian.',
        objectives: [{ type: 'defeatBoss', boss: 'crystal_guardian' }],
        rewards: { gold: 800, xp: 400, items: [{ id: 'crystal', qty: 10 }] },
        unlocks: ['enchantment_path'], chapter: 3
    },
    enchantment_path: {
        id: 'enchantment_path', name: 'The Path of Enchantment', type: QuestType.MAIN,
        description: 'Unlock the Enchanting Table and craft a magical item.',
        objectives: [
            { type: 'unlockStation', station: 'enchanting' },
            { type: 'craftCategory', category: 'enchanting', count: 1 }
        ],
        rewards: { gold: 1000, xp: 500, skillPoints: 2 },
        unlocks: ['dragon_challenge'], chapter: 4
    },
    dragon_challenge: {
        id: 'dragon_challenge', name: 'Dragon\'s Challenge', type: QuestType.MAIN,
        description: 'Defeat the Ancient Dragon on Dragon Peak.',
        objectives: [{ type: 'defeatBoss', boss: 'ancient_dragon' }],
        rewards: { gold: 3000, xp: 1500, items: [{ id: 'dragon_scale', qty: 10 }] },
        unlocks: ['void_beckons'], chapter: 5
    },
    void_beckons: {
        id: 'void_beckons', name: 'The Void Beckons', type: QuestType.MAIN,
        description: 'Defeat the Void Lord and save reality.',
        objectives: [{ type: 'defeatBoss', boss: 'void_lord' }],
        rewards: { gold: 10000, xp: 5000, items: [{ id: 'crown_of_commerce', qty: 1 }] },
        unlocks: [], chapter: 6, finalQuest: true
    },

    // === SIDE QUESTS ===
    herbalist: {
        id: 'herbalist', name: 'Herbalist\'s Request', type: QuestType.SIDE,
        description: 'Deliver 10 Wild Herbs.',
        objectives: [{ type: 'deliver', item: 'herb', count: 10 }],
        rewards: { gold: 50, xp: 30, reputation: 5 },
        repeatable: true, cooldown: 5
    },
    ore_collector: {
        id: 'ore_collector', name: 'Ore Collection', type: QuestType.SIDE,
        description: 'Deliver 5 Iron Ore.',
        objectives: [{ type: 'deliver', item: 'iron_ore', count: 5 }],
        rewards: { gold: 80, xp: 40, reputation: 5 },
        repeatable: true, cooldown: 5
    },
    potion_master: {
        id: 'potion_master', name: 'Potion Orders', type: QuestType.SIDE,
        description: 'Craft and deliver 5 Health Potions.',
        objectives: [{ type: 'deliver', item: 'health_potion', count: 5 }],
        rewards: { gold: 120, xp: 60, reputation: 8 },
        repeatable: true, cooldown: 7
    },
    rare_gem: {
        id: 'rare_gem', name: 'Rare Gem Hunt', type: QuestType.SIDE,
        description: 'Find and deliver a Ruby.',
        objectives: [{ type: 'deliver', item: 'ruby', count: 1 }],
        rewards: { gold: 200, xp: 100, reputation: 10 },
        repeatable: true, cooldown: 10
    },
    weapon_order: {
        id: 'weapon_order', name: 'Weapon Commission', type: QuestType.SIDE,
        description: 'Craft and deliver a Steel Sword.',
        objectives: [{ type: 'deliver', item: 'steel_sword', count: 1 }],
        rewards: { gold: 300, xp: 150, reputation: 15 },
        repeatable: true, cooldown: 10
    },

    // === ACHIEVEMENTS ===
    first_thousand: {
        id: 'first_thousand', name: 'First Thousand', type: QuestType.ACHIEVEMENT,
        description: 'Accumulate 1,000 gold.',
        objectives: [{ type: 'totalGold', count: 1000 }],
        rewards: { xp: 100, title: 'Budding Merchant' }
    },
    ten_thousand: {
        id: 'ten_thousand', name: 'Big Spender', type: QuestType.ACHIEVEMENT,
        description: 'Accumulate 10,000 gold.',
        objectives: [{ type: 'totalGold', count: 10000 }],
        rewards: { xp: 500, title: 'Prosperous Merchant' }
    },
    hundred_thousand: {
        id: 'hundred_thousand', name: 'Gold Tycoon', type: QuestType.ACHIEVEMENT,
        description: 'Accumulate 100,000 gold.',
        objectives: [{ type: 'totalGold', count: 100000 }],
        rewards: { xp: 2000, title: 'Gold Tycoon' }
    },
    craft_master: {
        id: 'craft_master', name: 'Craft Master', type: QuestType.ACHIEVEMENT,
        description: 'Craft 100 items.',
        objectives: [{ type: 'totalCrafts', count: 100 }],
        rewards: { xp: 300, title: 'Master Crafter' }
    },
    dragon_slayer: {
        id: 'dragon_slayer', name: 'Dragon Slayer', type: QuestType.ACHIEVEMENT,
        description: 'Defeat the Ancient Dragon.',
        objectives: [{ type: 'defeatBoss', boss: 'ancient_dragon' }],
        rewards: { xp: 1000, title: 'Dragon Slayer' }
    },
    void_conqueror: {
        id: 'void_conqueror', name: 'Void Conqueror', type: QuestType.ACHIEVEMENT,
        description: 'Defeat the Void Lord.',
        objectives: [{ type: 'defeatBoss', boss: 'void_lord' }],
        rewards: { xp: 5000, title: 'Void Conqueror' }
    },
    hundred_sales: {
        id: 'hundred_sales', name: 'Hundred Sales', type: QuestType.ACHIEVEMENT,
        description: 'Complete 100 sales.',
        objectives: [{ type: 'totalSales', count: 100 }],
        rewards: { xp: 200, title: 'Seasoned Merchant' }
    },
    explorer_supreme: {
        id: 'explorer_supreme', name: 'Explorer Supreme', type: QuestType.ACHIEVEMENT,
        description: 'Explore all 9 areas.',
        objectives: [{ type: 'exploreAllAreas', count: 9 }],
        rewards: { xp: 1000, title: 'World Explorer' }
    }
};
