import _ from 'lodash';

import request from '../modules/request';

let player = {};

player.user;
player.actions = {};

player.setUser = function(user) {
    let _this = this;

    this.user = user;

    _.forEach(this.user.actions, function(el, i) {
        _this.actions[i] = el;
    });
};

player.action = function(now, name) {
    this.actions[name].check(now);
};

player.sendActionToServer = function() {
    let actions = {},
        notNull = false;

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
