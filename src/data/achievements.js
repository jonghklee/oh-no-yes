// Achievement system
const AchievementCategory = {
    TRADING: 'trading',
    COMBAT: 'combat',
    CRAFTING: 'crafting',
    EXPLORATION: 'exploration',
    COLLECTION: 'collection',
    PROGRESSION: 'progression',
    SECRET: 'secret'
};

const AchievementDB = {
    // =============================================
    // === TRADING (15) ===
    // =============================================
    first_sale: {
        id: 'first_sale', name: 'First Sale', icon: '🪙',
        description: 'Complete your very first sale.',
        category: AchievementCategory.TRADING, hidden: false,
        condition: { type: 'totalSales', value: 1 },
        reward: { gold: 25, xp: 10 }
    },
    hundred_sales: {
        id: 'hundred_sales', name: 'Retail Therapy', icon: '🛒',
        description: 'Complete 100 sales.',
        category: AchievementCategory.TRADING, hidden: false,
        condition: { type: 'totalSales', value: 100 },
        reward: { gold: 500, xp: 200 }
    },
    thousand_sales: {
        id: 'thousand_sales', name: 'Sales Machine', icon: '🏪',
        description: 'Complete 1,000 sales.',
        category: AchievementCategory.TRADING, hidden: false,
        condition: { type: 'totalSales', value: 1000 },
        reward: { gold: 2000, xp: 1000, title: 'Sales Machine' }
    },
    earn_1k_gold: {
        id: 'earn_1k_gold', name: 'Pocket Change', icon: '💰',
        description: 'Earn a total of 1,000 gold.',
        category: AchievementCategory.TRADING, hidden: false,
        condition: { type: 'totalGoldEarned', value: 1000 },
        reward: { gold: 100, xp: 50 }
    },
    earn_10k_gold: {
        id: 'earn_10k_gold', name: 'Prosperous', icon: '💰',
        description: 'Earn a total of 10,000 gold.',
        category: AchievementCategory.TRADING, hidden: false,
        condition: { type: 'totalGoldEarned', value: 10000 },
        reward: { gold: 500, xp: 250, title: 'Prosperous Merchant' }
    },
    earn_100k_gold: {
        id: 'earn_100k_gold', name: 'Gold Tycoon', icon: '👑',
        description: 'Earn a total of 100,000 gold.',
        category: AchievementCategory.TRADING, hidden: false,
        condition: { type: 'totalGoldEarned', value: 100000 },
        reward: { gold: 2000, xp: 1000, title: 'Gold Tycoon' }
    },
    earn_1m_gold: {
        id: 'earn_1m_gold', name: 'Millionaire', icon: '💎',
        description: 'Earn a total of 1,000,000 gold.',
        category: AchievementCategory.TRADING, hidden: false,
        condition: { type: 'totalGoldEarned', value: 1000000 },
        reward: { gold: 10000, xp: 5000, title: 'Millionaire Merchant' }
    },
    master_haggler: {
        id: 'master_haggler', name: 'Master Haggler', icon: '🤝',
        description: 'Successfully haggle 50 times.',
        category: AchievementCategory.TRADING, hidden: false,
        condition: { type: 'totalHaggles', value: 50 },
        reward: { gold: 300, xp: 150, title: 'Master Haggler' }
    },
    tax_free_day: {
        id: 'tax_free_day', name: 'Tax Free Day', icon: '📜',
        description: 'Earn 1,000 gold in a single day without paying any taxes.',
        category: AchievementCategory.TRADING, hidden: false,
        condition: { type: 'taxFreeDayGold', value: 1000 },
        reward: { gold: 500, xp: 200 }
    },
    sell_legendary: {
        id: 'sell_legendary', name: 'Legendary Dealer', icon: '⭐',
        description: 'Sell a Legendary quality item.',
        category: AchievementCategory.TRADING, hidden: false,
        condition: { type: 'sellItemQuality', value: 'legendary' },
        reward: { gold: 1000, xp: 500, title: 'Legendary Dealer' }
    },
    full_display: {
        id: 'full_display', name: 'Full Display', icon: '🗄️',
        description: 'Have every display slot in your shop filled with items.',
        category: AchievementCategory.TRADING, hidden: false,
        condition: { type: 'fullDisplay', value: true },
        reward: { gold: 200, xp: 100 }
    },
    noble_customer: {
        id: 'noble_customer', name: 'Noble Customer', icon: '🎩',
        description: 'Serve a Noble-tier customer.',
        category: AchievementCategory.TRADING, hidden: false,
        condition: { type: 'serveCustomerTier', value: 'noble' },
        reward: { gold: 300, xp: 150 }
    },
    royal_customer: {
        id: 'royal_customer', name: 'Royal Patronage', icon: '👸',
        description: 'Serve a Royal-tier customer.',
        category: AchievementCategory.TRADING, hidden: false,
        condition: { type: 'serveCustomerTier', value: 'royal' },
        reward: { gold: 1000, xp: 500, title: 'Royal Supplier' }
    },
    market_crash_survivor: {
        id: 'market_crash_survivor', name: 'Market Crash Survivor', icon: '📉',
        description: 'Maintain positive gold balance through a market crash event.',
        category: AchievementCategory.TRADING, hidden: false,
        condition: { type: 'surviveMarketCrash', value: true },
        reward: { gold: 500, xp: 250 }
    },
    buy_low_sell_high: {
        id: 'buy_low_sell_high', name: 'Buy Low Sell High', icon: '📊',
        description: 'Sell an item for at least 3x its purchase price.',
        category: AchievementCategory.TRADING, hidden: false,
        condition: { type: 'profitMultiplier', value: 3 },
        reward: { gold: 200, xp: 100 }
    },

    // =============================================
    // === COMBAT (15) ===
    // =============================================
    first_blood: {
        id: 'first_blood', name: 'First Blood', icon: '⚔️',
        description: 'Defeat your first enemy.',
        category: AchievementCategory.COMBAT, hidden: false,
        condition: { type: 'totalKills', value: 1 },
        reward: { gold: 25, xp: 15 }
    },
    hundred_kills: {
        id: 'hundred_kills', name: 'Warrior', icon: '🗡️',
        description: 'Defeat 100 enemies.',
        category: AchievementCategory.COMBAT, hidden: false,
        condition: { type: 'totalKills', value: 100 },
        reward: { gold: 500, xp: 250 }
    },
    thousand_kills: {
        id: 'thousand_kills', name: 'Slaughter Machine', icon: '💀',
        description: 'Defeat 1,000 enemies.',
        category: AchievementCategory.COMBAT, hidden: false,
        condition: { type: 'totalKills', value: 1000 },
        reward: { gold: 2000, xp: 1000, title: 'Slaughter Machine' }
    },
    beat_crystal_guardian: {
        id: 'beat_crystal_guardian', name: 'Crystal Breaker', icon: '💎',
        description: 'Defeat the Crystal Guardian.',
        category: AchievementCategory.COMBAT, hidden: false,
        condition: { type: 'defeatBoss', value: 'crystal_guardian' },
        reward: { gold: 500, xp: 300 }
    },
    beat_forest_king: {
        id: 'beat_forest_king', name: 'Dethroned', icon: '🌿',
        description: 'Defeat the Forest King.',
        category: AchievementCategory.COMBAT, hidden: false,
        condition: { type: 'defeatBoss', value: 'forest_king' },
        reward: { gold: 400, xp: 200 }
    },
    beat_ancient_dragon: {
        id: 'beat_ancient_dragon', name: 'Dragon Slayer', icon: '🐉',
        description: 'Defeat the Ancient Dragon.',
        category: AchievementCategory.COMBAT, hidden: false,
        condition: { type: 'defeatBoss', value: 'ancient_dragon' },
        reward: { gold: 2000, xp: 1000, title: 'Dragon Slayer' }
    },
    beat_void_lord: {
        id: 'beat_void_lord', name: 'Void Conqueror', icon: '🌀',
        description: 'Defeat the Void Lord.',
        category: AchievementCategory.COMBAT, hidden: false,
        condition: { type: 'defeatBoss', value: 'void_lord' },
        reward: { gold: 5000, xp: 3000, title: 'Void Conqueror' }
    },
    beat_ice_queen: {
        id: 'beat_ice_queen', name: 'Ice Breaker', icon: '❄️',
        description: 'Defeat the Ice Queen.',
        category: AchievementCategory.COMBAT, hidden: false,
        condition: { type: 'defeatBoss', value: 'ice_queen' },
        reward: { gold: 1000, xp: 500 }
    },
    flawless_victory: {
        id: 'flawless_victory', name: 'Flawless Victory', icon: '✨',
        description: 'Defeat a boss without taking any damage.',
        category: AchievementCategory.COMBAT, hidden: false,
        condition: { type: 'flawlessBoss', value: true },
        reward: { gold: 1500, xp: 750, title: 'Untouchable' }
    },
    counter_master: {
        id: 'counter_master', name: 'Counter Master', icon: '🔄',
        description: 'Successfully counter enemy attacks 10 times in a single battle.',
        category: AchievementCategory.COMBAT, hidden: false,
        condition: { type: 'countersInBattle', value: 10 },
        reward: { gold: 800, xp: 400, title: 'Counter Master' }
    },
    crit_streak: {
        id: 'crit_streak', name: 'Critical Cascade', icon: '💥',
        description: 'Land 5 critical hits in a row.',
        category: AchievementCategory.COMBAT, hidden: false,
        condition: { type: 'critStreak', value: 5 },
        reward: { gold: 600, xp: 300 }
    },
    survive_1hp: {
        id: 'survive_1hp', name: 'Death\'s Door', icon: '💔',
        description: 'Win a battle while at exactly 1 HP.',
        category: AchievementCategory.COMBAT, hidden: false,
        condition: { type: 'winAt1HP', value: true },
        reward: { gold: 1000, xp: 500, title: 'Death Defier' }
    },
    speed_run_boss: {
        id: 'speed_run_boss', name: 'Speed Runner', icon: '⏱️',
        description: 'Defeat a boss in fewer than 5 turns.',
        category: AchievementCategory.COMBAT, hidden: false,
        condition: { type: 'bossUnderTurns', value: 5 },
        reward: { gold: 1200, xp: 600, title: 'Speed Runner' }
    },
    lifesteal_kill: {
        id: 'lifesteal_kill', name: 'Vampiric Strike', icon: '🧛',
        description: 'Defeat an enemy while healing from lifesteal.',
        category: AchievementCategory.COMBAT, hidden: false,
        condition: { type: 'lifestealKill', value: true },
        reward: { gold: 400, xp: 200 }
    },
    beat_lava_titan: {
        id: 'beat_lava_titan', name: 'Titan Toppler', icon: '🌋',
        description: 'Defeat the Lava Titan.',
        category: AchievementCategory.COMBAT, hidden: false,
        condition: { type: 'defeatBoss', value: 'lava_titan' },
        reward: { gold: 1500, xp: 700 }
    },

    // =============================================
    // === CRAFTING (10) ===
    // =============================================
    first_craft: {
        id: 'first_craft', name: 'Apprentice Crafter', icon: '🔨',
        description: 'Craft your first item.',
        category: AchievementCategory.CRAFTING, hidden: false,
        condition: { type: 'totalCrafts', value: 1 },
        reward: { gold: 25, xp: 15 }
    },
    master_crafter: {
        id: 'master_crafter', name: 'Master Crafter', icon: '⚒️',
        description: 'Craft 100 items.',
        category: AchievementCategory.CRAFTING, hidden: false,
        condition: { type: 'totalCrafts', value: 100 },
        reward: { gold: 1000, xp: 500, title: 'Master Crafter' }
    },
    double_craft: {
        id: 'double_craft', name: 'Double or Nothing', icon: '✌️',
        description: 'Trigger the double craft bonus.',
        category: AchievementCategory.CRAFTING, hidden: false,
        condition: { type: 'doubleCraft', value: true },
        reward: { gold: 200, xp: 100 }
    },
    legendary_quality: {
        id: 'legendary_quality', name: 'Legendary Quality', icon: '🌟',
        description: 'Craft an item of Legendary quality.',
        category: AchievementCategory.CRAFTING, hidden: false,
        condition: { type: 'craftQuality', value: 'legendary' },
        reward: { gold: 1500, xp: 750, title: 'Legendary Artisan' }
    },
    unlock_all_stations: {
        id: 'unlock_all_stations', name: 'Fully Equipped', icon: '🏭',
        description: 'Unlock every crafting station.',
        category: AchievementCategory.CRAFTING, hidden: false,
        condition: { type: 'allStationsUnlocked', value: true },
        reward: { gold: 1000, xp: 500 }
    },
    craft_every_recipe: {
        id: 'craft_every_recipe', name: 'Recipe Completionist', icon: '📖',
        description: 'Craft at least one of every recipe.',
        category: AchievementCategory.CRAFTING, hidden: false,
        condition: { type: 'allRecipesCrafted', value: true },
        reward: { gold: 3000, xp: 1500, title: 'Recipe Completionist' }
    },
    max_crafting_level: {
        id: 'max_crafting_level', name: 'Grandmaster Smith', icon: '🏅',
        description: 'Reach the maximum crafting level.',
        category: AchievementCategory.CRAFTING, hidden: false,
        condition: { type: 'maxCraftingLevel', value: true },
        reward: { gold: 2000, xp: 1000, title: 'Grandmaster Smith' }
    },
    resource_saver: {
        id: 'resource_saver', name: 'Resource Saver', icon: '♻️',
        description: 'Trigger the resource-saving proc 50 times.',
        category: AchievementCategory.CRAFTING, hidden: false,
        condition: { type: 'resourceSaves', value: 50 },
        reward: { gold: 500, xp: 250 }
    },
    five_hundred_crafts: {
        id: 'five_hundred_crafts', name: 'Industrial Revolution', icon: '🏗️',
        description: 'Craft 500 items.',
        category: AchievementCategory.CRAFTING, hidden: false,
        condition: { type: 'totalCrafts', value: 500 },
        reward: { gold: 2500, xp: 1200 }
    },
    craft_without_fail: {
        id: 'craft_without_fail', name: 'Perfect Streak', icon: '🎯',
        description: 'Craft 20 items in a row without a failure.',
        category: AchievementCategory.CRAFTING, hidden: false,
        condition: { type: 'craftStreak', value: 20 },
        reward: { gold: 800, xp: 400 }
    },

    // =============================================
    // === EXPLORATION (10) ===
    // =============================================
    first_exploration: {
        id: 'first_exploration', name: 'First Steps Outside', icon: '🚶',
        description: 'Complete your first exploration.',
        category: AchievementCategory.EXPLORATION, hidden: false,
        condition: { type: 'totalExplorations', value: 1 },
        reward: { gold: 25, xp: 15 }
    },
    visit_all_areas: {
        id: 'visit_all_areas', name: 'World Traveler', icon: '🗺️',
        description: 'Visit every exploration area at least once.',
        category: AchievementCategory.EXPLORATION, hidden: false,
        condition: { type: 'allAreasVisited', value: true },
        reward: { gold: 1500, xp: 750, title: 'World Traveler' }
    },
    max_floor_all_areas: {
        id: 'max_floor_all_areas', name: 'Depth Plumber', icon: '⛏️',
        description: 'Reach the maximum floor in every exploration area.',
        category: AchievementCategory.EXPLORATION, hidden: false,
        condition: { type: 'allAreasMaxFloor', value: true },
        reward: { gold: 5000, xp: 2500, title: 'Depth Plumber' }
    },
    hundred_gathers: {
        id: 'hundred_gathers', name: 'Gathering Pro', icon: '🧺',
        description: 'Gather resources 100 times during exploration.',
        category: AchievementCategory.EXPLORATION, hidden: false,
        condition: { type: 'totalGathers', value: 100 },
        reward: { gold: 500, xp: 250 }
    },
    find_rare_item: {
        id: 'find_rare_item', name: 'Lucky Find', icon: '🍀',
        description: 'Discover a rare item during exploration.',
        category: AchievementCategory.EXPLORATION, hidden: false,
        condition: { type: 'findRareItem', value: true },
        reward: { gold: 300, xp: 150 }
    },
    boss_rush: {
        id: 'boss_rush', name: 'Boss Rush', icon: '💪',
        description: 'Defeat 3 different bosses in a single day.',
        category: AchievementCategory.EXPLORATION, hidden: false,
        condition: { type: 'bossesInOneDay', value: 3 },
        reward: { gold: 2000, xp: 1000, title: 'Boss Rusher' }
    },
    full_stamina_bar: {
        id: 'full_stamina_bar', name: 'Fully Rested', icon: '⚡',
        description: 'Reach the maximum stamina capacity.',
        category: AchievementCategory.EXPLORATION, hidden: false,
        condition: { type: 'maxStamina', value: true },
        reward: { gold: 400, xp: 200 }
    },
    speed_explorer: {
        id: 'speed_explorer', name: 'Speed Explorer', icon: '🏃',
        description: 'Clear an exploration area in under 30 seconds.',
        category: AchievementCategory.EXPLORATION, hidden: false,
        condition: { type: 'speedClear', value: 30 },
        reward: { gold: 600, xp: 300 }
    },
    five_hundred_gathers: {
        id: 'five_hundred_gathers', name: 'Hoarder', icon: '📦',
        description: 'Gather resources 500 times during exploration.',
        category: AchievementCategory.EXPLORATION, hidden: false,
        condition: { type: 'totalGathers', value: 500 },
        reward: { gold: 1500, xp: 750 }
    },
    survive_ambush: {
        id: 'survive_ambush', name: 'Ambush Survivor', icon: '🪤',
        description: 'Survive 10 ambush encounters during exploration.',
        category: AchievementCategory.EXPLORATION, hidden: false,
        condition: { type: 'ambushSurvivals', value: 10 },
        reward: { gold: 700, xp: 350 }
    },

    // =============================================
    // === COLLECTION (10) ===
    // =============================================
    own_10_unique: {
        id: 'own_10_unique', name: 'Budding Collector', icon: '📋',
        description: 'Own 10 unique items.',
        category: AchievementCategory.COLLECTION, hidden: false,
        condition: { type: 'uniqueItems', value: 10 },
        reward: { gold: 100, xp: 50 }
    },
    own_25_unique: {
        id: 'own_25_unique', name: 'Collector', icon: '📋',
        description: 'Own 25 unique items.',
        category: AchievementCategory.COLLECTION, hidden: false,
        condition: { type: 'uniqueItems', value: 25 },
        reward: { gold: 300, xp: 150 }
    },
    own_50_unique: {
        id: 'own_50_unique', name: 'Avid Collector', icon: '🏛️',
        description: 'Own 50 unique items.',
        category: AchievementCategory.COLLECTION, hidden: false,
        condition: { type: 'uniqueItems', value: 50 },
        reward: { gold: 800, xp: 400 }
    },
    own_100_unique: {
        id: 'own_100_unique', name: 'Museum Curator', icon: '🏛️',
        description: 'Own 100 unique items.',
        category: AchievementCategory.COLLECTION, hidden: false,
        condition: { type: 'uniqueItems', value: 100 },
        reward: { gold: 2000, xp: 1000, title: 'Museum Curator' }
    },
    full_equipment_set: {
        id: 'full_equipment_set', name: 'Matching Set', icon: '🛡️',
        description: 'Equip a full matching equipment set.',
        category: AchievementCategory.COLLECTION, hidden: false,
        condition: { type: 'fullEquipmentSet', value: true },
        reward: { gold: 500, xp: 250 }
    },
    gem_collector: {
        id: 'gem_collector', name: 'Gem Collector', icon: '💎',
        description: 'Collect at least one of every gem type.',
        category: AchievementCategory.COLLECTION, hidden: false,
        condition: { type: 'allGems', value: true },
        reward: { gold: 1500, xp: 750, title: 'Gem Connoisseur' }
    },
    material_hoarder: {
        id: 'material_hoarder', name: 'Material Hoarder', icon: '🧱',
        description: 'Have 100 of a single material in your inventory.',
        category: AchievementCategory.COLLECTION, hidden: false,
        condition: { type: 'singleMaterialCount', value: 100 },
        reward: { gold: 300, xp: 150 }
    },
    museum_complete: {
        id: 'museum_complete', name: 'Museum Complete', icon: '🏆',
        description: 'Discover every item in the game at least once.',
        category: AchievementCategory.COLLECTION, hidden: false,
        condition: { type: 'allItemsDiscovered', value: true },
        reward: { gold: 10000, xp: 5000, title: 'Grand Curator' }
    },
    full_inventory: {
        id: 'full_inventory', name: 'Packed Bags', icon: '🎒',
        description: 'Completely fill your inventory.',
        category: AchievementCategory.COLLECTION, hidden: false,
        condition: { type: 'fullInventory', value: true },
        reward: { gold: 200, xp: 100 }
    },
    rare_material_stash: {
        id: 'rare_material_stash', name: 'Rare Stash', icon: '✨',
        description: 'Have 10 different rare materials in your inventory.',
        category: AchievementCategory.COLLECTION, hidden: false,
        condition: { type: 'rareMaterials', value: 10 },
        reward: { gold: 600, xp: 300 }
    },

    // =============================================
    // === PROGRESSION (10) ===
    // =============================================
    reach_level_10: {
        id: 'reach_level_10', name: 'Getting Started', icon: '📈',
        description: 'Reach level 10.',
        category: AchievementCategory.PROGRESSION, hidden: false,
        condition: { type: 'playerLevel', value: 10 },
        reward: { gold: 100, xp: 50 }
    },
    reach_level_25: {
        id: 'reach_level_25', name: 'Seasoned', icon: '📈',
        description: 'Reach level 25.',
        category: AchievementCategory.PROGRESSION, hidden: false,
        condition: { type: 'playerLevel', value: 25 },
        reward: { gold: 300, xp: 150 }
    },
    reach_level_50: {
        id: 'reach_level_50', name: 'Veteran', icon: '📈',
        description: 'Reach level 50.',
        category: AchievementCategory.PROGRESSION, hidden: false,
        condition: { type: 'playerLevel', value: 50 },
        reward: { gold: 1000, xp: 500, title: 'Veteran Merchant' }
    },
    reach_level_100: {
        id: 'reach_level_100', name: 'Centurion', icon: '🏅',
        description: 'Reach level 100.',
        category: AchievementCategory.PROGRESSION, hidden: false,
        condition: { type: 'playerLevel', value: 100 },
        reward: { gold: 5000, xp: 2500, title: 'Centurion' }
    },
    max_skill_tree: {
        id: 'max_skill_tree', name: 'Fully Skilled', icon: '🌳',
        description: 'Unlock every node in a single skill tree.',
        category: AchievementCategory.PROGRESSION, hidden: false,
        condition: { type: 'maxSkillTree', value: true },
        reward: { gold: 1500, xp: 750 }
    },
    all_skills_unlocked: {
        id: 'all_skills_unlocked', name: 'Omniscient', icon: '🧠',
        description: 'Unlock every skill across all skill trees.',
        category: AchievementCategory.PROGRESSION, hidden: false,
        condition: { type: 'allSkillsUnlocked', value: true },
        reward: { gold: 5000, xp: 2500, title: 'Omniscient' }
    },
    prestige_1: {
        id: 'prestige_1', name: 'New Beginnings', icon: '🔁',
        description: 'Prestige for the first time.',
        category: AchievementCategory.PROGRESSION, hidden: false,
        condition: { type: 'prestigeLevel', value: 1 },
        reward: { gold: 1000, xp: 500, title: 'Reborn' }
    },
    prestige_5: {
        id: 'prestige_5', name: 'Eternal Merchant', icon: '🔁',
        description: 'Reach prestige level 5.',
        category: AchievementCategory.PROGRESSION, hidden: false,
        condition: { type: 'prestigeLevel', value: 5 },
        reward: { gold: 5000, xp: 2500, title: 'Eternal Merchant' }
    },
    prestige_10: {
        id: 'prestige_10', name: 'Transcendent', icon: '🌌',
        description: 'Reach prestige level 10.',
        category: AchievementCategory.PROGRESSION, hidden: false,
        condition: { type: 'prestigeLevel', value: 10 },
        reward: { gold: 20000, xp: 10000, title: 'Transcendent' }
    },
    day_100: {
        id: 'day_100', name: 'Centenarian', icon: '📅',
        description: 'Survive 100 days in a single run.',
        category: AchievementCategory.PROGRESSION, hidden: false,
        condition: { type: 'day', value: 100 },
        reward: { gold: 1000, xp: 500 }
    },
    day_365: {
        id: 'day_365', name: 'One Full Year', icon: '📅',
        description: 'Survive 365 days in a single run.',
        category: AchievementCategory.PROGRESSION, hidden: false,
        condition: { type: 'day', value: 365 },
        reward: { gold: 5000, xp: 2500, title: 'Year One Merchant' }
    },

    // =============================================
    // === SECRET (10) ===
    // =============================================
    midnight_merchant: {
        id: 'midnight_merchant', name: '???', icon: '❓',
        description: 'Hidden achievement.',
        category: AchievementCategory.SECRET, hidden: true,
        revealedName: 'Midnight Merchant',
        revealedDescription: 'Open your shop at exactly midnight real-world time.',
        condition: { type: 'playAtMidnight', value: true },
        reward: { gold: 500, xp: 250, title: 'Midnight Merchant' }
    },
    sell_to_ghost: {
        id: 'sell_to_ghost', name: '???', icon: '❓',
        description: 'Hidden achievement.',
        category: AchievementCategory.SECRET, hidden: true,
        revealedName: 'Ghostly Transaction',
        revealedDescription: 'Sell an item to the mysterious ghost customer.',
        condition: { type: 'sellToGhost', value: true },
        reward: { gold: 1000, xp: 500, title: 'Ghost Whisperer' }
    },
    throw_away_fortune: {
        id: 'throw_away_fortune', name: '???', icon: '❓',
        description: 'Hidden achievement.',
        category: AchievementCategory.SECRET, hidden: true,
        revealedName: 'Easy Come Easy Go',
        revealedDescription: 'Lose 10,000 gold in a single transaction.',
        condition: { type: 'loseGoldSingle', value: 10000 },
        reward: { gold: 2000, xp: 1000 }
    },
    pet_all_pets: {
        id: 'pet_all_pets', name: '???', icon: '❓',
        description: 'Hidden achievement.',
        category: AchievementCategory.SECRET, hidden: true,
        revealedName: 'Animal Lover',
        revealedDescription: 'Pet every type of pet in the game.',
        condition: { type: 'petAllPets', value: true },
        reward: { gold: 500, xp: 250, title: 'Animal Lover' }
    },
    click_sign_100: {
        id: 'click_sign_100', name: '???', icon: '❓',
        description: 'Hidden achievement.',
        category: AchievementCategory.SECRET, hidden: true,
        revealedName: 'Sign Enthusiast',
        revealedDescription: 'Click on the shop sign 100 times.',
        condition: { type: 'clickSign', value: 100 },
        reward: { gold: 100, xp: 50 }
    },
    refuse_king: {
        id: 'refuse_king', name: '???', icon: '❓',
        description: 'Hidden achievement.',
        category: AchievementCategory.SECRET, hidden: true,
        revealedName: 'Defiant Merchant',
        revealedDescription: 'Refuse to sell an item to the King.',
        condition: { type: 'refuseKing', value: true },
        reward: { gold: 0, xp: 500, title: 'Defiant One' }
    },
    zero_gold_boss: {
        id: 'zero_gold_boss', name: '???', icon: '❓',
        description: 'Hidden achievement.',
        category: AchievementCategory.SECRET, hidden: true,
        revealedName: 'Penniless Victor',
        revealedDescription: 'Defeat a boss with 0 gold in your pocket.',
        condition: { type: 'beatBossNoGold', value: true },
        reward: { gold: 3000, xp: 1500, title: 'Penniless Victor' }
    },
    craft_on_holiday: {
        id: 'craft_on_holiday', name: '???', icon: '❓',
        description: 'Hidden achievement.',
        category: AchievementCategory.SECRET, hidden: true,
        revealedName: 'Holiday Crafter',
        revealedDescription: 'Craft an item on an in-game holiday.',
        condition: { type: 'craftOnHoliday', value: true },
        reward: { gold: 300, xp: 150 }
    },
    sell_starting_item: {
        id: 'sell_starting_item', name: '???', icon: '❓',
        description: 'Hidden achievement.',
        category: AchievementCategory.SECRET, hidden: true,
        revealedName: 'Sentimental Value',
        revealedDescription: 'Sell your very first starting item.',
        condition: { type: 'sellStartingItem', value: true },
        reward: { gold: 1, xp: 100 }
    },
    open_close_shop_10: {
        id: 'open_close_shop_10', name: '???', icon: '❓',
        description: 'Hidden achievement.',
        category: AchievementCategory.SECRET, hidden: true,
        revealedName: 'Indecisive',
        revealedDescription: 'Open and close your shop 10 times in a single day.',
        condition: { type: 'openCloseShop', value: 10 },
        reward: { gold: 50, xp: 50, title: 'Indecisive' }
    }
};

