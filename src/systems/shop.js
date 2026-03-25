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
            // Customer leaves
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

    serialize() {
        return {
            displayItems: this.displayItems,
            maxDisplay: this.maxDisplay,
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
