// Simple audio system using Web Audio API
class AudioSystem {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.volume = 0.3;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch(e) {
            this.enabled = false;
        }
    }

    play(type, freq = 440, duration = 0.1, vol = 0.3) {
        if (!this.enabled || !this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.value = freq;
            gain.gain.value = vol * this.volume;
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch(e) {}
    }

    // Sound effects
    click() { this.play('sine', 800, 0.05, 0.2); }
    buy() { this.play('sine', 523, 0.1, 0.3); this.play('sine', 659, 0.1, 0.3); }
    sell() { this.play('sine', 660, 0.08, 0.3); this.play('triangle', 880, 0.12, 0.2); }
    craft() { this.play('square', 200, 0.15, 0.2); this.play('square', 300, 0.1, 0.2); }
    hit() { this.play('sawtooth', 150, 0.1, 0.3); }
    crit() { this.play('sawtooth', 200, 0.15, 0.4); this.play('sine', 600, 0.1, 0.3); }
    heal() { this.play('sine', 440, 0.1, 0.2); this.play('sine', 550, 0.1, 0.2); this.play('sine', 660, 0.15, 0.2); }
    levelUp() {
        [523, 659, 784, 1047].forEach((f, i) => {
            setTimeout(() => this.play('sine', f, 0.2, 0.3), i * 100);
        });
    }
    error() { this.play('square', 200, 0.2, 0.3); }
    victory() {
        [523, 659, 784, 1047, 1319].forEach((f, i) => {
            setTimeout(() => this.play('sine', f, 0.25, 0.3), i * 120);
        });
    }
    defeat() {
        [400, 350, 300, 200].forEach((f, i) => {
            setTimeout(() => this.play('sine', f, 0.3, 0.3), i * 200);
        });
    }
    coin() { this.play('triangle', 1200, 0.05, 0.2); this.play('triangle', 1500, 0.05, 0.15); }
    discover() { this.play('sine', 600, 0.15, 0.25); this.play('sine', 750, 0.15, 0.2); }
}
