// Save/Load system
class SaveSystem {
    constructor() {
        this.saveKey = 'ohnoyes_save';
        this.autoSaveInterval = 30000; // 30 seconds
        this.lastSave = 0;
    }

    save(gameState) {
        try {
            const data = JSON.stringify(gameState);
            localStorage.setItem(this.saveKey, data);
            this.lastSave = Date.now();
            return true;
        } catch (e) {
            console.error('Save failed:', e);
            return false;
        }
    }

    load() {
        try {
            const data = localStorage.getItem(this.saveKey);
            if (!data) return null;
            return JSON.parse(data);
        } catch (e) {
            console.error('Load failed:', e);
            return null;
        }
    }

    hasSave() {
        return localStorage.getItem(this.saveKey) !== null;
    }

    deleteSave() {
        localStorage.removeItem(this.saveKey);
    }

    shouldAutoSave(now) {
        return now - this.lastSave >= this.autoSaveInterval;
    }
}
