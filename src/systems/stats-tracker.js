// Statistics Tracker - track daily metrics for graphs
class StatsTracker {
    constructor() {
        this.dailyIncome = [];    // last 30 days
        this.dailySales = [];
        this.dailyCrafts = [];
        this.maxTracked = 30;
    }

    recordDay(income, sales, crafts) {
        this.dailyIncome.push(income);
        this.dailySales.push(sales);
        this.dailyCrafts.push(crafts);

        if (this.dailyIncome.length > this.maxTracked) this.dailyIncome.shift();
        if (this.dailySales.length > this.maxTracked) this.dailySales.shift();
        if (this.dailyCrafts.length > this.maxTracked) this.dailyCrafts.shift();
    }

    getIncomeAverage() {
        if (this.dailyIncome.length === 0) return 0;
        return Math.round(this.dailyIncome.reduce((a, b) => a + b, 0) / this.dailyIncome.length);
    }

    getBestDay() {
        return Math.max(0, ...this.dailyIncome);
    }

    renderGraph(renderer, data, x, y, w, h, color, label) {
        if (data.length < 2) return;

        renderer.roundRect(x, y, w, h, 4, 'rgba(10,5,20,0.5)', '#333');
        renderer.text(label, x + 5, y + 3, '#888', 8);

        const max = Math.max(1, ...data);
        const step = w / (data.length - 1);

        for (let i = 1; i < data.length; i++) {
            const x1 = x + (i - 1) * step;
            const y1 = y + h - (data[i - 1] / max) * (h - 15);
            const x2 = x + i * step;
            const y2 = y + h - (data[i] / max) * (h - 15);
            renderer.line(x1, y1, x2, y2, color, 1.5);
        }

        // Current value
        const last = data[data.length - 1];
        renderer.text(last.toString(), x + w - 5, y + 3, color, 8, 'right');
    }

    serialize() {
        return {
            dailyIncome: this.dailyIncome,
            dailySales: this.dailySales,
            dailyCrafts: this.dailyCrafts
        };
    }

    deserialize(data) {
        this.dailyIncome = data?.dailyIncome || [];
        this.dailySales = data?.dailySales || [];
        this.dailyCrafts = data?.dailyCrafts || [];
    }
}
