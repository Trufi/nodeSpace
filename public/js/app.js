// window.DEBUG = {};

require.config({
    baseUrl: 'js/lib',
    paths: {
        socketio: '/socket.io/socket.io.js',
        game: '../game',
        config: '../config.json'
    },
    shim: {
        /*phaser: {
            exports: 'Phaser'
        }*/
    }
});

require(['game/main'], function(io) {

});
