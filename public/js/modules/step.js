var _ = require('lodash');

var step = {};

step.go = function(dt) {
    _(weaponsList).forEach(function(el) {
        el.step(dt);
    });
};

var weaponsList = {};

step.addWeapon = function(weapon) {
    weaponsList[weapon.id] = weapon;
};

step.removeWeapon = function(weapon) {
    if (weaponsList[weapon.id] !== undefined) {
        delete weaponsList[weapon.id];
    }
};

module.exports = step;
