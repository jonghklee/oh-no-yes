// Pet / Companion system

const PetRarity = {
    COMMON: 'common',
    UNCOMMON: 'uncommon',
    RARE: 'rare',
    EPIC: 'epic',
    LEGENDARY: 'legendary'
};

const PetRarityColors = {
    common: '#9e9e9e',
    uncommon: '#4caf50',
    rare: '#2196f3',
    epic: '#9c27b0',
    legendary: '#ff9800'
};

const PetDB = {
    // === COMMON ===
    cat: {
        id: 'cat', name: 'Tabby Cat', icon: '🐱', rarity: PetRarity.COMMON,
        description: 'A lucky feline companion that improves your fortune.',
        passiveEffect: { type: 'luck', dropBonus: 0.05 },
        activeAbility: { name: 'Lucky Pounce', type: 'goldFind', bonus: 0.15, cooldown: 30000, description: 'Finds extra gold for 30 seconds.' },
        feedItems: ['bread', 'stew'],
        happinessBonus: { well_fed: 0.02, ecstatic: 0.05 },
        baseStats: { atk: 1, def: 0 }
    },
    dog: {
        id: 'dog', name: 'Loyal Hound', icon: '🐕', rarity: PetRarity.COMMON,
        description: 'A faithful dog that sniffs out hidden items during exploration.',
        passiveEffect: { type: 'itemFind', chance: 0.08 },
        activeAbility: { name: 'Fetch', type: 'findItem', rarityBoost: 1, cooldown: 45000, description: 'Finds a random item from the current area.' },
        feedItems: ['bread', 'stew'],
        happinessBonus: { well_fed: 0.03, ecstatic: 0.06 },
        baseStats: { atk: 2, def: 1 }
    },
    chicken: {
        id: 'chicken', name: 'Golden Chicken', icon: '🐔', rarity: PetRarity.COMMON,
        description: 'A plump chicken that occasionally produces valuable eggs.',
        passiveEffect: { type: 'produce', item: 'egg', interval: 120000, chance: 0.6 },
        activeAbility: { name: 'Golden Egg', type: 'produceRare', item: 'golden_egg', cooldown: 300000, description: 'Lays a golden egg worth 100 gold.' },
        feedItems: ['herb', 'bread'],
        happinessBonus: { well_fed: 0.01, ecstatic: 0.03 },
        baseStats: { atk: 0, def: 0 }
    },
    rabbit: {
        id: 'rabbit', name: 'Swift Rabbit', icon: '🐇', rarity: PetRarity.COMMON,
        description: 'A quick rabbit that boosts your movement and action speed.',
        passiveEffect: { type: 'speed', explorationBonus: 0.10 },
        activeAbility: { name: 'Dash', type: 'speedBurst', bonus: 0.30, duration: 15000, cooldown: 40000, description: 'Greatly increases exploration speed for 15 seconds.' },
        feedItems: ['herb', 'bread'],
        happinessBonus: { well_fed: 0.02, ecstatic: 0.05 },
        baseStats: { atk: 0, def: 0 }
    },

    // === UNCOMMON ===
    owl: {
        id: 'owl', name: 'Mystic Owl', icon: '🦉', rarity: PetRarity.UNCOMMON,
        description: 'A wise owl that reveals hidden secrets and boosts experience.',
        passiveEffect: { type: 'xpBonus', ratio: 0.06 },
        activeAbility: { name: 'Insight', type: 'revealSecret', cooldown: 60000, description: 'Reveals a hidden treasure or secret in the current area.' },
        feedItems: ['bread', 'stew', 'herb'],
        happinessBonus: { well_fed: 0.03, ecstatic: 0.07 },
        baseStats: { atk: 1, def: 0 }
    },
    fox: {
        id: 'fox', name: 'Sly Fox', icon: '🦊', rarity: PetRarity.UNCOMMON,
        description: 'A cunning fox that steals items and gold from enemies.',
        passiveEffect: { type: 'steal', chance: 0.10, goldRatio: 0.05 },
        activeAbility: { name: 'Pilfer', type: 'stealItem', cooldown: 50000, description: 'Attempts to steal an item from the current enemy.' },
        feedItems: ['bread', 'stew'],
        happinessBonus: { well_fed: 0.03, ecstatic: 0.07 },
        baseStats: { atk: 3, def: 0 }
    },
    turtle: {
        id: 'turtle', name: 'Iron Turtle', icon: '🐢', rarity: PetRarity.UNCOMMON,
        description: 'A sturdy turtle that provides a protective defense bonus.',
        passiveEffect: { type: 'defense', defBonus: 3 },
        activeAbility: { name: 'Shell Guard', type: 'shield', damageReduction: 0.40, duration: 8000, cooldown: 45000, description: 'Reduces damage taken by 40% for 8 seconds.' },
        feedItems: ['herb', 'bread'],
        happinessBonus: { well_fed: 0.02, ecstatic: 0.05 },
        baseStats: { atk: 0, def: 4 }
    },
    hawk: {
        id: 'hawk', name: 'Red-Tailed Hawk', icon: '🦅', rarity: PetRarity.UNCOMMON,
        description: 'A sharp-eyed hawk that increases your critical hit chance.',
        passiveEffect: { type: 'critBonus', chance: 0.05 },
        activeAbility: { name: 'Dive Strike', type: 'critAttack', multiplier: 2.5, cooldown: 35000, description: 'Performs a guaranteed critical strike for 2.5x damage.' },
        feedItems: ['bread', 'stew'],
        happinessBonus: { well_fed: 0.03, ecstatic: 0.06 },
        baseStats: { atk: 3, def: 0 }
    },

    // === RARE ===
    wolf: {
        id: 'wolf', name: 'Dire Wolf', icon: '🐺', rarity: PetRarity.RARE,
        description: 'A fierce wolf that fights alongside you in combat.',
        passiveEffect: { type: 'combatAlly', atkBonus: 5 },
        activeAbility: { name: 'Pack Howl', type: 'buff', atkBuff: 8, duration: 10000, cooldown: 40000, description: 'Howls to boost your ATK by 8 for 10 seconds.' },
        feedItems: ['stew', 'bread'],
        happinessBonus: { well_fed: 0.04, ecstatic: 0.08 },
        baseStats: { atk: 8, def: 3 }
    },
    bear: {
        id: 'bear', name: 'Honey Bear', icon: '🐻', rarity: PetRarity.RARE,
        description: 'A strong bear that greatly improves gathering yields.',
        passiveEffect: { type: 'gatherBonus', ratio: 0.20 },
        activeAbility: { name: 'Forage', type: 'bonusGather', multiplier: 3, cooldown: 60000, description: 'Gathers triple resources from the next gathering action.' },
        feedItems: ['bread', 'stew', 'herb'],
        happinessBonus: { well_fed: 0.04, ecstatic: 0.08 },
        baseStats: { atk: 6, def: 5 }
    },
    phoenix_chick: {
        id: 'phoenix_chick', name: 'Phoenix Chick', icon: '🐦‍🔥', rarity: PetRarity.RARE,
        description: 'A young phoenix that adds fire damage to your attacks.',
        passiveEffect: { type: 'fireDamage', bonusDamage: 4 },
        activeAbility: { name: 'Flame Burst', type: 'aoeDamage', damage: 20, element: 'fire', cooldown: 30000, description: 'Unleashes a burst of flame dealing 20 fire damage.' },
        feedItems: ['bread', 'ruby'],
        happinessBonus: { well_fed: 0.04, ecstatic: 0.09 },
        baseStats: { atk: 6, def: 1 }
    },
    frost_sprite: {
        id: 'frost_sprite', name: 'Frost Sprite', icon: '🧊', rarity: PetRarity.RARE,
        description: 'A tiny ice spirit that adds frost damage and slows enemies.',
        passiveEffect: { type: 'iceDamage', bonusDamage: 3, slowChance: 0.15 },
        activeAbility: { name: 'Blizzard', type: 'aoeSlowDamage', damage: 15, slowRatio: 0.30, duration: 5000, cooldown: 35000, description: 'Creates a blizzard dealing 15 damage and slowing all enemies.' },
        feedItems: ['bread', 'sapphire'],
        happinessBonus: { well_fed: 0.04, ecstatic: 0.09 },
        baseStats: { atk: 5, def: 2 }
    },

    // === EPIC ===
    baby_dragon: {
        id: 'baby_dragon', name: 'Baby Dragon', icon: '🐲', rarity: PetRarity.EPIC,
        description: 'A baby dragon with devastating breath attacks.',
        passiveEffect: { type: 'fireDamage', bonusDamage: 8 },
        activeAbility: { name: 'Dragon Breath', type: 'aoeDamage', damage: 40, element: 'fire', cooldown: 25000, description: 'Breathes fire for 40 damage to all enemies.' },
        feedItems: ['stew', 'ruby', 'dragon_scale'],
        happinessBonus: { well_fed: 0.05, ecstatic: 0.10 },
        baseStats: { atk: 12, def: 6 }
    },
    unicorn: {
        id: 'unicorn', name: 'Starlight Unicorn', icon: '🦄', rarity: PetRarity.EPIC,
        description: 'A mystical unicorn with powerful healing abilities.',
        passiveEffect: { type: 'regen', hpPerTick: 3, interval: 4000 },
        activeAbility: { name: 'Purify', type: 'fullHeal', healRatio: 0.50, cooldown: 60000, description: 'Heals you for 50% of your max HP and removes debuffs.' },
        feedItems: ['moonflower', 'herb', 'bread'],
        happinessBonus: { well_fed: 0.05, ecstatic: 0.10 },
        baseStats: { atk: 4, def: 8 }
    },
    shadow_cat: {
        id: 'shadow_cat', name: 'Shadow Cat', icon: '🐈‍⬛', rarity: PetRarity.EPIC,
        description: 'A phantom feline that phases between shadows, boosting evasion.',
        passiveEffect: { type: 'dodge', chance: 0.08 },
        activeAbility: { name: 'Phase Shift', type: 'invulnerable', duration: 3000, cooldown: 50000, description: 'Become untouchable for 3 seconds.' },
        feedItems: ['stew', 'moonflower', 'void_essence'],
        happinessBonus: { well_fed: 0.05, ecstatic: 0.10 },
        baseStats: { atk: 7, def: 3 }
    },

    // === LEGENDARY ===
    ancient_golem: {
        id: 'ancient_golem', name: 'Ancient Golem', icon: '🗿', rarity: PetRarity.LEGENDARY,
        description: 'An ancient stone construct that provides unbreakable defense.',
        passiveEffect: { type: 'defense', defBonus: 15 },
        activeAbility: { name: 'Earthquake', type: 'aoeDamage', damage: 35, stunDuration: 3000, cooldown: 45000, description: 'Slams the ground for 35 damage and stuns enemies for 3 seconds.' },
        feedItems: ['stone', 'iron_ingot', 'diamond'],
        happinessBonus: { well_fed: 0.06, ecstatic: 0.12 },
        baseStats: { atk: 10, def: 20 }
    },
    celestial_spirit: {
        id: 'celestial_spirit', name: 'Celestial Spirit', icon: '⭐', rarity: PetRarity.LEGENDARY,
        description: 'A being of pure starlight that enhances every aspect of its master.',
        passiveEffect: { type: 'allBonus', atkBonus: 5, defBonus: 5, xpBonus: 0.10, goldBonus: 0.10, dropBonus: 0.05 },
        activeAbility: { name: 'Starfall', type: 'aoeDamage', damage: 50, healRatio: 0.25, cooldown: 55000, description: 'Rains starlight for 50 damage to enemies and heals you for 25% max HP.' },
        feedItems: ['moonflower', 'diamond', 'phoenix_feather'],
        happinessBonus: { well_fed: 0.08, ecstatic: 0.15 },
        baseStats: { atk: 12, def: 12 }
    }
};

