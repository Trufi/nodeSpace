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

        player.action = function(name) {
            this.actions[name].check();
        };

        player.sendActionToServer = function() {
            var actions = [];

            _(player.actions).forEach(function(el, i) {
                if (el.checked) {
                    actions.push(i);

                    el.reset();
                }
            });

            if (actions.length > 0) {
                request.sendToServer(actions);
            }
        };

        return player;
    }
);