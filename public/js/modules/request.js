define(
    function(require) {
        var $ = require('jquery');
        var config = require('json!config');
        var io = require('socketio');

        var request = {};

        var socket = io.connect(config.socketHost, {
            reconnectionDelay: 1000,
            reconnectionDelayMax: 1000
        });

        socket
            .on('disconnect', function() {
                console.log('disconnect');
            })
            .on('reconnect_failed', function() {
                console.log('reconnect_failed');
            })
            .on('reconnect', function() {
                console.log('reconnect');
            });

        request.gameInit = function(callback) {
            socket.emit('clientOnLoad');
            socket.once('userFirstState', function (data) {
                callback(data);
            });
        };

        request.changeStatusToPlayer = function(callback) {
            socket.once('changeStatusToPlayer', function(data) {
                callback(data);
            });
        };

        request.onUpdateGameState = function(callback) {
            socket.on('updateGameState', function(data) {
                callback(data);
            });
        };

        request.sendToServer = function(data) {
            socket.emit('playerActions', data);
        };

        request.signUp = function(email, pass, callback) {
            $.ajax({
                url: '/signup',
                method: 'POST',
                data: 'login=' + email + '&pass=' + pass,
                success: function(data) {
                    callback(data);
                }
            });
        };

        request.login = function(email, pass, callback) {
            $.ajax({
                url: '/login',
                method: 'POST',
                data: 'login=' + email + '&pass=' + pass,
                success: function(data) {
                    callback(data);
                }
            });
        };

        return request;
    }
);