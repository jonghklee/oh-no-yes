// Shop management system
class ShopSystem {
    constructor() {
        this.displayItems = []; // items on display for customers
        this.maxDisplay = 8;
        this.customers = []; // current customers in shop
        this.maxCustomers = 3;
        this.customerTimer = 0;
        this.customerInterval = 8000; // ms between customers
        this.totalSales = 0;
        this.totalEarnings = 0;
        this.dailySales = 0;
        this.dailyEarnings = 0;
        this.satisfiedCustomers = 0;
        this.shopLevel = 1;
        this.activeNegotiation = null;
        this.autoSellEnabled = false;
        this.autoSellMinRarity = 'common'; // auto-sell items of this rarity or lower
    }

    addToDisplay(itemId, qty, inventory) {
        if (this.displayItems.length >= this.maxDisplay) return false;
        if (!inventory.hasItem(itemId, qty)) return false;

        inventory.removeItem(itemId, qty);
        const existing = this.displayItems.find(d => d.id === itemId);
        if (existing) {
            existing.quantity += qty;
        } else {
            const item = Utils.deepClone(ItemDB[itemId]);
            item.quantity = qty;
            this.displayItems.push(item);
        }
        return true;
    }

    removeFromDisplay(index, inventory) {
        if (index < 0 || index >= this.displayItems.length) return false;
        const item = this.displayItems[index];
        inventory.addItem(item.id, item.quantity);
        this.displayItems.splice(index, 1);
        return true;
    }

    update(dt, day, reputation, economy, skillBonuses) {
        // Spawn customers
        this.customerTimer += dt;
        let interval = this.customerInterval;

        // Apply customer rate modifiers
        if (skillBonuses.customerRate) interval /= skillBonuses.customerRate;
        for (const event of economy.activeEvents) {
            if (event.effects.customerRate) interval /= event.effects.customerRate;
        }

        if (this.customerTimer >= interval && this.customers.length < this.maxCustomers) {
            this.customerTimer = 0;
            const customer = generateCustomer(day, reputation);
            this.customers.push(customer);
        }

        // Update customers
        const results = [];
        for (let i = this.customers.length - 1; i >= 0; i--) {
            const customer = this.customers[i];

            // If customer is browsing (no active negotiation with them)
            if (!this.activeNegotiation || this.activeNegotiation.customerId !== customer.id) {
                customer.browseTimer = (customer.browseTimer || 0) + dt;
                if (customer.browseTimer > 5000) { // 5 seconds of browsing
                    // Customer wants to buy something
                    const wanted = this.findItemForCustomer(customer, economy, skillBonuses);
                    if (wanted) {
                        // Auto-negotiation if no active negotiation
                        if (!this.activeNegotiation) {
                            this.startNegotiation(customer, wanted, economy, skillBonuses);
                        }
                    } else {
                        // Nothing to buy, leave
                        customer.currentPatience--;
                        customer.browseTimer = 0;
                        if (customer.currentPatience <= 0) {
                            results.push({ type: 'customerLeft', customer });
                            this.customers.splice(i, 1);
                        }
                    }
                }
            }
        }
        return results;
    }

    findItemForCustomer(customer, economy, skillBonuses) {
        // Find items customer wants to buy
        const matches = this.displayItems.filter(item => {
            if (item.quantity <= 0) return false;
            if (customer.preferredCategories.includes(item.category)) return true;
            return Math.random() < 0.2; // 20% chance to buy non-preferred
        });

        if (matches.length === 0) return null;

        // Pick the best match within budget
        const affordable = matches.filter(item => {
            const price = economy.getSellPrice(item.id, item.quality || 1.0, skillBonuses);
            return price <= customer.budget;
        });

        if (affordable.length === 0) return null;
        return Utils.choice(affordable);
    }

    startNegotiation(customer, item, economy, skillBonuses) {
        const basePrice = economy.getSellPrice(item.id, item.quality || 1.0, skillBonuses);
        const qualityMult = customer.qualityMultiplier || 1.0;
        const askPrice = Math.round(basePrice * qualityMult);

        this.activeNegotiation = {
            customerId: customer.id,
            customer,
            item,
            askPrice,
            currentOffer: askPrice,
            customerOffer: Math.round(askPrice * (0.7 + customer.haggleSkill * 0.2)),
            haggleCount: 0,
            state: 'offering' // offering, haggling, done
        };
    }

    acceptOffer() {
        if (!this.activeNegotiation) return null;
        const neg = this.activeNegotiation;
        const price = neg.currentOffer;

        // Remove item from display
        const idx = this.displayItems.findIndex(d => d.id === neg.item.id);
        if (idx !== -1) {
            this.displayItems[idx].quantity--;
            if (this.displayItems[idx].quantity <= 0) {
                this.displayItems.splice(idx, 1);
            }
        }

        this.totalSales++;
        this.dailySales++;
        this.totalEarnings += price;
        this.dailyEarnings += price;
        this.satisfiedCustomers++;

        // Remove customer
        const custIdx = this.customers.findIndex(c => c.id === neg.customerId);
        if (custIdx !== -1) this.customers.splice(custIdx, 1);

        const result = {
            type: 'sold',
            item: neg.item,
            price,
            customer: neg.customer,
            dialogue: Utils.choice(neg.customer.dialogue.buy)
        };

        this.activeNegotiation = null;
        return result;
    }

