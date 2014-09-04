define(
    function(require) {
        var io = require('socketio'),
            config = require('json!config'),
            disconnectFrame = require('interface/frames/disconnect');

        var request = {};

        var socket = io.connect(location.origin, {
            reconnectionDelay: 1000,
            reconnectionDelayMax: 1000
        });

        var disconnectTime = 0,
            disconnectCallback = function() {},
            reconnectCallback = function() {};

        socket
            .on('disconnect', function() {
                disconnectTime = Date.now();
                disconnectFrame.show(config.socket.reconnectWait);
                disconnectCallback();
            })
            .on('reconnect_failed', function() {
                console.log('reconnect_failed');
            })
            .on('reconnect', function() {
                disconnectFrame.hide();
                reconnectCallback();
            });

        request.disconnect = function(callback) {
            disconnectCallback = callback;
        };

        request.reconnect = function(callback) {
            reconnectCallback = callback;
        };

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