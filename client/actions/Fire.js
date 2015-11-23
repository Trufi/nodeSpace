import _ from 'lodash';

import Action from './Action';

export default class Fire extends Action {
    constructor(options) {
        super(options);

        this.cooldown = 100;
        this.ship = options.body;
        this.weapons = options.weapons;
    }

    getInfo() {
        return _.map(this.weapons, function(el) {
            return Math.floor(el.getAngle() * 100) / 100;
        });
    }
}
