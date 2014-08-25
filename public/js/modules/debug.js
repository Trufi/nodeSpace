define(
    function(require) {
        var _ = require('lodash');
        var PIXI = require('pixi');
        var game = require('games/game');
        var request = require('modules/request');

        var debug = {};

        var pingInterval,
            pingTimeInterval = 1000,
            pingText;

        debug.pingOn = function() {
            pingText = new PIXI.Text('0ms', {
                font: 'normal 18px Arial',
                fill: '#fff'
            });
            pingText.position.x = 10;
            pingText.position.y = 10;
            game.layers[4].addChild(pingText);

            pingInterval = setInterval(function() {
                var sendTime = Date.now();

                request.ping(function() {
                    if (pingText !== undefined) {
                        pingText.setText(Date.now() - sendTime + 'ms');
                    }
                });
            }, pingTimeInterval);
        };

        debug.pingOff = function() {
            clearInterval(pingInterval);
            game.layers[4].removeChild(pingText);
            pingText = undefined;
        };

        return debug;
    }
);