var log = require('modules/log')(module);
var sessionStore = require('mongo/sessionStore');
var common = require('./common');
var mongo = require('mongo');
var crypto = require('crypto');
var config = require('config');

module.exports = function (clients) {
    clients.loginFromCookie = function(client, callback) {
        common.loadUserFromDb(client.session.name, function (err, doc) {
            if (err) return callback(err);
            client.applyDate(doc);
            callback(null, null);
        });
    };

    clients.initNewPlayer = function(client, options) {
        options = options || {};

        var game = client.game,
            gameDate = game.getDateForNewPlayer();

        if (options.name !== 'undefined') {
            gameDate.name = options.name;
        }

        client.applyDate(gameDate);
        client.save();
        game.removeSpectator(client);
        game.addPlayer(client);

        client.send('changeStatusToPlayer', client.getFirstState());

        client.session.name = client.name;
        sessionStore.set(client.sid, client.session, function(err) {
            if (err) log.error(err.message);
        });

    };

    clients.quickStart = function(client) {
        clients.initNewPlayer(client);
        log.silly('User quickstart, id: %s, name: %s', client.id, client.name);
    };

    clients.login = function(req, res, next) {

    };

    clients.signup = function(client, data) {
        var email = data.email,
            pass = data.pass;

        if (client.session.name !== undefined) {
            return log.warn('client already name as %s', client.session.name);
        }
        if (email === undefined || pass === undefined) {
            return log.warn('email or password are undefined, email: %s, pass: %s', email, pass);
        }
        if (!/.+@.+\..+/i.test(email)) {
            return log.warn('email not valid, email: %s, pass: %s', email, pass);
        }

        if (pass.length <= 3) {
            return log.warn('password length <= 3, email: %s, pass: %s', email, pass);
        }

        mongo.users.findOne({email: email}, function(err, doc) {
            if (err) {
                client.send('signupAnswer', {error: 500, message: 'server error'});
                return log.error(err.message);
            }

            if (doc) {
                client.send('signupAnswer', {error: 1, message: 'email already busy'});
                log.silly('email %s already busy, client id: %s', email, client.id);
            } else {
                client.socket.once('enterName', function(data) {
                    var name = data.name;

                    if (name === undefined) {
                        return log.error('EnterName name is undefined, client id: %s', client.id);
                    }

                    if (typeof name !== 'string' && typeof name !== 'number') {
                        return log.error('EnterName name not string, client id: %s', client.id);
                    }

                    name = String(name);
                    if (name.length <= 3) {
                        return log.error('EnterName name length <= 3, client id: %s', client.id);
                    }

                    if (/[^a-z0-9\s]/i.test(name)) {
                        return log.error('EnterName name not valid, client id: %s', client.id);
                    }

                    mongo.users.findOne({name: name}, function(err, doc) {
                        var password, salt;

                        if (err) {
                            client.send('signupAnswer', {error: 500, message: 'server error'});
                            return log.error(err.message);
                        }

                        if (doc) {
                            client.send('enterNameAnswer', {error: 1, message: 'name already busy'});
                            log.silly('name %s already busy, client id: %s', name, client.id);
                        } else {
                            salt = Math.random() + '';
                            password = crypto.createHmac('sha1', salt).update(pass).digest('hex');
                            mongo.users.insert({email: email, salt: salt, password: password, name: name}, function(err) {
                                if (err) {
                                    client.send('signupAnswer', {error: 500, message: 'server error'});
                                    return log.error(err.message);
                                }

                                client.send('enterNameAnswer', {error: null});
                                clients.initNewPlayer(client, {name: name});
                                log.silly('User signup, id: %s, name: %s', client.id, client.name);
                            });
                        }
                    });
                });
                client.send('signupAnswer', {error: null});
                log.silly('User send signupAnswer, email: %s, id: %s', email, client.id);
            }
        });
    };
};