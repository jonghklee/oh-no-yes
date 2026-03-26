// Challenge Mode - timed trials for competitive replayability
class ChallengeModeSystem {
    constructor() {
        this.active = false;
        this.currentChallenge = null;
        this.timer = 0;
        this.score = 0;
        this.highScores = {}; // { challengeId: bestScore }
        this.totalChallenges = 0;
    }

    getChallenges() {
        return [
            {
                id: 'speed_sell', name: 'Speed Seller',
                icon: '⏱', description: 'Sell as many items as possible in 60 seconds!',
                duration: 60000, scoreType: 'sales',
                reward: (score) => ({ gold: score * 20, xp: score * 10 })
            },
            {
                id: 'gold_rush', name: 'Gold Rush',
                icon: '💰', description: 'Earn as much gold as possible in 90 seconds!',
                duration: 90000, scoreType: 'gold',
                reward: (score) => ({ gold: Math.round(score * 0.2), xp: Math.round(score * 0.1) })
            },
            {
                id: 'craft_sprint', name: 'Craft Sprint',
                icon: '🔨', description: 'Craft as many items as possible in 120 seconds!',
                duration: 120000, scoreType: 'crafts',
                reward: (score) => ({ gold: score * 30, xp: score * 15 })
            },
            {
                id: 'combat_arena', name: 'Combat Arena',
                icon: '⚔', description: 'Defeat as many enemies as possible in 2 minutes!',
                duration: 120000, scoreType: 'kills',
                reward: (score) => ({ gold: score * 50, xp: score * 25 })
            }
        ];
    }

    start(challengeId) {
        const challenge = this.getChallenges().find(c => c.id === challengeId);
        if (!challenge) return false;

        this.active = true;
        this.currentChallenge = challenge;
        this.timer = challenge.duration;
        this.score = 0;
        this.totalChallenges++;
        return true;
    }

    addScore(type, amount = 1) {
        if (!this.active || !this.currentChallenge) return;
        if (this.currentChallenge.scoreType === type) {
            this.score += amount;
        }
    }

    update(dt) {
        if (!this.active) return null;

        this.timer -= dt;
        if (this.timer <= 0) {
            return this.complete();
        }
        return null;
    }

    complete() {
        this.active = false;
        const challenge = this.currentChallenge;
        const isNewRecord = !this.highScores[challenge.id] || this.score > this.highScores[challenge.id];

        if (isNewRecord) {
            this.highScores[challenge.id] = this.score;
        }

        const reward = challenge.reward(this.score);
        const result = {
            challenge,
            score: this.score,
            isNewRecord,
            previousBest: this.highScores[challenge.id],
            reward
        };

        this.currentChallenge = null;
        return result;
    }

    getTimeRemaining() {
        return Math.max(0, Math.ceil(this.timer / 1000));
    }

    serialize() {
        return {
            highScores: this.highScores,
            totalChallenges: this.totalChallenges
        };
    }

    deserialize(data) {
        this.highScores = data?.highScores || {};
        this.totalChallenges = data?.totalChallenges || 0;
    }
}
