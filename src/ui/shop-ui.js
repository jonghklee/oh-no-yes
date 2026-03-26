// Shop screen UI
class ShopUI {
    static render(game) {
        const r = game.renderer;
        const inp = game.input;
        const shop = game.shop;
        const bonuses = game.getSkillBonuses();

        // Shop background
        r.gradientRect(0, 50, 1200, 700, '#12081f', '#1a0a2e');

        // === LEFT PANEL: Display Items ===
        r.panel(10, 55, 380, 340, '🏪 Shop Display');

        // Display slots
        for (let i = 0; i < shop.maxDisplay; i++) {
            const col = i % 4;
            const row = Math.floor(i / 4);
            const sx = 25 + col * 88;
            const sy = 95 + row * 88;
            const item = shop.displayItems[i] || null;
            const hovered = inp.isOver(sx, sy, 80, 80);

            r.itemSlot(sx, sy, 80, item, hovered);

            if (item) {
                const price = game.economy.getSellPrice(item.id, item.quality || 1.0, bonuses);
                r.text(`${price}g`, sx + 40, sy + 62, '#ffd700', 10, 'center');

                if (hovered) {
                    game.tooltipItem = item;
                }

                // Right click to remove from display
                if (hovered && inp.rightClicked) {
                    shop.removeFromDisplay(i, game.inventory);
                    game.audio.click();
                }
            }
        }

        // Add item button / instructions
        r.text('Right-click to remove items', 20, 280, '#666', 10);
        r.text('Add items from inventory (tab 4)', 20, 295, '#666', 10);

        // Quick add buttons for inventory items
        const sellableItems = game.inventory.getItemList().filter(item =>
            item.basePrice > 0 && !item.quest
        ).slice(0, 6);

        r.text('Quick Stock:', 20, 320, '#aaa', 11);
        sellableItems.forEach((item, i) => {
            const bx = 20 + (i % 3) * 120;
            const by = 338 + Math.floor(i / 3) * 24;
            const hovered = inp.isOver(bx, by, 115, 22);
            r.roundRect(bx, by, 115, 22, 3, hovered ? 'rgba(61,30,109,0.5)' : 'rgba(30,15,50,0.5)', '#3d1e6d');
            r.text(`${item.icon} ${item.name} (${item.quantity})`, bx + 5, by + 4, RarityColors[item.rarity], 10);

            if (inp.clickedIn(bx, by, 115, 22)) {
                if (shop.addToDisplay(item.id, 1, game.inventory)) {
                    game.audio.click();
                }
            }
        });

        // === RIGHT PANEL: Customers ===
        r.panel(400, 55, 790, 340, '👥 Customers');

        if (shop.customers.length === 0 && !shop.activeNegotiation) {
            r.text('Waiting for customers...', 600, 170, '#666', 16, 'center');
            r.text(`Next customer in ~${Math.ceil((shop.customerInterval - shop.customerTimer) / 1000)}s`, 600, 200, '#555', 12, 'center');
        }

        // Render customers
        shop.customers.forEach((customer, i) => {
            const cx = 420 + i * 250;
            const cy = 90;
            const isActive = shop.activeNegotiation && shop.activeNegotiation.customerId === customer.id;

            r.roundRect(cx, cy, 230, 120, 6,
                isActive ? 'rgba(80,40,120,0.6)' : 'rgba(30,15,50,0.5)',
                isActive ? '#8050c0' : '#3d1e6d');

            r.text(customer.icon, cx + 20, cy + 10, '#fff', 30);
            r.textBold(customer.name, cx + 60, cy + 10, '#fff', 13);
            r.text(`Budget: ${Utils.formatGold(customer.budget)}g`, cx + 60, cy + 30, '#ffd700', 11);
            r.text(`Wants: ${customer.wantedCategory}`, cx + 60, cy + 48, '#aaa', 10);

            // Patience bar
            r.text('Patience:', cx + 10, cy + 75, '#888', 9);
            r.progressBar(cx + 70, cy + 75, 100, 10,
                customer.currentPatience, customer.maxPatience,
                customer.currentPatience <= 1 ? '#ff4444' : '#44aa44');

            // Browsing indicator
            if (!isActive) {
                const dots = '.'.repeat(Math.floor((customer.browseTimer || 0) / 1000) % 4);
                r.text(`Browsing${dots}`, cx + 10, cy + 95, '#888', 10);
            }
        });

        // === NEGOTIATION PANEL ===
        if (shop.activeNegotiation) {
            const neg = shop.activeNegotiation;
            r.panel(400, 400, 790, 200, '💬 Negotiation');

            // Customer dialogue
            const dialogue = neg.haggleCount === 0
                ? Utils.choice(neg.customer.dialogue.enter)
                : Utils.choice(neg.customer.dialogue.haggle);
            r.text(`"${dialogue}"`, 420, 440, '#ddd', 13);

            // Item info
            r.text(`${neg.item.icon} ${neg.item.name}`, 420, 470, RarityColors[neg.item.rarity], 14);
            r.text(`Market Value: ${game.economy.getSellPrice(neg.item.id, 1.0, bonuses)}g`, 420, 492, '#aaa', 11);

            // Offer
            r.textBold(`Current Offer: ${neg.currentOffer}g`, 420, 520, '#ffd700', 16);
            r.text(`(${neg.haggleCount}/${neg.customer.maxHaggle} haggles)`, 620, 522, '#888', 11);

            // Buttons
            const acceptHover = inp.isOver(420, 555, 120, 35);
            r.button(420, 555, 120, 35, '✅ Accept', acceptHover);
            if (inp.clickedIn(420, 555, 120, 35)) {
                const result = shop.acceptOffer();
                if (result) {
                    game.addGold(result.price);
                    game.audio.sell();
                    game.particles.saleEffect(600, 480);
                    game.particles.goldGain(600, 500, result.price);
                    game.reputation.addReputation(2);
                    game.quests.updateProgress('sell', { count: 1 });
                    game.trackDaily('sell', 1);
                    game.trackDaily('earnGold', result.price);
                    game.notify(`Sold ${result.item.name} for ${result.price}g!`, '#44ff44');
                    game.renderer.shake(100);
                }
            }

            const haggleHover = inp.isOver(560, 555, 120, 35);
            const canHaggle = neg.haggleCount < neg.customer.maxHaggle;
            r.button(560, 555, 120, 35, '🤝 Haggle', haggleHover, !canHaggle, '#5a5020');
            if (canHaggle && inp.clickedIn(560, 555, 120, 35)) {
                const result = shop.haggle();
                if (result) {
                    if (result.type === 'customerAngry') {
                        game.notify(result.dialogue, '#ff4444');
                        game.reputation.loseReputation(2);
                    } else {
                        game.audio.click();
                    }
                }
            }

            const rejectHover = inp.isOver(700, 555, 120, 35);
            r.button(700, 555, 120, 35, '❌ Refuse', rejectHover, false, '#5a2020');
            if (inp.clickedIn(700, 555, 120, 35)) {
                const result = shop.rejectOffer();
                if (result) {
                    game.audio.click();
                    game.notify(result.dialogue, '#ff8888');
                }
            }

            // Counter-offer buttons (preset price options)
            r.text('Counter:', 420, 598, '#888', 10);
            const counterPrices = [
                Math.round(neg.currentOffer * 1.1),
                Math.round(neg.currentOffer * 1.25),
                Math.round(neg.currentOffer * 1.5)
            ];
            counterPrices.forEach((cp, i) => {
                const cpx = 480 + i * 100;
                const cpHover = inp.isOver(cpx, 595, 90, 22);
                r.button(cpx, 595, 90, 22, `💬 ${cp}g`, cpHover, false, '#3a3a5a');
                if (inp.clickedIn(cpx, 595, 90, 22)) {
                    const result = shop.counterOffer(cp);
                    if (result) {
                        if (result.type === 'accepted') {
                            // Auto-accept the deal
                            const saleResult = shop.acceptOffer();
                            if (saleResult) {
                                game.addGold(saleResult.price);
                                game.audio.sell();
                                game.particles.saleEffect(600, 480);
                                game.particles.goldGain(600, 500, saleResult.price);
                                game.reputation.addReputation(2);
                                game.notify(`Deal! Sold for ${saleResult.price}g!`, '#44ff44');
                                game.renderer.shake(100);
                            }
                        } else if (result.type === 'customerAngry') {
                            game.notify(result.dialogue, '#ff4444');
                            game.reputation.loseReputation(2);
                        } else {
                            game.notify(result.dialogue, '#ffaa44');
                        }
                        game.audio.click();
                    }
                }
            });
        }

        // === BOTTOM LEFT: Daily Summary ===
        r.panel(10, 610, 380, 140, '📊 Today\'s Summary');
        r.text(`Sales: ${shop.dailySales}`, 25, 645, '#fff', 12);
        r.text(`Earnings: ${shop.dailyEarnings}g`, 25, 665, '#ffd700', 12);
        r.text(`Total Sales: ${shop.totalSales}`, 25, 685, '#aaa', 11);
        r.text(`Total Earnings: ${Utils.formatGold(shop.totalEarnings)}g`, 25, 705, '#aaa', 11);
        r.text(`Tax Rate: ${Math.round(game.economy.getEffectiveTaxRate(bonuses) * 100)}%`, 25, 725, '#ff8888', 11);

        // Skip day button
        const skipHover = inp.isOver(200, 710, 170, 30);
        r.button(200, 710, 170, 30, '⏭ Skip to Next Day', skipHover);
        if (inp.clickedIn(200, 710, 170, 30)) {
            game.advanceDay();
            game.audio.click();
        }

        // === MYSTERY CHESTS (in customer area when no negotiation) ===
        if (!shop.activeNegotiation && shop.customers.length === 0) {
            r.panel(400, 400, 790, 200, '🎁 Mystery Chests & Trade Routes');

            // Mystery chests
            const chests = game.mystery.getChestTypes();
            chests.forEach((chest, i) => {
                const cx = 420 + i * 255;
                const cy = 435;
                const hovered = inp.isOver(cx, cy, 240, 70);
                r.roundRect(cx, cy, 240, 70, 6,
                    hovered ? 'rgba(60,30,80,0.6)' : 'rgba(30,15,40,0.4)',
                    chest.color, 1);
                r.text(chest.icon, cx + 10, cy + 8, '#fff', 24);
                r.textBold(chest.name, cx + 45, cy + 8, chest.color, 12);
                r.text(`${chest.cost}g`, cx + 200, cy + 8, game.gold >= chest.cost ? '#ffd700' : '#ff6666', 12, 'right');
                r.text(chest.description, cx + 10, cy + 30, '#888', 9);

                // Open button
                const openHover = inp.isOver(cx + 150, cy + 45, 80, 22);
                r.button(cx + 150, cy + 45, 80, 22, '🔓 Open', openHover, game.gold < chest.cost);
                if (game.gold >= chest.cost && inp.clickedIn(cx + 150, cy + 45, 80, 22)) {
                    const result = game.mystery.openChest(chest.id, game.gold);
                    if (result && !result.error) {
                        game.spendGold(result.cost);
                        for (const item of result.items) {
                            game.inventory.addItem(item.item, item.qty);
                            game.codex.discoverItem(item.item);
                        }
                        if (result.bonusGold > 0) game.addGold(result.bonusGold);

                        if (result.isJackpot) {
                            game.notify(`🎉 JACKPOT! Amazing loot from ${chest.name}!`, '#ffd700', 5000);
                            game.audio.victory();
                            game.particles.burst(600, 400, 30, '#ffd700', 5);
                            game.renderer.shake(400);
                        } else {
                            const rarityColors = { common: '#9e9e9e', uncommon: '#4caf50', rare: '#2196f3', epic: '#9c27b0', legendary: '#ff9800' };
                            const itemNames = result.items.map(i => `${ItemDB[i.item]?.name} x${i.qty}`).join(', ');
                            game.notify(`${chest.icon} Got: ${itemNames}`, rarityColors[result.rarity] || '#fff', 4000);
                            game.audio.discover();
                            game.particles.sparkle(600, 400, rarityColors[result.rarity] || '#fff');
                        }
                    }
                }
            });

            // Trade routes
            const routes = game.tradeRoutes.getAvailableRoutes(game.day);
            if (routes.length > 0) {
                r.text('🚂 Trade Routes:', 420, 520, '#ffaa44', 11);
                r.text(`Active: ${game.tradeRoutes.activeCaravans.length}/${game.tradeRoutes.maxActiveCaravans}`, 580, 520, '#aaa', 10);

                routes.slice(0, 3).forEach((route, i) => {
                    const rx = 420 + i * 255;
                    const ry = 540;
                    const hovered = inp.isOver(rx, ry, 240, 50);
                    const canSend = game.gold >= route.investment && game.tradeRoutes.activeCaravans.length < game.tradeRoutes.maxActiveCaravans;

                    r.roundRect(rx, ry, 240, 50, 4,
                        hovered ? 'rgba(60,40,20,0.5)' : 'rgba(30,20,10,0.3)', '#8a6a3a');
                    r.text(`${route.icon} ${route.name}`, rx + 8, ry + 5, '#fff', 11);
                    r.text(`${route.investment}g → ${route.profitRange[0]}-${route.profitRange[1]}g (${route.distance}d)`, rx + 8, ry + 22, '#aaa', 9);
                    r.text(`Risk: ${Math.round(route.risk * 100)}%`, rx + 8, ry + 36, route.risk > 0.15 ? '#ff8888' : '#aaa', 9);

                    if (canSend && hovered && inp.clicked) {
                        const result = game.tradeRoutes.sendCaravan(route.id, game.day, game.gold);
                        if (result.success) {
                            game.spendGold(result.cost);
                            game.notify(`${route.icon} Caravan sent! Returns day ${result.returnDay}`, '#ffaa44');
                            game.audio.coin();
                        }
                    }
                });

                // Active caravans display
                game.tradeRoutes.activeCaravans.forEach((c, i) => {
                    const daysLeft = c.returnDay - game.day;
                    r.text(`${c.route.icon} ${c.route.name}: ${daysLeft}d left`, 420, 598 + i * 14, '#ffaa44', 9);
                });
            }
        }

        // === BOTTOM RIGHT: Shop Upgrades ===
        if (!shop.activeNegotiation) {
            r.panel(400, 610, 790, 140, '🏗 Shop Upgrades');
            const upgrades = shop.getUpgrades();
            upgrades.forEach((upg, i) => {
                const ux = 415 + (i % 2) * 385;
                const uy = 645 + Math.floor(i / 2) * 48;
                const maxed = upg.currentLevel >= upg.maxLevel;
                const canAfford = game.gold >= upg.cost;
                const hovered = inp.isOver(ux, uy, 370, 42);

                r.roundRect(ux, uy, 370, 42, 4,
                    hovered && !maxed ? 'rgba(60,30,100,0.5)' : 'rgba(20,10,40,0.3)', '#3d1e6d');
                r.textBold(upg.name, ux + 8, uy + 4, maxed ? '#888' : '#fff', 11);
                r.text(upg.description, ux + 8, uy + 20, maxed ? '#555' : '#aaa', 9);
                r.text(maxed ? 'MAX' : `${upg.cost}g`, ux + 330, uy + 8, maxed ? '#888' : (canAfford ? '#ffd700' : '#ff6666'), 11, 'right');

                // Level pips
                for (let p = 0; p < upg.maxLevel; p++) {
                    r.circle(ux + 340 + p * 8, uy + 30, 3, p < upg.currentLevel ? '#ffd700' : '#333');
                }

                if (hovered && inp.clicked && !maxed && canAfford) {
                    const result = shop.buyUpgrade(upg.id, game.gold);
                    if (result.success) {
                        game.spendGold(result.cost);
                        game.audio.buy();
                        game.notify(`Upgraded ${upg.name}!`, '#44ff44');
                    }
                }
            });
        }
    }
}
