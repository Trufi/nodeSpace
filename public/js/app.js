window.JS_ENV = window.JS_ENV || 'production';

if (window.JS_ENV === 'development') {
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
} else {
    require.config({
        baseUrl: 'js/lib',
        paths: {
            lodash: '//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min',
            socketio: 'https://cdn.socket.io/socket.io-1.0.6',
            pixi: '//cdnjs.cloudflare.com/ajax/libs/pixi.js/1.6.1/pixi',
            p2: '//cdnjs.cloudflare.com/ajax/libs/p2.js/0.6.0/p2.min',
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
}

require(['main']);
