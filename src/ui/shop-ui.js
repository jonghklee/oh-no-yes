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
                    game.particles.goldGain(600, 500, result.price);
                    game.reputation.addReputation(2);
                    game.quests.updateProgress('sell', { count: 1 });
                    game.notify(`Sold ${result.item.name} for ${result.price}g!`, '#44ff44');
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
