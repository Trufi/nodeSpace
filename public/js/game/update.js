define(
    'game/update',
    ['game/game', 'game/body'],
    function(game, Body) {
        return function() {
            _(game.bodies).forEach(function(el) {
                el.updateSprite();
            });
        };
    }
);