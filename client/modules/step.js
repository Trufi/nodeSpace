import _ from 'lodash';

const step = {};

const weaponsList = {};

step.go = function(dt) {
    for (const i in weaponsList) {
        weaponsList[i].step(dt);
    }
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
