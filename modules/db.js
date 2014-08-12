var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var format = require('util').format;
var config = require('config');

var db;
var users;

mongoClient.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.db, function(err, _db) {
    if (err) throw err;

    exports.db = _db;

    /*var sessions = db.collection('sessions');
    sessions.find().toArray(function(err, res) {
        console.log(res);
    });*/

/*    var collection = db.collection('test_insert');
    collection.insert({a:2}, function(err, docs) {

        collection.count(function(err, count) {
            console.log(format("count = %s", count));
        });

        // Locate all the entries using find
        collection.find().toArray(function(err, results) {
            console.dir(results);
            // Let's close the db
            db.close();
        });
    });*/

    exports.users = _db.collection('users');
});

/*
exports.db = db;
exports.users = users;*/
