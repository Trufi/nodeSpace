define(
    function(require) {
        var _ = require('lodash');
        var request = require('modules/request');

        // хрен знает че делает, пока что просто хранит ссылку на User данного пользователя
        var player = {};

        player.user;
        player.ship;

        player.setUser = function(user) {
            this.user =  user;
            this.ship = this.user.ship;
        };

        player.actions = {};

        player.actions.thrust = {
            done: false
        };

        player.sendActionToServer = function() {
            var actions = {},
                isNull = true;

            _(player.actions).forEach(function(el, i) {
                if (el.done) {
                    actions[i] = true;
                    isNull = false;
                    el.done = false;
                }
            });

            if (!isNull) {
                console.log(actions);
                request.sendToServer(actions);
            }
        };

        return player;
    }
);