const HappinessState = {
    MISERABLE: { name: 'Miserable', min: 0, max: 19, multiplier: 0.5 },
    SAD: { name: 'Sad', min: 20, max: 39, multiplier: 0.75 },
    CONTENT: { name: 'Content', min: 40, max: 59, multiplier: 1.0 },
    HAPPY: { name: 'Happy', min: 60, max: 79, multiplier: 1.25 },
    WELL_FED: { name: 'Well Fed', min: 80, max: 94, multiplier: 1.4 },
    ECSTATIC: { name: 'Ecstatic', min: 95, max: 100, multiplier: 1.6 }
};

class PetSystem {
    constructor() {
        this.ownedPets = new Map(); // petId -> { level, xp, happiness, customName }
        this.activePet = null;
        this.maxPets = 10;
        this.abilityCooldowns = new Map(); // petId -> timestamp of last ability use
        this.happinessDecayRate = 1; // happiness lost per minute
        this.lastHappinessUpdate = Date.now();
    }

    adoptPet(petId) {
        const pet = PetDB[petId];
        if (!pet) return { success: false, reason: 'Pet not found' };
        if (this.ownedPets.has(petId)) return { success: false, reason: 'You already own this pet' };
        if (this.ownedPets.size >= this.maxPets) return { success: false, reason: `Pet limit reached (${this.maxPets}). Release a pet first.` };

        this.ownedPets.set(petId, {
            level: 1,
            xp: 0,
            happiness: 50,
            customName: pet.name
        });

        // Set as active if no active pet
        if (!this.activePet) {
            this.activePet = petId;
        }

        return { success: true, pet: pet.name };
    }

