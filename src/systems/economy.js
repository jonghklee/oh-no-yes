// Dynamic economy system
class Economy {
    constructor() {
        this.prices = {}; // current market prices
        this.priceHistory = {}; // { itemId: [last 30 days] }
        this.supply = {}; // supply levels
        this.demand = {}; // demand levels
        this.trends = {}; // price trends
        this.taxRate = 0.05; // 5% default tax
        this.activeEvents = [];
        this.season = null;

        this.initPrices();
    }

    initPrices() {
        for (const [id, item] of Object.entries(ItemDB)) {
            this.prices[id] = item.basePrice;
            this.priceHistory[id] = [item.basePrice];
            this.supply[id] = 50;
            this.demand[id] = 50;
            this.trends[id] = 0; // -1 to 1
        }
    }

    getPrice(itemId, quality = 1.0) {
        const base = this.prices[itemId] || 0;
        return Math.max(1, Math.round(base * quality));
    }

    getSellPrice(itemId, quality = 1.0, bonuses = {}) {
        let price = this.getPrice(itemId, quality);
        // Apply sell bonus from skills
        if (bonuses.sellBonus) price = Math.round(price * (1 + bonuses.sellBonus));
        // Apply tax
        const effectiveTax = this.taxRate * (1 - (bonuses.taxReduction || 0));
        price = Math.round(price * (1 - effectiveTax));
        // Apply event modifiers
        for (const event of this.activeEvents) {
            if (event.effects.sellPriceModifier) {
                price = Math.round(price * event.effects.sellPriceModifier);
            }
        }
        return Math.max(1, price);
    }

    getBuyPrice(itemId, quality = 1.0, bonuses = {}) {
        let price = Math.round(this.getPrice(itemId, quality) * 1.3); // 30% markup for buying
        if (bonuses.buyDiscount) price = Math.round(price * (1 - bonuses.buyDiscount));
        for (const event of this.activeEvents) {
            if (event.effects.buyPriceModifier) {
                price = Math.round(price * event.effects.buyPriceModifier);
            }
        }
        return Math.max(1, price);
    }

    // Called each new day
    updatePrices(day) {
        this.season = getSeason(day);

        // Update events
        this.activeEvents = this.activeEvents.filter(e => {
            e.duration--;
            return e.duration > 0;
        });

        // Check for new events
        const newEvent = checkForEvent(day);
        if (newEvent) {
            this.activeEvents.push(newEvent);
        }

        // Update supply and demand
        for (const [id, item] of Object.entries(ItemDB)) {
            // Random fluctuation
            this.supply[id] += Utils.random(-5, 5);
            this.demand[id] += Utils.random(-5, 5);

            // Keep in bounds
            this.supply[id] = Utils.clamp(this.supply[id], 10, 100);
            this.demand[id] = Utils.clamp(this.demand[id], 10, 100);

            // Calculate trend
            const supplyDemandRatio = this.demand[id] / this.supply[id];
            this.trends[id] = Utils.clamp(supplyDemandRatio - 1, -0.5, 0.5);

            // Apply trend to price
            let newPrice = item.basePrice * (0.7 + supplyDemandRatio * 0.6);

            // Season modifiers
            if (this.season) {
                const effects = this.season.effects;
                if (effects.potionDemand && item.category === 'potion') {
                    newPrice *= effects.potionDemand;
                }
            }

            // Event demand modifiers
            for (const event of this.activeEvents) {
                if (event.effects.demandModifier && event.effects.demandModifier[item.category]) {
                    newPrice *= event.effects.demandModifier[item.category];
                }
                if (event.effects.categoryPriceModifier && event.effects.categoryPriceModifier[item.category]) {
                    newPrice *= event.effects.categoryPriceModifier[item.category];
                }
            }

            // Random daily variation (±5%)
            newPrice *= Utils.randomFloat(0.95, 1.05);

            // Smooth transition
            this.prices[id] = Math.round(Utils.lerp(this.prices[id], newPrice, 0.3));
            this.prices[id] = Math.max(1, this.prices[id]);

            // Record history
            this.priceHistory[id].push(this.prices[id]);
            if (this.priceHistory[id].length > 30) this.priceHistory[id].shift();
        }
    }

    getTrend(itemId) {
        const t = this.trends[itemId] || 0;
        if (t > 0.15) return { icon: '▲▲', color: '#44ff44', text: 'Rising Fast' };
        if (t > 0.05) return { icon: '▲', color: '#88ff88', text: 'Rising' };
        if (t < -0.15) return { icon: '▼▼', color: '#ff4444', text: 'Falling Fast' };
        if (t < -0.05) return { icon: '▼', color: '#ff8888', text: 'Falling' };
        return { icon: '─', color: '#aaaaaa', text: 'Stable' };
    }

    getEffectiveTaxRate(bonuses = {}) {
        let rate = this.taxRate;
        for (const event of this.activeEvents) {
            if (event.effects.taxRate !== undefined) rate = event.effects.taxRate;
        }
        rate *= (1 - (bonuses.taxReduction || 0));
        return rate;
    }

    serialize() {
        return {
            prices: this.prices,
            priceHistory: this.priceHistory,
            supply: this.supply,
            demand: this.demand,
            trends: this.trends,
            activeEvents: this.activeEvents
        };
    }

    deserialize(data) {
        Object.assign(this, data);
    }
}
