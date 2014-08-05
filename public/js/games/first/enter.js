define(
    function(require) {
        var _ = require('lodash');
        var PIXI = require('pixi');
        var game = require('games/game');
        var key = require('modules/key');
        var interface = require('interface/index')

        var state = {};

        state.followBodyNumber;

        state.start = function() {
            this.followBodyNumber = 1;
            game.camera.followTo(game.bodies[this.followBodyNumber]);

            interface.button.create({
                text: 'Ahahah, it\'s work!',
                width: 300,
                height: 50,
                fontSize: 22,
                color: 'red',
                click: function() {
                    console.log('lol');
                },
                anchor: 'CENTER',
                position: [-150, -25]
            });
        };

        state.update = function() {
            if (key.pressed.SPACE) {
                this.followBodyNumber = this.followBodyNumber % _.size(game.bodies) + 1;
                game.camera.followTo(game.bodies[this.followBodyNumber]);
            }
        };

        state.render = function() {

        };

        state.close = function() {

        };

        return state;
    }
);