    releasePet(petId) {
        if (!this.ownedPets.has(petId)) return { success: false, reason: 'You do not own this pet' };

        const pet = PetDB[petId];
        this.ownedPets.delete(petId);
        this.abilityCooldowns.delete(petId);

        if (this.activePet === petId) {
            // Switch to first available pet or null
            const remaining = Array.from(this.ownedPets.keys());
            this.activePet = remaining.length > 0 ? remaining[0] : null;
        }

        return { success: true, released: pet.name };
    }

    setActivePet(petId) {
        if (!this.ownedPets.has(petId)) return { success: false, reason: 'You do not own this pet' };
        this.activePet = petId;
        return { success: true, active: PetDB[petId].name };
    }

    renamePet(petId, newName) {
        const petData = this.ownedPets.get(petId);
        if (!petData) return { success: false, reason: 'You do not own this pet' };
        if (!newName || newName.trim().length === 0) return { success: false, reason: 'Name cannot be empty' };
        if (newName.length > 20) return { success: false, reason: 'Name must be 20 characters or less' };

        petData.customName = newName.trim();
        return { success: true, name: petData.customName };
    }

    feedPet(petId, itemId, inventory) {
        const petData = this.ownedPets.get(petId);
        if (!petData) return { success: false, reason: 'You do not own this pet' };

        const pet = PetDB[petId];
        if (!pet.feedItems.includes(itemId)) {
            return { success: false, reason: `${pet.name} doesn't like that food` };
        }

        if (!inventory.hasItem(itemId, 1)) {
            return { success: false, reason: `You don't have any ${ItemDB[itemId]?.name || itemId}` };
        }

        inventory.removeItem(itemId, 1);

        // Happiness gain based on item rarity
        const item = ItemDB[itemId];
        const rarityHappiness = { common: 5, uncommon: 10, rare: 18, epic: 30, legendary: 50 };
        const happinessGain = rarityHappiness[item?.rarity] || 5;
        petData.happiness = Math.min(100, petData.happiness + happinessGain);

        // XP gain
        const xpGain = Math.floor(happinessGain * 2);
        petData.xp += xpGain;

        // Level up check
        let leveledUp = false;
        while (petData.xp >= this._getXpForLevel(petData.level)) {
            petData.xp -= this._getXpForLevel(petData.level);
            petData.level++;
            leveledUp = true;
        }

        return {
            success: true,
            happiness: petData.happiness,
            happinessGain,
            xpGain,
            leveledUp,
            newLevel: petData.level
        };
    }