    haggle() {
        if (!this.activeNegotiation) return null;
        const neg = this.activeNegotiation;

        if (neg.haggleCount >= neg.customer.maxHaggle) {
            return { type: 'noMoreHaggle', dialogue: 'Take it or leave it!' };
        }

        neg.haggleCount++;
        // Customer raises offer slightly
        neg.customerOffer = Math.round(neg.customerOffer * 1.1);
        neg.currentOffer = neg.customerOffer;

        // Customer patience decreases
        neg.customer.currentPatience--;
        if (neg.customer.currentPatience <= 0) {
            const custIdx = this.customers.findIndex(c => c.id === neg.customerId);
            if (custIdx !== -1) this.customers.splice(custIdx, 1);
            const result = {
                type: 'customerAngry',
                dialogue: Utils.choice(neg.customer.dialogue.leave)
            };
            this.activeNegotiation = null;
            return result;
        }

        return {
            type: 'haggled',
            newOffer: neg.currentOffer,
            dialogue: Utils.choice(neg.customer.dialogue.haggle)
        };
    }

    counterOffer(price) {
        if (!this.activeNegotiation) return null;
        const neg = this.activeNegotiation;

        // How far is the counter-offer from what customer is willing to pay?
        const maxWilling = Math.round(neg.askPrice * (1.2 + neg.customer.haggleSkill * 0.3));
        const ratio = price / maxWilling;

        if (price <= neg.currentOffer) {
            // Player asking less than current offer - auto accept
            neg.currentOffer = price;
            return { type: 'accepted', dialogue: Utils.choice(neg.customer.dialogue.happy) };
        }

        if (ratio > 1.5) {
            // Way too high - customer leaves
            neg.customer.currentPatience = 0;
            const custIdx = this.customers.findIndex(c => c.id === neg.customerId);
            if (custIdx !== -1) this.customers.splice(custIdx, 1);
            this.activeNegotiation = null;
            return { type: 'customerAngry', dialogue: "That's outrageous! I'm leaving!" };
        }

        if (ratio > 1.2) {
            // Too high - customer refuses but stays
            neg.customer.currentPatience--;
            if (neg.customer.currentPatience <= 0) {
                const custIdx = this.customers.findIndex(c => c.id === neg.customerId);
                if (custIdx !== -1) this.customers.splice(custIdx, 1);
                this.activeNegotiation = null;
                return { type: 'customerAngry', dialogue: Utils.choice(neg.customer.dialogue.leave) };
            }
            return { type: 'tooHigh', dialogue: "That's too much. Try lower.", newOffer: neg.currentOffer };
        }

        // Reasonable counter - meet in the middle
        const meetPrice = Math.round((price + neg.currentOffer) / 2);
        neg.currentOffer = Math.min(price, Math.max(meetPrice, neg.currentOffer));
        neg.haggleCount++;

        if (neg.currentOffer >= price * 0.9) {
            return { type: 'accepted', dialogue: "Fine, you drive a hard bargain!", newOffer: neg.currentOffer };
        }

        return { type: 'counter', dialogue: `How about ${neg.currentOffer}g?`, newOffer: neg.currentOffer };
    }

    rejectOffer() {
        if (!this.activeNegotiation) return null;
        const neg = this.activeNegotiation;

        // Customer leaves
        const custIdx = this.customers.findIndex(c => c.id === neg.customerId);
        if (custIdx !== -1) this.customers.splice(custIdx, 1);

        const result = {
            type: 'rejected',
            dialogue: Utils.choice(neg.customer.dialogue.leave)
        };
        this.activeNegotiation = null;
        return result;
    }

    newDay() {
        this.dailySales = 0;
        this.dailyEarnings = 0;
        this.customers = [];
        this.activeNegotiation = null;
        this.customerTimer = 0;
    }

    // Shop upgrades
    getUpgrades() {
        return [
            {
                id: 'display_slots', name: 'Expand Display',
                description: `Add 4 more display slots (current: ${this.maxDisplay})`,
                cost: 200 * this.shopLevel, maxLevel: 5,
                currentLevel: Math.floor((this.maxDisplay - 8) / 4),
                apply: () => { this.maxDisplay += 4; }
            },
            {
                id: 'customer_slots', name: 'Bigger Shop',
                description: `Allow ${this.maxCustomers + 1} customers at once`,
                cost: 300 * this.shopLevel, maxLevel: 4,
                currentLevel: this.maxCustomers - 3,
                apply: () => { this.maxCustomers++; }
            },
            {
                id: 'faster_customers', name: 'Better Location',
                description: 'Customers arrive 15% faster',
                cost: 250 * this.shopLevel, maxLevel: 5,
                currentLevel: Math.round((8000 - this.customerInterval) / 1200),
                apply: () => { this.customerInterval = Math.max(3000, this.customerInterval - 1200); }
            },
            {
                id: 'shop_level', name: 'Shop Renovation',
                description: `Upgrade shop to level ${this.shopLevel + 1}. Better customers!`,
                cost: 500 * this.shopLevel, maxLevel: 10,
                currentLevel: this.shopLevel - 1,
                apply: () => { this.shopLevel++; }
            }
        ];
    }

    buyUpgrade(upgradeId, gold) {
        const upgrade = this.getUpgrades().find(u => u.id === upgradeId);
        if (!upgrade) return { success: false, reason: 'Upgrade not found' };
        if (upgrade.currentLevel >= upgrade.maxLevel) return { success: false, reason: 'Already maxed!' };
        if (gold < upgrade.cost) return { success: false, reason: `Need ${upgrade.cost}g` };
        upgrade.apply();
        return { success: true, cost: upgrade.cost };
    }

    serialize() {
        return {
            displayItems: this.displayItems,
            maxDisplay: this.maxDisplay,
            maxCustomers: this.maxCustomers,
            customerInterval: this.customerInterval,
            totalSales: this.totalSales,
            totalEarnings: this.totalEarnings,
            satisfiedCustomers: this.satisfiedCustomers,
            shopLevel: this.shopLevel
        };
    }

    deserialize(data) {
        Object.assign(this, data);
        this.customers = [];
        this.activeNegotiation = null;
    }
}
