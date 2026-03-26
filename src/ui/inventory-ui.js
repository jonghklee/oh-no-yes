// Inventory UI
class InventoryUI {
    static selectedItem = null;
    static scrollY = 0;
    static filterCategory = 'all';
    static sortMode = 'default'; // default, price, rarity, name

    static render(game) {
        const r = game.renderer;
        const inp = game.input;
        const inv = game.inventory;
        const bonuses = game.getSkillBonuses();

        r.gradientRect(0, 50, 1200, 700, '#12081f', '#1a0a2e');

        // === Equipment Panel ===
        r.panel(10, 55, 250, 300, '⚔ Equipment');

        const slots = ['weapon', 'armor', 'accessory', 'tool'];
        const slotIcons = { weapon: '⚔', armor: '🛡', accessory: '💍', tool: '⛏' };

        slots.forEach((slot, i) => {
            const sy = 90 + i * 55;
            const equip = inv.equipment[slot];
            const hovered = inp.isOver(25, sy, 225, 48);

            r.roundRect(25, sy, 225, 48, 4,
                hovered ? 'rgba(61,30,109,0.4)' : 'rgba(20,10,40,0.3)',
                equip ? RarityColors[equip.rarity] : '#333');

            r.text(slotIcons[slot], 35, sy + 8, '#888', 20);

            if (equip) {
                r.text(equip.icon, 65, sy + 5, '#fff', 20);
                r.textBold(equip.name, 95, sy + 8, RarityColors[equip.rarity], 12);
                // Show main stat
                if (equip.stats) {
                    const mainStat = Object.entries(equip.stats)[0];
                    if (mainStat) {
                        r.text(`+${mainStat[1]} ${mainStat[0]}`, 95, sy + 26, '#88ff88', 10);
                    }
                }
                if (hovered) game.tooltipItem = equip;

                // Unequip on click
                if (hovered && inp.clicked) {
                    inv.unequip(slot);
                    game.audio.click();
                }
            } else {
                // Pulsing empty slot indicator
                const emptyPulse = Math.sin(Date.now() / 800 + i) * 0.15 + 0.85;
                r.setAlpha(emptyPulse);
                r.text(`Empty ${slot}`, 65, sy + 12, '#666', 11);
                r.text('Click Items tab to equip', 65, sy + 28, '#444', 8);
                r.resetAlpha();
            }
        });

        // Stat summary
        r.panel(10, 365, 250, 250, '📊 Stats');
        const stats = game.getPlayerStats();
        const statList = [
            { label: 'HP', value: stats.maxHp, color: '#44aa44' },
            { label: 'MP', value: stats.maxMp, color: '#4488ff' },
            { label: 'ATK', value: stats.atk, color: '#ff8844' },
            { label: 'DEF', value: stats.def, color: '#4488ff' },
            { label: 'SPD', value: stats.speed, color: '#44ddff' },
            { label: 'Crit', value: Math.round(stats.critRate * 100) + '%', color: '#ff4444' },
            { label: 'Dodge', value: Math.round(stats.dodge * 100) + '%', color: '#44ff44' },
            { label: 'Lifesteal', value: Math.round(stats.lifesteal * 100) + '%', color: '#ff44ff' }
        ];

        statList.forEach((stat, i) => {
            r.text(stat.label + ':', 25, 400 + i * 22, '#888', 11);
            r.textBold(stat.value.toString(), 120, 400 + i * 22, stat.color, 12);
        });

        // Sell bonus
        if (bonuses.sellBonus) {
            r.text(`Sell Bonus: +${Math.round(bonuses.sellBonus * 100)}%`, 25, 580, '#ffd700', 10);
        }
        if (bonuses.buyDiscount) {
            r.text(`Buy Discount: ${Math.round(bonuses.buyDiscount * 100)}%`, 25, 595, '#88ff88', 10);
        }

        // Set bonus display
        const setBonus = inv.getSetBonus();
        if (setBonus) {
            r.text(`🔗 ${setBonus.name}`, 25, 610, '#ff88ff', 10);
        }

        // Total net worth
        let inventoryValue = 0;
        for (const item of inv.getItemList()) {
            inventoryValue += (item.basePrice || 0) * (item.quantity || 1);
        }
        r.text(`💎 Net Worth: ${Utils.formatGold(game.gold + inventoryValue + game.bank.deposits)}g`, 25, 625, '#ffd700', 9);
        r.text(`📦 Inv: ${Utils.formatGold(inventoryValue)}g | 🏦 Bank: ${Utils.formatGold(game.bank.deposits)}g`, 25, 638, '#888', 8);

        // === Main Inventory ===
        r.panel(270, 55, 550, 700, `🎒 Inventory (${inv.getUsedSlots()}/${inv.maxSlots})`);

        // Category filter
        const cats = ['all', 'material', 'potion', 'weapon', 'armor', 'accessory', 'food', 'gem', 'scroll', 'tool'];
        let fx = 285;
        cats.forEach(cat => {
            const isActive = InventoryUI.filterCategory === cat;
            const w = r.measureText(cat === 'all' ? 'All' : cat, 10) + 16;
            const hovered = inp.isOver(fx, 85, w, 20);
            r.roundRect(fx, 85, w, 20, 3,
                isActive ? '#3d1e6d' : (hovered ? 'rgba(61,30,109,0.3)' : 'transparent'));
            r.text(cat === 'all' ? 'All' : cat, fx + 8, 88, isActive ? '#fff' : '#888', 10);
            if (inp.clickedIn(fx, 85, w, 20)) {
                InventoryUI.filterCategory = cat;
                game.audio.click();
            }
            fx += w + 4;
        });

        // Sort buttons
        const sortModes = [
            { id: 'default', label: 'Default' },
            { id: 'price', label: 'Price ↓' },
            { id: 'rarity', label: 'Rarity ↓' },
            { id: 'name', label: 'A-Z' }
        ];
        let sx = 285;
        r.text('Sort:', sx, 108, '#666', 9);
        sx += 30;
        sortModes.forEach(sm => {
            const isActive = InventoryUI.sortMode === sm.id;
            const w = r.measureText(sm.label, 9) + 10;
            const hov = inp.isOver(sx, 106, w, 16);
            r.roundRect(sx, 106, w, 16, 2, isActive ? '#3d1e6d' : (hov ? 'rgba(61,30,109,0.3)' : 'transparent'));
            r.text(sm.label, sx + 5, 108, isActive ? '#fff' : '#666', 9);
            if (inp.clickedIn(sx, 106, w, 16)) { InventoryUI.sortMode = sm.id; game.audio.click(); }
            sx += w + 3;
        });

        let items = inv.getItemList().filter(item => {
            if (InventoryUI.filterCategory === 'all') return true;
            return item.category === InventoryUI.filterCategory;
        });

        // Apply sort
        const rarityOrder = ['legendary', 'epic', 'rare', 'uncommon', 'common'];
        if (InventoryUI.sortMode === 'price') {
            items = items.sort((a, b) => (b.basePrice || 0) - (a.basePrice || 0));
        } else if (InventoryUI.sortMode === 'rarity') {
            items = items.sort((a, b) => rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity));
        } else if (InventoryUI.sortMode === 'name') {
            items = items.sort((a, b) => a.name.localeCompare(b.name));
        }

