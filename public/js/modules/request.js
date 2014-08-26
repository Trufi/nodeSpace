define(
    function(require) {
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
            socket.once(2, function (data) {
                callback(data);
            });
            socket.emit(1);
        };

        request.changeStatusToPlayer = function(callback) {
            socket.once(6, function(data) {
                callback(data);
            });
        };

        request.onUpdateGameState = function(callback) {
            socket.on(3, function(data) {
                callback(data);
            });
        };

        request.sendToServer = function(data) {
            socket.emit(5, data);
        };

        request.signUp = function(email, pass, callback) {
            socket.once('signupAnswer', function(data) {
                callback(data);
            });
            socket.emit('signup', {email: email, pass: pass});
        };

        request.enterName = function(name, callback) {
            socket.once('enterNameAnswer', function(data) {
                callback(data);
            });
            socket.emit('enterName', {name: name});
        };

        request.login = function(email, pass, callback) {
            socket.once('loginAnswer', function(data) {
                callback(data);
            });
            socket.emit('login', {email: email, pass: pass});
        };

        request.quickStart = function() {
            socket.emit('quickStart');
        };

        request.onGameClose = function(callback) {
            socket.on('gameClose', function() {
                callback();
            });
        };

        request.ping = function(callback) {
            socket.once(8, callback);
            socket.emit(7);
        };

        return request;
    }
);