class AchievementSystem {
    constructor() {
        this.unlockedAchievements = new Set();
        this.achievementPoints = 0;
    }

    checkAchievement(id, gameState) {
        if (this.unlockedAchievements.has(id)) return false;
        const achievement = AchievementDB[id];
        if (!achievement) return false;

        const cond = achievement.condition;
        const gs = gameState;

        switch (cond.type) {
            case 'totalSales':
                return (gs.totalSales || 0) >= cond.value;
            case 'totalGoldEarned':
                return (gs.totalGoldEarned || 0) >= cond.value;
            case 'totalHaggles':
                return (gs.totalHaggles || 0) >= cond.value;
            case 'taxFreeDayGold':
                return (gs.taxFreeDayGold || 0) >= cond.value;
            case 'sellItemQuality':
                return (gs.soldQualities || []).includes(cond.value);
            case 'fullDisplay':
                return gs.fullDisplay === true;
            case 'serveCustomerTier':
                return (gs.servedCustomerTiers || []).includes(cond.value);
            case 'surviveMarketCrash':
                return gs.survivedMarketCrash === true;
            case 'profitMultiplier':
                return (gs.bestProfitMultiplier || 0) >= cond.value;
            case 'totalKills':
                return (gs.totalKills || 0) >= cond.value;
            case 'defeatBoss':
                return (gs.defeatedBosses || []).includes(cond.value);
            case 'flawlessBoss':
                return gs.flawlessBossVictory === true;
            case 'countersInBattle':
                return (gs.maxCountersInBattle || 0) >= cond.value;
            case 'critStreak':
                return (gs.maxCritStreak || 0) >= cond.value;
            case 'winAt1HP':
                return gs.wonAt1HP === true;
            case 'bossUnderTurns':
                return (gs.fastestBossTurns || Infinity) < cond.value;
            case 'lifestealKill':
                return gs.lifestealKill === true;
            case 'totalCrafts':
                return (gs.totalCrafts || 0) >= cond.value;
            case 'doubleCraft':
                return gs.triggeredDoubleCraft === true;
            case 'craftQuality':
                return (gs.craftedQualities || []).includes(cond.value);
            case 'allStationsUnlocked':
                return gs.allStationsUnlocked === true;
            case 'allRecipesCrafted':
                return gs.allRecipesCrafted === true;
            case 'maxCraftingLevel':
                return gs.maxCraftingLevel === true;
            case 'resourceSaves':
                return (gs.resourceSaves || 0) >= cond.value;
            case 'craftStreak':
                return (gs.maxCraftStreak || 0) >= cond.value;
            case 'totalExplorations':
                return (gs.totalExplorations || 0) >= cond.value;
            case 'allAreasVisited':
                return gs.allAreasVisited === true;
            case 'allAreasMaxFloor':
                return gs.allAreasMaxFloor === true;
            case 'totalGathers':
                return (gs.totalGathers || 0) >= cond.value;
            case 'findRareItem':
                return gs.foundRareItem === true;
            case 'bossesInOneDay':
                return (gs.bossesDefeatedToday || 0) >= cond.value;
            case 'maxStamina':
                return gs.maxStaminaReached === true;
            case 'speedClear':
                return (gs.fastestClearSeconds || Infinity) <= cond.value;
            case 'ambushSurvivals':
                return (gs.ambushSurvivals || 0) >= cond.value;
            case 'uniqueItems':
                return (gs.uniqueItemsOwned || 0) >= cond.value;
            case 'fullEquipmentSet':
                return gs.fullEquipmentSet === true;
            case 'allGems':
                return gs.allGemsCollected === true;
            case 'singleMaterialCount':
                return (gs.maxSingleMaterial || 0) >= cond.value;
            case 'allItemsDiscovered':
                return gs.allItemsDiscovered === true;
            case 'fullInventory':
                return gs.fullInventory === true;
            case 'rareMaterials':
                return (gs.rareMaterialTypes || 0) >= cond.value;
            case 'playerLevel':
                return (gs.playerLevel || 0) >= cond.value;
            case 'maxSkillTree':
                return gs.maxSkillTree === true;
            case 'allSkillsUnlocked':
                return gs.allSkillsUnlocked === true;
            case 'prestigeLevel':
                return (gs.prestigeLevel || 0) >= cond.value;
            case 'day':
                return (gs.day || 0) >= cond.value;
            case 'playAtMidnight':
                return gs.playedAtMidnight === true;
            case 'sellToGhost':
                return gs.soldToGhost === true;
            case 'loseGoldSingle':
                return (gs.maxGoldLostSingle || 0) >= cond.value;
            case 'petAllPets':
                return gs.pettedAllPets === true;
            case 'clickSign':
                return (gs.signClicks || 0) >= cond.value;
            case 'refuseKing':
                return gs.refusedKing === true;
            case 'beatBossNoGold':
                return gs.beatBossWithNoGold === true;
            case 'craftOnHoliday':
                return gs.craftedOnHoliday === true;
            case 'sellStartingItem':
                return gs.soldStartingItem === true;
            case 'openCloseShop':
                return (gs.openCloseShopToday || 0) >= cond.value;
            default:
                return false;
        }
    }

