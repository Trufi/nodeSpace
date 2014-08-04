var p2 = require('p2');
var _ = require('lodash');

var Game = function Game() {
    this.id = ++Game._idCounter;
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
            rectangle: 'rect.png',
            ship: 'ship2.png'
        }
    };

    this.newBodies = [];
    this.newUsers = [];

    this.world = new p2.World({
        gravity: this.gravity,
        applyDamping: this.applyDamping
    });
};

Game._idCounter = 0;

Game.prototype.start = function() {
    var _this = this;

    this.lastTimeStep = Date.now();

    this.interval = setInterval(function() {
        var currentTimeStep = Date.now();

        _this.world.step((currentTimeStep - _this.lastTimeStep) / 1000);
        _this.sendStateToUsers();

        _this.lastTimeStep = currentTimeStep;
    }, 1000 * this.timeStep);
};

Game.prototype.stop = function() {
    clearInterval(this.interval);
};

Game.prototype.sendStateToUsers = function() {
    var _this = this,
        hasNew = false;

    if (this.newBodies.length > 0 || this.newUsers.length > 0) {
        hasNew = true;
    }

    _(this.users).forEach(function(el) {
        var gameState = _this.getGameState(el);

        if (hasNew) {
            gameState.newData = _this.getGameNewState(el);
        }

        el.send('updateGameState', gameState);
    });

    if (hasNew) {
        _this.newBodies = [];
        _this.newUsers = [];
    }
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

    state.player = user.getFirstInfo();

    return state;
};

// данные о новых телах и пользователях
Game.prototype.getGameNewState = function(user) {
    var state = {};

    state.bodies = _.map(this.newBodies, function(el) {
        return el.getFirstInfo();
    });

    state.users = _.map(this.newUsers, function(el) {
        return el.getFirstInfo();
    });

    return state;
};

Game.prototype.addUser = function(user) {
    this.users[user.id] = user;

    this.newUsers.push(user);
};

Game.prototype.removeUser = function(user) {
    if (this.users[user.id] !== undefined) {
        delete this.users[user.id];
    }
};

Game.prototype.addBody = function(body) {
    this.bodies[body.id] = body;
    body.addToWorld(this.world);

    this.newBodies.push(body);
};

module.exports = Game;