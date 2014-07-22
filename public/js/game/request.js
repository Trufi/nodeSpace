define(
    'game/request',
    ['json!config', 'socketio'],
    function(config, io) {
        var request = {};

        var socket = io.connect(config.socketHost);

        request.gameInit = function(callback) {
            socket.once('firstGameState', function (data) {
                callback(data);
            });
        };

        return request;
    }
);