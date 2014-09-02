define(
    function(require) {
        var _ = require('lodash');
        var request = require('modules/request');
        //var action = require('actions/index');

        var player = {};

        player.user;
        player.actions = {};

        player.setUser = function(user) {
            var _this = this;

            this.user = user;

            _(this.user.actions).forEach(function(el, i) {
                _this.actions[i] = el;
            });
        };

        player.action = function(now, name) {
            this.actions[name].check(now);
        };

        player.sendActionToServer = function() {
            var actions = {},
                notNull = false;

            _(player.actions).forEach(function(el, i) {
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

        return player;
    }
);