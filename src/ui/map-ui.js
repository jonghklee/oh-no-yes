// Market / Price overview UI
class MapUI {
    static selectedItem = null;
    static scrollY = 0;
    static filterCategory = 'all';

    static render(game) {
        const r = game.renderer;
        const inp = game.input;
        const economy = game.economy;
        const bonuses = game.getSkillBonuses();

        r.gradientRect(0, 50, 1200, 700, '#12081f', '#1a0a2e');

        // === LEFT: Category Filter ===
        r.panel(10, 55, 160, 700, '📊 Categories');

        const categories = ['all', ...Object.values(ItemCategory)];
        categories.forEach((cat, i) => {
            const cy = 88 + i * 28;
            const isActive = MapUI.filterCategory === cat;
            const hovered = inp.isOver(20, cy, 140, 25);
            r.roundRect(20, cy, 140, 25, 3,
                isActive ? '#3d1e6d' : (hovered ? 'rgba(61,30,109,0.3)' : 'transparent'));

            const icon = cat === 'all' ? '📋' : (CategoryIcons[cat] || '•');
            const label = cat === 'all' ? 'All Items' : cat.charAt(0).toUpperCase() + cat.slice(1);
            r.text(`${icon} ${label}`, 30, cy + 5, isActive ? '#fff' : '#aaa', 11);

            if (inp.clickedIn(20, cy, 140, 25)) {
                MapUI.filterCategory = cat;
                MapUI.scrollY = 0;
                game.audio.click();
            }
        });

        // === CENTER: Price List ===
        r.panel(180, 55, 600, 700, '💹 Market Prices');

        // Header
        r.text('Item', 200, 85, '#888', 11);
        r.text('Price', 450, 85, '#888', 11);
        r.text('Buy', 520, 85, '#888', 11);
        r.text('Sell', 590, 85, '#888', 11);
        r.text('Trend', 660, 85, '#888', 11);
        r.text('Stock', 720, 85, '#888', 11);
        r.line(190, 100, 770, 100, '#3d1e6d');

        const items = Object.entries(ItemDB).filter(([id, item]) => {
            if (MapUI.filterCategory === 'all') return true;
            return item.category === MapUI.filterCategory;
        });

        if (inp.isOver(180, 55, 600, 700)) {
            MapUI.scrollY = Utils.clamp(MapUI.scrollY - inp.scrollDelta * 25, -(items.length * 24 - 600), 0);
        }

        let iy = 105 + MapUI.scrollY;
        for (const [id, item] of items) {
            if (iy > 65 && iy < 740) {
                const hovered = inp.isOver(190, iy, 580, 22);
                const isSelected = MapUI.selectedItem === id;

                if (hovered || isSelected) {
                    r.fillRect(190, iy, 580, 22, isSelected ? 'rgba(80,40,120,0.4)' : 'rgba(61,30,109,0.2)');
                }

                r.text(`${item.icon} ${item.name}`, 200, iy + 3, RarityColors[item.rarity], 11);
                r.text(`${economy.getPrice(id)}g`, 450, iy + 3, '#ffd700', 11);
                r.text(`${economy.getBuyPrice(id, 1.0, bonuses)}g`, 520, iy + 3, '#ff8888', 11);
                r.text(`${economy.getSellPrice(id, 1.0, bonuses)}g`, 590, iy + 3, '#88ff88', 11);

                const trend = economy.getTrend(id);
                r.text(trend.icon, 660, iy + 3, trend.color, 11);

                const stock = game.inventory.getCount(id);
                r.text(stock > 0 ? stock.toString() : '-', 720, iy + 3, stock > 0 ? '#fff' : '#444', 11);

                if (inp.clickedIn(190, iy, 580, 22)) {
                    MapUI.selectedItem = id;
                    game.audio.click();
                }
            }
            iy += 24;
        }

        // === RIGHT: Item Detail & Price History ===
        r.panel(790, 55, 400, 700, '📈 Price Detail');

        if (MapUI.selectedItem) {
            const item = ItemDB[MapUI.selectedItem];
            const history = economy.priceHistory[MapUI.selectedItem] || [];

            r.text(item.icon, 810, 95, '#fff', 28);
            r.textBold(item.name, 850, 95, RarityColors[item.rarity], 16);
            r.text(`${item.rarity} ${item.category}`, 850, 117, '#aaa', 11);
            r.text(item.description || '', 810, 145, '#ccc', 11);

            // Current prices
            r.text('Current Price:', 810, 175, '#888', 11);
            r.textBold(`${economy.getPrice(MapUI.selectedItem)}g`, 920, 173, '#ffd700', 14);

            r.text('Buy Price:', 810, 195, '#888', 11);
            r.text(`${economy.getBuyPrice(MapUI.selectedItem, 1.0, bonuses)}g`, 920, 195, '#ff8888', 12);

            r.text('Sell Price:', 810, 215, '#888', 11);
            r.text(`${economy.getSellPrice(MapUI.selectedItem, 1.0, bonuses)}g`, 920, 215, '#88ff88', 12);

            const trend = economy.getTrend(MapUI.selectedItem);
            r.text('Trend:', 810, 235, '#888', 11);
            r.text(`${trend.icon} ${trend.text}`, 920, 235, trend.color, 12);

            // Price history chart
            if (history.length > 1) {
                r.text('Price History (30 days)', 810, 270, '#888', 11);
                const chartX = 810, chartY = 290, chartW = 370, chartH = 150;
                r.roundRect(chartX, chartY, chartW, chartH, 4, 'rgba(10,5,20,0.5)', '#333');

                const maxPrice = Math.max(...history) * 1.1;
                const minPrice = Math.min(...history) * 0.9;
                const range = maxPrice - minPrice || 1;

                // Grid lines
                for (let g = 0; g <= 4; g++) {
                    const gy = chartY + (chartH / 4) * g;
                    r.line(chartX, gy, chartX + chartW, gy, 'rgba(100,100,100,0.2)');
                    r.text(Math.round(maxPrice - (range / 4) * g).toString(), chartX - 3, gy - 5, '#555', 8, 'right');
                }

                // Price line
                for (let i = 1; i < history.length; i++) {
                    const x1 = chartX + ((i - 1) / (history.length - 1)) * chartW;
                    const y1 = chartY + chartH - ((history[i - 1] - minPrice) / range) * chartH;
                    const x2 = chartX + (i / (history.length - 1)) * chartW;
                    const y2 = chartY + chartH - ((history[i] - minPrice) / range) * chartH;

                    const color = history[i] >= history[i - 1] ? '#44ff44' : '#ff4444';
                    r.line(x1, y1, x2, y2, color, 2);
                }

                // Current dot
                if (history.length > 0) {
                    const lastX = chartX + chartW;
                    const lastY = chartY + chartH - ((history[history.length - 1] - minPrice) / range) * chartH;
                    r.circle(lastX, lastY, 4, '#ffd700', '#fff');
                }
            }

            // Sources
            if (item.sources) {
                r.text('Found in:', 810, 460, '#888', 11);
                item.sources.forEach((src, i) => {
                    r.text(`• ${src}`, 825, 478 + i * 18, '#aaa', 11);
                });
            }

            // Inventory
            const stock = game.inventory.getCount(MapUI.selectedItem);
            r.text(`In Stock: ${stock}`, 810, 540, stock > 0 ? '#88ff88' : '#666', 12);

            // Quick sell
            if (stock > 0) {
                const sellHover = inp.isOver(810, 565, 150, 30);
                const sellPrice = economy.getSellPrice(MapUI.selectedItem, 1.0, bonuses);
                r.button(810, 565, 150, 30, `Sell 1 (${sellPrice}g)`, sellHover);
                if (inp.clickedIn(810, 565, 150, 30)) {
                    game.sellItem(MapUI.selectedItem);
                }
            }
        } else {
            r.text('Select an item to view details', 990, 400, '#666', 13, 'center');
        }

        // === BANK SECTION (bottom of right panel) ===
        r.panel(790, 620, 400, 130, '🏦 Bank');
        const bank = game.bank;

        r.text(`Deposits: ${Utils.formatGold(bank.deposits)}g / ${Utils.formatGold(bank.maxDeposit)}g`, 810, 650, '#44ddff', 11);
        r.text(`Interest Rate: ${Math.round(bank.interestRate * 100)}% daily`, 810, 668, '#aaa', 10);
        r.text(`Earned: ${Utils.formatGold(bank.totalInterestEarned)}g total`, 810, 683, '#ffd700', 10);

        if (bank.accumulatedInterest > 0) {
            const collectHover = inp.isOver(1030, 648, 140, 22);
            r.button(1030, 648, 140, 22, `💰 Collect ${bank.accumulatedInterest}g`, collectHover);
            if (inp.clickedIn(1030, 648, 140, 22)) {
                const amt = bank.collectInterest();
                game.addGold(amt);
                game.audio.coin();
                game.notify(`Collected ${amt}g interest!`, '#44ddff');
            }
        }

        // Deposit / Withdraw buttons
        const depAmounts = [100, 500, 1000];
        depAmounts.forEach((amt, i) => {
            const dx = 810 + i * 65;
            // Deposit
            const depHover = inp.isOver(dx, 700, 60, 20);
            r.button(dx, 700, 60, 20, `+${amt}`, depHover, game.gold < amt || bank.deposits + amt > bank.maxDeposit, '#2a4a2a');
            if (game.gold >= amt && bank.deposits + amt <= bank.maxDeposit && inp.clickedIn(dx, 700, 20, 20)) {
                const result = bank.deposit(amt, game.gold);
                if (result.success) { game.spendGold(amt); game.audio.coin(); }
            }
            // Withdraw
            const wdx = dx + 130;
            const wdHover = inp.isOver(wdx, 700, 60, 20);
            r.button(wdx, 700, 60, 20, `-${amt}`, wdHover, bank.deposits < amt, '#4a2a2a');
            if (bank.deposits >= amt && inp.clickedIn(wdx, 700, 60, 20)) {
                const result = bank.withdraw(amt);
                if (result.success) { game.addGold(amt); game.audio.coin(); }
            }
        });

        // Loan info
        if (bank.loans > 0) {
            r.text(`⚠ Loan: ${Utils.formatGold(bank.loans)}g (${bank.loanDaysLeft}d left)`, 810, 728, '#ff8888', 10);
            const repayHover = inp.isOver(1050, 726, 120, 18);
            r.button(1050, 726, 120, 18, `Repay ${Math.min(bank.loans, game.gold)}g`, repayHover, game.gold <= 0, '#5a2a2a');
            if (game.gold > 0 && inp.clickedIn(1050, 726, 120, 18)) {
                const result = bank.repayLoan(game.gold, game.gold);
                if (result.success) { game.spendGold(result.cost); game.notify(`Repaid ${result.cost}g`, '#44ff44'); }
            }
        }
    }
}
