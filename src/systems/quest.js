// Quest tracking system
class QuestSystem {
    constructor() {
        this.activeQuests = {}; // { questId: { progress: [...], completed: false } }
        this.completedQuests = new Set();
        this.availableQuests = new Set(['first_sale']);
    }

    acceptQuest(questId) {
        if (this.activeQuests[questId] || this.completedQuests.has(questId)) return false;
        const quest = QuestDB[questId];
        if (!quest) return false;

        this.activeQuests[questId] = {
            progress: quest.objectives.map(() => 0),
            completed: false,
            startDay: 0
        };
        return true;
    }

    updateProgress(type, data = {}) {
        const results = [];
        for (const [questId, state] of Object.entries(this.activeQuests)) {
            if (state.completed) continue;
            const quest = QuestDB[questId];

            for (let i = 0; i < quest.objectives.length; i++) {
                const obj = quest.objectives[i];
                if (obj.type === type) {
                    let match = true;
                    if (obj.area && data.area !== obj.area) match = false;
                    if (obj.item && data.item !== obj.item) match = false;
                    if (obj.boss && data.boss !== obj.boss) match = false;
                    if (obj.station && data.station !== obj.station) match = false;
                    if (obj.category && data.category !== obj.category) match = false;

                    if (match) {
                        state.progress[i] += data.count || 1;
                    }
                }
            }

            // Check completion
            let allDone = true;
            for (let i = 0; i < quest.objectives.length; i++) {
                if (state.progress[i] < quest.objectives[i].count) {
                    allDone = false;
                    break;
                }
            }

            if (allDone && !state.completed) {
                state.completed = true;
                results.push(questId);
            }
        }
        return results;
    }

    claimReward(questId) {
        const state = this.activeQuests[questId];
        if (!state || !state.completed) return null;

        const quest = QuestDB[questId];
        this.completedQuests.add(questId);
        delete this.activeQuests[questId];

        // Unlock next quests
        if (quest.unlocks) {
            for (const next of quest.unlocks) {
                this.availableQuests.add(next);
            }
        }

        // If repeatable, make available again after cooldown
        if (quest.repeatable) {
            this.availableQuests.add(questId);
        }

        return quest.rewards;
    }

    getActiveQuestList() {
        return Object.entries(this.activeQuests).map(([id, state]) => ({
            id,
            quest: QuestDB[id],
            state
        }));
    }

    getAvailableQuestList() {
        return [...this.availableQuests]
            .filter(id => !this.activeQuests[id] && !this.completedQuests.has(id))
            .map(id => ({ id, quest: QuestDB[id] }))
            .filter(q => q.quest);
    }

    autoAcceptMainQuests() {
        for (const id of this.availableQuests) {
            const quest = QuestDB[id];
            if (quest && quest.type === QuestType.MAIN && !this.activeQuests[id] && !this.completedQuests.has(id)) {
                this.acceptQuest(id);
            }
        }
    }

    serialize() {
        return {
            activeQuests: this.activeQuests,
            completedQuests: [...this.completedQuests],
            availableQuests: [...this.availableQuests]
        };
    }

    deserialize(data) {
        this.activeQuests = data.activeQuests || {};
        this.completedQuests = new Set(data.completedQuests || []);
        this.availableQuests = new Set(data.availableQuests || ['first_sale']);
    }
}
