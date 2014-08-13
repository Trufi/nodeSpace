var log = require('modules/log')(module);
var db = require('modules/db');
var crypto = require('crypto');
var users = require('users');

var login = {};

function userAuth(login, pass, callback) {
    if (db.users === undefined) {
        return callback(new Error('db not initialized'));
    }

    db.users.findOne({login: login}, function(err, doc) {
        var password;

        if (err) return callback(err);

        if (doc && doc.salt && doc.password) {
            password = crypto.createHmac('sha1', doc.salt).update(pass).digest('hex');
            if (password === doc.password) {
                callback(null, null);
            } else {
                callback(null, 1);
                log.silly('passwords not match, login: %s, password: %s', login, pass);
            }
        } else {
            callback(null, 1);
            log.silly('login not found in db, login: %s', login);
        }
    });
}

login.post = function(req, res, next) {
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
            res.send({error: 1, message: 'unknown login or password'});
        } else {
            req.session.login = login;
            res.send({error: null});

            // находим Nobody юзера и переделываем его в Player
            user = users.findNobodyWithSid(req.session.id);
            users.changeToPlayer(user);
            console.log(user);
            user.updateSocketSession();
        }
    });
};

module.exports = login;