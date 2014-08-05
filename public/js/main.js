define(
    function(require) {
        var request = require('modules/request');
        var game = require('games/game');
        var render = require('modules/render');
        var enterstate = require('games/first/enter');
        var position = require('interface/position');

        request.gameInit(function(data) {
            game.load(data, function() {
                render.create();
                position.update();
                game.changeState(enterstate);
                game.start(data);
            });
        });
    }
);