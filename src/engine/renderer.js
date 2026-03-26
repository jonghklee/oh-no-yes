// Canvas renderer
class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.shakeX = 0;
        this.shakeY = 0;
        this.shakeTime = 0;
    }

    clear(color = '#1a0a2e') {
        this.ctx.save();
        if (this.shakeTime > 0) {
            this.shakeTime -= 16;
            this.shakeX = Utils.random(-3, 3);
            this.shakeY = Utils.random(-3, 3);
            this.ctx.translate(this.shakeX, this.shakeY);
        }
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    endFrame() {
        this.ctx.restore();
    }

    shake(duration = 200) {
        this.shakeTime = duration;
    }

    // Basic drawing
    fillRect(x, y, w, h, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, w, h);
    }

    strokeRect(x, y, w, h, color, lineWidth = 1) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.strokeRect(x, y, w, h);
    }

    roundRect(x, y, w, h, r, fillColor, strokeColor, lineWidth = 1) {
        this.ctx.beginPath();
        this.ctx.roundRect(x, y, w, h, r);
        if (fillColor) {
            this.ctx.fillStyle = fillColor;
            this.ctx.fill();
        }
        if (strokeColor) {
            this.ctx.strokeStyle = strokeColor;
            this.ctx.lineWidth = lineWidth;
            this.ctx.stroke();
        }
    }

    // Text
    text(str, x, y, color = '#fff', size = 14, align = 'left', font = 'Segoe UI') {
        this.ctx.fillStyle = color;
        this.ctx.font = `${size}px ${font}`;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(str, x, y);
    }

    textBold(str, x, y, color = '#fff', size = 14, align = 'left') {
        this.ctx.fillStyle = color;
        this.ctx.font = `bold ${size}px Segoe UI`;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(str, x, y);
    }

    textWithShadow(str, x, y, color = '#fff', size = 14, align = 'left') {
        this.ctx.font = `${size}px Segoe UI`;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = 'top';
        this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
        this.ctx.fillText(str, x + 1, y + 1);
        this.ctx.fillStyle = color;
        this.ctx.fillText(str, x, y);
    }

    measureText(str, size = 14) {
        this.ctx.font = `${size}px Segoe UI`;
        return this.ctx.measureText(str).width;
    }

    // Progress bar
    progressBar(x, y, w, h, value, max, fgColor, bgColor = '#333', borderColor = '#555') {
        const pct = Utils.clamp(value / max, 0, 1);
        this.roundRect(x, y, w, h, 3, bgColor, borderColor);
        if (pct > 0) {
            this.roundRect(x + 1, y + 1, (w - 2) * pct, h - 2, 2, fgColor);
        }
    }

    // Gradient rect
    gradientRect(x, y, w, h, color1, color2, direction = 'vertical') {
        const grad = direction === 'vertical'
            ? this.ctx.createLinearGradient(x, y, x, y + h)
            : this.ctx.createLinearGradient(x, y, x + w, y);
        grad.addColorStop(0, color1);
        grad.addColorStop(1, color2);
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(x, y, w, h);
    }

    // Circle
    circle(x, y, r, fillColor, strokeColor, lineWidth = 1) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI * 2);
        if (fillColor) {
            this.ctx.fillStyle = fillColor;
            this.ctx.fill();
        }
        if (strokeColor) {
            this.ctx.strokeStyle = strokeColor;
            this.ctx.lineWidth = lineWidth;
            this.ctx.stroke();
        }
    }

    // Line
    line(x1, y1, x2, y2, color, lineWidth = 1) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.stroke();
    }

    // Panel with title and shadow
    panel(x, y, w, h, title, bgColor = 'rgba(20,10,40,0.9)', borderColor = '#3d1e6d') {
        // Subtle drop shadow
        this.ctx.globalAlpha = 0.15;
        this.roundRect(x + 3, y + 3, w, h, 8, '#000');
        this.ctx.globalAlpha = 1;
        // Main panel
        this.roundRect(x, y, w, h, 8, bgColor, borderColor, 2);
        if (title) {
            this.gradientRect(x + 2, y + 2, w - 4, 28, '#3d1e6d', 'rgba(61,30,109,0.3)');
            this.textBold(title, x + 10, y + 7, '#e0d0ff', 14);
        }
    }

    // Button
    button(x, y, w, h, label, isHovered, isDisabled = false, color = '#3d1e6d') {
        const bg = isDisabled ? '#2a2a2a' : (isHovered ? '#5a3090' : color);
        const border = isDisabled ? '#444' : (isHovered ? '#8050c0' : '#5a3090');
        const textColor = isDisabled ? '#666' : '#fff';
        this.roundRect(x, y, w, h, 5, bg, border, 2);
        this.text(label, x + w / 2, y + h / 2 - 7, textColor, 13, 'center');
        return { x, y, w, h }; // for click detection
    }

    // Item slot
    itemSlot(x, y, size, item, isHovered = false, showQty = true) {
        const border = item ? RarityColors[item.rarity] : '#444';
        const bg = isHovered ? 'rgba(60,40,100,0.8)' : 'rgba(30,15,50,0.8)';
        this.roundRect(x, y, size, size, 4, bg, border, isHovered ? 2 : 1);
        if (item) {
            this.text(item.icon || '?', x + size / 2, y + size / 2 - 12, '#fff', 20, 'center');
            if (showQty && item.quantity > 1) {
                this.text(item.quantity.toString(), x + size - 5, y + size - 16, '#ffd700', 11, 'right');
            }
        }
    }

    // Tooltip
    tooltip(x, y, item) {
        if (!item) return;
        const w = 220;
        let h = 100;
        const lines = [];
        lines.push({ text: item.name, color: RarityColors[item.rarity], size: 14, bold: true });
        lines.push({ text: `${item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)} ${item.category}`, color: '#aaa', size: 11 });
        if (item.qualityLabel) {
            lines.push({ text: `Quality: ${item.qualityLabel}`, color: '#ffd700', size: 11 });
        }
        lines.push({ text: '', size: 4 }); // spacer
        if (item.description) {
            lines.push({ text: item.description, color: '#ccc', size: 11 });
        }
        if (item.stats) {
            lines.push({ text: '', size: 4 });
            for (const [stat, val] of Object.entries(item.stats)) {
                const label = stat.replace(/([A-Z])/g, ' $1').trim();
                const prefix = val > 0 ? '+' : '';
                lines.push({ text: `${label}: ${prefix}${typeof val === 'number' && val < 1 ? Math.round(val * 100) + '%' : val}`, color: '#88ff88', size: 11 });
            }
        }
        if (item.basePrice) {
            lines.push({ text: '', size: 4 });
            lines.push({ text: `Value: ${item.basePrice}g`, color: '#ffd700', size: 11 });
        }

        h = lines.reduce((sum, l) => sum + (l.size || 14) + 4, 0) + 16;
        // Keep tooltip on screen
        if (x + w > this.width) x = this.width - w - 5;
        if (y + h > this.height) y = this.height - h - 5;

        this.roundRect(x, y, w, h, 6, 'rgba(10,5,25,0.95)', '#5a3090', 2);
        let ty = y + 8;
        for (const line of lines) {
            if (line.bold) {
                this.textBold(line.text, x + 10, ty, line.color, line.size);
            } else {
                this.text(line.text, x + 10, ty, line.color, line.size);
            }
            ty += (line.size || 14) + 4;
        }
    }

    // Alpha
    setAlpha(a) {
        this.ctx.globalAlpha = a;
    }

    resetAlpha() {
        this.ctx.globalAlpha = 1;
    }

    // Screen flash effect
    flash(color = '#fff', duration = 200) {
        this._flashColor = color;
        this._flashTime = duration;
        this._flashMax = duration;
    }

    renderFlash() {
        if (this._flashTime > 0) {
            const alpha = (this._flashTime / this._flashMax) * 0.4;
            this.setAlpha(alpha);
            this.fillRect(0, 0, this.width, this.height, this._flashColor);
            this.resetAlpha();
            this._flashTime -= 16;
        }
    }

    // Vignette effect
    vignette(intensity = 0.3) {
        const grad = this.ctx.createRadialGradient(
            this.width / 2, this.height / 2, this.width * 0.3,
            this.width / 2, this.height / 2, this.width * 0.7
        );
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, `rgba(0,0,0,${intensity})`);
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
}
