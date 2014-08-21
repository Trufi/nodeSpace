var _ = require('lodash');
var log = require('modules/log')(module);
var sessionStore = require('mongo/sessionStore');
var common = require('./common');
var mongo = require('mongo');
var crypto = require('crypto');
var config = require('config');

module.exports = function (clients) {
    clients.enableSocketAuth = function(client) {
        client.socket
            .once('quickStart', function() {
                clients.quickStart(client);
            })
            .on('signup', function(data) {
                clients.signup(client, data);
            })
            .on('login', function(data) {
                clients.login(client, data);
            });
    };

    clients.disableSocketAuth = function(client) {
        client.socket
            .removeAllListeners('quickStart')
            .removeAllListeners('signup')
            .removeAllListeners('login');
    };

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

        if (options.name !== undefined) {
            gameDate.name = options.name;
        }
        if (options._id !== undefined) {
            gameDate._id = options._id;
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
        clients.disableSocketAuth(client);
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
                client.socket.on('enterName', function(data) {
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
                            mongo.users.insert({email: email, salt: salt, password: password, name: name}, function(err, arrDoc) {
                                if (err) {
                                    client.send('signupAnswer', {error: 500, message: 'server error'});
                                    return log.error(err.message);
                                }

                                client.send('enterNameAnswer', {error: null});
                                client.socket.removeAllListeners('enterName');
                                clients.initNewPlayer(client, {name: name, _id: arrDoc[0]._id});
                                log.silly('User signup, id: %s, name: %s', client.id, client.name);
                                clients.disableSocketAuth(client);
                            });
                        }
                    });
                });
                client.send('signupAnswer', {error: null});
                log.silly('User send signupAnswer, email: %s, id: %s', email, client.id);
            }
        });
    };

    clients.login = function(client, data) {
        var email = data.email,
            pass = data.pass;

        if (client.session.name !== undefined) {
            return log.warn('client already login as %s, id: %s', client.session.name, client.id);
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
            var password, game, searchResult, tempSocket;

            if (err) {
                client.send('loginAnswer', {error: 500, message: 'server error'});
                return log.error(err.message);
            }

            if (doc && doc.salt && doc.password) {
                password = crypto.createHmac('sha1', doc.salt).update(pass).digest('hex');

                if (password !== doc.password) {
                    client.send('loginAnswer', {error: 1, message: 'email or pass not find'});
                    return log.silly('passwords not match, email: %s, id: %s', email, client.id);
                }

                // если есть уже такой пользователь с таким sid
                searchResult = _.find(clients.list, function(el) {
                    return el.gameEnable && (el.name === doc.name);
                });

                if (searchResult !== undefined) {
                    log.silly('Client already enable, name: ' + searchResult.name);
                    tempSocket = client.socket;
                    client = searchResult;
                    client.socket = tempSocket;
                    client.socketOn();
                } else {
                    game = client.game;
                    client.applyDate(doc);
                    game.removeSpectator(client);
                    game.addPlayer(client);
                }

                client.send('changeStatusToPlayer', client.getFirstState());
                client.session.name = client.name;
                sessionStore.set(client.sid, client.session, function (err) {
                    if (err) log.error(err.message);
                });

                log.silly('User login, name: %s, id: %s', client.name, client.id);
                clients.disableSocketAuth(client);
            } else {
                client.send('loginAnswer', {error: 1, message: 'email or pass not find'});
                log.silly('email not found in db, email: %s, id: %s', email, client.id);
            }
        });


    };
};