    checkAll(gameState) {
        const newlyUnlocked = [];
        for (const id of Object.keys(AchievementDB)) {
            if (this.checkAchievement(id, gameState)) {
                const result = this.unlock(id);
                if (result) {
                    newlyUnlocked.push(result);
                }
            }
        }
        return newlyUnlocked;
    }

    unlock(id) {
        if (this.unlockedAchievements.has(id)) return null;
        const achievement = AchievementDB[id];
        if (!achievement) return null;

        this.unlockedAchievements.add(id);
        this.achievementPoints += this._getPointValue(achievement);

        return {
            id: id,
            name: achievement.hidden ? (achievement.revealedName || achievement.name) : achievement.name,
            description: achievement.hidden ? (achievement.revealedDescription || achievement.description) : achievement.description,
            icon: achievement.icon,
            category: achievement.category,
            reward: achievement.reward
        };
    }

    _getPointValue(achievement) {
        switch (achievement.category) {
            case AchievementCategory.SECRET: return 15;
            case AchievementCategory.COMBAT: return 10;
            case AchievementCategory.EXPLORATION: return 10;
            case AchievementCategory.CRAFTING: return 10;
            case AchievementCategory.TRADING: return 10;
            case AchievementCategory.COLLECTION: return 10;
            case AchievementCategory.PROGRESSION: return 10;
            default: return 5;
        }
    }

