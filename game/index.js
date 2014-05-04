var socketio = require('socket.io')
var Player = require('./player');
var io;
var listPlayers = {};



function gameInit(server) {
    io = socketio.listen(server);

    io.sockets.on('connection', function (socket) {
        var player = new Player();

        listPlayers[player.id] = player;
        socket.emit('playerIsConnect', {id: player.id});

        socket.on('update', function (data) {
            player.setPosition(data.position);
        });

        setInterval(function () {
            var res = {},
                i;

            for (i in listPlayers) {
                //if (listPlayers[i].id !== player.id) {
                    res[i] = listPlayers[i];
                //}
            }

            socket.emit('updateClient', res);
        }, 1000);
    });
}

exports.init = gameInit;