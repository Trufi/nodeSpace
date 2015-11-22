import config from '../../config';

export default function Action(options) {
    this.cooldown = options.cooldown || config.actions.cooldown;
    this.lastTimeUsed = 0;
    this.type = 0;
};

Action.prototype._run = function() {};

Action.prototype.use = function(now, options) {
    if (now - this.lastTimeUsed > this.cooldown) {
        this._run(now, options);
        this.lastTimeUsed = now;
    } else {
        return false;
    }
};
