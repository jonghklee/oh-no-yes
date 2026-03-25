// Named NPCs with relationship/friendship system
const FriendshipTier = {
    STRANGER: 'stranger',
    ACQUAINTANCE: 'acquaintance',
    FRIEND: 'friend',
    CLOSE_FRIEND: 'close_friend',
    BEST_FRIEND: 'best_friend'
};

const FriendshipThresholds = {
    stranger: 0,
    acquaintance: 10,
    friend: 30,
    close_friend: 60,
    best_friend: 90
};

const NpcDB = {
    elena: {
        id: 'elena', name: 'Elena', icon: '🌿', title: 'The Herbalist',
        personality: 'Gentle and knowledgeable, speaks softly about nature.',
        likes: ['potion', 'material'],
        dislikes: ['weapon', 'armor'],
        dialogues: {
            stranger: [
                "Oh, a new face. I'm Elena, the local herbalist.",
                "Mind the nettles on that shelf, they bite.",
                "Are you the new merchant everyone talks about?"
            ],
            acquaintance: [
                "Back again? The chamomile is fresh today.",
                "Your shop is starting to look quite nice.",
                "I've been experimenting with a new tonic."
            ],
            friend: [
                "I saved some rare moonpetals for you, friend.",
                "Would you like to learn about herb blending? I can show you the basics.",
                "You have a real talent for finding quality ingredients."
            ],
            close_friend: [
                "I trust you more than anyone in this town, you know.",
                "Here, take this recipe. It's been in my family for generations.",
                "You remind me of my mentor. She had the same kindness in her eyes."
            ],
            best_friend: [
                "You are the finest person I've ever known. My shop is your shop.",
                "I've written down every secret recipe I know. They're yours.",
                "If you ever need anything, anything at all, just ask."
            ]
        },
        gifts: [
            { itemId: 'moonflower', affinityBonus: 5 },
            { itemId: 'healing_herb', affinityBonus: 3 },
            { itemId: 'health_potion', affinityBonus: 4 },
            { itemId: 'mana_potion', affinityBonus: 4 },
            { itemId: 'rare_herb_bundle', affinityBonus: 8 }
        ],
        quests: [
            { questId: 'elena_herbs_01', minTier: 'acquaintance' },
            { questId: 'elena_remedy_02', minTier: 'friend' },
            { questId: 'elena_legendary_03', minTier: 'close_friend' },
            { questId: 'elena_masterwork_04', minTier: 'best_friend' }
        ],
        schedule: {
            days: [1, 2, 3, 5, 6],
            phases: ['morning', 'afternoon']
        },
        unlockCondition: { type: 'level', value: 1 },
        rewards: {
            acquaintance: { discount: 0.05, description: '5% discount on herbs' },
            friend: { recipe: 'herbal_remedy', description: 'Herbal Remedy recipe unlocked' },
            close_friend: { recipe: 'elixir_of_vitality', discount: 0.10, description: 'Elixir of Vitality recipe + 10% herb discount' },
            best_friend: { recipe: 'panacea', statBoost: { herbYield: 0.25 }, description: 'Panacea recipe + 25% herb yield bonus' }
        }
    },

    garrick: {
        id: 'garrick', name: 'Garrick', icon: '🔨', title: 'The Blacksmith',
        personality: 'Gruff but fair, proud of his craft, speaks bluntly.',
        likes: ['weapon', 'armor', 'material'],
        dislikes: ['scroll', 'potion'],
        dialogues: {
            stranger: [
                "Hmph. Another merchant. Let's see if you're any good.",
                "Name's Garrick. I work the forge. Don't waste my time.",
                "You sell weapons? They better not be junk."
            ],
            acquaintance: [
                "You again. At least you don't sell garbage.",
                "That steel you had last time wasn't bad. Got more?",
                "I suppose you're alright, for a shopkeeper."
            ],
            friend: [
                "Here, let me show you how to temper a blade properly.",
                "I'll give you a fair price, always. That's what friends do.",
                "Your craftsmanship is improving. I can tell."
            ],
            close_friend: [
                "You've earned my respect. Not many can say that.",
                "I'll teach you the folding technique my father taught me.",
                "If anyone gives you trouble, send them my way."
            ],
            best_friend: [
                "You're like family to me now. Here, take my master hammer.",
                "I've never shared my secret alloy recipe with anyone. Until now.",
                "Side by side, we could forge weapons fit for legends."
            ]
        },
        gifts: [
            { itemId: 'iron_ore', affinityBonus: 3 },
            { itemId: 'mithril_ore', affinityBonus: 6 },
            { itemId: 'steel_ingot', affinityBonus: 4 },
            { itemId: 'dragon_scale', affinityBonus: 8 },
            { itemId: 'fine_whetstone', affinityBonus: 5 }
        ],
        quests: [
            { questId: 'garrick_ore_01', minTier: 'acquaintance' },
            { questId: 'garrick_blade_02', minTier: 'friend' },
            { questId: 'garrick_masterwork_03', minTier: 'close_friend' },
            { questId: 'garrick_legendary_04', minTier: 'best_friend' }
        ],
        schedule: {
            days: [1, 2, 3, 4, 5],
            phases: ['morning', 'afternoon', 'evening']
        },
        unlockCondition: { type: 'level', value: 2 },
        rewards: {
            acquaintance: { discount: 0.05, description: '5% discount on smithing materials' },
            friend: { recipe: 'reinforced_blade', description: 'Reinforced Blade recipe unlocked' },
            close_friend: { recipe: 'mithril_edge', discount: 0.10, description: 'Mithril Edge recipe + 10% weapon material discount' },
            best_friend: { recipe: 'dragonforged_sword', statBoost: { smithingSpeed: 0.25 }, description: 'Dragonforged Sword recipe + 25% smithing speed' }
        }
    },

    luna: {
        id: 'luna', name: 'Luna', icon: '🔮', title: 'The Scholar',
        personality: 'Curious and dreamy, always lost in thought, speaks in riddles.',
        likes: ['scroll', 'gem'],
        dislikes: ['food', 'tool'],
        dialogues: {
            stranger: [
                "Hmm? Oh, hello. I didn't see you there. I was contemplating the stars.",
                "A merchant's shop... full of potential energy waiting to be converted.",
                "Do you know the crystalline resonance frequency of amethyst? No? Pity."
            ],
            acquaintance: [
                "Ah, the merchant with the curious aura. You're back.",
                "I've been studying a new enchantment theory. It's fascinating.",
                "Your shop has an interesting magical signature, did you know?"
            ],
            friend: [
                "I think you'd understand this research. Come, let me show you.",
                "Enchanting is really just persuading matter to remember magic.",
                "I found a scroll about you in the archives. Just kidding. Or am I?"
            ],
            close_friend: [
                "You're one of the few who doesn't think I'm completely mad.",
                "Take this enchanting primer. It will change how you see the world.",
                "I dreamed about your shop last night. It was glowing with power."
            ],
            best_friend: [
                "My life's research, all my notes, I want you to have copies of everything.",
                "Together, we could unlock the secrets of the ancient enchantments.",
                "You are my dearest friend. The stars told me you would come."
            ]
        },
        gifts: [
            { itemId: 'enchanted_scroll', affinityBonus: 5 },
            { itemId: 'sapphire', affinityBonus: 4 },
            { itemId: 'star_crystal', affinityBonus: 7 },
            { itemId: 'ancient_tome', affinityBonus: 8 },
            { itemId: 'ruby', affinityBonus: 3 }
        ],
        quests: [
            { questId: 'luna_crystal_01', minTier: 'acquaintance' },
            { questId: 'luna_enchant_02', minTier: 'friend' },
            { questId: 'luna_arcane_03', minTier: 'close_friend' },
            { questId: 'luna_revelation_04', minTier: 'best_friend' }
        ],
        schedule: {
            days: [2, 4, 6, 7],
            phases: ['afternoon', 'evening']
        },
        unlockCondition: { type: 'level', value: 5 },
        rewards: {
            acquaintance: { discount: 0.05, description: '5% discount on scrolls' },
            friend: { recipe: 'minor_enchantment', description: 'Minor Enchantment recipe unlocked' },
            close_friend: { recipe: 'arcane_infusion', discount: 0.10, description: 'Arcane Infusion recipe + 10% gem discount' },
            best_friend: { recipe: 'stellar_enchantment', statBoost: { enchantPower: 0.30 }, description: 'Stellar Enchantment recipe + 30% enchant power' }
        }
    },

    marcus: {
        id: 'marcus', name: 'Marcus', icon: '⚔', title: 'The Adventurer',
        personality: 'Bold and cheerful, always has a story, loves food and drink.',
        likes: ['food', 'potion'],
        dislikes: ['scroll', 'gem'],
        dialogues: {
            stranger: [
                "Hey there! New shop, huh? Got anything for a hungry adventurer?",
                "Name's Marcus. I've been in every dungeon from here to the coast.",
                "You wouldn't believe what I fought yesterday. Buy me a drink and I'll tell you."
            ],
            acquaintance: [
                "The shopkeeper! Got any healing potions? I go through them like water.",
                "I found this weird cave to the north. Interested?",
                "Your potions saved my hide last week. Good stuff."
            ],
            friend: [
                "Hey buddy! I mapped out a new dungeon floor for you. Lots of loot potential.",
                "If you ever want to come adventuring, just say the word!",
                "I always stop here first before a quest. Best supplies in town."
            ],
            close_friend: [
                "You're the reason I keep coming back alive. Here, take this treasure map.",
                "I'd trust you with my life. Actually, I already do with your potions.",
                "Between us, I found a secret room in the Deep Mines. Check it out."
            ],
            best_friend: [
                "You're my best friend and partner. Everything I find, you get first pick.",
                "I'm naming my signature move after you. The Shopkeeper's Strike!",
                "From adventurer to merchant, there's no one I'd rather have at my side."
            ]
        },
        gifts: [
            { itemId: 'roast_meat', affinityBonus: 4 },
            { itemId: 'health_potion', affinityBonus: 3 },
            { itemId: 'stamina_elixir', affinityBonus: 5 },
            { itemId: 'adventurer_ration', affinityBonus: 4 },
            { itemId: 'golden_ale', affinityBonus: 6 }
        ],
        quests: [
            { questId: 'marcus_supplies_01', minTier: 'acquaintance' },
            { questId: 'marcus_dungeon_02', minTier: 'friend' },
            { questId: 'marcus_deepmine_03', minTier: 'close_friend' },
            { questId: 'marcus_dragon_04', minTier: 'best_friend' }
        ],
        schedule: {
            days: [1, 3, 5, 7],
            phases: ['morning', 'evening']
        },
        unlockCondition: { type: 'level', value: 3 },
        rewards: {
            acquaintance: { item: 'dungeon_map_floor1', description: 'Dungeon Map: Floor 1' },
            friend: { item: 'dungeon_map_floor2', lootBonus: 0.10, description: 'Dungeon Map: Floor 2 + 10% loot bonus' },
            close_friend: { item: 'dungeon_map_secret', lootBonus: 0.20, description: 'Secret Dungeon Map + 20% loot bonus' },
            best_friend: { item: 'dragon_map', statBoost: { dungeonLoot: 0.35 }, description: 'Dragon Lair Map + 35% dungeon loot bonus' }
        }
    },

    rosa: {
        id: 'rosa', name: 'Rosa', icon: '🍰', title: 'The Baker',
        personality: 'Warm and motherly, always smells of fresh bread, generous spirit.',
        likes: ['food', 'material'],
        dislikes: ['weapon', 'armor'],
        dialogues: {
            stranger: [
                "Welcome, dear! I'm Rosa. Would you like a fresh roll? On the house.",
                "A new merchant! The town could use more honest folk.",
                "My bakery is just down the lane. Stop by anytime for a warm meal."
            ],
            acquaintance: [
                "There you are, dear. I brought you some fresh bread.",
                "Business treating you well? You look a bit thin. Eat something!",
                "I need some sugar and flour. Do you carry food ingredients?"
            ],
            friend: [
                "Sweetheart! Let me teach you my grandmother's bread recipe.",
                "I made extra pastries today. Take as many as you like.",
                "You're such a good soul. The town is lucky to have you."
            ],
            close_friend: [
                "You're like family to me now. Here, my secret sourdough starter.",
                "I want you to have my mother's recipe book. She'd have loved you.",
                "Whenever you're feeling down, come to my bakery. There's always a seat for you."
            ],
            best_friend: [
                "My dearest friend, you've brought so much joy to this old baker's life.",
                "Everything I know about cooking is yours. Every recipe, every secret.",
                "You are the warmth in this town, just like a fresh loaf from the oven."
            ]
        },
        gifts: [
            { itemId: 'wheat_flour', affinityBonus: 3 },
            { itemId: 'honey', affinityBonus: 4 },
            { itemId: 'sugar', affinityBonus: 3 },
            { itemId: 'rare_spice', affinityBonus: 6 },
            { itemId: 'golden_apple', affinityBonus: 7 }
        ],
        quests: [
            { questId: 'rosa_ingredients_01', minTier: 'acquaintance' },
            { questId: 'rosa_feast_02', minTier: 'friend' },
            { questId: 'rosa_contest_03', minTier: 'close_friend' },
            { questId: 'rosa_legacy_04', minTier: 'best_friend' }
        ],
        schedule: {
            days: [1, 2, 3, 4, 5, 6],
            phases: ['morning']
        },
        unlockCondition: { type: 'level', value: 1 },
        rewards: {
            acquaintance: { recipe: 'fresh_bread', description: 'Fresh Bread recipe unlocked' },
            friend: { recipe: 'honey_cake', discount: 0.05, description: 'Honey Cake recipe + 5% food ingredient discount' },
            close_friend: { recipe: 'feast_platter', statBoost: { cookingSpeed: 0.15 }, description: 'Feast Platter recipe + 15% cooking speed' },
            best_friend: { recipe: 'legendary_pie', statBoost: { cookingSpeed: 0.30, foodValue: 0.25 }, description: 'Legendary Pie recipe + 30% cooking speed + 25% food value' }
        }
    },

    theron: {
        id: 'theron', name: 'Theron', icon: '⛏', title: 'The Miner',
        personality: 'Quiet and steady, speaks slowly, deeply connected to the earth.',
        likes: ['material', 'gem'],
        dislikes: ['scroll', 'accessory'],
        dialogues: {
            stranger: [
                "...Hm? Oh. Name's Theron. I work the mines.",
                "You buy ores? Might have business to talk about then.",
                "Don't see many surface folk who appreciate good stone."
            ],
            acquaintance: [
                "Found a new vein of copper yesterday. Decent quality.",
                "Your prices are fair. I respect that.",
                "The mountain's been generous this week."
            ],
            friend: [
                "There's a spot in the east mines... I'll mark it on your map.",
                "You've got a miner's eye for quality. That's rare in a merchant.",
                "Here, feel this ore. See how it catches the light? That's the good stuff."
            ],
            close_friend: [
                "I found a mithril deposit. Telling only you.",
                "The deep tunnels... they're dangerous but full of treasure. I'll guide you.",
                "You're the only person I trust enough to share my best spots with."
            ],
            best_friend: [
                "The Heart of the Mountain... I finally found it. Come see it with me.",
                "Every ore vein I find, you'll know about it first. Always.",
                "You are stone-true, friend. The highest compliment a miner can give."
            ]
        },
        gifts: [
            { itemId: 'iron_ore', affinityBonus: 3 },
            { itemId: 'gold_ore', affinityBonus: 5 },
            { itemId: 'mithril_ore', affinityBonus: 7 },
            { itemId: 'diamond', affinityBonus: 8 },
            { itemId: 'pickaxe', affinityBonus: 4 }
        ],
        quests: [
            { questId: 'theron_ores_01', minTier: 'acquaintance' },
            { questId: 'theron_deepvein_02', minTier: 'friend' },
            { questId: 'theron_mithril_03', minTier: 'close_friend' },
            { questId: 'theron_heartstone_04', minTier: 'best_friend' }
        ],
        schedule: {
            days: [1, 2, 4, 5, 6],
            phases: ['morning', 'afternoon']
        },
        unlockCondition: { type: 'level', value: 4 },
        rewards: {
            acquaintance: { discount: 0.05, description: '5% discount on ores' },
            friend: { item: 'mining_map_east', statBoost: { miningYield: 0.10 }, description: 'East Mine Map + 10% mining yield' },
            close_friend: { item: 'mining_map_deep', statBoost: { miningYield: 0.20 }, description: 'Deep Mine Map + 20% mining yield' },
            best_friend: { item: 'heartstone_pick', statBoost: { miningYield: 0.35, rareOreChance: 0.15 }, description: 'Heartstone Pickaxe + 35% mining yield + 15% rare ore chance' }
        }
    },

    ivy: {
        id: 'ivy', name: 'Ivy', icon: '🗡', title: 'The Thief',
        personality: 'Sly and witty, always smirking, speaks in hushed tones.',
        likes: ['accessory', 'gem'],
        dislikes: ['armor', 'tool'],
        dialogues: {
            stranger: [
                "Psst. Hey. Nice shop. Very... accessible. Just kidding. Mostly.",
                "Call me Ivy. I'm in the... acquisitions business.",
                "Relax, I don't steal from friends. And you look friendly."
            ],
            acquaintance: [
                "Got any shiny things? I have a professional appreciation for gems.",
                "Don't look now, but that customer just pocketed something. Want me to handle it?",
                "I hear things on the street. Useful things. Interested?"
            ],
            friend: [
                "I'll teach you a trick: always check for hidden compartments in old furniture.",
                "Someone tried to rob your shop last night. I discouraged them. You're welcome.",
                "Here's a tip: the merchant on Fifth Street is selling fakes. Don't buy from him."
            ],
            close_friend: [
                "I've got contacts in places you wouldn't believe. Need anything, just ask.",
                "I found these in an abandoned hideout. They're clean, I promise. Mostly.",
                "You're one of the few honest people I actually like. Don't ruin it by telling anyone."
            ],
            best_friend: [
                "You're the one person in this world I'd never steal from. That means everything.",
                "My network is your network. Every thief, scout, and spy in the city.",
                "I'd take an arrow for you. Which is saying a lot because I really hate pain."
            ]
        },
        gifts: [
            { itemId: 'ruby', affinityBonus: 4 },
            { itemId: 'emerald', affinityBonus: 4 },
            { itemId: 'gold_ring', affinityBonus: 5 },
            { itemId: 'shadow_cloak', affinityBonus: 7 },
            { itemId: 'diamond', affinityBonus: 6 }
        ],
        quests: [
            { questId: 'ivy_intel_01', minTier: 'acquaintance' },
            { questId: 'ivy_heist_02', minTier: 'friend' },
            { questId: 'ivy_network_03', minTier: 'close_friend' },
            { questId: 'ivy_masterthief_04', minTier: 'best_friend' }
        ],
        schedule: {
            days: [2, 4, 6],
            phases: ['evening']
        },
        unlockCondition: { type: 'level', value: 8 },
        rewards: {
            acquaintance: { statBoost: { theftProtection: 0.20 }, description: '20% theft protection for your shop' },
            friend: { statBoost: { theftProtection: 0.40, bargainFind: 0.10 }, description: '40% theft protection + 10% bargain find chance' },
            close_friend: { statBoost: { theftProtection: 0.60, bargainFind: 0.20 }, item: 'lockpick_set', description: '60% theft protection + 20% bargain finds + Lockpick Set' },
            best_friend: { statBoost: { theftProtection: 0.80, bargainFind: 0.30, blackMarketAccess: true }, description: '80% theft protection + 30% bargain finds + Black Market access' }
        }
    },

    old_man_sage: {
        id: 'old_man_sage', name: 'Old Man Sage', icon: '🧙', title: 'The Wise One',
        personality: 'Ancient and mysterious, speaks in proverbs, knows everything.',
        likes: ['artifact', 'scroll'],
        dislikes: ['food', 'material'],
        dialogues: {
            stranger: [
                "Ah, a new chapter begins. I have been expecting you, young merchant.",
                "Time flows like a river, and you have just stepped into the current.",
                "The universe brought you here for a reason. We shall see what it is."
            ],
            acquaintance: [
                "You return. The stars suggested you would.",
                "Knowledge is the greatest treasure. Remember that when counting gold.",
                "I sense potential in you. Unrealized, but growing."
            ],
            friend: [
                "Sit, friend. Let me tell you of the Old Kingdom and its wonders.",
                "This artifact holds memories of a thousand years. Can you feel them?",
                "The ancients had secrets we are only beginning to rediscover."
            ],
            close_friend: [
                "You have earned wisdom that most spend lifetimes seeking.",
                "Here, take this ancient relic. It has been waiting for someone worthy.",
                "The prophecy speaks of a merchant who changes the world. Perhaps that is you."
            ],
            best_friend: [
                "In all my years, I have never met a soul quite like yours.",
                "Everything I know, every secret of the ancients, I pass to you.",
                "When I am gone, you will carry the wisdom forward. I chose well."
            ]
        },
        gifts: [
            { itemId: 'ancient_artifact', affinityBonus: 8 },
            { itemId: 'enchanted_scroll', affinityBonus: 5 },
            { itemId: 'star_crystal', affinityBonus: 6 },
            { itemId: 'ancient_tome', affinityBonus: 7 },
            { itemId: 'philosopher_stone', affinityBonus: 10 }
        ],
        quests: [
            { questId: 'sage_wisdom_01', minTier: 'acquaintance' },
            { questId: 'sage_artifacts_02', minTier: 'friend' },
            { questId: 'sage_prophecy_03', minTier: 'close_friend' },
            { questId: 'sage_legacy_04', minTier: 'best_friend' }
        ],
        schedule: {
            days: [7],
            phases: ['evening']
        },
        unlockCondition: { type: 'level', value: 15 },
        rewards: {
            acquaintance: { statBoost: { xpGain: 0.10 }, description: '10% XP gain bonus' },
            friend: { statBoost: { xpGain: 0.20 }, recipe: 'ancient_ward', description: '20% XP gain + Ancient Ward recipe' },
            close_friend: { statBoost: { xpGain: 0.30, wisdomBonus: 0.15 }, recipe: 'temporal_elixir', description: '30% XP + 15% wisdom + Temporal Elixir recipe' },
            best_friend: { statBoost: { xpGain: 0.50, wisdomBonus: 0.25, ancientKnowledge: true }, description: '50% XP + 25% wisdom + Ancient Knowledge unlocked' }
        }
    },

    princess_aria: {
        id: 'princess_aria', name: 'Princess Aria', icon: '👸', title: 'The Crown Princess',
        personality: 'Regal but kind, secretly adventurous, longs for freedom.',
        likes: ['artifact', 'gem', 'accessory'],
        dislikes: ['material', 'tool'],
        dialogues: {
            stranger: [
                "Please, no formalities. I'm just... browsing. Incognito.",
                "Your shop is charming. So different from the palace.",
                "Is it true commoners choose their own meals? How wonderful!"
            ],
            acquaintance: [
                "Oh good, it's you. The guards didn't follow me this time.",
                "I brought gold from my personal coffers. What do you recommend?",
                "The palace is so dreadfully boring. Tell me about your adventures."
            ],
            friend: [
                "I trust you completely. Please don't tell anyone I come here.",
                "I want to commission something special. A gift for the kingdom.",
                "You treat me like a person, not a title. Thank you for that."
            ],
            close_friend: [
                "The royal treasury has items I could share with you. Secretly, of course.",
                "Father wants to name an official Royal Supplier. I recommended you.",
                "You're the best friend I've ever had outside the palace walls."
            ],
            best_friend: [
                "By royal decree, you are hereby the Crown's Official Merchant. Congratulations!",
                "You have done more for this kingdom than most nobles ever will.",
                "If I could choose my own council, you would be the first I appoint."
            ]
        },
        gifts: [
            { itemId: 'diamond', affinityBonus: 5 },
            { itemId: 'gold_necklace', affinityBonus: 6 },
            { itemId: 'ancient_artifact', affinityBonus: 7 },
            { itemId: 'legendary_gem', affinityBonus: 10 },
            { itemId: 'star_crystal', affinityBonus: 5 }
        ],
        quests: [
            { questId: 'aria_gift_01', minTier: 'acquaintance' },
            { questId: 'aria_banquet_02', minTier: 'friend' },
            { questId: 'aria_crown_03', minTier: 'close_friend' },
            { questId: 'aria_kingdom_04', minTier: 'best_friend' }
        ],
        schedule: {
            days: [3, 6],
            phases: ['afternoon']
        },
        unlockCondition: { type: 'quest', value: 'meet_the_princess' },
        rewards: {
            acquaintance: { statBoost: { royalFavor: 0.10 }, description: '10% royal favor bonus' },
            friend: { statBoost: { royalFavor: 0.20 }, discount: 0.10, description: '20% royal favor + 10% royal goods discount' },
            close_friend: { statBoost: { royalFavor: 0.35 }, item: 'royal_crest', description: '35% royal favor + Royal Crest (attracts noble customers)' },
            best_friend: { statBoost: { royalFavor: 0.50, customerRate: 0.20 }, item: 'royal_charter', description: '50% royal favor + Royal Charter + 20% more customers' }
        }
    },

    grom: {
        id: 'grom', name: 'Grom', icon: '🪓', title: 'Dwarven Master Smith',
        personality: 'Boisterous and proud, loves ale, fiercely loyal to friends.',
        likes: ['material', 'weapon'],
        dislikes: ['scroll', 'potion'],
        dialogues: {
            stranger: [
                "Ha! A surface merchant! Let's see if ye've got anything worth a dwarf's time.",
                "Grom Ironbeard, at yer service. I forge, I drink, I forge some more.",
                "Yer shop's alright, for surface-folk standards. No offense."
            ],
            acquaintance: [
                "Back again, eh? Brought any good ores this time?",
                "By me beard, that's a fine piece of iron ye've got there.",
                "Ye're not bad, for a non-dwarf. That's a compliment, by the way."
            ],
            friend: [
                "Ha ha! Come, friend! Let me show ye dwarven forging techniques!",
                "Any friend of Grom's gets the best metal prices in the mountain.",
                "Ye've got the heart of a dwarf, even if ye're a bit tall for one."
            ],
            close_friend: [
                "I'll teach ye the secret of Dwarven Steel. Guard it with yer life.",
                "Me great-grandfather's anvil deserves a worthy heir. Take it.",
                "If the dwarven clans ever need a surface ally, I'll name you first."
            ],
            best_friend: [
                "Ye are Dwarf-Friend, the highest honor me people can bestow!",
                "The legendary ore, Starfall Iron. I found it. We forge it together!",
                "In all me centuries of living, ye are the truest friend I've ever known."
            ]
        },
        gifts: [
            { itemId: 'mithril_ore', affinityBonus: 6 },
            { itemId: 'adamantite_ore', affinityBonus: 8 },
            { itemId: 'golden_ale', affinityBonus: 5 },
            { itemId: 'dragon_scale', affinityBonus: 7 },
            { itemId: 'starfall_iron', affinityBonus: 10 }
        ],
        quests: [
            { questId: 'grom_trial_01', minTier: 'acquaintance' },
            { questId: 'grom_forge_02', minTier: 'friend' },
            { questId: 'grom_dwarven_03', minTier: 'close_friend' },
            { questId: 'grom_legendary_04', minTier: 'best_friend' }
        ],
        schedule: {
            days: [1, 3, 5],
            phases: ['afternoon', 'evening']
        },
        unlockCondition: { type: 'area', value: 'dwarven_mines' },
        rewards: {
            acquaintance: { recipe: 'dwarven_nails', description: 'Dwarven Nails recipe unlocked' },
            friend: { recipe: 'dwarven_steel', statBoost: { smithingQuality: 0.15 }, description: 'Dwarven Steel recipe + 15% smithing quality' },
            close_friend: { recipe: 'runic_weapon', statBoost: { smithingQuality: 0.25 }, item: 'dwarven_anvil', description: 'Runic Weapon recipe + 25% smithing quality + Dwarven Anvil' },
            best_friend: { recipe: 'legendary_dwarven_blade', statBoost: { smithingQuality: 0.40, rareOreChance: 0.20 }, description: 'Legendary Dwarven Blade recipe + 40% smithing quality + 20% rare ore chance' }
        }
    },

    sylph: {
        id: 'sylph', name: 'Sylph', icon: '🧚', title: 'Forest Spirit',
        personality: 'Ethereal and gentle, speaks in whispers, deeply connected to nature.',
        likes: ['material', 'potion'],
        dislikes: ['weapon', 'armor'],
        dialogues: {
            stranger: [
                "The wind told me of you... a merchant with a kind spirit.",
                "I am Sylph, voice of the ancient forest. You may speak freely here.",
                "Your heart carries no malice. The trees confirm it."
            ],
            acquaintance: [
                "The flowers bloom when you visit. They sense your gentle nature.",
                "I brought moonflowers from the deepest grove. A gift from the forest.",
                "The forest creatures speak of your fairness. That is rare among humans."
            ],
            friend: [
                "The forest wishes to share its bounty with you. Follow the silver path.",
                "I can teach you to hear the plants. They tell secrets of growth and harvest.",
                "A baby fox spirit has been following you. I think it wants to stay."
            ],
            close_friend: [
                "The Great Tree wants to meet you. Few mortals receive such an invitation.",
                "Take this seedling. It will grow into something extraordinary with your care.",
                "The forest names you Friend of the Wild. Creatures will aid you now."
            ],
            best_friend: [
                "You are part of the forest now, as much as any ancient oak.",
                "The spirits have chosen you as Guardian. Every grove will shelter you.",
                "In all the ages of the wood, no mortal has been loved as you are."
            ]
        },
        gifts: [
            { itemId: 'moonflower', affinityBonus: 7 },
            { itemId: 'healing_herb', affinityBonus: 4 },
            { itemId: 'fairy_dust', affinityBonus: 8 },
            { itemId: 'ancient_seed', affinityBonus: 9 },
            { itemId: 'spirit_water', affinityBonus: 6 }
        ],
        quests: [
            { questId: 'sylph_nature_01', minTier: 'acquaintance' },
            { questId: 'sylph_grove_02', minTier: 'friend' },
            { questId: 'sylph_greattree_03', minTier: 'close_friend' },
            { questId: 'sylph_guardian_04', minTier: 'best_friend' }
        ],
        schedule: {
            days: [1, 4, 7],
            phases: ['morning']
        },
        unlockCondition: { type: 'area', value: 'ancient_forest' },
        rewards: {
            acquaintance: { statBoost: { herbYield: 0.10 }, description: '10% herb yield bonus' },
            friend: { statBoost: { herbYield: 0.20 }, item: 'fox_spirit_pet', description: '20% herb yield + Fox Spirit pet' },
            close_friend: { statBoost: { herbYield: 0.30, natureBlessing: 0.15 }, item: 'forest_charm', description: '30% herb yield + 15% nature blessing + Forest Charm' },
            best_friend: { statBoost: { herbYield: 0.50, natureBlessing: 0.30 }, item: 'guardian_staff', description: '50% herb yield + 30% nature blessing + Guardian Staff' }
        }
    },

    captain_rex: {
        id: 'captain_rex', name: 'Captain Rex', icon: '🚢', title: 'Ship Captain',
        personality: 'Weathered and worldly, speaks with sea metaphors, loves rare goods.',
        likes: ['artifact', 'gem', 'accessory'],
        dislikes: ['food', 'tool'],
        dialogues: {
            stranger: [
                "Ahoy, landlubber! Captain Rex, master of the Azure Wind. At your service.",
                "Every port has its merchants. Let's see if you're worth dropping anchor for.",
                "I sail the seven seas looking for the extraordinary. Got anything like that?"
            ],
            acquaintance: [
                "Good to see ye again! I brought exotic goods from the eastern isles.",
                "The seas have been kind. My hold is full of foreign treasures.",
                "Ye run a tight ship here, merchant. I respect that."
            ],
            friend: [
                "I've charted a new trade route. Want exclusive access? First pick of foreign goods.",
                "Storm season's coming, but for you, I'll make the run.",
                "Ye know what makes a good captain? Same thing that makes a good merchant. Trust."
            ],
            close_friend: [
                "There's an island not on any map. Treasures beyond imagination. Want to go?",
                "I'm opening my private trade network to you. Goods from every corner of the world.",
                "Ye've earned the respect of every sailor in my fleet. That's no small thing."
            ],
            best_friend: [
                "I'm naming my new flagship after you. The finest vessel on the seas.",
                "Every trade route, every contact, every treasure map. It's all yours.",
                "In forty years of sailing, ye are the only person I'd trust with my ship."
            ]
        },
        gifts: [
            { itemId: 'exotic_spice', affinityBonus: 5 },
            { itemId: 'pearl', affinityBonus: 4 },
            { itemId: 'foreign_artifact', affinityBonus: 7 },
            { itemId: 'treasure_map', affinityBonus: 6 },
            { itemId: 'kraken_tooth', affinityBonus: 9 }
        ],
        quests: [
            { questId: 'rex_cargo_01', minTier: 'acquaintance' },
            { questId: 'rex_voyage_02', minTier: 'friend' },
            { questId: 'rex_island_03', minTier: 'close_friend' },
            { questId: 'rex_treasure_04', minTier: 'best_friend' }
        ],
        schedule: {
            days: [2, 5, 7],
            phases: ['morning', 'afternoon']
        },
        unlockCondition: { type: 'level', value: 12 },
        rewards: {
            acquaintance: { statBoost: { foreignGoodsAccess: true }, description: 'Access to foreign trade goods' },
            friend: { statBoost: { tradeRouteBonus: 0.15 }, item: 'trade_route_east', description: 'Eastern Trade Route + 15% trade bonus' },
            close_friend: { statBoost: { tradeRouteBonus: 0.25 }, item: 'trade_route_south', description: 'Southern Trade Route + 25% trade bonus' },
            best_friend: { statBoost: { tradeRouteBonus: 0.40, rareItemChance: 0.20 }, item: 'flagship_access', description: '40% trade bonus + 20% rare item chance + Personal Flagship' }
        }
    }
};

