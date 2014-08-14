var _ = require('lodash');
var game = require('game');
var body = require('game/body');
var action = require('game/actions');
var db = require('modules/db');
var ObjectID = require('modules/db').ObjectID;

var Player = function Player(options) {
    this.id = options.id;
    this.socket = options.socket;

    options.doc = options.doc || {};

    this.name = options.doc.name || options.name;
    this.game = game.getGameForPlayer(this);
    this.game.addUser(this);
    this.dbId = options.doc._id;

    this.actions = {};
    this.ship;
};

Player.prototype.sendFirstState = function() {
    var state = {};

    state.game = this.game.getGameFirstState();
    state.user = this.getFirstInfo();

    this.socket.emit('userFirstState', state);
};

Player.prototype.getInfo = function() {
    var info = {};
    info.id = this.id;
    return info;
};

Player.prototype.getFirstInfo = function() {
    var info = {};

    info.id = this.id;
    info.type = 1;
    info.name = this.name;

    if (this.ship !== undefined) {
        info.shipId = this.ship.id;
    }

    return info;
};

Player.prototype.send = function(name, data) {
    this.socket.emit(name, data);
};

Player.prototype.createShip = function() {
    var _this = this;

    this.ship = body.create({
        type: 10,
        position: [-100, -100],
        mass: 50
    });

    _(this.ship.actions).forEach(function(el, i) {
        _this.actions[i] = el;
    });
};

Player.prototype.action = function(name) {
    if (this.actions[name] !== undefined) {
        this.actions[name].use();
    }
};

Player.prototype.getDbInfo = function() {
    var info = {};
    info.name = this.name;
    return info;
};

Player.prototype.save = function() {
/*    if (this.dbId === undefined) {
        db.users.insert(this.getDbInfo(), function(err) {
            if (err) return log.error(err);
        });
    } else {
        db.users.update({_id: new ObjectID(this.dbId)}, {$set: this.getDbInfo()});
    }*/
};

module.exports = Player;