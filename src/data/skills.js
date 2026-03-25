// Skill trees
const SkillTreeDB = {
    merchant: {
        name: 'Merchant', icon: '💰', color: '#ffd700',
        description: 'Trading, negotiation, and shop management.',
        skills: {
            haggle_1: { name: 'Basic Haggling', desc: 'Sell items for 5% more.', effect: { sellBonus: 0.05 }, cost: 1, requires: [] },
            haggle_2: { name: 'Silver Tongue', desc: 'Sell items for 10% more.', effect: { sellBonus: 0.10 }, cost: 2, requires: ['haggle_1'] },
            haggle_3: { name: 'Master Negotiator', desc: 'Sell items for 15% more.', effect: { sellBonus: 0.15 }, cost: 3, requires: ['haggle_2'] },
            buy_discount_1: { name: 'Bulk Buyer', desc: 'Buy materials 5% cheaper.', effect: { buyDiscount: 0.05 }, cost: 1, requires: [] },
            buy_discount_2: { name: 'Wholesale', desc: 'Buy materials 10% cheaper.', effect: { buyDiscount: 0.10 }, cost: 2, requires: ['buy_discount_1'] },
            customer_draw_1: { name: 'Shop Sign', desc: '+10% customer rate.', effect: { customerRate: 1.1 }, cost: 1, requires: [] },
            customer_draw_2: { name: 'Reputation', desc: '+20% customer rate.', effect: { customerRate: 1.2 }, cost: 2, requires: ['customer_draw_1'] },
            customer_draw_3: { name: 'Famous Shop', desc: '+30% customer rate and attracts nobles.', effect: { customerRate: 1.3, nobleAttract: true }, cost: 3, requires: ['customer_draw_2'] },
            appraisal: { name: 'Appraisal', desc: 'See item quality and true value.', effect: { appraisal: true }, cost: 2, requires: ['haggle_1'] },
            market_sense: { name: 'Market Sense', desc: 'Predict next day price trends.', effect: { pricePrediction: true }, cost: 2, requires: ['appraisal'] },
            tax_evasion: { name: 'Tax Optimization', desc: 'Reduce tax rate by 50%.', effect: { taxReduction: 0.5 }, cost: 3, requires: ['buy_discount_2'] },
            golden_touch: { name: 'Golden Touch', desc: '+5% gold from all sources.', effect: { goldBonus: 0.05 }, cost: 2, requires: ['haggle_2', 'buy_discount_2'] },
        }
    },
    combat: {
        name: 'Combat', icon: '⚔', color: '#ff4444',
        description: 'Fighting skills for dungeon exploration.',
        skills: {
            atk_1: { name: 'Weapon Training', desc: '+3 ATK.', effect: { atk: 3 }, cost: 1, requires: [] },
            atk_2: { name: 'Advanced Combat', desc: '+5 ATK.', effect: { atk: 5 }, cost: 2, requires: ['atk_1'] },
            atk_3: { name: 'Master Warrior', desc: '+8 ATK.', effect: { atk: 8 }, cost: 3, requires: ['atk_2'] },
            def_1: { name: 'Shield Use', desc: '+3 DEF.', effect: { def: 3 }, cost: 1, requires: [] },
            def_2: { name: 'Heavy Armor', desc: '+5 DEF.', effect: { def: 5 }, cost: 2, requires: ['def_1'] },
            def_3: { name: 'Fortress', desc: '+8 DEF.', effect: { def: 8 }, cost: 3, requires: ['def_2'] },
            crit_1: { name: 'Precision', desc: '+5% crit rate.', effect: { critRate: 0.05 }, cost: 1, requires: ['atk_1'] },
            crit_2: { name: 'Deadly Strike', desc: '+10% crit rate, +50% crit damage.', effect: { critRate: 0.10, critDmg: 0.5 }, cost: 3, requires: ['crit_1'] },
            hp_1: { name: 'Vitality', desc: '+20 max HP.', effect: { maxHp: 20 }, cost: 1, requires: [] },
            hp_2: { name: 'Endurance', desc: '+40 max HP.', effect: { maxHp: 40 }, cost: 2, requires: ['hp_1'] },
            dodge: { name: 'Dodge', desc: '10% chance to evade attacks.', effect: { dodge: 0.10 }, cost: 2, requires: ['def_1'] },
            counter: { name: 'Counter Attack', desc: '15% chance to counter when attacked.', effect: { counter: 0.15 }, cost: 2, requires: ['atk_2', 'def_2'] },
            lifesteal: { name: 'Life Steal', desc: 'Heal 5% of damage dealt.', effect: { lifesteal: 0.05 }, cost: 3, requires: ['atk_3'] },
        }
    },
    crafting: {
        name: 'Crafting', icon: '🔨', color: '#4488ff',
        description: 'Item creation and improvement.',
        skills: {
            craft_speed_1: { name: 'Quick Hands', desc: '-20% craft time.', effect: { craftSpeed: 0.8 }, cost: 1, requires: [] },
            craft_speed_2: { name: 'Efficiency', desc: '-40% craft time.', effect: { craftSpeed: 0.6 }, cost: 2, requires: ['craft_speed_1'] },
            quality_1: { name: 'Quality Focus', desc: '+10% item quality.', effect: { qualityBonus: 0.1 }, cost: 1, requires: [] },
            quality_2: { name: 'Master Craft', desc: '+20% item quality.', effect: { qualityBonus: 0.2 }, cost: 2, requires: ['quality_1'] },
            quality_3: { name: 'Legendary Smith', desc: '+30% quality, chance for legendary.', effect: { qualityBonus: 0.3, legendaryChance: 0.05 }, cost: 3, requires: ['quality_2'] },
            resource_save_1: { name: 'Resourceful', desc: '10% chance to not consume materials.', effect: { resourceSave: 0.1 }, cost: 1, requires: [] },
            resource_save_2: { name: 'Conservation', desc: '20% chance to not consume materials.', effect: { resourceSave: 0.2 }, cost: 2, requires: ['resource_save_1'] },
            double_craft: { name: 'Double Output', desc: '15% chance to craft 2x items.', effect: { doubleCraft: 0.15 }, cost: 3, requires: ['quality_2', 'resource_save_2'] },
            craft_xp_1: { name: 'Studious', desc: '+25% crafting XP.', effect: { craftXpBonus: 0.25 }, cost: 1, requires: [] },
            craft_xp_2: { name: 'Expert', desc: '+50% crafting XP.', effect: { craftXpBonus: 0.50 }, cost: 2, requires: ['craft_xp_1'] },
            unlock_enchant: { name: 'Enchanting', desc: 'Unlock enchanting station.', effect: { unlockStation: 'enchanting' }, cost: 2, requires: ['quality_1'] },
            auto_craft: { name: 'Auto Craft', desc: 'Queue multiple crafts.', effect: { autoCraft: true }, cost: 2, requires: ['craft_speed_2'] },
        }
    },
    exploration: {
        name: 'Exploration', icon: '🗺', color: '#44bb44',
        description: 'Gathering, navigation, and survival.',
        skills: {
            stamina_1: { name: 'Hiking', desc: '+10 max stamina.', effect: { maxStamina: 10 }, cost: 1, requires: [] },
            stamina_2: { name: 'Endurance', desc: '+20 max stamina.', effect: { maxStamina: 20 }, cost: 2, requires: ['stamina_1'] },
            stamina_3: { name: 'Tireless', desc: '+30 max stamina.', effect: { maxStamina: 30 }, cost: 3, requires: ['stamina_2'] },
            gather_1: { name: 'Keen Eye', desc: '+15% gather rate.', effect: { gatherBonus: 0.15 }, cost: 1, requires: [] },
            gather_2: { name: 'Expert Gatherer', desc: '+30% gather rate.', effect: { gatherBonus: 0.30 }, cost: 2, requires: ['gather_1'] },
            rare_find: { name: 'Rare Finder', desc: '+10% rare item chance.', effect: { rareFindBonus: 0.10 }, cost: 2, requires: ['gather_2'] },
            speed_1: { name: 'Swift Feet', desc: '-10% stamina cost.', effect: { staminaReduction: 0.10 }, cost: 1, requires: ['stamina_1'] },
            speed_2: { name: 'Explorer', desc: '-20% stamina cost.', effect: { staminaReduction: 0.20 }, cost: 2, requires: ['speed_1'] },
            loot_1: { name: 'Scavenger', desc: '+15% combat drops.', effect: { lootBonus: 0.15 }, cost: 1, requires: [] },
            loot_2: { name: 'Treasure Hunter', desc: '+30% combat drops.', effect: { lootBonus: 0.30 }, cost: 2, requires: ['loot_1'] },
            map_sense: { name: 'Map Sense', desc: 'Reveal area secrets.', effect: { mapReveal: true }, cost: 2, requires: ['gather_1'] },
            escape_artist: { name: 'Escape Artist', desc: 'Always escape from battle.', effect: { guaranteedEscape: true }, cost: 1, requires: [] },
        }
    }
};

// XP requirements per level
function getXpForLevel(level) {
    return Math.floor(100 * Math.pow(1.15, level - 1));
}

// Skill points per level
function getSkillPointsForLevel(level) {
    if (level % 5 === 0) return 2; // bonus point every 5 levels
    return 1;
}
