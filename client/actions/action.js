var config = require('../config');

var Action = function Action(options) {
    this.cooldown = options.cooldown || config.actions.cooldown;
    this.durationAnimation = options.durationAnimation || (config.serverSendStateInterval * 2 + this.cooldown);

    this.lastTimeUsed = 0;
    this.checked = false;
};

Action.prototype._run = function() {};

Action.prototype.use = function(now) {
    this.lastTimeUsed = now;
    this._run();
};

Action.prototype.check = function(now) {
    if (!this.checked) {
        if (now - this.lastTimeUsed > this.cooldown) {
            this.checked = true;
            //this.lastTimeUsed = now;
        }
    }
};

Action.prototype.reset = function() {
    this.checked = false;
};

Action.prototype.isAnimate = function(now) {
    return (now - this.lastTimeUsed) < this.durationAnimation;
};

Action.prototype.getInfo = function() {
    return 0;
};

module.exports = Action;