    levelUpPet(petId) {
        const petData = this.ownedPets.get(petId);
        if (!petData) return { success: false, reason: 'You do not own this pet' };

        const needed = this._getXpForLevel(petData.level);
        if (petData.xp < needed) {
            return { success: false, reason: `Need ${needed - petData.xp} more XP to level up` };
        }

        petData.xp -= needed;
        petData.level++;

        return {
            success: true,
            pet: PetDB[petId].name,
            newLevel: petData.level
        };
    }

    getActivePetBonuses() {
        if (!this.activePet) return {};
        const petData = this.ownedPets.get(this.activePet);
        if (!petData) return {};

        const pet = PetDB[this.activePet];
        const happinessMultiplier = this._getHappinessMultiplier(petData.happiness);
        const levelMultiplier = 1 + (petData.level - 1) * 0.08;
        const passive = pet.passiveEffect;
        const bonuses = {};

        switch (passive.type) {
            case 'luck':
                bonuses.dropBonus = passive.dropBonus * happinessMultiplier * levelMultiplier;
                break;
            case 'itemFind':
                bonuses.itemFindChance = passive.chance * happinessMultiplier * levelMultiplier;
                break;
            case 'produce':
                bonuses.produceItem = passive.item;
                bonuses.produceInterval = passive.interval;
                bonuses.produceChance = passive.chance * happinessMultiplier;
                break;
            case 'speed':
                bonuses.explorationSpeed = passive.explorationBonus * happinessMultiplier * levelMultiplier;
                break;
            case 'xpBonus':
                bonuses.xpBonus = passive.ratio * happinessMultiplier * levelMultiplier;
                break;
            case 'steal':
                bonuses.stealChance = passive.chance * happinessMultiplier;
                bonuses.goldStealRatio = passive.goldRatio * levelMultiplier;
                break;
            case 'defense':
                bonuses.defBonus = Math.floor(passive.defBonus * happinessMultiplier * levelMultiplier);
                break;
            case 'critBonus':
                bonuses.critChance = passive.chance * happinessMultiplier * levelMultiplier;
                break;
            case 'combatAlly':
                bonuses.atkBonus = Math.floor(passive.atkBonus * happinessMultiplier * levelMultiplier);
                break;
            case 'gatherBonus':
                bonuses.gatherBonus = passive.ratio * happinessMultiplier * levelMultiplier;
                break;
            case 'fireDamage':
                bonuses.bonusFireDamage = Math.floor(passive.bonusDamage * happinessMultiplier * levelMultiplier);
                break;
            case 'iceDamage':
                bonuses.bonusIceDamage = Math.floor(passive.bonusDamage * happinessMultiplier * levelMultiplier);
                bonuses.slowChance = passive.slowChance * happinessMultiplier;
                break;
            case 'regen':
                bonuses.regenHp = Math.floor(passive.hpPerTick * levelMultiplier);
                bonuses.regenInterval = passive.interval;
                break;
            case 'dodge':
                bonuses.dodgeChance = passive.chance * happinessMultiplier * levelMultiplier;
                break;
            case 'allBonus':
                bonuses.atkBonus = Math.floor(passive.atkBonus * happinessMultiplier * levelMultiplier);
                bonuses.defBonus = Math.floor(passive.defBonus * happinessMultiplier * levelMultiplier);
                bonuses.xpBonus = passive.xpBonus * happinessMultiplier * levelMultiplier;
                bonuses.goldBonus = passive.goldBonus * happinessMultiplier * levelMultiplier;
                bonuses.dropBonus = passive.dropBonus * happinessMultiplier * levelMultiplier;
                break;
        }

        // Add happiness-tier specific bonus
        const state = this._getHappinessState(petData.happiness);
        if (state.name === 'Well Fed' && pet.happinessBonus.well_fed) {
            bonuses.happinessDropBonus = pet.happinessBonus.well_fed;
        } else if (state.name === 'Ecstatic' && pet.happinessBonus.ecstatic) {
            bonuses.happinessDropBonus = pet.happinessBonus.ecstatic;
        }

        return bonuses;
    }

