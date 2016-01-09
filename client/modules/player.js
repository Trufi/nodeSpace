import _ from 'lodash';

import request from '../modules/request';

const player = {};

player.user = null;
player.actions = {};

player.setUser = function(user) {
    this.user = user;

    _.forEach(this.user.actions, (el, i) => {
        this.actions[i] = el;
    });
};

player.action = function(now, name) {
    this.actions[name].check(now);
};

player.sendActionToServer = function() {
    const actions = {};
    let notNull = false;

    _.forEach(player.actions, function(el, i) {
        if (el.checked) {
            actions[i] = el.getInfo();

            el.reset();
            notNull = true;
        }
    });

    if (notNull) {
        request.sendToServer(actions);
    }
};

export {player as default};
