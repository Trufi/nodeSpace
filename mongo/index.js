var mongoClient = require('mongodb').MongoClient;
var config = require('config');
var log = require('modules/log')(module);
var EventEmmiter = require('events').EventEmitter;

var db = new EventEmmiter();
db.db = undefined;
db.users = undefined;
db.usersCount = 0;

var mongoUrl = process.env.NODE_ENV === 'development' ? config.mongo.urlDev : config.mongo.url;

mongoClient.connect(mongoUrl, function(err, _db) {
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
