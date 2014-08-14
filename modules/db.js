var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
//var format = require('util').format;
var config = require('config');
var users = require('users');
var log = require('modules/log')(module);
var EventEmmiter = require('events').EventEmitter;

var db = new EventEmmiter();
db.db = undefined;
db.users = undefined;

mongoClient.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.db, function(err, _db) {
    if (err) throw err;

    db.db = _db;
    db.users = _db.collection('users');
    db.emit('ready');
    log.info('Database ready');
});

module.exports = db;
