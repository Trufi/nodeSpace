define(
    function(require) {
        var request = require('modules/request');
        var game = require('games/game');
        var render = require('modules/render');
        var enterstate = require('games/first/enter');
        var mainstate = require('games/first/mainstate');
        var position = require('interface/position');
        //var player = require('modules/player');

        request.gameInit(function(data) {
            game.load(data, function() {
                render.create();
                position.update();

                if (data.user[1] === 0) {
                    game.changeState(enterstate);
                } else {
                    game.changeState(mainstate);
                }
                game.start(data);
            });
        });
    }
);