    petGather(area) {
        if (!this.activePet) return null;
        const petData = this.ownedPets.get(this.activePet);
        if (!petData) return null;

        const pet = PetDB[this.activePet];
        const happinessMultiplier = this._getHappinessMultiplier(petData.happiness);
        const levelMultiplier = 1 + (petData.level - 1) * 0.05;
        const findChance = 0.15 * happinessMultiplier * levelMultiplier;

        if (Math.random() > findChance) return null;

        // Pet found something based on area and pet type
        const possibleItems = this._getGatherItems(area, pet);
        if (possibleItems.length === 0) return null;

        const found = possibleItems[Math.floor(Math.random() * possibleItems.length)];

        // Grant pet XP for gathering
        petData.xp += 2;

        return { itemId: found, qty: 1, petName: petData.customName };
    }

    petCombatAction(enemy) {
        if (!this.activePet) return null;
        const petData = this.ownedPets.get(this.activePet);
        if (!petData) return null;

        const pet = PetDB[this.activePet];
        const levelMultiplier = 1 + (petData.level - 1) * 0.10;
        const happinessMultiplier = this._getHappinessMultiplier(petData.happiness);

        // Pet attacks based on its base stats
        const petAtk = Math.floor(pet.baseStats.atk * levelMultiplier * happinessMultiplier);
        if (petAtk <= 0) return null;

        // 60% chance to attack each turn
        if (Math.random() > 0.60) return null;

        const damage = Math.max(1, petAtk - Math.floor((enemy.def || 0) * 0.3));

        // Grant pet XP for combat
        petData.xp += 3;

        return {
            damage,
            petName: petData.customName,
            petIcon: pet.icon
        };
    }

