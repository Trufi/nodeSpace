define(
    function(require) {
        var _ = require('lodash');
        var PIXI = require('pixi');
        var game = require('games/game');
        var key = require('modules/key');
        var player = require('modules/player');
        var ScreenArrow = require('interface/screenArrow');
        var interface = require('interface/index');
        var debug = require('modules/debug');

        var state = {};

        state.start = function(options) {
            // присваиваем User игроку
            player.setUser(game.users[options.changeStatusData.user[0] || options.user[0]]);

            game.camera.followTo(player.user.ship);

            this.scrArrow = new ScreenArrow({
                camera: game.camera,
                target: game.bodies[1]
            });

            _(game.users).forEach(function(el) {
                interface.bodyInfo.create({
                    body: el.ship
                });
            });

            debug.pingOn();
            player.user.ship.weaponsAimActivate();
        };

        state.update = function(now) {
            if (key.pressed.WHEELDOWN) {
                game.camera.zoomOut();
            } else if (key.pressed.WHEELUP) {
                game.camera.zoomIn();
            }

            if (key.down.W) {
                player.action(now, 1);
            } else if (key.down.S) {
                player.action(now, 2);
            }

            if (key.down.A) {
                player.action(now, 3);
            } else if (key.down.D) {
                player.action(now, 4);
            } else if (!key.down.CTRL) {
                // TODO: торможение
            }

            if (key.down.SPACE) {
                player.action(now, 5);
            }

            player.user.ship.weaponsGoto(game.stage.getMousePosition());
            this.scrArrow.update();
            interface.bodyInfo.update();
            debug.update();
        };

        state.render = function() {

        };

        state.close = function() {

        };

        state.newData = function(data) {
            _(data[1]).forEach(function(el) {
                interface.bodyInfo.create({
                    body: game.users[el[0]].ship
                });
            });
        };

        state.removeData = function(data) {

        };

        return state;
    }
);