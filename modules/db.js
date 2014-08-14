var mongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
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

  /*  db.users.findOne({login: 'rr@rr.ru'}, function(err, arr) {
        console.log(arr);
        db.users.update({_id: new ObjectID(arr._id)}, {$set: {a: 1}}, function(err, crr) {
            console.log(err);
            console.log(crr);
        });
    });*/
});

module.exports = db;
