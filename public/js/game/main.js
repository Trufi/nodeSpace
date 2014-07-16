define(
    'game/main',
    ['game/request', 'game/game'],
    function(request, game) {
        request.gameInit(function(data) {
            game.init(data);
        });
    }
);