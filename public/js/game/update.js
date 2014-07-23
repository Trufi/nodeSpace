define(
    'game/update',
    ['game/game', 'game/body', 'game/camera'],
    function(game, Body, camera) {
        return function() {
            var first = true;
            _(game.bodies).forEach(function(el) {
                if (first) {
                    first = false;
                }
                el.updateSprite();
            });

            game.background.tilePosition.x = camera.x(0);
            game.background.tilePosition.y = camera.y(0);
        };
    }
);