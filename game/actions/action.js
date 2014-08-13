var config = require('config');

var Action = function Action(options) {
    this.cooldown = options.cooldown || config.actionsCooldown;
    this.lastTimeUsed = 0;
};

Action.prototype._run = function() {};

Action.prototype.use = function() {
    var now = Date.now();

    if (now - this.lastTimeUsed > this.cooldown) {
        this._run();
        this.lastTimeUsed = now;
    } else {
        return false;
    }
};

module.exports = Action;