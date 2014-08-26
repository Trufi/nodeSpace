var config = require('config');

var Action = function Action(options) {
    this.cooldown = options.cooldown || config.actions.cooldown;
    this.lastTimeUsed = 0;
    this.type = 0;
};

Action.prototype._run = function() {};

Action.prototype.use = function(now) {
    if (now - this.lastTimeUsed > this.cooldown) {
        this._run();
        this.lastTimeUsed = now;
    } else {
        return false;
    }
};

module.exports = Action;