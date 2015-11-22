import _ from 'lodash';

import Action from './Action';

export default class Fire extends Action {
    constructor(options) {
        super(options);

        this.type = 5;
        this.cooldown = 100;
        this.ship = options.body;
        this.weapons = options.weapons;
    }

    _run(now, options) {
        this.ship.actionsUsed.push(this.type);

        _.forEach(options, (angle, i) => {
            if (this.weapons[i] !== undefined) {
                this.weapons[i].fire(now, angle);
            }
        });
    }
}
