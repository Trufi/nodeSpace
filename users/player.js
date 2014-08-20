var _ = require('lodash');
var game = require('game');
var body = require('game/body');
var action = require('game/actions');
var db = require('modules/db');
var ObjectID = require('mongodb').ObjectID;

var Player = function Player(options) {
    this.id = options.id;
    //this.socket = options.socket;
    //this.socket.handshake.user = this;

    options.db = options.db || {};

    //this.name = options.db.name || options.name;
    this.game = game.getGameForPlayer(this);
    this.game.addUser(this);
    this.dbId = options.db._id;

    this.actions = {};

    this.ship;
    this.createShip(options);
};

/*Player.prototype.sendFirstState = function() {
    var state = {};

    state.game = this.game.getGameFirstState();
    state.user = this.getFirstInfo();

    this.socket.emit('userFirstState', state);
};*/

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

/*Player.prototype.send = function(name, data) {
    this.socket.emit(name, data);
};*/

Player.prototype.createShip = function(options) {
    var _this = this;

    this.ship = body.create({
        type: options.db.shipType || 10,
        position: options.db.position || [-100, -100],
        velocity: options.db.velocity || [0, 0],
        angularVelocity: options.db.angularVelocity || 0,
        angle: options.db.angle || 0,
        mass: 50
    });

    _(this.ship.actions).forEach(function(el, i) {
        _this.actions[i] = el;
    });

    this.game.addBody(this.ship);
};

Player.prototype.action = function(name) {
    if (this.actions[name] !== undefined) {
        this.actions[name].use();
    }
};

Player.prototype.getDbInfo = function() {
    var info = {};
    info.name = this.name;
    info.shipType = this.ship.type;
    info.position = [this.ship.body.position[0], this.ship.body.position[1]];
    info.velocity = [this.ship.body.velocity[0], this.ship.body.velocity[1]];
    info.angularVelocity = this.ship.body.angularVelocity;
    info.angle = this.ship.body.angle;
    return info;
};

Player.prototype.save = function() {
    if (this.dbId === undefined) {
        db.users.insert(this.getDbInfo(), function(err) {
            if (err) return log.error(err);
        });
    } else {
        db.users.update({_id: new ObjectID(this.dbId)}, {$set: this.getDbInfo()}, function(err) {
            if (err) return log.error(err);
        });
    }
};

module.exports = Player;