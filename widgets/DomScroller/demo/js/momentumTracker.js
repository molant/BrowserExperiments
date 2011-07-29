
   

function MomentumTracker() {

    this.scrollDuration = 2000; // Duration of the scrolling animation in msecs.
    this.overshootDuration = 250; // Duration of the overshoot animation in msecs.
    this.snapbackDuration = 500; // Duration of the snapback animation in msecs.
    
    this.easing = "easeOutQuad";
    this.reset();

    this.getCurrentTime = function () {
        return (new Date()).getTime();
    }

}

var tstates = {
    scrolling: 0,
    overshot: 1,
    snapback: 2,
    done: 3
};


$.extend(MomentumTracker.prototype, {
    start: function (pos, speed, duration, minPos, maxPos) {
        this.state = (speed != 0) ? ((pos < minPos || pos > maxPos) ? tstates.snapback : tstates.scrolling) : tstates.done;
        this.pos = pos;
        this.speed = speed;
        this.duration = (this.state == tstates.snapback) ? this.snapbackDuration : duration;
        this.minPos = minPos;
        this.maxPos = maxPos;

        this.fromPos = (this.state == tstates.snapback) ? this.pos : 0;
        this.toPos = (this.state == tstates.snapback) ? ((this.pos < this.minPos) ? this.minPos : this.maxPos) : 0;

        this.startTime = this.getCurrentTime();
    },

    reset: function () {
        this.state = tstates.done;
        this.pos = 0;
        this.speed = 0;
        this.minPos = 0;
        this.maxPos = 0;
        this.duration = 0;
    },

    update: function () {
        var state = this.state;
        if (state == tstates.done) return this.pos;

        var duration = this.duration;
        var elapsed = this.getCurrentTime() - this.startTime;
        elapsed = elapsed > duration ? duration : elapsed;

        if (state == tstates.scrolling || state == tstates.overshot) {
            var dx = this.speed * (1 - $.easing[this.easing](elapsed / duration, elapsed, 0, 1, duration));

            var x = this.pos + dx;

            var didOverShoot = (state == tstates.scrolling) && (x < this.minPos || x > this.maxPos);
            if (didOverShoot) x = (x < this.minPos) ? this.minPos : this.maxPos;

            this.pos = x;

            if (state == tstates.overshot) {
                if (elapsed >= duration) {
                    this.state = tstates.snapback;
                    this.fromPos = this.pos;
                    this.toPos = (x < this.minPos) ? this.minPos : this.maxPos;
                    this.duration = this.snapbackDuration;
                    this.startTime = this.getCurrentTime();
                    elapsed = 0;
                }
            } else if (state == tstates.scrolling) {
                if (didOverShoot) {
                    this.state = tstates.overshot;
                    this.speed = dx / 2;
                    this.duration = this.overshootDuration;
                    this.startTime = this.getCurrentTime();
                } else if (elapsed >= duration) this.state = tstates.done;
            }
        } else if (state == tstates.snapback) {
            if (elapsed >= duration) {
                this.pos = this.toPos;
                this.state = tstates.done;
            } else this.pos = this.fromPos + ((this.toPos - this.fromPos) * $.easing[this.easing](elapsed / duration, elapsed, 0, 1, duration));
        }

        return this.pos;
    },

    done: function () {
        return this.state == tstates.done;
    },
    getPosition: function () {
        return this.pos;
    }
});
