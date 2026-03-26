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
    hover() { this.play('sine', 1200, 0.02, 0.05); }
    click() { this.play('sine', 800, 0.05, 0.2); }
    tabSwitch() { this.play('sine', 600, 0.05, 0.15); this.play('sine', 900, 0.05, 0.1); }
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
    upgrade() { [440, 554, 659, 880].forEach((f,i) => setTimeout(() => this.play('sine', f, 0.15, 0.25), i*80)); }
    questComplete() { [523, 659, 784, 1047, 1319].forEach((f,i) => setTimeout(() => this.play('triangle', f, 0.2, 0.25), i*100)); }
    chestOpen() { this.play('triangle', 400, 0.1, 0.2); setTimeout(() => this.play('sine', 800, 0.15, 0.3), 100); }
    fusion() { this.play('sawtooth', 300, 0.2, 0.2); setTimeout(() => this.play('sine', 900, 0.2, 0.3), 150); }
    enhance() { this.play('square', 250, 0.1, 0.2); setTimeout(() => this.play('sine', 1000, 0.15, 0.25), 100); }

    // === AMBIENT MUSIC SYSTEM ===
    startMusic(mood = 'shop') {
        if (!this.enabled || !this.ctx) return;
        this.stopMusic();
        this.musicMood = mood;
        this.musicPlaying = true;
        this._playMusicLoop();
    }

    stopMusic() {
        this.musicPlaying = false;
        if (this._musicTimeout) clearTimeout(this._musicTimeout);
    }

    _playMusicLoop() {
        if (!this.musicPlaying || !this.ctx) return;

        const moods = {
            shop: { scale: [261, 294, 330, 349, 392, 440, 494], tempo: 2000, type: 'sine', vol: 0.06 },
            combat: { scale: [196, 220, 247, 262, 294, 330, 370], tempo: 800, type: 'sawtooth', vol: 0.05 },
            explore: { scale: [330, 370, 415, 440, 494, 554, 622], tempo: 1500, type: 'triangle', vol: 0.05 },
            title: { scale: [262, 330, 392, 494, 524, 660, 784], tempo: 2500, type: 'sine', vol: 0.04 }
        };

        const m = moods[this.musicMood] || moods.shop;

        // Play a note from the scale
        const note = m.scale[Math.floor(Math.random() * m.scale.length)];
        const duration = Utils.randomFloat(0.3, 0.8);

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = m.type;
            osc.frequency.value = note;
            gain.gain.value = 0;
            gain.gain.linearRampToValueAtTime(m.vol * this.volume, this.ctx.currentTime + 0.05);
            gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch(e) {}

        // Occasionally play a harmony
        if (Math.random() < 0.3) {
            const harmony = m.scale[Math.floor(Math.random() * m.scale.length)] * 0.5;
            try {
                const osc2 = this.ctx.createOscillator();
                const gain2 = this.ctx.createGain();
                osc2.type = 'sine';
                osc2.frequency.value = harmony;
                gain2.gain.value = 0;
                gain2.gain.linearRampToValueAtTime(m.vol * 0.3 * this.volume, this.ctx.currentTime + 0.1);
                gain2.gain.linearRampToValueAtTime(0, this.ctx.currentTime + duration * 1.5);
                osc2.connect(gain2);
                gain2.connect(this.ctx.destination);
                osc2.start();
                osc2.stop(this.ctx.currentTime + duration * 1.5);
            } catch(e) {}
        }

        const nextDelay = Utils.random(m.tempo * 0.7, m.tempo * 1.3);
        this._musicTimeout = setTimeout(() => this._playMusicLoop(), nextDelay);
    }

    setMood(mood) {
        if (this.musicMood !== mood && this.musicPlaying) {
            this.startMusic(mood);
        }
    }
}
