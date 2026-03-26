// Market Order System - set price alerts and auto-sell rules
class MarketOrderSystem {
    constructor() {
        this.sellOrders = []; // { itemId, minPrice, qty }
        this.priceAlerts = []; // { itemId, targetPrice, direction: 'above'|'below' }
        this.maxOrders = 5;
        this.totalAutoSold = 0;
        this.totalAutoEarned = 0;
    }

    addSellOrder(itemId, minPrice, qty) {
        if (this.sellOrders.length >= this.maxOrders) return { error: 'Max orders reached' };
        this.sellOrders.push({ itemId, minPrice, qty, filled: 0 });
        return { success: true };
    }

    addPriceAlert(itemId, targetPrice, direction) {
        if (this.priceAlerts.length >= this.maxOrders) return { error: 'Max alerts reached' };
        this.priceAlerts.push({ itemId, targetPrice, direction, triggered: false });
        return { success: true };
    }

    removeSellOrder(index) {
        if (index >= 0 && index < this.sellOrders.length) {
            this.sellOrders.splice(index, 1);
            return true;
        }
        return false;
    }

    removePriceAlert(index) {
        if (index >= 0 && index < this.priceAlerts.length) {
            this.priceAlerts.splice(index, 1);
            return true;
        }
        return false;
    }

    // Process orders - called each day
    processOrders(economy, inventory, skillBonuses) {
        const results = [];

        // Process sell orders
        for (let i = this.sellOrders.length - 1; i >= 0; i--) {
            const order = this.sellOrders[i];
            const currentPrice = economy.getSellPrice(order.itemId, 1.0, skillBonuses);

            if (currentPrice >= order.minPrice && inventory.hasItem(order.itemId, 1)) {
                const toSell = Math.min(order.qty - order.filled, inventory.getCount(order.itemId));
                if (toSell > 0) {
                    let totalGold = 0;
                    for (let s = 0; s < toSell; s++) {
                        if (inventory.removeItem(order.itemId, 1)) {
                            totalGold += currentPrice;
                            order.filled++;
                        }
                    }
                    this.totalAutoSold += toSell;
                    this.totalAutoEarned += totalGold;
                    results.push({
                        type: 'sold',
                        item: order.itemId,
                        qty: toSell,
                        gold: totalGold,
                        price: currentPrice
                    });

                    if (order.filled >= order.qty) {
                        this.sellOrders.splice(i, 1);
                    }
                }
            }
        }

        // Check price alerts
        for (let i = this.priceAlerts.length - 1; i >= 0; i--) {
            const alert = this.priceAlerts[i];
            const currentPrice = economy.getPrice(alert.itemId);

            const triggered = alert.direction === 'above'
                ? currentPrice >= alert.targetPrice
                : currentPrice <= alert.targetPrice;

            if (triggered) {
                results.push({
                    type: 'alert',
                    item: alert.itemId,
                    price: currentPrice,
                    direction: alert.direction
                });
                this.priceAlerts.splice(i, 1);
            }
        }

        return results;
    }

    serialize() {
        return {
            sellOrders: this.sellOrders,
            priceAlerts: this.priceAlerts,
            maxOrders: this.maxOrders,
            totalAutoSold: this.totalAutoSold,
            totalAutoEarned: this.totalAutoEarned
        };
    }

    deserialize(data) {
        Object.assign(this, data || {});
    }
}
