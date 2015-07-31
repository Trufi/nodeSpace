var _ = require('lodash');
var log = require('../modules/log')(module);
var config = require('../config');

module.exports = function (clients) {
    clients.enableSocketAuth = function(client) {
        client.socket
            .once('quickStart', function() {
                clients.quickStart(client);
            });
    };

    clients.disableSocketAuth = function(client) {
        client.socket
            .removeAllListeners('quickStart');
    };

    clients.initNewPlayer = function(client, options) {
        options = options || {};

        var game = client.game,
            gameData = game.getDateForNewPlayer();

        if (options.name !== undefined) {
            gameData.name = options.name;
        }
        if (options._id !== undefined) {
            gameData._id = options._id;
        }

        client.applyData(gameData);
        game.removeSpectator(client);
        game.addPlayer(client);

        client.send(6, client.getFirstState());

    };

    clients.quickStart = function(client) {
        clients.initNewPlayer(client);
        log.silly('User quickstart, id: %s, name: %s', client.id, client.name);
        clients.disableSocketAuth(client);
    };
};