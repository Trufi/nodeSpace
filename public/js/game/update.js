define(
    'game/update',
    ['game/game', 'game/body'],
    function(game, Body) {
        return function() {
            var i;

            for (i in game.bodies) {
                game.bodies[i].updateSprite();
            }
        };
    }
);