    useActiveAbility(petId, context) {
        const petData = this.ownedPets.get(petId);
        if (!petData) return { success: false, reason: 'You do not own this pet' };

        const pet = PetDB[petId];
        const ability = pet.activeAbility;
        const now = Date.now();
        const lastUse = this.abilityCooldowns.get(petId) || 0;

        if (now - lastUse < ability.cooldown) {
            const remaining = Math.ceil((ability.cooldown - (now - lastUse)) / 1000);
            return { success: false, reason: `${ability.name} on cooldown (${remaining}s)` };
        }

        this.abilityCooldowns.set(petId, now);
        const levelMultiplier = 1 + (petData.level - 1) * 0.10;

        const result = { success: true, abilityName: ability.name };

        switch (ability.type) {
            case 'goldFind':
                result.effect = { type: 'goldBuff', bonus: ability.bonus * levelMultiplier, duration: ability.cooldown };
                break;
            case 'findItem':
                result.effect = { type: 'findItem', rarityBoost: ability.rarityBoost + Math.floor(petData.level / 3) };
                break;
            case 'produceRare':
                result.effect = { type: 'produceItem', item: ability.item };
                break;
            case 'speedBurst':
                result.effect = { type: 'speedBuff', bonus: ability.bonus * levelMultiplier, duration: ability.duration };
                break;
            case 'revealSecret':
                result.effect = { type: 'revealSecret' };
                break;
            case 'stealItem':
                result.effect = { type: 'steal', chance: 0.5 + petData.level * 0.03 };
                break;
            case 'shield':
                result.effect = { type: 'damageReduction', ratio: ability.damageReduction, duration: ability.duration };
                break;
            case 'critAttack':
                result.effect = { type: 'guaranteedCrit', multiplier: ability.multiplier * levelMultiplier };
                break;
            case 'buff':
                result.effect = { type: 'atkBuff', value: Math.floor(ability.atkBuff * levelMultiplier), duration: ability.duration };
                break;
            case 'bonusGather':
                result.effect = { type: 'gatherMultiplier', multiplier: ability.multiplier };
                break;
            case 'aoeDamage':
                result.effect = { type: 'aoeDamage', damage: Math.floor(ability.damage * levelMultiplier), element: ability.element || 'physical' };
                if (ability.stunDuration) result.effect.stunDuration = ability.stunDuration;
                if (ability.healRatio) result.effect.healRatio = ability.healRatio;
                break;
            case 'aoeSlowDamage':
                result.effect = { type: 'aoeDamage', damage: Math.floor(ability.damage * levelMultiplier), slow: ability.slowRatio, slowDuration: ability.duration };
                break;
            case 'fullHeal':
                result.effect = { type: 'heal', ratio: ability.healRatio * levelMultiplier, cleanse: true };
                break;
            case 'invulnerable':
                result.effect = { type: 'invulnerable', duration: ability.duration };
                break;
        }

        // Grant pet XP for ability use
        petData.xp += 5;

        return result;
    }

