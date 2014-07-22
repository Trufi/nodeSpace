define(
    'game/main',
    ['game/request', 'game/game', 'game/create', 'game/update', 'game/render'],
    function(request, game, create, update, render) {
        request.gameInit(function(data) {
            game.start(data, create, update, render);
        });
    }
);