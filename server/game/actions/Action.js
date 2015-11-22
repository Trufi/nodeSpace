import config from '../../config';

export default class Action {
    constructor(options) {
        this.cooldown = options.cooldown || config.actions.cooldown;
        this.lastTimeUsed = 0;
        this.type = 0;
    }

    _run() {}

    use(now, options) {
        if (now - this.lastTimeUsed > this.cooldown) {
            this._run(now, options);
            this.lastTimeUsed = now;
        } else {
            return false;
        }
    }
}
