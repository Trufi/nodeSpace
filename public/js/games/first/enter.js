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

            var enterFrame = interface.frame.create({
                anchor: 'CENTER'
            });

            var button = interface.button.create({
                text: 'Quick start',
                width: 300,
                height: 50,
                fontSize: 22,
                color: 'red',
                click: function() {
                    console.log('lol');
                },
                position: [-150, -60]
            });
            enterFrame.addChild(button);

            var editbox = interface.editbox.create({
                text: '123456789',
                width: 300,
                height: 50,
                fontSize: 22,
                color: 'blue',
                click: function() {
                    console.log('lol2');
                },
                position: [-150, 15],
                placeholder: 'smth'
            });
            enterFrame.addChild(editbox);
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