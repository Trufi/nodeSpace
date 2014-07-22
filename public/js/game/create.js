define(
    'game/create',
    ['game/game', 'game/body', 'game/assets'],
    function(game, Body, assets) {
        return function(data) {
            var i;

            game.setBackground(assets.texture.background);

            for (i in data.bodies) {
                game.addBody(new Body(data.bodies[i]));
            }
        };
    }
);