var mongoClient = require('mongodb').MongoClient;
var config = require('config');
var log = require('modules/log')(module);
var EventEmmiter = require('events').EventEmitter;

var db = new EventEmmiter();
db.db = undefined;
db.users = undefined;
db.usersCount = 0;

mongoClient.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.db, function(err, _db) {
    if (err) throw err;

    db.db = _db;
    db.users = _db.collection('users');

    db.users.count(function(err, count) {
        if (err) return log.error(err.message);
        db.usersCount = count;

        db.emit('ready');
        log.info('MongoDB ready');
    });
});

module.exports = db;
