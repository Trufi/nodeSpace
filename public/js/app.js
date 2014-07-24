// window.DEBUG = {};

require.config({
    baseUrl: 'js/lib',
    paths: {
        socketio: '/socket.io/socket.io.js',
        game: '../game',
        config: '../config.json',
        body: '../game/body'
    }
});

require(['game/main'], function() {

});
