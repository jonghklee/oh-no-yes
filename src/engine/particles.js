// Particle system
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.floatingTexts = [];
    }

    emit(x, y, count, color, speed = 2, life = 30, size = 3) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = Utils.randomFloat(speed * 0.5, speed);
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                life,
                maxLife: life,
                color,
                size
            });
        }
    }

    burst(x, y, count, color, speed = 3) {
        this.emit(x, y, count, color, speed, 40, 4);
    }

    sparkle(x, y, color = '#ffd700') {
        this.emit(x, y, 5, color, 1, 20, 2);
    }

    goldBurst(x, y) {
        this.burst(x, y, 8, '#ffd700', 2);
    }

    floatingText(x, y, text, color = '#fff', size = 14, duration = 60) {
        this.floatingTexts.push({
            x, y, text, color, size, duration,
            life: duration,
            vy: -1
        });
    }

    damage(x, y, amount, isCrit = false) {
        const color = isCrit ? '#ff4444' : '#ff8844';
        const size = isCrit ? 18 : 14;
        const text = isCrit ? `${amount}!` : `${amount}`;
        this.floatingText(x, y, text, color, size);
        if (isCrit) this.burst(x, y, 6, '#ff4444');
    }

    goldGain(x, y, amount) {
        this.floatingText(x, y, `+${amount}g`, '#ffd700', 14);
        this.sparkle(x, y, '#ffd700');
    }

    xpGain(x, y, amount) {
        this.floatingText(x, y, `+${amount} XP`, '#44aaff', 12);
    }

    update() {
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05; // gravity
            p.life--;
            if (p.life <= 0) this.particles.splice(i, 1);
        }

        // Update floating texts
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const ft = this.floatingTexts[i];
            ft.y += ft.vy;
            ft.life--;
            if (ft.life <= 0) this.floatingTexts.splice(i, 1);
        }
    }

    render(renderer) {
        // Render particles
        for (const p of this.particles) {
            const alpha = p.life / p.maxLife;
            renderer.setAlpha(alpha);
            renderer.circle(p.x, p.y, p.size * alpha, p.color);
            renderer.resetAlpha();
        }

        // Render floating texts
        for (const ft of this.floatingTexts) {
            const alpha = ft.life / ft.duration;
            renderer.setAlpha(alpha);
            renderer.textWithShadow(ft.text, ft.x, ft.y, ft.color, ft.size, 'center');
            renderer.resetAlpha();
        }
    }
}
