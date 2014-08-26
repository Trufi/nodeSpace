define(
    function(require) {
        var _ = require('lodash');
        var PIXI = require('pixi');
        var game = require('games/game');
        var request = require('modules/request');
        var ping = require('modules/ping');

        var debug = {};

        var pingText;

        debug.pingOn = function() {
            pingText = new PIXI.Text(ping.get() + 'ms', {
                font: 'normal 18px Arial',
                fill: '#fff'
            });
            pingText.position.x = 10;
            pingText.position.y = 10;
            game.layers[4].addChild(pingText);
        };

        debug.pingOff = function() {
            game.layers[4].removeChild(pingText);
            pingText = undefined;
        };

        debug.update = function() {
            if (pingText !== undefined) {
                pingText.setText(ping.get() + 'ms');
            }
        };

        return debug;
    }
);