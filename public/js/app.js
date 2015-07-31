window.JS_ENV = window.JS_ENV || 'production';

console.log('Development mode enable');
require.config({
    baseUrl: 'js/lib',
    paths: {
        socketio: '/socket.io/socket.io.js',
        game: '../game',
        config: '../config.json',
        body: '../body',
        modules: '../modules',
        games: '../games',
        main: '../main',
        actions: '../actions',
        interface: '../interface'
    }
});

require(['main']);
