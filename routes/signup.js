var log = require('modules/log')(module);
var db = require('modules/db');
var crypto = require('crypto');
var users = require('users');
var config = require('config');

var signup = {};

function userAuth(login, pass, callback) {
    if (db.users === undefined) {
        return callback(new Error('db not initialized'));
    }

    db.users.findOne({login: login}, function(err, doc) {
        var password, salt;

        if (err) return callback(err);

        if (doc) {
            callback(null, 1);
            log.silly('login %s already busy', login);
        } else {
            salt = Math.random() + '';
            password = crypto.createHmac('sha1', salt).update(pass).digest('hex');
            callback(null, {login: login, salt: salt, password: password});
        }
    });
}

signup.post = function(req, res, next) {
    var login = req.body.login,
        pass = req.body.pass;

    if (req.session.login !== undefined) {
        log.warn('client already login as %s', req.session.login);
        return next(new Error('client already login'));
    }

    if (login === undefined || pass === undefined) {
        log.warn('login or password are undefined, login: %s, pass: %s', login, pass);
        return next(new Error('login or password are undefined'));
    }

    if (!/.+@.+\..+/i.test(login)) {
        log.warn('login not valid, login: %s, pass: %s', login, pass);
        return next(new Error('login not valid'));
    }

    if (pass.length <= 3) {
        log.warn('password length <= 3, login: %s, pass: %s', login, pass);
        return next(new Error('password length <= 3'));
    }

    userAuth(login, pass, function(err, arg2) {
        var user;

        if (err) return next(err);

        if (arg2 === 1) {
            res.send({error: 1, message: 'this login already busy'});
        } else {
            req.session.login = login;
            res.send({error: null});

            if (err) return next(err);

            // находим Nobody юзера и переделываем его в Player
            user = users.findNobodyWithSid(req.session.id);

            if (user === undefined) {
                log.error('users with sid %s not found', req.session.id);
                return next(new Error('users not found'));
            }

            user = users.changeToPlayer(user, {name: config.users.anonName + users.count()});

            if (user === undefined) {
                log.error('user not update to player, sid %s', req.session.id);
                return next(new Error('user not update to player'));
            }
            log.info('user login as %s, username: %s', login, user.name);
            user.save();
        }
    });
};

module.exports = signup;