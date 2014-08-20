var log = require('modules/log')(module);
var sessionStore = require('mongo/sessionStore');
var common = require('./common');

module.exports = function (clients) {
    clients.loginFromCookie = function(client, callback) {
        common.loadUserFromDb(client.session.name, function (err, doc) {
            if (err) return callback(err);
            client.applyDate(doc);
            callback(null, null);
        });
    };

    clients.quickStart = function(client) {
        var game = client.game;
        client.applyDate(game.getDateForNewPlayer());
        client.save();
        game.removeSpectator(client);
        game.addPlayer(client);

        client.send('changeStatusToPlayer', client.getFirstState());
        log.silly('User quickstart, id: %s, name: %s', client.id, client.name);

        client.session.name = client.name;
        sessionStore.set(client.sid, client.session, function(err) {
            if (err) log.error(err.message);
        });
    };

    clients.login = function(req, res, next) {

    };

    clients.signup = function(req, res, next) {

    };
};