// Skill system
class SkillSystem {
    constructor() {
        this.unlockedSkills = new Set();
        this.skillPoints = 0;
    }

    canUnlock(treeId, skillId) {
        const tree = SkillTreeDB[treeId];
        if (!tree) return false;
        const skill = tree.skills[skillId];
        if (!skill) return false;
        if (this.unlockedSkills.has(skillId)) return false;
        if (this.skillPoints < skill.cost) return false;

        // Check requirements
        for (const req of skill.requires) {
            if (!this.unlockedSkills.has(req)) return false;
        }
        return true;
    }

    unlock(treeId, skillId) {
        if (!this.canUnlock(treeId, skillId)) return false;
        const skill = SkillTreeDB[treeId].skills[skillId];
        this.skillPoints -= skill.cost;
        this.unlockedSkills.add(skillId);
        return true;
    }

    getBonuses() {
        const bonuses = {};
        for (const treeId of Object.keys(SkillTreeDB)) {
            const tree = SkillTreeDB[treeId];
            for (const [skillId, skill] of Object.entries(tree.skills)) {
                if (this.unlockedSkills.has(skillId)) {
                    for (const [key, val] of Object.entries(skill.effect)) {
                        if (typeof val === 'number') {
                            bonuses[key] = (bonuses[key] || 0) + val;
                        } else {
                            bonuses[key] = val;
                        }
                    }
                }
            }
        }
        return bonuses;
    }

    addPoints(n) {
        this.skillPoints += n;
    }

    serialize() {
        return {
            unlockedSkills: [...this.unlockedSkills],
            skillPoints: this.skillPoints
        };
    }

    deserialize(data) {
        this.unlockedSkills = new Set(data.unlockedSkills || []);
        this.skillPoints = data.skillPoints || 0;
    }
}