        if (inp.isOver(270, 110, 550, 640)) {
            InventoryUI.scrollY = Utils.clamp(InventoryUI.scrollY - inp.scrollDelta * 30, -(items.length * 40 - 580), 0);
        }

        let iy = 115 + InventoryUI.scrollY;
        for (const item of items) {
            if (iy > 100 && iy < 740) {
                const hovered = inp.isOver(280, iy, 530, 36);
                const isSelected = InventoryUI.selectedItem === item.id;

                r.roundRect(280, iy, 530, 36, 4,
                    isSelected ? 'rgba(80,40,120,0.5)' :
                    (hovered ? 'rgba(61,30,109,0.3)' : 'rgba(20,10,40,0.2)'),
                    RarityColors[item.rarity]);

                r.text(item.icon || '?', 295, iy + 5, '#fff', 18);
                r.textBold(item.name, 325, iy + 4, RarityColors[item.rarity], 12);
                r.text(`x${item.quantity}`, 325 + r.measureText(item.name, 12) + 8, iy + 6, '#aaa', 10);

                const sellPrice = game.economy.getSellPrice(item.id, item.quality || 1.0, bonuses);
                r.text(`${sellPrice}g`, 740, iy + 6, '#ffd700', 10, 'right');

                if (item.qualityLabel) {
                    r.text(item.qualityLabel, 755, iy + 6, '#ffd700', 9);
                }

                if (hovered) game.tooltipItem = item;

                if (inp.clickedIn(280, iy, 530, 36)) {
                    InventoryUI.selectedItem = item.id;
                    game.audio.click();
                }
            }
            iy += 40;
        }

        // === Selected Item Actions ===
        r.panel(830, 55, 360, 700, '📦 Item Actions');

