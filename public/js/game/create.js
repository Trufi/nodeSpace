define(
    'game/create',
    ['lodash', 'game/game', 'body/body', 'game/assets', 'game/camera'],
    function(_, game, body, assets, camera) {
        return function(data) {
            var first = false;

            game.setBackground(assets.texture.background);
            camera.set(camera.create(game.resolution[0], game.resolution[1]));

            _(data.bodies).forEach(function(el) {
                var ast = body.create(el);
                game.addBody(ast);

                if (!first) {
                    first = true;
                    camera.get().followToBody(ast);
                }
            });
        };
    }
);