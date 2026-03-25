// Exploration areas
const AreaDB = {
    whispering_woods: {
        id: 'whispering_woods', name: 'Whispering Woods',
        description: 'A peaceful forest teeming with basic resources.',
        icon: '🌲', color: '#2d5a2d',
        unlockLevel: 1, staminaCost: 10, difficulty: 1,
        enemies: ['forest_slime', 'wild_boar', 'treant'],
        gatherables: [
            { item: 'wood', chance: 0.5, qty: [1, 3] },
            { item: 'herb', chance: 0.4, qty: [1, 2] },
            { item: 'leather', chance: 0.2, qty: [1, 1] },
            { item: 'moonflower', chance: 0.03, qty: [1, 1] }
        ],
        encounterRate: 0.4,
        explorationEvents: ['found_chest', 'herb_patch', 'old_camp', 'hidden_path'],
        floors: 5, bossFloor: 5
    },
    sunlit_meadow: {
        id: 'sunlit_meadow', name: 'Sunlit Meadow',
        description: 'Rolling fields of golden grass and wildflowers.',
        icon: '🌻', color: '#8a7a2d',
        unlockLevel: 3, staminaCost: 12, difficulty: 2,
        enemies: ['flower_sprite', 'giant_bee', 'meadow_golem'],
        gatherables: [
            { item: 'herb', chance: 0.5, qty: [1, 3] },
            { item: 'cloth', chance: 0.3, qty: [1, 2] },
            { item: 'copper_ore', chance: 0.2, qty: [1, 2] },
            { item: 'moonflower', chance: 0.06, qty: [1, 1] }
        ],
        encounterRate: 0.35,
        explorationEvents: ['found_chest', 'flower_field', 'traveler', 'ancient_shrine'],
        floors: 6, bossFloor: 6
    },
    rocky_hills: {
        id: 'rocky_hills', name: 'Rocky Hills',
        description: 'Rugged terrain rich in minerals and ore.',
        icon: '⛰', color: '#6b5b3d',
        unlockLevel: 5, staminaCost: 15, difficulty: 3,
        enemies: ['rock_lizard', 'mountain_wolf', 'stone_giant'],
        gatherables: [
            { item: 'stone', chance: 0.5, qty: [1, 4] },
            { item: 'iron_ore', chance: 0.3, qty: [1, 2] },
            { item: 'copper_ore', chance: 0.3, qty: [1, 2] },
            { item: 'leather', chance: 0.2, qty: [1, 2] }
        ],
        encounterRate: 0.45,
        explorationEvents: ['mine_entrance', 'avalanche', 'hermit', 'ore_vein'],
        floors: 7, bossFloor: 7
    },
    crystal_caves: {
        id: 'crystal_caves', name: 'Crystal Caves',
        description: 'Glittering underground caverns filled with crystals.',
        icon: '💎', color: '#3d5a7a',
        unlockLevel: 8, staminaCost: 18, difficulty: 4,
        enemies: ['crystal_bat', 'cave_spider', 'crystal_guardian'],
        gatherables: [
            { item: 'crystal', chance: 0.3, qty: [1, 2] },
            { item: 'silver_ore', chance: 0.2, qty: [1, 2] },
            { item: 'silk', chance: 0.15, qty: [1, 1] },
            { item: 'ruby', chance: 0.05, qty: [1, 1] },
            { item: 'sapphire', chance: 0.05, qty: [1, 1] }
        ],
        encounterRate: 0.5,
        explorationEvents: ['crystal_formation', 'underground_lake', 'echo_chamber', 'gem_vein'],
        floors: 8, bossFloor: 8
    },
    enchanted_glade: {
        id: 'enchanted_glade', name: 'Enchanted Glade',
        description: 'A mystical forest where magic flows freely.',
        icon: '🌙', color: '#4a2d7a',
        unlockLevel: 12, staminaCost: 22, difficulty: 5,
        enemies: ['pixie', 'unicorn', 'fae_queen'],
        gatherables: [
            { item: 'moonflower', chance: 0.3, qty: [1, 3] },
            { item: 'enchanted_wood', chance: 0.25, qty: [1, 2] },
            { item: 'silk', chance: 0.2, qty: [1, 2] },
            { item: 'emerald', chance: 0.05, qty: [1, 1] }
        ],
        encounterRate: 0.45,
        explorationEvents: ['fairy_ring', 'moonwell', 'enchanted_tree', 'magic_spring'],
        floors: 10, bossFloor: 10
    },
    dwarven_mines: {
        id: 'dwarven_mines', name: 'Dwarven Mines',
        description: 'Ancient mines filled with precious metals and dangers.',
        icon: '⛏', color: '#5a3d1e',
        unlockLevel: 16, staminaCost: 25, difficulty: 6,
        enemies: ['mine_rat', 'dwarf_ghost', 'mine_boss'],
        gatherables: [
            { item: 'iron_ore', chance: 0.4, qty: [2, 4] },
            { item: 'silver_ore', chance: 0.3, qty: [1, 3] },
            { item: 'gold_ore', chance: 0.15, qty: [1, 2] },
            { item: 'mithril_ore', chance: 0.03, qty: [1, 1] },
            { item: 'diamond', chance: 0.02, qty: [1, 1] }
        ],
        encounterRate: 0.5,
        explorationEvents: ['ore_vein', 'collapsed_tunnel', 'dwarven_forge', 'treasure_room'],
        floors: 12, bossFloor: 12
    },
    haunted_ruins: {
        id: 'haunted_ruins', name: 'Haunted Ruins',
        description: 'Crumbling ruins filled with restless undead.',
        icon: '🏚', color: '#3d3d3d',
        unlockLevel: 20, staminaCost: 28, difficulty: 7,
        enemies: ['skeleton', 'wraith', 'lich'],
        gatherables: [
            { item: 'ancient_bone', chance: 0.3, qty: [1, 3] },
            { item: 'void_essence', chance: 0.05, qty: [1, 1] },
            { item: 'gold_ore', chance: 0.15, qty: [1, 2] },
            { item: 'crystal', chance: 0.1, qty: [1, 2] }
        ],
        encounterRate: 0.55,
        explorationEvents: ['ancient_tomb', 'cursed_altar', 'ghost_merchant', 'hidden_library'],
        floors: 14, bossFloor: 14
    },
    dragon_peak: {
        id: 'dragon_peak', name: 'Dragon Peak',
        description: 'The volcanic home of ancient dragons.',
        icon: '🌋', color: '#8a2d1e',
        unlockLevel: 25, staminaCost: 32, difficulty: 8,
        enemies: ['wyvern', 'fire_elemental', 'ancient_dragon'],
        gatherables: [
            { item: 'dragon_scale', chance: 0.1, qty: [1, 1] },
            { item: 'ruby', chance: 0.15, qty: [1, 2] },
            { item: 'mithril_ore', chance: 0.1, qty: [1, 2] },
            { item: 'phoenix_feather', chance: 0.02, qty: [1, 1] }
        ],
        encounterRate: 0.6,
        explorationEvents: ['dragon_nest', 'lava_pool', 'ancient_shrine', 'treasure_hoard'],
        floors: 16, bossFloor: 16
    },
    void_depths: {
        id: 'void_depths', name: 'Void Depths',
        description: 'The space between worlds. Only the strongest survive.',
        icon: '🌑', color: '#1a0a2e',
        unlockLevel: 30, staminaCost: 40, difficulty: 10,
        enemies: ['void_wisp', 'eldritch_horror', 'void_lord'],
        gatherables: [
            { item: 'void_essence', chance: 0.3, qty: [1, 3] },
            { item: 'diamond', chance: 0.1, qty: [1, 2] },
            { item: 'phoenix_feather', chance: 0.05, qty: [1, 1] },
            { item: 'mithril_ore', chance: 0.15, qty: [1, 2] }
        ],
        encounterRate: 0.65,
        explorationEvents: ['void_rift', 'reality_fragment', 'lost_traveler', 'cosmic_forge'],
        floors: 20, bossFloor: 20
    }
};
