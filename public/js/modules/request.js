define(
    function(require) {
        var config = require('json!config');
        var io = require('socketio');

        var request = {};

        var socket = io.connect(config.socketHost);

        request.gameInit = function(callback) {
            socket.emit('userConnect');
            socket.once('firstGameState', function (data) {
                callback(data);
            });
        };

        request.onUpdateGameState = function(callback) {
            socket.on('updateGameState', function(data) {
                callback(data);
            });
        };

        request.sendToServer = function(data) {
            console.log(data);
            socket.emit('playerActions', data);
        };

        return request;
    }
);