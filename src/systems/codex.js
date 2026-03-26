// Codex/Bestiary - track discovered enemies, items, areas
class Codex {
    constructor() {
        this.discoveredEnemies = new Set();
        this.discoveredItems = new Set();
        this.defeatedCounts = {}; // { enemyId: count }
        this.gatheredCounts = {}; // { itemId: count }
    }

    discoverEnemy(enemyId) {
        this.discoveredEnemies.add(enemyId);
        this.defeatedCounts[enemyId] = (this.defeatedCounts[enemyId] || 0) + 1;
    }

    discoverItem(itemId) {
        this.discoveredItems.add(itemId);
        this.gatheredCounts[itemId] = (this.gatheredCounts[itemId] || 0) + 1;
    }

    getEnemyEntries() {
        return Object.entries(EnemyDB).map(([id, enemy]) => ({
            id,
            ...enemy,
            discovered: this.discoveredEnemies.has(id),
            timesDefeated: this.defeatedCounts[id] || 0
        }));
    }

    getItemEntries() {
        return Object.entries(ItemDB).map(([id, item]) => ({
            id,
            ...item,
            discovered: this.discoveredItems.has(id),
            timesGathered: this.gatheredCounts[id] || 0
        }));
    }

    getDiscoveryPercent() {
        const totalEnemies = Object.keys(EnemyDB).length;
        const totalItems = Object.keys(ItemDB).length;
        const total = totalEnemies + totalItems;
        const discovered = this.discoveredEnemies.size + this.discoveredItems.size;
        return Math.round((discovered / total) * 100);
    }

    serialize() {
        return {
            discoveredEnemies: [...this.discoveredEnemies],
            discoveredItems: [...this.discoveredItems],
            defeatedCounts: this.defeatedCounts,
            gatheredCounts: this.gatheredCounts
        };
    }

    deserialize(data) {
        this.discoveredEnemies = new Set(data.discoveredEnemies || []);
        this.discoveredItems = new Set(data.discoveredItems || []);
        this.defeatedCounts = data.defeatedCounts || {};
        this.gatheredCounts = data.gatheredCounts || {};
    }
}
