define(
    'game/update',
    ['game/game', 'game/body', 'game/camera'],
    function(game, Body, camera) {
        return function() {
            _(game.bodies).forEach(function(el) {
                el.updateSprite();
            });

            camera.update();
        };
    }
);