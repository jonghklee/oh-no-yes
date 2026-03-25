// Random events that affect the economy and gameplay
const EventDB = {
    // === POSITIVE EVENTS ===
    trade_caravan: {
        id: 'trade_caravan', name: 'Trade Caravan Arrives!',
        description: 'A trade caravan has arrived, bringing goods and customers.',
        icon: '🐪', type: 'positive', duration: 3,
        effects: { customerRate: 1.5, buyPriceModifier: 0.9 },
        minDay: 5, chance: 0.08
    },
    festival: {
        id: 'festival', name: 'Town Festival!',
        description: 'The town is celebrating! Customers are generous.',
        icon: '🎉', type: 'positive', duration: 2,
        effects: { sellPriceModifier: 1.2, customerRate: 1.3 },
        minDay: 7, chance: 0.06
    },
    royal_decree: {
        id: 'royal_decree', name: 'Royal Decree',
        description: 'The king has declared a tax holiday!',
        icon: '📜', type: 'positive', duration: 5,
        effects: { taxRate: 0 },
        minDay: 15, chance: 0.03
    },
    merchant_guild: {
        id: 'merchant_guild', name: 'Merchant Guild Meeting',
        description: 'The guild shares trade secrets. +50% crafting XP.',
        icon: '🏛', type: 'positive', duration: 3,
        effects: { craftXpModifier: 1.5 },
        minDay: 10, chance: 0.05
    },
    lucky_find: {
        id: 'lucky_find', name: 'Lucky Find!',
        description: 'You found hidden coins while cleaning the shop!',
        icon: '💰', type: 'positive', duration: 0,
        effects: { instantGold: [100, 500] },
        minDay: 3, chance: 0.04
    },

    // === NEGATIVE EVENTS ===
    storm: {
        id: 'storm', name: 'Great Storm',
        description: 'A terrible storm reduces customer traffic.',
        icon: '⛈', type: 'negative', duration: 2,
        effects: { customerRate: 0.5 },
        minDay: 3, chance: 0.08
    },
    bandit_raid: {
        id: 'bandit_raid', name: 'Bandit Raid!',
        description: 'Bandits are raiding! Weapon and armor demand surges.',
        icon: '🏴‍☠️', type: 'negative', duration: 3,
        effects: { demandModifier: { weapon: 2.0, armor: 2.0 } },
        minDay: 8, chance: 0.06
    },
    plague: {
        id: 'plague', name: 'Minor Plague',
        description: 'Sickness spreads. Potion demand increases dramatically.',
        icon: '🤒', type: 'negative', duration: 4,
        effects: { demandModifier: { potion: 3.0 }, customerRate: 0.7 },
        minDay: 10, chance: 0.04
    },
    supply_shortage: {
        id: 'supply_shortage', name: 'Supply Shortage',
        description: 'Supply routes are blocked. Material prices spike.',
        icon: '📦', type: 'negative', duration: 3,
        effects: { categoryPriceModifier: { material: 1.8 } },
        minDay: 5, chance: 0.07
    },
    tax_increase: {
        id: 'tax_increase', name: 'Tax Increase',
        description: 'The crown raises taxes on all sales.',
        icon: '💸', type: 'negative', duration: 5,
        effects: { taxRate: 0.15 },
        minDay: 10, chance: 0.05
    },

    // === NEUTRAL EVENTS ===
    market_shift: {
        id: 'market_shift', name: 'Market Shift',
        description: 'Market preferences are changing.',
        icon: '📊', type: 'neutral', duration: 3,
        effects: { randomPriceShift: true },
        minDay: 5, chance: 0.1
    },
    traveling_sage: {
        id: 'traveling_sage', name: 'Traveling Sage',
        description: 'A wise sage visits, offering to share knowledge.',
        icon: '🧙', type: 'neutral', duration: 1,
        effects: { freeSkillPoint: true },
        minDay: 15, chance: 0.03
    },
    mysterious_stranger: {
        id: 'mysterious_stranger', name: 'Mysterious Stranger',
        description: 'A cloaked figure offers a rare trade...',
        icon: '🕵', type: 'neutral', duration: 1,
        effects: { specialTrade: true },
        minDay: 8, chance: 0.05
    },
    full_moon: {
        id: 'full_moon', name: 'Full Moon Night',
        description: 'Moonflowers bloom everywhere. +100% moonflower drops.',
        icon: '🌕', type: 'neutral', duration: 1,
        effects: { dropModifier: { moonflower: 2.0 } },
        minDay: 1, chance: 0.07
    }
};

// Seasonal modifiers
const Seasons = {
    spring: {
        name: 'Spring', icon: '🌸', color: '#90ee90',
        effects: { herbDropBonus: 0.2, customerRate: 1.1 },
        description: 'Herbs grow abundantly. More travelers visit.'
    },
    summer: {
        name: 'Summer', icon: '☀', color: '#ffd700',
        effects: { sellPriceBonus: 0.1, staminaBonus: 10 },
        description: 'Long days mean more exploration and sales.'
    },
    autumn: {
        name: 'Autumn', icon: '🍂', color: '#d2691e',
        effects: { oreDropBonus: 0.15, craftXpBonus: 0.1 },
        description: 'Mining season. Better yields and focus.'
    },
    winter: {
        name: 'Winter', icon: '❄', color: '#87ceeb',
        effects: { customerRate: 0.8, potionDemand: 1.3 },
        description: 'Fewer visitors but higher demand for warmth.'
    }
};

function getSeason(day) {
    const seasonOrder = ['spring', 'summer', 'autumn', 'winter'];
    const seasonLength = 30; // 30 days per season
    const index = Math.floor((day - 1) / seasonLength) % 4;
    return Seasons[seasonOrder[index]];
}

function getDayInSeason(day) {
    return ((day - 1) % 30) + 1;
}

function checkForEvent(day) {
    const available = Object.values(EventDB).filter(e => day >= e.minDay);
    for (const event of Utils.shuffle(available)) {
        if (Math.random() < event.chance) {
            return Utils.deepClone(event);
        }
    }
    return null;
}
