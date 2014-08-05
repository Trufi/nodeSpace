define(
    function(require) {
        var request = require('modules/request');
        var game = require('games/game');
        var render = require('modules/render');
        var mainstate = require('games/first/mainstate');

        request.gameInit(function(data) {
            game.load(data, function() {
                render.create();
                game.changeState(mainstate);
                game.start(data);
            });
        });
    }
);