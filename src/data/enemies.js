// Enemy database
const EnemyDB = {
    // === WHISPERING WOODS ===
    forest_slime: {
        id: 'forest_slime', name: 'Forest Slime', icon: '🟢', area: 'whispering_woods',
        hp: 20, atk: 3, def: 1, speed: 2, xp: 5, gold: [2, 8],
        drops: [
            { item: 'herb', chance: 0.6, qty: [1, 2] },
            { item: 'wood', chance: 0.3, qty: [1, 1] }
        ],
        abilities: ['tackle'],
        description: 'A jiggly green blob.'
    },
    wild_boar: {
        id: 'wild_boar', name: 'Wild Boar', icon: '🐗', area: 'whispering_woods',
        hp: 35, atk: 6, def: 3, speed: 4, xp: 10, gold: [5, 15],
        drops: [
            { item: 'leather', chance: 0.5, qty: [1, 2] },
            { item: 'herb', chance: 0.3, qty: [1, 1] }
        ],
        abilities: ['tackle', 'charge'],
        description: 'A territorial wild boar.'
    },
    treant: {
        id: 'treant', name: 'Treant', icon: '🌳', area: 'whispering_woods',
        hp: 60, atk: 8, def: 8, speed: 1, xp: 20, gold: [10, 25],
        drops: [
            { item: 'wood', chance: 0.8, qty: [2, 5] },
            { item: 'enchanted_wood', chance: 0.1, qty: [1, 1] }
        ],
        abilities: ['slam', 'root'],
        description: 'A living tree, slow but sturdy.',
        miniBoss: true
    },

    // === SUNLIT MEADOW ===
    flower_sprite: {
        id: 'flower_sprite', name: 'Flower Sprite', icon: '🧚', area: 'sunlit_meadow',
        hp: 15, atk: 5, def: 1, speed: 8, xp: 8, gold: [3, 10],
        drops: [
            { item: 'herb', chance: 0.7, qty: [1, 3] },
            { item: 'moonflower', chance: 0.08, qty: [1, 1] }
        ],
        abilities: ['sparkle', 'heal'],
        description: 'A mischievous nature spirit.'
    },
    giant_bee: {
        id: 'giant_bee', name: 'Giant Bee', icon: '🐝', area: 'sunlit_meadow',
        hp: 25, atk: 7, def: 2, speed: 6, xp: 12, gold: [5, 12],
        drops: [
            { item: 'herb', chance: 0.4, qty: [1, 2] },
            { item: 'cloth', chance: 0.3, qty: [1, 2] }
        ],
        abilities: ['sting', 'buzz'],
        description: 'A bee the size of a dog.'
    },
    meadow_golem: {
        id: 'meadow_golem', name: 'Meadow Golem', icon: '🗿', area: 'sunlit_meadow',
        hp: 80, atk: 10, def: 12, speed: 2, xp: 30, gold: [15, 35],
        drops: [
            { item: 'stone', chance: 0.8, qty: [3, 6] },
            { item: 'copper_ore', chance: 0.3, qty: [1, 3] }
        ],
        abilities: ['slam', 'stone_skin'],
        description: 'A golem made of earth and stone.',
        miniBoss: true
    },

    // === ROCKY HILLS ===
    rock_lizard: {
        id: 'rock_lizard', name: 'Rock Lizard', icon: '🦎', area: 'rocky_hills',
        hp: 40, atk: 8, def: 6, speed: 5, xp: 15, gold: [8, 20],
        drops: [
            { item: 'leather', chance: 0.5, qty: [1, 2] },
            { item: 'stone', chance: 0.4, qty: [1, 3] }
        ],
        abilities: ['bite', 'tail_whip'],
        description: 'A lizard with rocky scales.'
    },
    mountain_wolf: {
        id: 'mountain_wolf', name: 'Mountain Wolf', icon: '🐺', area: 'rocky_hills',
        hp: 45, atk: 12, def: 4, speed: 7, xp: 18, gold: [10, 25],
        drops: [
            { item: 'leather', chance: 0.6, qty: [1, 3] },
            { item: 'ancient_bone', chance: 0.05, qty: [1, 1] }
        ],
        abilities: ['bite', 'howl', 'pack_attack'],
        description: 'Hunts in packs on the rocky slopes.'
    },
    stone_giant: {
        id: 'stone_giant', name: 'Stone Giant', icon: '👹', area: 'rocky_hills',
        hp: 150, atk: 18, def: 15, speed: 2, xp: 50, gold: [30, 60],
        drops: [
            { item: 'iron_ore', chance: 0.7, qty: [3, 6] },
            { item: 'silver_ore', chance: 0.2, qty: [1, 2] }
        ],
        abilities: ['slam', 'boulder_throw', 'earthquake'],
        description: 'A towering giant of living stone.',
        miniBoss: true
    },

    // === CRYSTAL CAVES ===
    crystal_bat: {
        id: 'crystal_bat', name: 'Crystal Bat', icon: '🦇', area: 'crystal_caves',
        hp: 30, atk: 10, def: 3, speed: 9, xp: 15, gold: [8, 18],
        drops: [
            { item: 'crystal', chance: 0.15, qty: [1, 1] },
            { item: 'leather', chance: 0.3, qty: [1, 1] }
        ],
        abilities: ['sonic_wave', 'dive'],
        description: 'A bat with crystalline wings.'
    },
    cave_spider: {
        id: 'cave_spider', name: 'Cave Spider', icon: '🕷', area: 'crystal_caves',
        hp: 50, atk: 12, def: 5, speed: 6, xp: 22, gold: [12, 28],
        drops: [
            { item: 'silk', chance: 0.4, qty: [1, 2] },
            { item: 'crystal', chance: 0.1, qty: [1, 1] }
        ],
        abilities: ['bite', 'web', 'poison'],
        description: 'Spins webs of crystalline silk.'
    },
    crystal_guardian: {
        id: 'crystal_guardian', name: 'Crystal Guardian', icon: '💎', area: 'crystal_caves',
        hp: 200, atk: 20, def: 20, speed: 3, xp: 80, gold: [50, 100],
        drops: [
            { item: 'crystal', chance: 0.9, qty: [3, 6] },
            { item: 'ruby', chance: 0.2, qty: [1, 1] },
            { item: 'sapphire', chance: 0.2, qty: [1, 1] }
        ],
        abilities: ['crystal_beam', 'reflect', 'shatter'],
        description: 'Ancient guardian of the crystal caves.',
        miniBoss: true
    },

    // === ENCHANTED GLADE ===
    pixie: {
        id: 'pixie', name: 'Pixie', icon: '✨', area: 'enchanted_glade',
        hp: 25, atk: 15, def: 2, speed: 12, xp: 20, gold: [10, 25],
        drops: [
            { item: 'moonflower', chance: 0.3, qty: [1, 2] },
            { item: 'silk', chance: 0.2, qty: [1, 1] }
        ],
        abilities: ['magic_bolt', 'blink', 'confuse'],
        description: 'A tiny magical being.'
    },
    unicorn: {
        id: 'unicorn', name: 'Dark Unicorn', icon: '🦄', area: 'enchanted_glade',
        hp: 80, atk: 18, def: 10, speed: 8, xp: 40, gold: [20, 45],
        drops: [
            { item: 'moonflower', chance: 0.5, qty: [2, 4] },
            { item: 'enchanted_wood', chance: 0.3, qty: [1, 2] }
        ],
        abilities: ['horn_charge', 'heal', 'magic_barrier'],
        description: 'A corrupted unicorn.'
    },
    fae_queen: {
        id: 'fae_queen', name: 'Fae Queen', icon: '👸', area: 'enchanted_glade',
        hp: 300, atk: 25, def: 15, speed: 10, xp: 120, gold: [80, 150],
        drops: [
            { item: 'moonflower', chance: 1.0, qty: [5, 10] },
            { item: 'emerald', chance: 0.4, qty: [1, 2] },
            { item: 'enchanted_wood', chance: 0.6, qty: [3, 5] }
        ],
        abilities: ['nature_wrath', 'charm', 'heal', 'summon_pixies'],
        description: 'The ruler of the enchanted realm.',
        boss: true
    },

    // === DWARVEN MINES ===
    mine_rat: {
        id: 'mine_rat', name: 'Mine Rat', icon: '🐀', area: 'dwarven_mines',
        hp: 35, atk: 12, def: 4, speed: 8, xp: 18, gold: [12, 25],
        drops: [
            { item: 'iron_ore', chance: 0.4, qty: [1, 2] },
            { item: 'copper_ore', chance: 0.3, qty: [1, 2] }
        ],
        abilities: ['bite', 'burrow'],
        description: 'A rat grown large in the deep mines.'
    },
    dwarf_ghost: {
        id: 'dwarf_ghost', name: 'Dwarf Ghost', icon: '👻', area: 'dwarven_mines',
        hp: 60, atk: 15, def: 8, speed: 5, xp: 30, gold: [20, 40],
        drops: [
            { item: 'silver_ore', chance: 0.3, qty: [1, 2] },
            { item: 'gold_ore', chance: 0.1, qty: [1, 1] }
        ],
        abilities: ['ghost_touch', 'curse', 'phase'],
        description: 'Spirit of a fallen miner.'
    },
    mine_boss: {
        id: 'mine_boss', name: 'Forge Titan', icon: '🔥', area: 'dwarven_mines',
        hp: 400, atk: 30, def: 25, speed: 4, xp: 150, gold: [100, 200],
        drops: [
            { item: 'gold_ore', chance: 0.8, qty: [3, 6] },
            { item: 'diamond', chance: 0.2, qty: [1, 1] },
            { item: 'mithril_ore', chance: 0.15, qty: [1, 2] }
        ],
        abilities: ['flame_breath', 'forge_hammer', 'molten_armor', 'earthquake'],
        description: 'A titan of living metal and flame.',
        boss: true
    },

    // === HAUNTED RUINS ===
    skeleton: {
        id: 'skeleton', name: 'Skeleton Warrior', icon: '💀', area: 'haunted_ruins',
        hp: 50, atk: 14, def: 8, speed: 5, xp: 22, gold: [15, 30],
        drops: [
            { item: 'ancient_bone', chance: 0.3, qty: [1, 2] },
            { item: 'iron_ore', chance: 0.2, qty: [1, 1] }
        ],
        abilities: ['slash', 'bone_shield'],
        description: 'Risen warrior from ages past.'
    },
    wraith: {
        id: 'wraith', name: 'Wraith', icon: '👤', area: 'haunted_ruins',
        hp: 70, atk: 20, def: 5, speed: 7, xp: 35, gold: [20, 45],
        drops: [
            { item: 'void_essence', chance: 0.05, qty: [1, 1] },
            { item: 'ancient_bone', chance: 0.4, qty: [1, 2] }
        ],
        abilities: ['life_drain', 'terror', 'shadow_step'],
        description: 'A vengeful spirit of pure malice.'
    },
    lich: {
        id: 'lich', name: 'Lich King', icon: '☠', area: 'haunted_ruins',
        hp: 500, atk: 35, def: 20, speed: 6, xp: 200, gold: [150, 300],
        drops: [
            { item: 'void_essence', chance: 0.4, qty: [2, 4] },
            { item: 'ancient_bone', chance: 1.0, qty: [5, 10] },
            { item: 'diamond', chance: 0.3, qty: [1, 2] }
        ],
        abilities: ['death_bolt', 'summon_undead', 'dark_ritual', 'soul_cage'],
        description: 'An ancient sorcerer who conquered death.',
        boss: true
    },

    // === DRAGON PEAK ===
    wyvern: {
        id: 'wyvern', name: 'Wyvern', icon: '🐲', area: 'dragon_peak',
        hp: 100, atk: 25, def: 15, speed: 8, xp: 50, gold: [30, 60],
        drops: [
            { item: 'dragon_scale', chance: 0.1, qty: [1, 1] },
            { item: 'leather', chance: 0.5, qty: [2, 4] }
        ],
        abilities: ['claw', 'dive_bomb', 'fire_breath'],
        description: 'A lesser dragon with fierce talons.'
    },
    fire_elemental: {
        id: 'fire_elemental', name: 'Fire Elemental', icon: '🔥', area: 'dragon_peak',
        hp: 80, atk: 30, def: 10, speed: 6, xp: 45, gold: [25, 50],
        drops: [
            { item: 'ruby', chance: 0.2, qty: [1, 1] },
            { item: 'crystal', chance: 0.3, qty: [1, 2] }
        ],
        abilities: ['fireball', 'flame_shield', 'explosion'],
        description: 'Pure living fire.'
    },
    ancient_dragon: {
        id: 'ancient_dragon', name: 'Ancient Dragon', icon: '🐉', area: 'dragon_peak',
        hp: 800, atk: 45, def: 35, speed: 7, xp: 400, gold: [300, 500],
        drops: [
            { item: 'dragon_scale', chance: 1.0, qty: [5, 10] },
            { item: 'phoenix_feather', chance: 0.3, qty: [1, 1] },
            { item: 'diamond', chance: 0.5, qty: [2, 3] }
        ],
        abilities: ['inferno', 'dragon_roar', 'tail_sweep', 'ancient_fury', 'flame_nova'],
        description: 'The most powerful creature in the land.',
        boss: true
    },

    // === VOID DEPTHS ===
    void_wisp: {
        id: 'void_wisp', name: 'Void Wisp', icon: '🟣', area: 'void_depths',
        hp: 60, atk: 25, def: 5, speed: 12, xp: 40, gold: [25, 50],
        drops: [
            { item: 'void_essence', chance: 0.2, qty: [1, 1] },
            { item: 'crystal', chance: 0.3, qty: [1, 2] }
        ],
        abilities: ['void_bolt', 'blink', 'drain'],
        description: 'A floating orb of void energy.'
    },
    eldritch_horror: {
        id: 'eldritch_horror', name: 'Eldritch Horror', icon: '🦑', area: 'void_depths',
        hp: 150, atk: 35, def: 20, speed: 5, xp: 80, gold: [50, 100],
        drops: [
            { item: 'void_essence', chance: 0.4, qty: [1, 3] },
            { item: 'ancient_bone', chance: 0.3, qty: [2, 4] }
        ],
        abilities: ['tentacle', 'madness', 'void_pull', 'regenerate'],
        description: 'A creature from beyond reality.'
    },
    void_lord: {
        id: 'void_lord', name: 'Void Lord', icon: '🌑', area: 'void_depths',
        hp: 1200, atk: 55, def: 40, speed: 8, xp: 600, gold: [500, 800],
        drops: [
            { item: 'void_essence', chance: 1.0, qty: [8, 15] },
            { item: 'phoenix_feather', chance: 0.5, qty: [1, 2] },
            { item: 'diamond', chance: 0.8, qty: [3, 5] }
        ],
        abilities: ['void_nova', 'reality_tear', 'consume', 'summon_horrors', 'oblivion'],
        description: 'The ruler of the void between worlds. The ultimate challenge.',
        boss: true, finalBoss: true
    }
};

