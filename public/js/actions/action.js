define(
    function(require) {
        var config = require('json!config');

        var Action = function Action(options) {
            this.user = options.user;
            this.cooldown = options.cooldown || config.actionsCooldown;
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

        return Action;
    }
);