// NPC Relationship System
class NpcRelationshipSystem {
    constructor() {
        this.relationships = new Map();
        // Initialize all NPC relationships
        for (const npcId of Object.keys(NpcDB)) {
            this.relationships.set(npcId, {
                level: 0,
                giftsGiven: 0,
                questsDone: 0,
                met: false,
                lastGiftDay: -1
            });
        }
    }

    getFriendshipTier(npcId) {
        const rel = this.relationships.get(npcId);
        if (!rel || !rel.met) return FriendshipTier.STRANGER;
        if (rel.level >= FriendshipThresholds.best_friend) return FriendshipTier.BEST_FRIEND;
        if (rel.level >= FriendshipThresholds.close_friend) return FriendshipTier.CLOSE_FRIEND;
        if (rel.level >= FriendshipThresholds.friend) return FriendshipTier.FRIEND;
        if (rel.level >= FriendshipThresholds.acquaintance) return FriendshipTier.ACQUAINTANCE;
        return FriendshipTier.STRANGER;
    }

    meetNpc(npcId) {
        const rel = this.relationships.get(npcId);
        if (rel && !rel.met) {
            rel.met = true;
            rel.level = 1;
        }
    }

    giveGift(npcId, itemId, currentDay) {
        const rel = this.relationships.get(npcId);
        if (!rel || !rel.met) return { success: false, message: "You haven't met this person yet." };

        // One gift per NPC per day
        if (rel.lastGiftDay === currentDay) {
            return { success: false, message: "You've already given a gift today." };
        }

        const npc = NpcDB[npcId];
        if (!npc) return { success: false, message: "Unknown NPC." };

        let affinityGain = 1; // base gain
        const preferredGift = npc.gifts.find(g => g.itemId === itemId);
        if (preferredGift) {
            affinityGain = preferredGift.affinityBonus;
        } else if (npc.likes.some(cat => itemId.includes(cat))) {
            affinityGain = 2;
        } else if (npc.dislikes.some(cat => itemId.includes(cat))) {
            affinityGain = -2;
        }

        const oldTier = this.getFriendshipTier(npcId);
        rel.level = Math.max(0, Math.min(100, rel.level + affinityGain));
        rel.giftsGiven++;
        rel.lastGiftDay = currentDay;
        const newTier = this.getFriendshipTier(npcId);

        const result = {
            success: true,
            affinityGain,
            newLevel: rel.level,
            tierUp: oldTier !== newTier,
            newTier
        };

        if (result.tierUp) {
            result.message = `Your friendship with ${npc.name} has grown to ${newTier}!`;
            result.rewards = npc.rewards[newTier] || null;
        } else if (affinityGain > 0) {
            result.message = `${npc.name} appreciates the gift!`;
        } else if (affinityGain < 0) {
            result.message = `${npc.name} doesn't seem to like that...`;
        } else {
            result.message = `${npc.name} accepts the gift politely.`;
        }

        return result;
    }

