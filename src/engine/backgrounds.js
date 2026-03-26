// Animated background system per screen
class BackgroundRenderer {
    static render(renderer, screen, time) {
        const t = time / 1000;

        switch (screen) {
            case 'shop':
                BackgroundRenderer.shopBg(renderer, t);
                break;
            case 'craft':
                BackgroundRenderer.craftBg(renderer, t);
                break;
            case 'explore':
                BackgroundRenderer.exploreBg(renderer, t);
                break;
            case 'combat':
                // Combat has its own bg in combat-ui
                break;
            case 'inventory':
                BackgroundRenderer.inventoryBg(renderer, t);
                break;
            case 'skills':
                BackgroundRenderer.skillsBg(renderer, t);
                break;
            case 'quest':
                BackgroundRenderer.questBg(renderer, t);
                break;
            case 'map':
                BackgroundRenderer.mapBg(renderer, t);
                break;
            default:
                renderer.gradientRect(0, 50, 1200, 700, '#12081f', '#1a0a2e');
        }
    }

    static shopBg(r, t) {
        r.gradientRect(0, 50, 1200, 700, '#14091f', '#1c0c2e');
        // Warm lantern glow
        for (let i = 0; i < 3; i++) {
            const x = 200 + i * 400;
            const flicker = Math.sin(t * 3 + i * 2.1) * 0.15 + 0.85;
            r.setAlpha(0.04 * flicker);
            r.circle(x, 100, 80 + Math.sin(t * 2 + i) * 10, '#ffa500');
            r.resetAlpha();
        }
        // Floating dust particles
        for (let i = 0; i < 8; i++) {
            const x = (t * 20 + i * 167) % 1200;
            const y = 200 + Math.sin(t * 0.5 + i * 1.3) * 100;
            r.setAlpha(0.15);
            r.circle(x, y, 1, '#ffd700');
            r.resetAlpha();
        }
    }

    static craftBg(r, t) {
        r.gradientRect(0, 50, 1200, 700, '#1a0c08', '#1a0a2e');
        // Forge glow
        r.setAlpha(0.06 + Math.sin(t * 4) * 0.03);
        r.circle(600, 600, 200, '#ff4400');
        r.resetAlpha();
        // Sparks
        for (let i = 0; i < 5; i++) {
            const x = 500 + Math.sin(t * 3 + i * 1.7) * 150;
            const y = 700 - (t * 50 + i * 80) % 300;
            r.setAlpha(0.3);
            r.circle(x, y, 1.5, '#ff8800');
            r.resetAlpha();
        }
    }

    static exploreBg(r, t) {
        r.gradientRect(0, 50, 1200, 700, '#081a0c', '#0a1a2e');
        // Stars
        for (let i = 0; i < 15; i++) {
            const x = (i * 83 + 37) % 1200;
            const y = 60 + (i * 47 + 13) % 300;
            const blink = Math.sin(t * 1.5 + i * 2.3) * 0.3 + 0.5;
            r.setAlpha(blink * 0.3);
            r.circle(x, y, 1, '#fff');
            r.resetAlpha();
        }
        // Trees/mountains silhouette
        for (let i = 0; i < 10; i++) {
            const x = i * 130;
            const h = 40 + Math.sin(i * 0.7) * 20;
            r.setAlpha(0.08);
            r.fillRect(x, 700 - h, 120, h, '#1a4a1a');
            r.resetAlpha();
        }
    }

    static inventoryBg(r, t) {
        r.gradientRect(0, 50, 1200, 700, '#0f0a1f', '#1a0a2e');
        // Subtle grid pattern
        r.setAlpha(0.03);
        for (let x = 0; x < 1200; x += 40) {
            r.line(x, 50, x, 750, '#5a3090');
        }
        for (let y = 50; y < 750; y += 40) {
            r.line(0, y, 1200, y, '#5a3090');
        }
        r.resetAlpha();
    }

    static skillsBg(r, t) {
        r.gradientRect(0, 50, 1200, 700, '#0a0a1f', '#1a0a2e');
        // Constellation lines
        r.setAlpha(0.05);
        for (let i = 0; i < 6; i++) {
            const x1 = 100 + i * 200;
            const y1 = 200 + Math.sin(i) * 100;
            const x2 = x1 + 150;
            const y2 = y1 + Math.cos(i * 1.5) * 80;
            r.line(x1, y1, x2, y2, '#4488ff');
            r.circle(x1, y1, 2, '#4488ff');
            r.circle(x2, y2, 2, '#4488ff');
        }
        r.resetAlpha();
    }

    static questBg(r, t) {
        r.gradientRect(0, 50, 1200, 700, '#1a0f08', '#1a0a2e');
        // Scroll edge decoration
        r.setAlpha(0.04);
        r.fillRect(0, 50, 8, 700, '#8a6a3a');
        r.fillRect(1192, 50, 8, 700, '#8a6a3a');
        r.resetAlpha();
    }

    static mapBg(r, t) {
        r.gradientRect(0, 50, 1200, 700, '#0a1520', '#1a0a2e');
        // Gentle wave
        r.setAlpha(0.04);
        for (let x = 0; x < 1200; x += 4) {
            const y = 650 + Math.sin(x * 0.02 + t) * 20;
            r.fillRect(x, y, 4, 750 - y, '#2244aa');
        }
        r.resetAlpha();
    }

    // Weather overlay - called after main background
    static renderWeather(r, day, time) {
        const t = time / 1000;
        // Deterministic weather based on day
        const weatherSeed = (day * 7 + 3) % 10;
        if (weatherSeed < 3) return; // Clear (30%)

        if (weatherSeed < 5) {
            // Rain (20%)
            r.setAlpha(0.15);
            for (let i = 0; i < 15; i++) {
                const x = (t * 100 + i * 83) % 1200;
                const y = (t * 300 + i * 127) % 700 + 50;
                r.line(x, y, x - 2, y + 8, '#4488cc');
            }
            r.resetAlpha();
        } else if (weatherSeed < 7) {
            // Snow (20%) - winter aesthetic
            r.setAlpha(0.2);
            for (let i = 0; i < 12; i++) {
                const x = (Math.sin(t * 0.5 + i * 2.3) * 600 + 600);
                const y = (t * 30 + i * 67) % 700 + 50;
                r.circle(x, y, 1.5, '#ddeeff');
            }
            r.resetAlpha();
        } else if (weatherSeed < 9) {
            // Fog (20%)
            r.setAlpha(0.03);
            for (let i = 0; i < 4; i++) {
                const y = 400 + i * 80 + Math.sin(t * 0.3 + i) * 30;
                r.fillRect(0, y, 1200, 40, '#aaaacc');
            }
            r.resetAlpha();
        }
        // weatherSeed 9 = windy (10%) - just visual effect
    }
}
