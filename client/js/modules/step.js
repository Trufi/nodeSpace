var _ = require('lodash');

var step = {};

var weaponsList = {};

step.go = function(dt) {
    _.forEach(weaponsList, function(el) {
        el.step(dt);
    });
};

step.addWeapon = function(weapon) {
    weaponsList[weapon.id] = weapon;
};

step.removeWeapon = function(weapon) {
    if (weaponsList[weapon.id] !== undefined) {
        delete weaponsList[weapon.id];
    }
};

module.exports = step;