    getProgress(id, gameState) {
        const achievement = AchievementDB[id];
        if (!achievement) return null;
        if (this.unlockedAchievements.has(id)) {
            return { current: 1, target: 1, percent: 100, complete: true };
        }

        const cond = achievement.condition;
        const gs = gameState;
        let current = 0;
        let target = 1;

        switch (cond.type) {
            case 'totalSales':
                current = gs.totalSales || 0; target = cond.value; break;
            case 'totalGoldEarned':
                current = gs.totalGoldEarned || 0; target = cond.value; break;
            case 'totalHaggles':
                current = gs.totalHaggles || 0; target = cond.value; break;
            case 'taxFreeDayGold':
                current = gs.taxFreeDayGold || 0; target = cond.value; break;
            case 'totalKills':
                current = gs.totalKills || 0; target = cond.value; break;
            case 'totalCrafts':
                current = gs.totalCrafts || 0; target = cond.value; break;
            case 'resourceSaves':
                current = gs.resourceSaves || 0; target = cond.value; break;
            case 'craftStreak':
                current = gs.maxCraftStreak || 0; target = cond.value; break;
            case 'totalExplorations':
                current = gs.totalExplorations || 0; target = cond.value; break;
            case 'totalGathers':
                current = gs.totalGathers || 0; target = cond.value; break;
            case 'ambushSurvivals':
                current = gs.ambushSurvivals || 0; target = cond.value; break;
            case 'uniqueItems':
                current = gs.uniqueItemsOwned || 0; target = cond.value; break;
            case 'rareMaterials':
                current = gs.rareMaterialTypes || 0; target = cond.value; break;
            case 'playerLevel':
                current = gs.playerLevel || 0; target = cond.value; break;
            case 'prestigeLevel':
                current = gs.prestigeLevel || 0; target = cond.value; break;
            case 'day':
                current = gs.day || 0; target = cond.value; break;
            case 'countersInBattle':
                current = gs.maxCountersInBattle || 0; target = cond.value; break;
            case 'critStreak':
                current = gs.maxCritStreak || 0; target = cond.value; break;
            case 'bossUnderTurns':
                current = gs.fastestBossTurns ? Math.max(0, cond.value - gs.fastestBossTurns) : 0; target = cond.value; break;
            case 'bossesInOneDay':
                current = gs.bossesDefeatedToday || 0; target = cond.value; break;
            case 'speedClear':
                current = gs.fastestClearSeconds ? Math.max(0, cond.value - gs.fastestClearSeconds) : 0; target = cond.value; break;
            case 'singleMaterialCount':
                current = gs.maxSingleMaterial || 0; target = cond.value; break;
            case 'profitMultiplier':
                current = gs.bestProfitMultiplier || 0; target = cond.value; break;
            case 'clickSign':
                current = gs.signClicks || 0; target = cond.value; break;
            case 'loseGoldSingle':
                current = gs.maxGoldLostSingle || 0; target = cond.value; break;
            case 'openCloseShop':
                current = gs.openCloseShopToday || 0; target = cond.value; break;
            default:
                // Boolean conditions: either done or not
                current = this.checkAchievement(id, gameState) ? 1 : 0;
                target = 1;
                break;
        }

        const percent = target > 0 ? Math.min(100, Math.floor((current / target) * 100)) : 0;
        return { current, target, percent, complete: false };
    }

    getTotalPoints() {
        return this.achievementPoints;
    }

    getAchievementsByCategory(category) {
        const results = [];
        for (const [id, ach] of Object.entries(AchievementDB)) {
            if (ach.category === category) {
                results.push({
                    ...ach,
                    unlocked: this.unlockedAchievements.has(id),
                    name: ach.hidden && !this.unlockedAchievements.has(id) ? '???' : (ach.revealedName || ach.name),
                    description: ach.hidden && !this.unlockedAchievements.has(id) ? 'Hidden achievement.' : (ach.revealedDescription || ach.description)
                });
            }
        }
        return results;
    }

    getUnlockedCount() {
        return this.unlockedAchievements.size;
    }

    getTotalCount() {
        return Object.keys(AchievementDB).length;
    }

    serialize() {
        return {
            unlockedAchievements: [...this.unlockedAchievements],
            achievementPoints: this.achievementPoints
        };
    }

    deserialize(data) {
        this.unlockedAchievements = new Set(data.unlockedAchievements || []);
        this.achievementPoints = data.achievementPoints || 0;
    }
}
