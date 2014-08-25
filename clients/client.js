var _ = require('lodash');
var game = require('game');
var body = require('game/body');
var action = require('game/actions');
var mongo = require('mongo');
var ObjectID = require('mongodb').ObjectID;
var log = require('modules/log')(module);
var debug = require('modules/debug');
var config = require('config');

// В клиенте содержится сокет, игрок клиента, сессия и информация о ней
var Client = function(options) {
    this.id = options.id;

    this.session;
    this.sid;
    this.name;

    this.socket = options.socket;

    debug.pingOn(this);

    this.gameEnable = false;
    this.gameType;
    this.ship;
    this.actions = {};
};

Client.prototype.applyDate = function(data) {
    this.gameType = data.gameType || 0;
    this.name = data.name || (config.users.anonName + ++mongo.usersCount);
    this.dbId = data._id;

    this.createShip(data);
};

Client.prototype.createShip = function(data) {
    var _this = this;

    this.ship = body.create({
        type: data.shipType || 10,
        position: data.position || [-100, -100],
        velocity: data.velocity || [0, 0],
        angularVelocity: data.angularVelocity || 0,
        angle: data.angle || 0,
        mass: 50,
        name: this.name
    });

    _(this.ship.actions).forEach(function(el, i) {
        _this.actions[i] = el;
    });
};

Client.prototype.activateGame = function() {
    if (!this.gameEnable) {
        if (this.name !== undefined) {
            this.game = game.getGameForPlayer(this);
            this.game.addPlayer(this);
        } else {
            this.game = game.getGameForSpectator();
            this.game.addSpectator(this);
        }
        this.gameEnable = true;
    }

    this.socketOn();
    this.socket.emit('userFirstState', this.getFirstState());
};

Client.prototype.socketOn = function() {
    var _this = this;
    log.silly('Client socketOn, id: %s', this.id);
    this.socket
        .on('playerActions', function(data) {
            _(data).forEach(function (el) {
                _this.action(el);
            });
        });
};

Client.prototype.action = function(name) {
    if (this.actions[name] !== undefined) {
        this.actions[name].use();
    }
};

Client.prototype.getDateForDb = function() {
    var date = {};
    date.name = this.name;
    date.shipType = this.ship.type;
    date.position = [this.ship.body.position[0], this.ship.body.position[1]];
    date.velocity = [this.ship.body.velocity[0], this.ship.body.velocity[1]];
    date.angularVelocity = this.ship.body.angularVelocity;
    date.angle = this.ship.body.angle;
    return date;
};

Client.prototype.save = function() {
    var _this = this;

    if (this.dbId === undefined) {
        mongo.users.insert(this.getDateForDb(), function(err, doc) {
            if (err) return log.error(err);
            _this.dbId = doc._id;
        });
    } else {
        mongo.users.update({_id: new ObjectID(this.dbId)}, {$set: this.getDateForDb()}, function(err) {
            if (err) return log.error(err);
        });
    }
};

Client.prototype.getFirstState = function() {
    var state = {};

    state.game = this.game.getGameFirstState();
    state.user = this.getFirstInfo();

    return state;
};

Client.prototype.getInfo = function() {
    var info = {};
    info.id = this.id;
    return info;
};

Client.prototype.getFirstInfo = function() {
    var info = {};

    info.id = this.id;

    if (this.name !== undefined) {
        info.type = 1;
        info.name = this.name;
        info.shipId = this.ship.id;
    } else {
        info.type = 0;
    }

    return info;
};

Client.prototype.send = function(name, data) {
    this.socket.emit(name, data);
};

Client.prototype.destroy = function() {
    // TODO: destroy client
};

module.exports = Client;