var Client = require('./client');
var log = require('../modules/log')(module);
var async = require('async');
var config = require('../config');

var clients = {};

clients._idCounter = 0;
clients.list = {};

require('./authorization')(clients);

clients.initialize = function(socket) {
    var client;

    async.parallel([
        function(callback) {
            client = new Client({id: ++clients._idCounter, socket: socket});
            clients.list[client.id] = client;
            log.silly('Create new client with id: %s', client.id);
            callback(null, null);
        },
        function(callback) {
            var timeout = setTimeout(function() {
                callback(new Error('User load timeout'));
            }, config.waitingUsersLoad);

            socket.once(1, function() {
                clearTimeout(timeout);
                log.silly('Client onload');
                callback(null, null);
            });
        }
    ], function(err) {
        if (err) {
            log.error(err.message);

            if (client !== undefined) {
                client.destroy();
            }

            return;
        }

        client.activateGame();

        clients.enableSocketAuth(client);
    });
};

module.exports = clients;
