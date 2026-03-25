// Input handler
class Input {
    constructor(canvas) {
        this.canvas = canvas;
        this.mouseX = 0;
        this.mouseY = 0;
        this.clicked = false;
        this.rightClicked = false;
        this.keys = {};
        this.keysJustPressed = {};
        this.scrollDelta = 0;

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
            this.mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
        });

        canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) this.clicked = true;
            if (e.button === 2) this.rightClicked = true;
        });

        canvas.addEventListener('contextmenu', (e) => e.preventDefault());

        canvas.addEventListener('wheel', (e) => {
            this.scrollDelta += e.deltaY > 0 ? 1 : -1;
            e.preventDefault();
        }, { passive: false });

        window.addEventListener('keydown', (e) => {
            if (!this.keys[e.key]) {
                this.keysJustPressed[e.key] = true;
            }
            this.keys[e.key] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    isOver(x, y, w, h) {
        return Utils.pointInRect(this.mouseX, this.mouseY, x, y, w, h);
    }

    clickedIn(x, y, w, h) {
        return this.clicked && this.isOver(x, y, w, h);
    }

    justPressed(key) {
        return this.keysJustPressed[key] || false;
    }

    endFrame() {
        this.clicked = false;
        this.rightClicked = false;
        this.keysJustPressed = {};
        this.scrollDelta = 0;
    }
}
