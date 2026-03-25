// Animation system
class AnimationSystem {
    constructor() {
        this.animations = [];
    }

    add(target, prop, from, to, duration, easing = 'easeOutCubic', onComplete = null) {
        this.animations.push({
            target, prop, from, to, duration,
            elapsed: 0, easing, onComplete
        });
        target[prop] = from;
    }

    update(dt) {
        for (let i = this.animations.length - 1; i >= 0; i--) {
            const a = this.animations[i];
            a.elapsed += dt;
            const t = Utils.clamp(a.elapsed / a.duration, 0, 1);
            const easedT = Utils[a.easing] ? Utils[a.easing](t) : t;
            a.target[a.prop] = Utils.lerp(a.from, a.to, easedT);
            if (t >= 1) {
                a.target[a.prop] = a.to;
                if (a.onComplete) a.onComplete();
                this.animations.splice(i, 1);
            }
        }
    }

    isAnimating() {
        return this.animations.length > 0;
    }
}
