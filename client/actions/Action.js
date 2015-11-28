import config from '../config';

export default class Action {
    constructor(options) {
        this.cooldown = options.cooldown || config.actions.cooldown;
        this.durationAnimation = options.durationAnimation || (config.serverSendStateInterval * 2 + this.cooldown);

        this.lastTimeUsed = 0;
        this.checked = false;
    }

    _run() {
    }

    use(now) {
        this.lastTimeUsed = now;
        this._run();
    }

    check(now) {
        if (!this.checked) {
            if (now - this.lastTimeUsed > this.cooldown) {
                this.checked = true;
                // this.lastTimeUsed = now;
            }
        }
    }

    reset() {
        this.checked = false;
    }

    isAnimate(now) {
        return (now - this.lastTimeUsed) < this.durationAnimation;
    }

    getInfo() {
        return 0;
    }
}
