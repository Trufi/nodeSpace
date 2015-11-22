import util from 'util';
import _ from 'lodash';

import Action from './Action';

export default function Fire(options) {
    Fire.super_.apply(this, arguments);

    this.type = 5;
    this.cooldown = 100;
    this.ship = options.body;
    this.weapons = options.weapons;
};

util.inherits(Fire, Action);

Fire.prototype._run = function(now, options) {
    var _this = this;

    this.ship.actionsUsed.push(this.type);

    _.forEach(options, function(angle, i) {
        if (_this.weapons[i] !== undefined) {
            _this.weapons[i].fire(now, angle);
        }
    });
};
