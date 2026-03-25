// Camera for scrollable views
class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.speed = 0.1;
    }

    moveTo(x, y) {
        this.targetX = x;
        this.targetY = y;
    }

    update() {
        this.x = Utils.lerp(this.x, this.targetX, this.speed);
        this.y = Utils.lerp(this.y, this.targetY, this.speed);
    }
}