        if (InventoryUI.selectedItem && inv.items[InventoryUI.selectedItem]) {
            const item = inv.items[InventoryUI.selectedItem];

            r.text(item.icon || '?', 850, 95, '#fff', 36);
            r.textBold(item.name, 900, 95, RarityColors[item.rarity], 16);
            r.text(`${item.rarity} ${item.category}`, 900, 117, '#aaa', 11);
            r.text(`Quantity: ${item.quantity}`, 850, 145, '#fff', 12);
            r.text(item.description || '', 850, 170, '#ccc', 11);

            if (item.stats) {
                let sy = 200;
                for (const [stat, val] of Object.entries(item.stats)) {
                    const label = stat.replace(/([A-Z])/g, ' $1').trim();
                    r.text(`${label}: +${typeof val === 'number' && val < 1 ? Math.round(val * 100) + '%' : val}`, 850, sy, '#88ff88', 12);
                    sy += 18;
                }
            }

            // Enhancement level
            if (item.enhanceLevel) {
                r.textBold(`Enhancement: +${item.enhanceLevel}`, 850, 315, '#ff88ff', 11);
            }

            const sellPrice = game.economy.getSellPrice(item.id, item.quality || 1.0, bonuses);
            r.text(`Sell Value: ${sellPrice}g`, 850, 332, '#ffd700', 12);

            // Action buttons
            let by = 350;

            // Equip with comparison
            if (['weapon', 'armor', 'accessory', 'tool'].includes(item.category)) {
                const slot = item.category === 'weapon' ? 'weapon' :
                             item.category === 'armor' ? 'armor' :
                             item.category === 'accessory' ? 'accessory' : 'tool';
                const current = inv.equipment[slot];

                // Show stat comparison
                if (item.stats && current && current.stats) {
                    let compY = by;
                    for (const [stat, val] of Object.entries(item.stats)) {
                        const curVal = current.stats[stat] || 0;
                        const diff = val - curVal;
                        if (diff !== 0) {
                            const color = diff > 0 ? '#44ff44' : '#ff4444';
                            const sign = diff > 0 ? '+' : '';
                            const label = stat.replace(/([A-Z])/g, ' $1').trim();
                            r.text(`${label}: ${sign}${typeof diff === 'number' && Math.abs(diff) < 1 ? Math.round(diff * 100) + '%' : diff}`, 1030, compY, color, 10);
                            compY += 14;
                        }
                    }
                } else if (item.stats && !current) {
                    r.text('No current equipment', 1030, by, '#888', 9);
                }

                const eqHover = inp.isOver(850, by, 80, 35);
                r.button(850, by, 80, 35, '⚔ Equip', eqHover);
                if (inp.clickedIn(850, by, 80, 35)) {
                    inv.equip(item.id);
                    game.audio.click();
                    game.notify(`Equipped ${item.name}!`, '#44ff44');
                }

                // Enhance button
                if (game.enhance.canEnhance(item)) {
                    const cost = game.enhance.getEnhanceCost(item);
                    const enhHover = inp.isOver(940, by, 80, 35);
                    r.button(940, by, 80, 35, `⬆ +${(item.enhanceLevel||0)+1}`, enhHover, false, '#4a3060');
                    r.text(`${cost.gold}g ${cost.materialQty}x${ItemDB[cost.material]?.icon||'?'}`, 1030, by + 8, '#aaa', 8);
                    r.text(`${Math.round(cost.successRate*100)}%`, 1030, by + 20, cost.successRate >= 0.7 ? '#88ff88' : '#ff8888', 8);
                    if (inp.clickedIn(940, by, 80, 35)) {
                        const result = game.enhance.enhance(item, inv, game.gold);
                        if (result.success) {
                            game.spendGold(result.cost);
                            game.audio.enhance();
                            game.particles.burst(1000, by + 15, 12, '#ff88ff', 3);
                            game.notify(`✨ ${result.message}`, '#ff88ff');
                        } else if (result.error) {
                            game.notify(result.error, '#ff4444');
                        } else {
                            game.spendGold(result.cost);
                            game.notify(`💔 ${result.message}`, '#ff4444');
                            game.audio.error();
                        }
                    }
                }
                by += 42;
            }

            // Add to shop display
            if (item.basePrice > 0 && !item.quest) {
                const dispHover = inp.isOver(850, by, 160, 35);
                r.button(850, by, 160, 35, '🏪 Add to Shop', dispHover);
                if (inp.clickedIn(850, by, 160, 35)) {
                    if (game.shop.addToDisplay(item.id, 1, inv)) {
                        game.audio.click();
                        game.notify(`Added ${item.name} to display`, '#44aaff');
                    } else {
                        game.notify('Shop display is full!', '#ff4444');
                    }
                }
                by += 42;

                // Quick sell
                const sellHover = inp.isOver(850, by, 160, 35);
                r.button(850, by, 160, 35, `💰 Sell (${sellPrice}g)`, sellHover, false, '#5a5020');
                if (inp.clickedIn(850, by, 160, 35)) {
                    game.sellItem(item.id);
                }
                by += 42;

                // Sell all
                if (item.quantity > 1) {
                    const totalPrice = sellPrice * item.quantity;
                    const sellAllHover = inp.isOver(850, by, 160, 35);
                    r.button(850, by, 160, 35, `💰 Sell All (${totalPrice}g)`, sellAllHover, false, '#5a5020');
                    if (inp.clickedIn(850, by, 160, 35)) {
                        const qty = item.quantity;
                        for (let s = 0; s < qty; s++) game.sellItem(item.id);
                    }
                    by += 42;
                }
            }

            // Use (for potions/food)
            // Fusion (3 materials of same type → higher rarity)
            if (item.category === 'material' && item.quantity >= 3 && ['common', 'uncommon', 'rare', 'epic'].includes(item.rarity)) {
                const fuseHover = inp.isOver(850, by, 160, 35);
                r.button(850, by, 160, 35, `🔄 Fuse 3→1 ↑`, fuseHover, false, '#4a2a6a');
                r.text('Combine 3 for higher rarity', 1020, by + 12, '#aa88dd', 8);
                if (inp.clickedIn(850, by, 160, 35)) {
                    const result = game.fusion.fuse(item.id, inv);
                    if (result.success) {
                        game.audio.fusion();
                        game.particles.burst(1000, by + 15, 15, RarityColors[result.result.rarity] || '#fff', 3);
                        game.notify(`Fused! ${result.result.icon} ${result.result.name} (${result.result.rarity})`, RarityColors[result.result.rarity] || '#fff');
                        game.codex.discoverItem(result.result.id);
                    } else {
                        game.notify(result.error, '#ff4444');
                    }
                }
                by += 42;
            }

            if (item.effect && (item.category === 'potion' || item.category === 'food')) {
                const useHover = inp.isOver(850, by, 160, 35);
                r.button(850, by, 160, 35, `🧪 Use`, useHover);
                if (inp.clickedIn(850, by, 160, 35)) {
                    // Apply effect outside combat
                    game.inventory.removeItem(item.id, 1);
                    if (item.effect.type === 'heal') {
                        game.notify(`Healed ${item.effect.value} HP!`, '#44ff44');
                    }
                    game.audio.heal();
                }
            }
        } else {
            r.text('Select an item', 1010, 400, '#666', 13, 'center');
        }

