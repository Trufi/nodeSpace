var log = require('modules/log')(module);
var db = require('modules/db');
var crypto = require('crypto');

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
        } else {
            salt = Math.random() + '';
            password = crypto.createHmac('sha1', salt).update(pass).digest('hex');
            db.users.insert({login: login, salt: salt, password: password}, function(err, arrDoc) {
                if (err) return callback(err);
                log.info('Create new user in database, login: %s', arrDoc[0].login);
                callback(null, null);
            });
        }
    });
}

signup.post = function(req, res, next) {
    var login = req.body.login,
        pass = req.body.pass;

    if (!/.+@.+\..+/i.test(login)) {
        log.warn('login not valid, login: %s, pass: %s', login, pass);
        return next(new Error('login not valid'));
    }

    if (pass.length <= 3) {
        log.warn('password length <= 3, login: %s, pass: %s', login, pass);
        return next(new Error('password length <= 3'));
    }

    if (login === undefined || pass === undefined) {
        log.warn('login or password are undefined, login: %s, pass: %s', login, pass);
        return next(new Error('login or password are undefined'));
    }

    userAuth(login, pass, function(err, user) {
        if (err) return next(err);

        if (user === 1) {
            res.send({error: 1, message: 'this login already busy'});
        } else {
            req.session.login = login;
            res.send({error: null});
        }
    });
};

module.exports = signup;