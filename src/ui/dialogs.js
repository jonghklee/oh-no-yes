// Dialog overlay UI
class DialogUI {
    static render(game) {
        if (!game.dialogMessage) return;

        const r = game.renderer;
        const inp = game.input;
        const dialog = game.dialogMessage;

        // Overlay
        r.setAlpha(0.7);
        r.fillRect(0, 0, 1200, 800, '#000');
        r.resetAlpha();

        // Dialog box
        const w = 450;
        const h = dialog.options ? 180 : 120;
        const x = (1200 - w) / 2;
        const y = (800 - h) / 2;

        r.roundRect(x, y, w, h, 10, 'rgba(20,10,40,0.98)', '#5a3090', 2);

        // Message
        r.text(dialog.message, 600, y + 30, '#fff', 14, 'center');

        if (dialog.options) {
            dialog.options.forEach((opt, i) => {
                const bx = x + 30 + i * 200;
                const by = y + h - 55;
                const bw = 170;
                const hovered = inp.isOver(bx, by, bw, 35);

                r.button(bx, by, bw, 35, opt.label, hovered);

                if (inp.clickedIn(bx, by, bw, 35)) {
                    opt.action();
                    game.audio.click();
                }
            });
        } else {
            // Simple OK button
            const bx = x + w / 2 - 60;
            const by = y + h - 50;
            const hovered = inp.isOver(bx, by, 120, 35);
            r.button(bx, by, 120, 35, 'OK', hovered);
            if (inp.clickedIn(bx, by, 120, 35)) {
                game.dismissDialog();
                game.audio.click();
            }
        }
    }
}
