define(
    function(require) {
        var request = require('modules/request');
        var game = require('games/first');
        var render = require('modules/render');


        request.gameInit(function(data) {
            game.load(data, function() {
                render.create();
                game.start(data);
            });
        });
    }
);