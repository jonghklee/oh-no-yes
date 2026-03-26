// Bank & Investment System
class BankSystem {
    constructor() {
        this.deposits = 0;       // gold deposited
        this.interestRate = 0.02; // 2% daily interest
        this.accumulatedInterest = 0;
        this.totalInterestEarned = 0;
        this.maxDeposit = 10000;  // increases with reputation
        this.loans = 0;          // active loan amount
        this.loanInterest = 0.05; // 5% daily loan interest
        this.loanDaysLeft = 0;
    }

    deposit(amount, playerGold) {
        if (amount <= 0) return { error: 'Invalid amount' };
        if (playerGold < amount) return { error: 'Not enough gold' };
        if (this.deposits + amount > this.maxDeposit) {
            return { error: `Max deposit: ${this.maxDeposit}g` };
        }
        this.deposits += amount;
        return { success: true, cost: amount, newBalance: this.deposits };
    }

    withdraw(amount) {
        if (amount <= 0 || amount > this.deposits) return { error: 'Invalid amount' };
        this.deposits -= amount;
        return { success: true, gained: amount, newBalance: this.deposits };
    }

    takeLoan(amount) {
        if (this.loans > 0) return { error: 'Pay existing loan first' };
        if (amount > this.maxDeposit * 2) return { error: 'Loan too large' };
        this.loans = amount;
        this.loanDaysLeft = 30; // Must repay in 30 days
        return { success: true, gained: amount };
    }

    repayLoan(amount, playerGold) {
        if (this.loans <= 0) return { error: 'No active loan' };
        const payment = Math.min(amount, this.loans, playerGold);
        this.loans -= payment;
        if (this.loans <= 0) {
            this.loans = 0;
            this.loanDaysLeft = 0;
        }
        return { success: true, cost: payment, remaining: this.loans };
    }

    // Called each day
    processDailyInterest() {
        const results = [];

        // Deposit interest
        if (this.deposits > 0) {
            const interest = Math.round(this.deposits * this.interestRate);
            this.accumulatedInterest += interest;
            this.totalInterestEarned += interest;
            results.push({ type: 'interest', amount: interest, total: this.accumulatedInterest });
        }

        // Loan interest
        if (this.loans > 0) {
            const loanInterest = Math.round(this.loans * this.loanInterest);
            this.loans += loanInterest;
            this.loanDaysLeft--;
            results.push({ type: 'loanInterest', amount: loanInterest, remaining: this.loans, daysLeft: this.loanDaysLeft });

            if (this.loanDaysLeft <= 0 && this.loans > 0) {
                // Forced repayment from deposits
                const forced = Math.min(this.loans, this.deposits);
                this.deposits -= forced;
                this.loans -= forced;
                results.push({ type: 'forcedRepayment', amount: forced, loanRemaining: this.loans });
            }
        }

        return results;
    }

    collectInterest() {
        const amount = this.accumulatedInterest;
        this.accumulatedInterest = 0;
        return amount;
    }

    updateMaxDeposit(reputation) {
        this.maxDeposit = 10000 + reputation * 100;
    }

    serialize() {
        return {
            deposits: this.deposits,
            accumulatedInterest: this.accumulatedInterest,
            totalInterestEarned: this.totalInterestEarned,
            maxDeposit: this.maxDeposit,
            loans: this.loans,
            loanDaysLeft: this.loanDaysLeft
        };
    }

    deserialize(data) {
        Object.assign(this, data || {});
    }
}
