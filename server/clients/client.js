var _ = require('lodash');
var game = require('../game');
var body = require('../game/body');
var action = require('../game/actions');
var log = require('../modules/log')(module);
var config = require('../config');

var usersCount = 0;

// В клиенте содержится сокет, игрок клиента, сессия и информация о ней
var Client = function(options) {
    this.id = options.id;

    this.session;
    this.sid;
    this.name;

    this.socket = options.socket;

    this.gameEnable = false;
    this.gameType;
    this.ship;
    this.actions = {};

    // здесь хранятся действия до следующего шага игры
    this.actionsDone = {};
};

Client.prototype.applyData = function(data) {
    this.gameType = data.gameType || 0;
    this.name = data.name || (config.users.anonName + ++usersCount);
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

    _.forEach(this.ship.actions, function(el, i) {
        _this.actions[i] = el;
    });

    this.ship.client = this;
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
    this.socket.emit(2, this.getFirstState());
};

Client.prototype.socketOn = function() {
    var _this = this;
    log.silly('Client socketOn, id: %s', this.id);
    this.socket
        .removeAllListeners(5)
        .removeAllListeners(7)
        .on(5, function(data) {
            _.forEach(data, function (el, i) {
                _this.actionsDone[i] = el;
            });
        })
        .on(7, function() {
            _this.socket.emit(8, Date.now());
        });
};

Client.prototype.updateActions = function(now) {
    var _this = this;

    _.forEach(this.actionsDone, function(el, i) {
        _this.action(now, i, el);
    });

    this.actionsDone = {};
};

Client.prototype.action = function(now, name, options) {
    if (this.actions[name] !== undefined) {
        this.actions[name].use(now, options);
    }
};

Client.prototype.getFirstState = function() {
    var state = {};

    state.game = this.game.getGameFirstState();
    state.user = this.getFirstInfo();

    return state;
};

Client.prototype.getInfo = function() {
    var info = [];
    info[0] = this.id;
    return info;
};

Client.prototype.getFirstInfo = function() {
    var info = [];
    info[0] = this.id;

    if (this.name !== undefined) {
        info[1] = 1; // type
        info[2] = this.name;
        info[3] = this.ship.id;
    } else {
        info[1] = 0; // type
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
