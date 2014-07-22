define(
    'game/create',
    ['lodash', 'game/game', 'game/body', 'game/assets'],
    function(_, game, Body, assets) {
        return function(data) {
            game.setBackground(assets.texture.background);

            _(data.bodies).forEach(function(el) {
                game.addBody(new Body(el));
            });
        };
    }
);