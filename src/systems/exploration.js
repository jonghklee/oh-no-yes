// Exploration and dungeon system
class ExplorationSystem {
    constructor() {
        this.active = false;
        this.currentArea = null;
        this.currentFloor = 0;
        this.maxFloorReached = {}; // { areaId: maxFloor }
        this.stamina = 50;
        this.maxStamina = 50;
        this.explorationLog = [];
        this.gatheredItems = [];
        this.state = 'idle'; // idle, exploring, event, combat, results
        this.eventTimer = 0;
        this.bossesDefeated = new Set();
        this.areasVisited = new Set();
    }

    canExplore(areaId, playerLevel) {
        const area = AreaDB[areaId];
        if (!area) return { can: false, reason: 'Area not found' };
        if (playerLevel < area.unlockLevel) return { can: false, reason: `Need level ${area.unlockLevel}` };
        if (this.stamina < area.staminaCost) return { can: false, reason: 'Not enough stamina' };
        return { can: true };
    }

    startExploration(areaId, playerLevel, skillBonuses = {}) {
        const check = this.canExplore(areaId, playerLevel);
        if (!check.can) return check;

        const area = AreaDB[areaId];
        let cost = area.staminaCost;
        if (skillBonuses.staminaReduction) {
            cost = Math.round(cost * (1 - skillBonuses.staminaReduction));
        }

        this.stamina -= cost;
        this.active = true;
        this.currentArea = area;
        this.currentFloor = (this.maxFloorReached[areaId] || 0) + 1;
        this.currentFloor = Math.min(this.currentFloor, area.floors);
        this.gatheredItems = [];
        this.explorationLog = [];
        this.state = 'exploring';
        this.areasVisited.add(areaId);

        this.addLog(`Entering ${area.name} - Floor ${this.currentFloor}`);
        return { can: true, started: true };
    }

    exploreStep(skillBonuses = {}) {
        if (!this.active || this.state !== 'exploring') return null;

        const area = this.currentArea;
        const roll = Math.random();

        // Encounter enemy?
        if (roll < area.encounterRate) {
            // Determine enemy
            let enemies = area.enemies.filter(e => {
                const enemy = EnemyDB[e];
                if (enemy.boss && this.currentFloor < area.bossFloor) return false;
                if (enemy.boss && this.bossesDefeated.has(e)) return false;
                if (enemy.miniBoss && this.currentFloor < area.floors * 0.5) return false;
                return true;
            });

            // On boss floor, guarantee boss
            if (this.currentFloor >= area.bossFloor) {
                const bosses = area.enemies.filter(e => EnemyDB[e].boss && !this.bossesDefeated.has(e));
                if (bosses.length > 0) enemies = bosses;
            }

            if (enemies.length === 0) enemies = area.enemies.filter(e => !EnemyDB[e].boss);

            const enemyId = Utils.choice(enemies);
            const enemy = EnemyDB[enemyId];

            // Scale enemy with floor
            const scaledEnemy = Utils.deepClone(enemy);
            const floorScale = 1 + (this.currentFloor - 1) * 0.1;
            scaledEnemy.hp = Math.round(scaledEnemy.hp * floorScale);
            scaledEnemy.atk = Math.round(scaledEnemy.atk * floorScale);
            scaledEnemy.def = Math.round(scaledEnemy.def * floorScale);

            this.state = 'combat';
            this.addLog(`Encountered ${scaledEnemy.name}!`);
            return { type: 'combat', enemy: scaledEnemy };
        }

        // Gather resources
        const gathered = [];
        for (const g of area.gatherables) {
            let chance = g.chance;
            if (skillBonuses.gatherBonus) chance *= (1 + skillBonuses.gatherBonus);
            if (skillBonuses.rareFindBonus && ItemDB[g.item] && ItemDB[g.item].rarity !== 'common') {
                chance *= (1 + skillBonuses.rareFindBonus);
            }

            if (Math.random() < chance) {
                const qty = Utils.random(g.qty[0], g.qty[1]);
                gathered.push({ item: g.item, qty });
                this.gatheredItems.push({ item: g.item, qty });
            }
        }

        if (gathered.length > 0) {
            const names = gathered.map(g => `${ItemDB[g.item]?.name || g.item} x${g.qty}`).join(', ');
            this.addLog(`Found: ${names}`);
            return { type: 'gather', items: gathered };
        }

        // Random event
        if (Math.random() < 0.2) {
            const eventType = Utils.choice(area.explorationEvents);
            this.addLog(`Discovered: ${eventType.replace(/_/g, ' ')}`);
            return { type: 'event', event: eventType };
        }

        this.addLog('Nothing of interest here...');
        return { type: 'nothing' };
    }

    advanceFloor() {
        if (!this.active) return false;
        this.currentFloor++;
        if (!this.maxFloorReached[this.currentArea.id] || this.currentFloor > this.maxFloorReached[this.currentArea.id]) {
            this.maxFloorReached[this.currentArea.id] = this.currentFloor;
        }
        if (this.currentFloor > this.currentArea.floors) {
            this.addLog('Area fully explored!');
            return false; // can't go further
        }
        this.addLog(`Advanced to Floor ${this.currentFloor}`);
        return true;
    }

    onCombatVictory(enemyId) {
        const enemy = EnemyDB[enemyId];
        if (enemy && enemy.boss) {
            this.bossesDefeated.add(enemyId);
        }
        this.state = 'exploring';
    }

    onCombatDefeat() {
        this.state = 'results';
        this.active = false;
        this.addLog('Retreated from exploration...');
    }

    endExploration() {
        this.active = false;
        this.state = 'results';
        const results = {
            area: this.currentArea,
            floorsExplored: this.currentFloor,
            items: this.gatheredItems,
            log: this.explorationLog
        };
        return results;
    }

    restStamina(amount) {
        this.stamina = Math.min(this.maxStamina, this.stamina + amount);
    }

    newDay() {
        this.restStamina(Math.round(this.maxStamina * 0.5)); // Restore 50% stamina per day
    }

    addLog(msg) {
        this.explorationLog.push(msg);
        if (this.explorationLog.length > 20) this.explorationLog.shift();
    }

    serialize() {
        return {
            maxFloorReached: this.maxFloorReached,
            stamina: this.stamina,
            maxStamina: this.maxStamina,
            bossesDefeated: [...this.bossesDefeated],
            areasVisited: [...this.areasVisited]
        };
    }

    deserialize(data) {
        this.maxFloorReached = data.maxFloorReached || {};
        this.stamina = data.stamina || 50;
        this.maxStamina = data.maxStamina || 50;
        this.bossesDefeated = new Set(data.bossesDefeated || []);
        this.areasVisited = new Set(data.areasVisited || []);
    }
}
