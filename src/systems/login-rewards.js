// Daily Login Reward Calendar - 7-day cycle
class LoginRewardSystem {
    constructor() {
        this.currentDay = 0; // 0-6 in the 7-day cycle
        this.lastClaimedGameDay = 0;
        this.totalClaimed = 0;
        this.cyclesCompleted = 0;
    }

    getRewards() {
        const cycleBonus = 1 + this.cyclesCompleted * 0.2; // +20% per completed cycle
        return [
            { day: 1, name: '50 Gold', icon: '🪙', type: 'gold', value: Math.round(50 * cycleBonus) },
            { day: 2, name: 'Health Potion x3', icon: '🧪', type: 'item', item: 'health_potion', qty: 3 },
            { day: 3, name: '150 Gold', icon: '💰', type: 'gold', value: Math.round(150 * cycleBonus) },
            { day: 4, name: 'Crystal x2', icon: '🔮', type: 'item', item: 'crystal', qty: 2 },
            { day: 5, name: '300 Gold', icon: '💎', type: 'gold', value: Math.round(300 * cycleBonus) },
            { day: 6, name: '+1 Skill Point', icon: '⭐', type: 'skillPoint', value: 1 },
            { day: 7, name: 'MEGA REWARD!', icon: '🎁', type: 'mega', gold: Math.round(1000 * cycleBonus), items: [
                { item: 'ruby', qty: 1 },
                { item: 'moonflower', qty: 5 }
            ]},
        ];
    }

    canClaim(gameDay) {
        return gameDay > this.lastClaimedGameDay;
    }

    claim(gameDay) {
        if (!this.canClaim(gameDay)) return null;

        this.lastClaimedGameDay = gameDay;
        this.currentDay++;
        this.totalClaimed++;

        const rewards = this.getRewards();
        const todayReward = rewards[(this.currentDay - 1) % 7];

        if (this.currentDay % 7 === 0) {
            this.cyclesCompleted++;
            this.currentDay = 0;
        }

        return todayReward;
    }

    getDayInCycle() {
        return (this.currentDay % 7) + 1;
    }

    serialize() {
        return {
            currentDay: this.currentDay,
            lastClaimedGameDay: this.lastClaimedGameDay,
            totalClaimed: this.totalClaimed,
            cyclesCompleted: this.cyclesCompleted
        };
    }

    deserialize(data) {
        Object.assign(this, data || {});
    }
}
