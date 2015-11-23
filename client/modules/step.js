import _ from 'lodash';

let step = {};

let weaponsList = {};

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

export {step as default};
