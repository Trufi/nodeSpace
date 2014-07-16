// window.DEBUG = {};

require.config({
    baseUrl: 'js/lib',
    paths: {
        socketio: '/socket.io/socket.io.js',
        game: '../game',
        config: '../config.json'
    }
});

require(['game/main'], function() {

});
