// Skills UI
class SkillsUI {
    static selectedTree = 'merchant';
    static hoveredSkill = null;

    static render(game) {
        const r = game.renderer;
        const inp = game.input;
        const skills = game.skills;

        r.gradientRect(0, 50, 1200, 700, '#12081f', '#1a0a2e');

        // Skill points
        r.panel(10, 55, 1180, 40, null);
        r.textBold(`⭐ Skill Points: ${skills.skillPoints}`, 20, 67, '#ffd700', 16);
        r.text(`Level ${game.level} | Next point at level ${game.level + 1}`, 250, 70, '#888', 11);

        // Tree tabs
        const trees = Object.entries(SkillTreeDB);
        trees.forEach(([id, tree], i) => {
            const tx = 10 + i * 295;
            const isActive = SkillsUI.selectedTree === id;
            const hovered = inp.isOver(tx, 102, 285, 30);

            r.roundRect(tx, 102, 285, 30, 4,
                isActive ? tree.color + '44' : (hovered ? tree.color + '22' : 'transparent'),
                isActive ? tree.color : '#333');
            r.textBold(`${tree.icon} ${tree.name}`, tx + 15, 108, isActive ? '#fff' : '#888', 13);

            if (inp.clickedIn(tx, 102, 285, 30)) {
                SkillsUI.selectedTree = id;
                game.audio.click();
            }
        });

        // Skill grid
        const tree = SkillTreeDB[SkillsUI.selectedTree];
        if (!tree) return;

        r.panel(10, 140, 800, 610, `${tree.icon} ${tree.name} - ${tree.description}`);

        const skillEntries = Object.entries(tree.skills);
        const cols = 4;
        const cellW = 185;
        const cellH = 100;
        const startX = 30;
        const startY = 175;

        skillEntries.forEach(([skillId, skill], i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const sx = startX + col * cellW;
            const sy = startY + row * (cellH + 10);

            const unlocked = skills.unlockedSkills.has(skillId);
            const canUnlock = skills.canUnlock(SkillsUI.selectedTree, skillId);
            const hovered = inp.isOver(sx, sy, cellW - 10, cellH);

            // Requirement lines
            for (const req of skill.requires) {
                const reqIdx = skillEntries.findIndex(([id]) => id === req);
                if (reqIdx >= 0) {
                    const reqCol = reqIdx % cols;
                    const reqRow = Math.floor(reqIdx / cols);
                    const rx = startX + reqCol * cellW + (cellW - 10) / 2;
                    const ry = startY + reqRow * (cellH + 10) + cellH;
                    const tx = sx + (cellW - 10) / 2;
                    const ty = sy;
                    const lineColor = unlocked ? tree.color : (skills.unlockedSkills.has(req) ? '#555' : '#333');
                    r.line(rx, ry, tx, ty, lineColor, 2);
                }
            }

            // Skill node
            const bg = unlocked ? tree.color + '44' :
                       canUnlock ? 'rgba(40,30,60,0.8)' :
                       'rgba(20,10,30,0.5)';
            const border = unlocked ? tree.color :
                          canUnlock ? '#666' : '#333';

            r.roundRect(sx, sy, cellW - 10, cellH, 6, bg, border, hovered ? 2 : 1);

            // Skill name
            r.textBold(skill.name, sx + 8, sy + 8, unlocked ? '#fff' : (canUnlock ? '#ccc' : '#666'), 11);

            // Cost
            if (!unlocked) {
                r.text(`Cost: ${skill.cost} pts`, sx + 8, sy + 26, canUnlock ? '#ffd700' : '#555', 10);
            } else {
                r.text('✓ Unlocked', sx + 8, sy + 26, tree.color, 10);
            }

            // Description
            r.text(skill.desc, sx + 8, sy + 44, unlocked ? '#aaa' : '#555', 9);

            // Requirements
            if (skill.requires.length > 0 && !unlocked) {
                const reqNames = skill.requires.map(req => {
                    const s = tree.skills[req];
                    return s ? (skills.unlockedSkills.has(req) ? '✓' : '✗') + s.name : req;
                }).join(', ');
                r.text(`Req: ${reqNames}`, sx + 8, sy + 72, '#666', 8);
            }

            // Click to unlock
            if (hovered && inp.clicked && canUnlock) {
                skills.unlock(SkillsUI.selectedTree, skillId);
                game.audio.levelUp();
                game.notify(`Learned ${skill.name}!`, tree.color);
            }

            if (hovered) SkillsUI.hoveredSkill = skillId;
        });

        // Skill bonuses summary
        r.panel(820, 140, 370, 610, '📊 Active Bonuses');
        const bonuses = skills.getBonuses();
        let by = 175;
        const bonusEntries = Object.entries(bonuses).filter(([k, v]) => v !== false && v !== 0);

        if (bonusEntries.length === 0) {
            r.text('No skills unlocked yet.', 840, 200, '#666', 12);
            r.text('Spend skill points to gain bonuses!', 840, 220, '#555', 11);
        } else {
            bonusEntries.forEach(([key, val]) => {
                const label = key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim();
                const displayVal = typeof val === 'number'
                    ? (val < 1 && val > 0 ? `+${Math.round(val * 100)}%` : `+${val}`)
                    : (val === true ? '✓' : val);
                r.text(`${label}:`, 840, by, '#aaa', 11);
                r.textBold(displayVal.toString(), 1050, by, '#88ff88', 12);
                by += 22;
            });
        }

        // Total skill points spent
        r.text(`Skills Unlocked: ${skills.unlockedSkills.size}`, 840, by + 20, '#888', 11);
        r.text(`Points Available: ${skills.skillPoints}`, 840, by + 40, '#ffd700', 11);
    }
}