    update(dt) {
        // Decay happiness over time
        const now = Date.now();
        const elapsed = now - this.lastHappinessUpdate;

        if (elapsed >= 60000) { // once per minute
            const minutesPassed = Math.floor(elapsed / 60000);
            this.lastHappinessUpdate = now;

            for (const [petId, petData] of this.ownedPets) {
                petData.happiness = Math.max(0, petData.happiness - this.happinessDecayRate * minutesPassed);
            }
        }
    }

    expandPetSlots(cost, inventory) {
        if (inventory.gold < cost) return { success: false, reason: `Need ${cost} gold` };
        inventory.gold -= cost;
        this.maxPets += 5;
        return { success: true, newMax: this.maxPets };
    }

    getPetInfo(petId) {
        const pet = PetDB[petId];
        if (!pet) return null;

        const petData = this.ownedPets.get(petId);
        return {
            ...pet,
            owned: !!petData,
            level: petData?.level || 0,
            xp: petData?.xp || 0,
            xpNeeded: petData ? this._getXpForLevel(petData.level) : 0,
            happiness: petData?.happiness || 0,
            happinessState: petData ? this._getHappinessState(petData.happiness).name : 'N/A',
            customName: petData?.customName || pet.name,
            isActive: this.activePet === petId
        };
    }

    getOwnedPetsList() {
        const list = [];
        for (const [petId, petData] of this.ownedPets) {
            const pet = PetDB[petId];
            if (!pet) continue;
            list.push({
                id: petId,
                name: petData.customName,
                icon: pet.icon,
                rarity: pet.rarity,
                level: petData.level,
                happiness: petData.happiness,
                happinessState: this._getHappinessState(petData.happiness).name,
                isActive: this.activePet === petId
            });
        }
        return list;
    }

    _getGatherItems(area, pet) {
        // Mapping of areas to possible gathered items
        const areaItems = {
            'Whispering Woods': ['wood', 'herb', 'mushroom', 'leather'],
            'Sunlit Meadow': ['herb', 'cloth', 'copper_ore', 'wood'],
            'Rocky Hills': ['stone', 'iron_ore', 'copper_ore', 'leather'],
            'Crystal Caves': ['crystal', 'sapphire', 'ruby', 'emerald'],
            'Dwarven Mines': ['iron_ore', 'silver_ore', 'gold_ore', 'diamond'],
            'Enchanted Glade': ['moonflower', 'enchanted_wood', 'silk', 'emerald'],
            'Haunted Ruins': ['ancient_bone', 'iron_ingot', 'crystal', 'silk'],
            'Dragon Peak': ['dragon_scale', 'gold_ore', 'mithril_ore', 'ruby'],
            'Void Depths': ['void_essence', 'mithril_ore', 'ancient_bone', 'diamond']
        };

        return areaItems[area] || ['wood', 'stone', 'herb'];
    }

    _getXpForLevel(level) {
        return Math.floor(50 * Math.pow(1.35, level - 1));
    }

    _getHappinessMultiplier(happiness) {
        const state = this._getHappinessState(happiness);
        return state.multiplier;
    }

    _getHappinessState(happiness) {
        for (const state of Object.values(HappinessState)) {
            if (happiness >= state.min && happiness <= state.max) return state;
        }
        return HappinessState.CONTENT;
    }

    serialize() {
        return {
            ownedPets: Array.from(this.ownedPets.entries()),
            activePet: this.activePet,
            maxPets: this.maxPets,
            abilityCooldowns: Array.from(this.abilityCooldowns.entries()),
            lastHappinessUpdate: this.lastHappinessUpdate
        };
    }

    deserialize(data) {
        this.ownedPets = new Map(data.ownedPets || []);
        this.activePet = data.activePet || null;
        this.maxPets = data.maxPets || 10;
        this.abilityCooldowns = new Map(data.abilityCooldowns || []);
        this.lastHappinessUpdate = data.lastHappinessUpdate || Date.now();
    }
}
