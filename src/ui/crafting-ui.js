// Crafting screen UI
class CraftingUI {
    static selectedRecipe = null;
    static selectedStation = 'all';
    static scrollY = 0;
    static favorites = new Set();

    static render(game) {
        const r = game.renderer;
        const inp = game.input;
        const crafting = game.crafting;
        const bonuses = game.getSkillBonuses();

        r.gradientRect(0, 50, 1200, 700, '#12081f', '#1a0a2e');

        // === LEFT: Stations ===
        r.panel(10, 55, 180, 340, '🔨 Stations');

        // All filter
        const allHover = inp.isOver(20, 88, 160, 28);
        r.roundRect(20, 88, 160, 28, 4,
            CraftingUI.selectedStation === 'all' ? '#3d1e6d' : (allHover ? 'rgba(61,30,109,0.3)' : 'transparent'));
        r.text('📋 All Recipes', 30, 94, CraftingUI.selectedStation === 'all' ? '#fff' : '#aaa', 12);
        if (inp.clickedIn(20, 88, 160, 28)) { CraftingUI.selectedStation = 'all'; game.audio.click(); }

        let sy = 122;
        for (const [id, station] of Object.entries(CraftingStations)) {
            const unlocked = crafting.unlockedStations[id];
            const hovered = inp.isOver(20, sy, 160, 28);
            const isActive = CraftingUI.selectedStation === id;

            r.roundRect(20, sy, 160, 28, 4,
                isActive ? '#3d1e6d' : (hovered ? 'rgba(61,30,109,0.3)' : 'transparent'));

            if (unlocked) {
                r.text(`${station.icon} ${station.name}`, 30, sy + 6, isActive ? '#fff' : '#ccc', 12);
            } else {
                r.text(`🔒 ${station.name}`, 30, sy + 6, '#666', 12);
                r.text(`${station.unlockCost}g`, 150, sy + 8, '#ffd700', 10, 'right');

                if (hovered && inp.clicked && game.gold >= station.unlockCost) {
                    const result = crafting.unlockStation(id, game.gold);
                    if (result.success) {
                        game.spendGold(result.cost);
                        game.audio.buy();
                        game.notify(`Unlocked ${station.name}!`, '#44ff44');
                        game.quests.updateProgress('unlockStation', { station: id });
                    }
                }
            }

            sy += 32;
        }

        // Crafting level info
        r.text(`Crafting Level: ${crafting.level}`, 20, 310, '#4488ff', 12);
        const xpNeeded = getXpForLevel(crafting.level);
        r.progressBar(20, 330, 160, 12, crafting.xp, xpNeeded, '#4488ff', '#222');
        r.text(`${crafting.xp}/${xpNeeded} XP`, 25, 330, '#fff', 8);
        r.text(`Total Crafts: ${crafting.totalCrafts}`, 20, 350, '#888', 10);

        // === CENTER: Recipe List ===
        r.panel(200, 55, 500, 700, '📜 Recipes');

        const recipes = crafting.getAvailableRecipes().filter(rec => {
            if (CraftingUI.selectedStation === 'all') return true;
            return rec.station === CraftingUI.selectedStation;
        });

        // Scroll
        if (inp.isOver(200, 55, 500, 700)) {
            CraftingUI.scrollY = Utils.clamp(CraftingUI.scrollY - inp.scrollDelta * 30, -(recipes.length * 54 - 600), 0);
        }

        // Sort: favorites first, then by craftability
        recipes.sort((a, b) => {
            const aFav = CraftingUI.favorites.has(a.id) ? 0 : 1;
            const bFav = CraftingUI.favorites.has(b.id) ? 0 : 1;
            if (aFav !== bFav) return aFav - bFav;
            const aCraft = crafting.canCraft(a.id, game.inventory).can ? 0 : 1;
            const bCraft = crafting.canCraft(b.id, game.inventory).can ? 0 : 1;
            return aCraft - bCraft;
        });

        let ry = 90 + CraftingUI.scrollY;
        for (const recipe of recipes) {
            if (ry > 50 && ry < 730) {
                const result = ItemDB[recipe.result];
                if (!result) continue;

                const canCraft = crafting.canCraft(recipe.id, game.inventory);
                const isSelected = CraftingUI.selectedRecipe === recipe.id;
                const hovered = inp.isOver(210, ry, 480, 50);
                const isFav = CraftingUI.favorites.has(recipe.id);

                r.roundRect(210, ry, 480, 50, 4,
                    isSelected ? 'rgba(80,40,120,0.6)' :
                    (hovered ? 'rgba(61,30,109,0.3)' : (isFav ? 'rgba(40,30,20,0.3)' : 'rgba(20,10,40,0.3)')),
                    canCraft.can ? '#3d1e6d' : '#2a2a2a');

                r.text(result.icon || '?', 225, ry + 8, '#fff', 22);
                r.textBold(result.name, 260, ry + 6, canCraft.can ? RarityColors[result.rarity] : '#666', 13);
                r.text(`x${recipe.resultQty}`, 260 + r.measureText(result.name, 13) + 5, ry + 8, '#aaa', 10);

                // Ingredients preview
                let ix = 260;
                const ingText = recipe.ingredients.map(ing => {
                    const item = ItemDB[ing.item];
                    const has = game.inventory.getCount(ing.item);
                    const color = has >= ing.qty ? '#88ff88' : '#ff6666';
                    return { text: `${item?.icon || '?'}${has}/${ing.qty}`, color };
                });
                ix = 260;
                ingText.forEach(it => {
                    r.text(it.text, ix, ry + 28, it.color, 10);
                    ix += r.measureText(it.text, 10) + 8;
                });

                // Favorite star
                const starHover = inp.isOver(210, ry + 2, 18, 18);
                r.text(isFav ? '★' : '☆', 215, ry + 4, isFav ? '#ffd700' : (starHover ? '#888' : '#444'), 12);
                if (starHover && inp.clicked) {
                    if (isFav) CraftingUI.favorites.delete(recipe.id);
                    else CraftingUI.favorites.add(recipe.id);
                    game.audio.click();
                }

                // Station, level & craftable count
                r.text(`Lv.${recipe.level}`, 620, ry + 10, crafting.level >= recipe.level ? '#aaa' : '#ff6666', 10, 'right');
                r.text(`${CraftingStations[recipe.station]?.icon || ''}`, 630, ry + 8, '#888', 12);

                // How many can we craft?
                if (canCraft.can) {
                    const maxCraftable = Math.min(...recipe.ingredients.map(ing =>
                        Math.floor(game.inventory.getCount(ing.item) / ing.qty)
                    ));
                    if (maxCraftable > 0) {
                        r.text(`[${maxCraftable}]`, 660, ry + 28, '#88ff88', 9, 'right');
                    }
                }

                // Seasonal badge
                if (recipe.season) {
                    const seasonIcons = { spring: '🌸', summer: '☀', autumn: '🍂', winter: '❄' };
                    r.text(seasonIcons[recipe.season] || '', 670, ry + 8, '#fff', 12);
                }

                if (hovered && inp.clicked) {
                    CraftingUI.selectedRecipe = recipe.id;
                    game.audio.click();
                }
            }
            ry += 54;
        }

        // === RIGHT: Selected Recipe Detail ===
        r.panel(710, 55, 480, 400, '📖 Recipe Details');

        // Hint for new players
        if (crafting.totalCrafts === 0) {
            r.text('💡 Click a recipe on the left, then click Craft!', 720, 440, '#ffd700', 10);
            r.text('Green numbers = you have enough materials', 720, 456, '#88ff88', 9);
        }

        if (CraftingUI.selectedRecipe) {
            const recipe = RecipeDB[CraftingUI.selectedRecipe];
            const result = ItemDB[recipe.result];

            if (recipe && result) {
                r.text(result.icon || '?', 730, 95, '#fff', 32);
                r.textBold(result.name, 775, 95, RarityColors[result.rarity], 18);
                r.text(result.description || '', 730, 125, '#aaa', 11);

                // Stats
                if (result.stats) {
                    let statsY = 150;
                    for (const [stat, val] of Object.entries(result.stats)) {
                        const label = stat.replace(/([A-Z])/g, ' $1').trim();
                        r.text(`${label}: +${typeof val === 'number' && val < 1 ? Math.round(val * 100) + '%' : val}`, 730, statsY, '#88ff88', 12);
                        statsY += 18;
                    }
                }

                // Ingredients
                r.textBold('Ingredients:', 730, 230, '#ddd', 13);
                recipe.ingredients.forEach((ing, i) => {
                    const item = ItemDB[ing.item];
                    const has = game.inventory.getCount(ing.item);
                    const enough = has >= ing.qty;
                    r.text(`${item?.icon || '?'} ${item?.name || ing.item}`, 745, 252 + i * 22, enough ? '#fff' : '#ff6666', 12);
                    r.text(`${has}/${ing.qty}`, 1050, 252 + i * 22, enough ? '#88ff88' : '#ff6666', 12, 'right');
                });

                // Craft time
                let time = recipe.time;
                if (bonuses.craftSpeed) time = Math.max(1, Math.round(time * bonuses.craftSpeed));
                r.text(`Time: ${time}s`, 730, 350, '#aaa', 11);
                r.text(`XP: ${recipe.xp}`, 830, 350, '#4488ff', 11);

                // Craft buttons
                const canCraft = crafting.canCraft(recipe.id, game.inventory);
                const isCrafting = crafting.currentCraft !== null;

                // Craft x1
                const craft1Hover = inp.isOver(730, 380, 120, 36);
                r.button(730, 380, 120, 36, isCrafting ? '⏳ Crafting...' : '🔨 Craft x1', craft1Hover, !canCraft.can && !isCrafting);
                if (canCraft.can && inp.clickedIn(730, 380, 120, 36)) {
                    if (isCrafting) {
                        crafting.queueCraft(recipe.id, 1, game.inventory, bonuses);
                        game.notify('Added to queue', '#44aaff');
                    } else {
                        crafting.startCraft(recipe.id, game.inventory, bonuses);
                    }
                    game.audio.click();
                }

                // Craft x5
                const craft5Hover = inp.isOver(860, 380, 80, 36);
                r.button(860, 380, 80, 36, 'x5', craft5Hover, !canCraft.can);
                if (canCraft.can && inp.clickedIn(860, 380, 80, 36)) {
                    if (isCrafting) {
                        crafting.queueCraft(recipe.id, 5, game.inventory, bonuses);
                    } else {
                        crafting.startCraft(recipe.id, game.inventory, bonuses);
                        crafting.queueCraft(recipe.id, 4, game.inventory, bonuses);
                    }
                    game.audio.click();
                    game.notify('Queued 5 crafts!', '#44aaff');
                }

                // Queue indicator
                if (crafting.craftQueue.length > 0) {
                    r.text(`Queue: ${crafting.craftQueue.length} remaining`, 730, 420, '#44aaff', 10);
                }

                if (!canCraft.can && !isCrafting) {
                    r.text(canCraft.reason, 730, 420, '#ff6666', 11);
                }
            }
        } else {
            r.text('Select a recipe to view details', 800, 250, '#666', 14, 'center');
        }

        // === Craft Progress ===
        const progress = crafting.getCraftProgress();
        if (progress) {
            r.panel(710, 470, 480, 80, '⚙ Crafting Progress');
            const result = ItemDB[progress.recipe.result];
            r.text(`${result?.icon || '?'} ${result?.name || ''}`, 730, 505, '#fff', 13);
            r.progressBar(730, 530, 420, 16, progress.progress, 1, '#4488ff', '#222');
            r.text(`${Math.round(progress.progress * 100)}%`, 940, 530, '#fff', 10, 'center');
        }
    }
}
