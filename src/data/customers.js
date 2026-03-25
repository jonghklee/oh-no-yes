// Customer types and behaviors
const CustomerType = {
    PEASANT: 'peasant',
    MERCHANT: 'merchant',
    ADVENTURER: 'adventurer',
    NOBLE: 'noble',
    SCHOLAR: 'scholar',
    BLACKSMITH: 'blacksmith',
    ALCHEMIST: 'alchemist',
    COLLECTOR: 'collector',
    THIEF: 'thief',
    ROYAL: 'royal'
};

const CustomerDB = {
    peasant: {
        type: CustomerType.PEASANT, name: 'Peasant', icon: '👨‍🌾',
        budget: [10, 50], patience: 3, haggleSkill: 0.1,
        preferredCategories: ['food', 'material', 'tool'],
        description: 'Simple folk looking for basic goods.',
        spawnWeight: 30, minDay: 1,
        dialogue: {
            enter: ["Need some supplies...", "Hope prices are fair today.", "Just need the basics."],
            haggle: ["That's a bit much for me...", "Can you go lower?", "I'm just a simple farmer..."],
            buy: ["Thank you kindly!", "This'll do nicely.", "Much appreciated!"],
            leave: ["Maybe next time...", "I'll come back later.", "Too rich for my blood."],
            happy: ["What a deal!", "You're the best merchant around!", "I'll tell my friends!"]
        }
    },
    merchant: {
        type: CustomerType.MERCHANT, name: 'Traveling Merchant', icon: '🧳',
        budget: [50, 200], patience: 5, haggleSkill: 0.5,
        preferredCategories: ['material', 'gem', 'potion'],
        description: 'Fellow merchants looking for trade goods.',
        spawnWeight: 20, minDay: 3,
        dialogue: {
            enter: ["Let's see your wares.", "I'm looking for bulk deals.", "What's your best price?"],
            haggle: ["I know the real price.", "I can get this cheaper elsewhere.", "Come on, merchant to merchant."],
            buy: ["Fair deal.", "Pleasure doing business.", "I'll be back for more."],
            leave: ["Your prices are too high.", "I'll find a better deal.", "Not today."],
            happy: ["Excellent stock!", "You've got a good eye for goods!", "Worth every coin!"]
        }
    },
    adventurer: {
        type: CustomerType.ADVENTURER, name: 'Adventurer', icon: '⚔',
        budget: [30, 150], patience: 4, haggleSkill: 0.2,
        preferredCategories: ['weapon', 'armor', 'potion', 'scroll'],
        description: 'Warriors and explorers seeking equipment.',
        spawnWeight: 25, minDay: 2,
        dialogue: {
            enter: ["Got any good weapons?", "I need supplies for the road.", "Anything that'll keep me alive?"],
            haggle: ["Come on, I risk my life out there!", "A little discount for a hero?", "I've saved this town before!"],
            buy: ["This'll serve me well!", "Perfect for my next quest!", "Sharp and sturdy!"],
            leave: ["I'll manage without it.", "Too expensive for dungeon gear.", "I'll find a chest."],
            happy: ["Best gear in town!", "You're my favorite merchant!", "This is legendary quality!"]
        }
    },
    noble: {
        type: CustomerType.NOBLE, name: 'Noble', icon: '🎩',
        budget: [100, 500], patience: 2, haggleSkill: 0.1,
        preferredCategories: ['gem', 'accessory', 'artifact', 'weapon'],
        description: 'Wealthy nobles seeking luxury goods.',
        spawnWeight: 10, minDay: 5,
        dialogue: {
            enter: ["Show me your finest.", "I hope you have something worthy.", "Quality, not quantity."],
            haggle: ["Hmph, I suppose I could pay less.", "Do you know who I am?", "Surely you can do better."],
            buy: ["Acceptable quality.", "This will do for now.", "Wrap it up."],
            leave: ["Nothing worth my time.", "I expected better.", "Disappointing."],
            happy: ["Exquisite!", "Finally, a merchant with taste!", "You'll be hearing from me again!"]
        }
    },
    scholar: {
        type: CustomerType.SCHOLAR, name: 'Scholar', icon: '📚',
        budget: [40, 180], patience: 6, haggleSkill: 0.3,
        preferredCategories: ['scroll', 'potion', 'gem', 'material'],
        description: 'Academics seeking magical components.',
        spawnWeight: 15, minDay: 4,
        dialogue: {
            enter: ["Fascinating, let me see...", "Do you have any rare reagents?", "I need components for research."],
            haggle: ["The academic budget is quite limited...", "For the sake of knowledge?", "I'll cite you in my paper."],
            buy: ["Excellent specimen!", "This will further my research!", "Precisely what I needed!"],
            leave: ["Not what I'm looking for.", "Perhaps another time.", "I'll check the archives."],
            happy: ["A breakthrough find!", "You've advanced my research!", "Remarkable quality!"]
        }
    },
    blacksmith: {
        type: CustomerType.BLACKSMITH, name: 'Blacksmith', icon: '🔨',
        budget: [30, 120], patience: 4, haggleSkill: 0.4,
        preferredCategories: ['material'],
        description: 'Looking for raw materials in bulk.',
        spawnWeight: 12, minDay: 3,
        buyMultiplier: 0.85, // buys bulk at slight discount
        bulkBuyer: true,
        dialogue: {
            enter: ["Need ores and ingots.", "What's your material stock?", "I'll take everything you've got."],
            haggle: ["Bulk discount?", "I buy this every week.", "That's retail price, give me wholesale."],
            buy: ["Good quality.", "This'll keep the forge going.", "Solid materials."],
            leave: ["Not enough stock.", "Prices are up again...", "I'll mine it myself."],
            happy: ["Premium ore!", "Best supplier in town!", "Keep this quality coming!"]
        }
    },
    collector: {
        type: CustomerType.COLLECTOR, name: 'Collector', icon: '🔍',
        budget: [200, 1000], patience: 7, haggleSkill: 0.2,
        preferredCategories: ['artifact', 'gem', 'accessory'],
        description: 'Rare item collector. Pays premium for quality.',
        spawnWeight: 5, minDay: 10,
        qualityMultiplier: 2.0, // pays extra for high quality
        dialogue: {
            enter: ["Any rare finds today?", "I'm looking for something special.", "My collection needs expanding."],
            haggle: ["Even collectors have limits.", "It's rare, but not THAT rare.", "Perhaps a friendly discount?"],
            buy: ["A magnificent addition!", "My collection grows!", "Priceless... well, not literally."],
            leave: ["Nothing catches my eye.", "I've seen better.", "My standards are too high."],
            happy: ["Museum quality!", "One of a kind!", "The crown jewel of my collection!"]
        }
    },
    royal: {
        type: CustomerType.ROYAL, name: 'Royal Emissary', icon: '👑',
        budget: [500, 2000], patience: 3, haggleSkill: 0.0,
        preferredCategories: ['weapon', 'armor', 'gem', 'artifact'],
        description: 'Buying for the royal court. Unlimited budget.',
        spawnWeight: 2, minDay: 20,
        dialogue: {
            enter: ["The Crown requires your finest.", "A royal commission.", "Show me everything."],
            haggle: ["The Crown does not haggle.", "Name your price.", "Cost is no concern."],
            buy: ["For the Crown!", "The King will be pleased.", "Royal quality indeed."],
            leave: ["Not fit for royalty.", "The Crown is disappointed.", "We'll look elsewhere."],
            happy: ["Splendid! A royal appointment awaits you!", "The King sends his regards!", "You shall be the Crown's official supplier!"]
        }
    }
};

// Generate a customer
function generateCustomer(day, reputation) {
    const available = Object.values(CustomerDB).filter(c => day >= c.minDay);
    const weights = available.map(c => {
        let w = c.spawnWeight;
        // Higher reputation attracts better customers
        if (c.type === CustomerType.NOBLE || c.type === CustomerType.COLLECTOR || c.type === CustomerType.ROYAL) {
            w *= Math.min(1, reputation / 50);
        }
        return w;
    });
    const template = Utils.weightedChoice(available, weights);
    const budget = Utils.random(template.budget[0], template.budget[1]);
    // Scale budget with day
    const scaledBudget = Math.floor(budget * (1 + day * 0.02));

    return {
        ...Utils.deepClone(template),
        id: Utils.generateId(),
        budget: scaledBudget,
        maxPatience: template.patience,
        currentPatience: template.patience,
        wantedCategory: Utils.choice(template.preferredCategories),
        satisfied: false,
        haggleAttempts: 0,
        maxHaggle: 2
    };
}
