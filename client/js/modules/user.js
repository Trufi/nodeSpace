var _ = require('lodash');

function User(options) {
    this.id = options[0];
    this.ship;
    this.actions = {};
};

User.prototype.setShip = function(body) {
    var _this = this;

    this.ship = body;

    _.forEach(this.ship.actions, function(el, i) {
        _this.actions[i] = el;
    });
};

module.exports = User;