// Ability definitions
const AbilityDB = {
    tackle: { name: 'Tackle', damage: 1.0, type: 'physical', desc: 'A basic attack.' },
    charge: { name: 'Charge', damage: 1.5, type: 'physical', desc: 'Charges forward with force.' },
    slam: { name: 'Slam', damage: 1.3, type: 'physical', desc: 'A powerful slam.' },
    root: { name: 'Root', damage: 0.5, type: 'physical', desc: 'Roots the target, reducing speed.', effect: 'slow' },
    bite: { name: 'Bite', damage: 1.2, type: 'physical', desc: 'A vicious bite.' },
    slash: { name: 'Slash', damage: 1.1, type: 'physical', desc: 'A quick slash.' },
    sting: { name: 'Sting', damage: 1.0, type: 'physical', desc: 'A painful sting.', effect: 'poison' },
    sparkle: { name: 'Sparkle', damage: 0.8, type: 'magic', desc: 'A flash of light.' },
    heal: { name: 'Heal', damage: 0, type: 'heal', healPercent: 0.15, desc: 'Heals self.' },
    tail_whip: { name: 'Tail Whip', damage: 1.1, type: 'physical', desc: 'Strikes with tail.', effect: 'defDown' },
    howl: { name: 'Howl', damage: 0, type: 'buff', buff: 'atkUp', desc: 'Boosts attack power.' },
    pack_attack: { name: 'Pack Attack', damage: 1.8, type: 'physical', desc: 'Calls the pack to attack.' },
    sonic_wave: { name: 'Sonic Wave', damage: 1.0, type: 'magic', desc: 'A disorienting sonic blast.', effect: 'confuse' },
    dive: { name: 'Dive', damage: 1.4, type: 'physical', desc: 'A swooping dive attack.' },
    web: { name: 'Web', damage: 0.3, type: 'physical', desc: 'Traps in sticky web.', effect: 'slow' },
    poison: { name: 'Poison', damage: 0.5, type: 'physical', desc: 'Injects venom.', effect: 'poison' },
    magic_bolt: { name: 'Magic Bolt', damage: 1.3, type: 'magic', desc: 'A bolt of pure magic.' },
    blink: { name: 'Blink', damage: 0, type: 'buff', buff: 'evasion', desc: 'Teleports, gaining evasion.' },
    confuse: { name: 'Confuse', damage: 0.6, type: 'magic', desc: 'Confuses the target.', effect: 'confuse' },
    horn_charge: { name: 'Horn Charge', damage: 1.6, type: 'physical', desc: 'A powerful horn strike.' },
    magic_barrier: { name: 'Magic Barrier', damage: 0, type: 'buff', buff: 'defUp', desc: 'Creates a magical shield.' },
    bone_shield: { name: 'Bone Shield', damage: 0, type: 'buff', buff: 'defUp', desc: 'Shields with bones.' },
    life_drain: { name: 'Life Drain', damage: 1.2, type: 'magic', desc: 'Drains life force.', lifesteal: true },
    terror: { name: 'Terror', damage: 0.8, type: 'magic', desc: 'Induces fear.', effect: 'fear' },
    shadow_step: { name: 'Shadow Step', damage: 1.5, type: 'physical', desc: 'Strikes from the shadows.' },
    claw: { name: 'Claw', damage: 1.3, type: 'physical', desc: 'Rakes with claws.' },
    dive_bomb: { name: 'Dive Bomb', damage: 1.7, type: 'physical', desc: 'A devastating aerial dive.' },
    fire_breath: { name: 'Fire Breath', damage: 1.5, type: 'fire', desc: 'Breathes a cone of fire.' },
    fireball: { name: 'Fireball', damage: 1.6, type: 'fire', desc: 'Hurls a ball of fire.' },
    flame_shield: { name: 'Flame Shield', damage: 0, type: 'buff', buff: 'fireShield', desc: 'Wraps in protective flames.' },
    explosion: { name: 'Explosion', damage: 2.0, type: 'fire', desc: 'A massive explosion.' },
    crystal_beam: { name: 'Crystal Beam', damage: 1.5, type: 'magic', desc: 'Fires a beam of crystallized energy.' },
    reflect: { name: 'Reflect', damage: 0, type: 'buff', buff: 'reflect', desc: 'Reflects next attack.' },
    shatter: { name: 'Shatter', damage: 1.8, type: 'magic', desc: 'Shatters crystals as projectiles.' },
    ghost_touch: { name: 'Ghost Touch', damage: 1.2, type: 'magic', desc: 'An ethereal strike.' },
    curse: { name: 'Curse', damage: 0.5, type: 'magic', desc: 'Places a weakening curse.', effect: 'curse' },
    phase: { name: 'Phase', damage: 0, type: 'buff', buff: 'evasion', desc: 'Phases through reality.' },
    nature_wrath: { name: 'Nature\'s Wrath', damage: 2.0, type: 'magic', desc: 'The full fury of nature.' },
    charm: { name: 'Charm', damage: 0, type: 'debuff', effect: 'charm', desc: 'Charms the target.' },
    summon_pixies: { name: 'Summon Pixies', damage: 1.0, type: 'magic', desc: 'Calls pixies to attack.', hits: 3 },
    flame_breath: { name: 'Flame Breath', damage: 1.5, type: 'fire', desc: 'A torrent of dragonfire.' },
    forge_hammer: { name: 'Forge Hammer', damage: 1.8, type: 'physical', desc: 'Strikes with a massive hammer.' },
    molten_armor: { name: 'Molten Armor', damage: 0, type: 'buff', buff: 'defUp', desc: 'Encases in molten metal.' },
    earthquake: { name: 'Earthquake', damage: 1.5, type: 'physical', desc: 'Shakes the very earth.' },
    death_bolt: { name: 'Death Bolt', damage: 2.0, type: 'dark', desc: 'A bolt of pure death magic.' },
    summon_undead: { name: 'Summon Undead', damage: 0.8, type: 'dark', desc: 'Summons undead minions.', hits: 3 },
    dark_ritual: { name: 'Dark Ritual', damage: 0, type: 'heal', healPercent: 0.2, desc: 'Sacrifices minions to heal.' },
    soul_cage: { name: 'Soul Cage', damage: 1.5, type: 'dark', desc: 'Traps the soul.', effect: 'silence' },
    inferno: { name: 'Inferno', damage: 2.5, type: 'fire', desc: 'Engulfs everything in flames.' },
    dragon_roar: { name: 'Dragon Roar', damage: 0.5, type: 'physical', desc: 'A terrifying roar.', effect: 'fear' },
    tail_sweep: { name: 'Tail Sweep', damage: 1.5, type: 'physical', desc: 'Sweeps with massive tail.' },
    ancient_fury: { name: 'Ancient Fury', damage: 2.0, type: 'physical', desc: 'Unleashes ancient rage.' },
    flame_nova: { name: 'Flame Nova', damage: 2.2, type: 'fire', desc: 'A nova of dragon fire.' },
    void_bolt: { name: 'Void Bolt', damage: 1.5, type: 'dark', desc: 'A bolt from the void.' },
    drain: { name: 'Drain', damage: 1.0, type: 'dark', desc: 'Drains energy.', lifesteal: true },
    tentacle: { name: 'Tentacle', damage: 1.4, type: 'physical', desc: 'Strikes with tentacles.' },
    madness: { name: 'Madness', damage: 0.8, type: 'dark', desc: 'Induces madness.', effect: 'confuse' },
    void_pull: { name: 'Void Pull', damage: 1.2, type: 'dark', desc: 'Pulls into the void.', effect: 'slow' },
    regenerate: { name: 'Regenerate', damage: 0, type: 'heal', healPercent: 0.1, desc: 'Regenerates health.' },
    void_nova: { name: 'Void Nova', damage: 2.5, type: 'dark', desc: 'A devastating void explosion.' },
    reality_tear: { name: 'Reality Tear', damage: 3.0, type: 'dark', desc: 'Tears reality apart.', ignoresDef: true },
    consume: { name: 'Consume', damage: 2.0, type: 'dark', desc: 'Consumes all.', lifesteal: true },
    summon_horrors: { name: 'Summon Horrors', damage: 1.2, type: 'dark', desc: 'Calls forth void creatures.', hits: 4 },
    oblivion: { name: 'Oblivion', damage: 4.0, type: 'dark', desc: 'The ultimate void attack. Devastating.', chargeTime: 2 },
    stone_skin: { name: 'Stone Skin', damage: 0, type: 'buff', buff: 'defUp', desc: 'Hardens skin to stone.' },
    buzz: { name: 'Buzz', damage: 0.5, type: 'physical', desc: 'An annoying buzz.', effect: 'confuse' },
    burrow: { name: 'Burrow', damage: 0, type: 'buff', buff: 'evasion', desc: 'Burrows underground.' },
    boulder_throw: { name: 'Boulder Throw', damage: 1.8, type: 'physical', desc: 'Hurls a massive boulder.' },
};
