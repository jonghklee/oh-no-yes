// Trade Route System - send caravans for passive income
class TradeRouteSystem {
    constructor() {
        this.routes = [];
        this.activeCaravans = [];
        this.totalProfit = 0;
        this.caravansCompleted = 0;
        this.maxActiveCaravans = 2;
    }

    getAvailableRoutes(day) {
        return [
            {
                id: 'local_village', name: 'Local Village',
                icon: '🏘', distance: 3, // days to complete
                investment: 100, profitRange: [120, 180],
                risk: 0.05, // 5% chance of loss
                description: 'Short, safe route to a nearby village.',
                unlockDay: 1
            },
            {
                id: 'port_city', name: 'Port City',
                icon: '⚓', distance: 5,
                investment: 300, profitRange: [400, 600],
                risk: 0.1,
                description: 'A sea trade to the bustling port city.',
                unlockDay: 10
            },
            {
                id: 'mountain_pass', name: 'Mountain Pass',
                icon: '⛰', distance: 7,
                investment: 500, profitRange: [700, 1200],
                risk: 0.15,
                description: 'Dangerous mountain route with high rewards.',
                unlockDay: 20
            },
            {
                id: 'desert_oasis', name: 'Desert Oasis',
                icon: '🏜', distance: 10,
                investment: 800, profitRange: [1200, 2000],
                risk: 0.2,
                description: 'Long trek through the desert. Very profitable.',
                unlockDay: 40
            },
            {
                id: 'foreign_kingdom', name: 'Foreign Kingdom',
                icon: '🏰', distance: 15,
                investment: 1500, profitRange: [2500, 4500],
                risk: 0.25,
                description: 'Trade with a foreign kingdom. Highest risk and reward.',
                unlockDay: 60
            }
        ].filter(r => day >= r.unlockDay);
    }

    sendCaravan(routeId, day, gold) {
        if (this.activeCaravans.length >= this.maxActiveCaravans) {
            return { error: 'Max caravans active! Wait for one to return.' };
        }

        const routes = this.getAvailableRoutes(day);
        const route = routes.find(r => r.id === routeId);
        if (!route) return { error: 'Route not available.' };
        if (gold < route.investment) return { error: `Need ${route.investment}g to invest.` };

        this.activeCaravans.push({
            route,
            sentDay: day,
            returnDay: day + route.distance,
            investment: route.investment
        });

        return { success: true, cost: route.investment, returnDay: day + route.distance };
    }

    checkReturns(day) {
        const returns = [];
        for (let i = this.activeCaravans.length - 1; i >= 0; i--) {
            const caravan = this.activeCaravans[i];
            if (day >= caravan.returnDay) {
                const route = caravan.route;
                // Check risk
                if (Math.random() < route.risk) {
                    // Lost!
                    returns.push({
                        route: route.name,
                        icon: route.icon,
                        success: false,
                        lost: caravan.investment,
                        message: `Caravan to ${route.name} was lost! -${caravan.investment}g`
                    });
                } else {
                    // Profit!
                    const profit = Utils.random(route.profitRange[0], route.profitRange[1]);
                    const netProfit = profit - caravan.investment;
                    this.totalProfit += netProfit;
                    this.caravansCompleted++;
                    returns.push({
                        route: route.name,
                        icon: route.icon,
                        success: true,
                        profit: profit,
                        netProfit: netProfit,
                        message: `Caravan from ${route.name} returned! +${profit}g (${netProfit > 0 ? '+' : ''}${netProfit}g profit)`
                    });
                }
                this.activeCaravans.splice(i, 1);
            }
        }
        return returns;
    }

    serialize() {
        return {
            activeCaravans: this.activeCaravans,
            totalProfit: this.totalProfit,
            caravansCompleted: this.caravansCompleted,
            maxActiveCaravans: this.maxActiveCaravans
        };
    }

    deserialize(data) {
        Object.assign(this, data || {});
    }
}
