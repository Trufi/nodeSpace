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
            socket.once('userFirstState', function (data) {
                callback(data);
            });
            socket.emit('clientOnLoad');
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

        return request;
    }
);