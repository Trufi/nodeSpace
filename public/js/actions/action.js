define(
    function(require) {
        var config = require('json!config');

        var Action = function Action(options) {
            this.cooldown = options.cooldown || config.actionsCooldown;
            this.durationAnimation = options.durationAnimation || 0;
            this.lastTimeUsed = 0;
            this.checked = false;
        };

        Action.prototype._run = function() {};

        Action.prototype.use = function() {
            this.lastTimeUsed = Date.now();
            this._run();
        };

        Action.prototype.check = function() {
            var now;

            if (!this.checked) {
                now = Date.now();
                if (now - this.lastTimeUsed > this.cooldown) {
                    this.checked = true;
                    this.lastTimeUsed = now;
                }
            }
        };

        Action.prototype.reset = function() {
            this.checked = false;
        };

        Action.prototype.isAnimate = function() {
            if (Date.now() - this.lastTimeUsed < this.durationAnimation) {
                return true;
            } else {
                return false;
            }
        };

        return Action;
    }
);