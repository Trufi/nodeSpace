define(
    'game/create',
    ['lodash', 'game/game', 'game/body', 'game/assets', 'game/camera'],
    function(_, game, Body, assets, camera) {
        return function(data) {
            var first = false;

            game.setBackground(assets.texture.background);
            camera.set(camera.create(game.resolution[0], game.resolution[1], 20));

            _(data.bodies).forEach(function(el) {
                var body = new Body(el);
                game.addBody(body);

                if (!first) {
                    first = true;
                    camera.get().followToBody(body);
                }
            });
        };
    }
);