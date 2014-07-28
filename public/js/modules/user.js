define(
    function(require) {
        var User = function User(options) {
            this.id = options.id;
            this.ship;
        };

        User.prototype.setShip = function(body) {
            this.ship = body;
        };

        return User;
    }
);