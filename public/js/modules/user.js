define(
    function(require) {
        var User = function User(options) {
            this.id = options[0];
            this.ship;
            this.actions = {};
        };

        User.prototype.setShip = function(body) {
            var _this = this;

            this.ship = body;

            _(this.ship.actions).forEach(function(el, i) {
                _this.actions[i] = el;
            });
        };

        return User;
    }
);