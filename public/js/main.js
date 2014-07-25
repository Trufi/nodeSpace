define(
    function(require) {
        var request = require('modules/request');
        var game = require('games/first');
        var render = require('modules/render');

        render.create();

        request.gameInit(function(data) {
            game.load(data, function() {
                game.start(data);
            });
        });
    }
);