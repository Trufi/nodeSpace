import _ from 'lodash';

export default class User {
    constructor(options) {
        this.id = options.id;
        this.ship = null;
        this.actions = {};
    }

    setShip(body) {
        this.ship = body;

        _.forEach(this.ship.actions, (el, i) => {
            this.actions[i] = el;
        });
    }

    getShip() {
        return this.ship;
    }
}
