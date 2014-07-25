var p2 = require('p2');
var _ = require('lodash');

var Game = function Game() {
    this.id = ++Game._idCounter;
    this.worldSize = [5000, 5000];
    this.timeStep = 1 / 60;
    this.gravity = [0, 0];
    this.applyDamping = false;
    this.interval = undefined;
    this.users = {};
    this.bodies = {};

    this.assets = {
        texture: {
            background: 'bg2.png',
            backroundTest: 'bg.jpeg',
            asteroid: 'asteroid.png',
            rectangle: 'rect.png'
        }
    };

    this.world = new p2.World({
        gravity: this.gravity,
        applyDamping: this.applyDamping
    });
};

Game._idCounter = 0;

Game.prototype.start = function() {
    var _this = this;

    this.lastTimeStep = (new Date()).getTime();

    this.interval = setInterval(function() {
        var currentTimeStep = (new Date()).getTime();

        _this.world.step((currentTimeStep - _this.lastTimeStep) / 1000);
        _this.sendStateToUsers();

        _this.lastTimeStep = currentTimeStep;
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
    if (this.users[user.id] !== undefined) {
        delete this.users[user.id];
    }
};

Game.prototype.addBody = function(body) {
    this.bodies[body.id] = body;
    body.addToWorld(this.world);
};

module.exports = Game;