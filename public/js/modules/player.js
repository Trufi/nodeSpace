define(
    function(require) {
        var _ = require('lodash');
        var request = require('modules/request');
        var action = require('actions/index');

        // хрен знает че делает, пока что просто хранит ссылку на User данного пользователя
        var player = {};

        player.user;
        player.ship;
        player.actions = {};

        player.setUser = function(user) {
            var _this = this;

            this.user =  user;
            //this.ship = this.user.ship;

            _(this.user.ship.userActions).forEach(function(el) {
                _this.actions[el] = action.create({name: el, user: _this.user});
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
                    el.checked = false;
                }
            });

            if (actions.length > 0) {
                request.sendToServer(actions);
            }
        };

        return player;
    }
);