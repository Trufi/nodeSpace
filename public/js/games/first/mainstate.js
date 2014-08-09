define(
    function(require) {
        var _ = require('lodash');
        var PIXI = require('pixi');
        var game = require('games/game');
        var key = require('modules/key');
        var player = require('modules/player');
        var ScreenArrow = require('interface/screenArrow');

        var state = {};

        state.start = function() {
            this.followBodyNumber = 3;
            game.camera.followTo(game.bodies[this.followBodyNumber]);

            this.scrArrow = new ScreenArrow({
                camera: game.camera,
                target: game.bodies[1],
                stage: game.stage
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

            this.scrArrow.update();
        };

        state.render = function() {

        };

        state.close = function() {

        };

        return state;
    }
);