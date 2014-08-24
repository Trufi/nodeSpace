define(
    function(require) {
        var _ = require('lodash');
        var PIXI = require('pixi');
        var game = require('games/game');
        var key = require('modules/key');
        var player = require('modules/player');
        var ScreenArrow = require('interface/screenArrow');
        var interface = require('interface/index');

        var state = {};

        state.start = function(options) {
            // присваиваем User игроку
            player.setUser(game.users[options.changeStatusData.user.id || options.user.id]);

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
        };

        state.update = function() {
            if (key.pressed.WHEELDOWN) {
                game.camera.zoomOut();
            } else if (key.pressed.WHEELUP) {
                game.camera.zoomIn();
            }

            if (key.down.W) {
                player.action('thrust');
            } else if (key.down.S) {
                player.action('reverse');
            }

            if (key.down.A) {
                player.action('left');
            } else if (key.down.D) {
                player.action('right');
            } else if (!key.down.CTRL) {
                // TODO: торможение
            }

            if (key.down.SPACE) {
                player.action('fire');
            }

            this.scrArrow.update();
            interface.bodyInfo.update();
        };

        state.render = function() {

        };

        state.close = function() {

        };

        return state;
    }
);