        // Bulk sell buttons at bottom
        r.roundRect(835, 700, 350, 45, 6, 'rgba(30,15,50,0.5)', '#3d1e6d');
        r.text('Quick Sell:', 850, 708, '#888', 10);

        // Sell all common materials
        const scHover = inp.isOver(850, 718, 100, 22);
        r.button(850, 718, 100, 22, '💰 Common', scHover, false, '#4a3020');
        if (inp.clickedIn(850, 718, 100, 22)) {
            let totalSold = 0;
            const toSell = inv.getItemsByCategory('material').filter(i => i.rarity === 'common' && i.basePrice > 0);
            for (const item of toSell) {
                const qty = item.quantity;
                for (let s = 0; s < qty; s++) {
                    game.sellItem(item.id);
                    totalSold++;
                }
            }
            if (totalSold > 0) game.notify(`Sold ${totalSold} common materials!`, '#ffd700');
        }

        // Sell all uncommon materials
        const suHover = inp.isOver(960, 718, 110, 22);
        r.button(960, 718, 110, 22, '💰 Uncommon', suHover, false, '#2a4a20');
        if (inp.clickedIn(960, 718, 110, 22)) {
            let totalSold = 0;
            const toSell = inv.getItemsByCategory('material').filter(i => i.rarity === 'uncommon' && i.basePrice > 0);
            for (const item of toSell) {
                const qty = item.quantity;
                for (let s = 0; s < qty; s++) {
                    game.sellItem(item.id);
                    totalSold++;
                }
            }
            if (totalSold > 0) game.notify(`Sold ${totalSold} uncommon materials!`, '#ffd700');
        }

        // Stock all to shop
        const saHover = inp.isOver(1080, 718, 100, 22);
        r.button(1080, 718, 100, 22, '🏪 Stock All', saHover, false, '#2a2a5a');
        if (inp.clickedIn(1080, 718, 100, 22)) {
            let stocked = 0;
            const sellable = inv.getItemList().filter(i => i.basePrice > 0 && !i.quest);
            for (const item of sellable) {
                if (game.shop.addToDisplay(item.id, 1, inv)) stocked++;
                if (game.shop.displayItems.length >= game.shop.maxDisplay) break;
            }
            if (stocked > 0) game.notify(`Stocked ${stocked} items to shop!`, '#44aaff');
        }
    }
}
