define(
    'game/main',
    ['game/request', 'game/game', 'game/body'],
    function(request, game, Body) {
        var worldSize = [5000, 5000];
        var bodiesData = {};

        var create = function() {
            var i;

            for (i in bodiesData) {
                game.addBody(new Body(bodiesData[i]));
            }
        };

        var update = function() {

        };

        var render = function() {

        };

        request.gameInit(function(data) {
            bodiesData = data.bodies;
            game.start(data, create, update, render);
        });
    }
);