    completeQuest(npcId) {
        const rel = this.relationships.get(npcId);
        if (!rel) return;
        rel.questsDone++;
        const oldTier = this.getFriendshipTier(npcId);
        rel.level = Math.min(100, rel.level + 5);
        const newTier = this.getFriendshipTier(npcId);
        return { tierUp: oldTier !== newTier, newTier, newLevel: rel.level };
    }

    getBonuses(npcId) {
        const tier = this.getFriendshipTier(npcId);
        const npc = NpcDB[npcId];
        if (!npc || tier === FriendshipTier.STRANGER) return null;
        return npc.rewards[tier] || null;
    }

    getAllBonuses() {
        const bonuses = {};
        for (const npcId of Object.keys(NpcDB)) {
            const bonus = this.getBonuses(npcId);
            if (bonus) bonuses[npcId] = bonus;
        }
        return bonuses;
    }

    getAvailableNpcs(day, dayPhase, level) {
        const dayOfWeek = ((day - 1) % 7) + 1;
        const available = [];

        for (const [npcId, npc] of Object.entries(NpcDB)) {
            // Check unlock condition
            let unlocked = false;
            switch (npc.unlockCondition.type) {
                case 'level':
                    unlocked = level >= npc.unlockCondition.value;
                    break;
                case 'area':
                case 'quest':
                    // These require external state checks; include them if already met
                    const rel = this.relationships.get(npcId);
                    unlocked = rel && rel.met;
                    break;
                default:
                    unlocked = true;
            }

            if (!unlocked) continue;

            // Check schedule
            if (npc.schedule.days.includes(dayOfWeek) && npc.schedule.phases.includes(dayPhase)) {
                available.push({
                    ...npc,
                    friendship: this.getFriendshipTier(npcId),
                    level: this.relationships.get(npcId).level
                });
            }
        }

        return available;
    }

    getDialogue(npcId) {
        const npc = NpcDB[npcId];
        if (!npc) return "...";
        const tier = this.getFriendshipTier(npcId);
        const dialogues = npc.dialogues[tier];
        if (!dialogues || dialogues.length === 0) return "...";
        return dialogues[Math.floor(Math.random() * dialogues.length)];
    }

    getAvailableQuests(npcId) {
        const npc = NpcDB[npcId];
        if (!npc) return [];
        const tier = this.getFriendshipTier(npcId);
        const tierOrder = ['stranger', 'acquaintance', 'friend', 'close_friend', 'best_friend'];
        const currentTierIndex = tierOrder.indexOf(tier);
        return npc.quests.filter(q => {
            const requiredIndex = tierOrder.indexOf(q.minTier);
            return requiredIndex <= currentTierIndex;
        });
    }

    serialize() {
        const data = {};
        for (const [npcId, rel] of this.relationships) {
            data[npcId] = { ...rel };
        }
        return data;
    }

    deserialize(data) {
        if (!data) return;
        for (const [npcId, rel] of Object.entries(data)) {
            if (this.relationships.has(npcId)) {
                this.relationships.set(npcId, { ...rel });
            }
        }
    }
}
