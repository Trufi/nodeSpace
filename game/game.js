var p2 = require('p2');
var utils = require('./utils');
var _ = require('lodash');

var Game = function Game() {
    this.id = utils.getId('game');
    this.worldSize = [5000, 5000];
    this.timeStep = 1 / 100;
    this.gravity = [0, 0];
    this.applyDamping = false;
    this.interval = undefined;
    this.users = {};
    this.bodies = {};

    this.assets = {
        texture: {
            background: 'bg2.png',
            backroundTest: 'bg.jpeg',
            asteroid: 'asteroid.png'
        }
    };

    this.world = new p2.World({
        gravity: this.gravity,
        applyDamping: this.applyDamping
    });
};

Game.prototype.start = function() {
    var _this = this;
    this.interval = setInterval(function() {
        _this.world.step(_this.timeStep);
        _this.sendStateToUsers();
    }, 1000 * this.timeStep);
};

Game.prototype.stop = function() {
    clearInterval(this.interval);
};

Game.prototype.sendStateToUsers = function() {
    var _this = this;

    _(this.users).forEach(function(el) {
        el.send('updateGameState', _this.getGameState());
    });
};

// данные, которые отправляются через каждый шаг
Game.prototype.getGameState = function(user) {
    var state = {};

    state.bodies = _.map(this.bodies, function(el) {
        return el.getInfo();
    });

    state.users = _.map(this.users, function(el) {
        return el.getInfo();
    });

    return state;
};

// данные отправляемые при подключении пользователя
Game.prototype.getGameFirstState = function(user) {
    var state = {};

    state.assets = this.assets;

    state.world = {};
    state.world.worldSize = this.worldSize;
    state.world.timeStep = this.timeStep;
    state.world.id = this.id;
    state.world.gravity = this.gravity;
    state.world.applyDamping = this.applyDamping;

    state.bodies = _.map(this.bodies, function(el) {
        return el.getFirstInfo();
    });

    state.users = _.map(this.users, function(el) {
        return el.getFirstInfo();
    });

    return state;
};

Game.prototype.addUser = function(user) {
    this.users[user.id] = user;

    user.send('firstGameState', this.getGameFirstState());
};

Game.prototype.removeUser = function(user) {
    if (typeof this.users !== 'undefined') {
        delete this.users[user.id];
    }
};

Game.prototype.addBody = function(body) {
    this.bodies[body.id] = body;
    body.addToWorld(this.world);
};

module.exports = Game;