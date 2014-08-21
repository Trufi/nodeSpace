var _ = require('lodash');
var Client = require('./client');
var log = require('modules/log')(module);
var common = require('./common');
var async = require('async');
var config = require('config');

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

            // найдем сессию и создадим клиента с данным сокетом и сессией
            var sid = common.getSid(socket);
            if (!sid) return callback(new Error('Sid is empty, id: ' + client.id));

            client.sid = sid;
            log.silly('Set client sid to %s, id: %s', client.sid, client.id);

            // если есть уже такой пользователь с таким sid
            var searchResult = _.find(clients.list, function(el) {
                return el.gameEnable && (el.sid === sid);
            });

            if (searchResult !== undefined) {
                log.silly('Client already enable, sid: ' + sid);
                client = searchResult;
                client.socket = socket;
                callback(null, null);
            } else {
                common.loadSession(sid, function(err, session) {
                    if (err) return callback(err);
                    if (!session) return callback(new Error('Session is empty, sid: ' + sid));
                    client.session = session;
                    log.silly('Set client session, sid: %s', client.sid);

                    if (session.name !== undefined) {
                        clients.loginFromCookie(client, callback);
                    } else {
                        callback(null, null);
                    }
                });
            }
        },
        function(callback) {
            var timeout = setTimeout(function() {
                callback(new Error('User load timeout'));
            }, config.waitingUsersLoad);
            socket.once('clientOnLoad', function() {
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
        }

        client.activateGame();

        clients.enableSocketAuth(client);
    });
};

module.exports = clients;