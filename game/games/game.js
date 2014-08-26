var p2 = require('p2');
var _ = require('lodash');

var body = require('game/body');
var config = require('config');

var Game = function Game() {
    this.id = ++Game._idCounter;

    this.timeStep = 1 / 60;

    this.sendStateInterval = config.sendStateInterval;
    this.sendStateLastTime = 0;

    this.gravity = [0, 0];
    this.applyDamping = false;
    this.interval = undefined;
    this.users = {};
    this.spectators = {};
    this.bodies = {};

    this.assets = {
        texture: {
            background: 'bg2.png',
            backroundTest: 'bg.jpeg',
            asteroid: 'asteroid.png',
            rectangle: 'rect.png',
            ship: 'ship2.png',
            bullet: 'bullet.gif'
        }
    };

    this.newBodies = [];
    this.removeBodies = [];
    this.newUsers = [];

    this.world = new p2.World({
        gravity: this.gravity,
        applyDamping: this.applyDamping
    });

    this.world.on('impact', this.impactEvent);
};

Game._idCounter = 0;

Game.prototype.start = function() {
    var _this = this;

    this.lastTimeStep = Date.now();

    this.interval = setInterval(function() {
        var now = Date.now();

        _(_this.users).forEach(function(el) {
            el.updateActions(now);
        });

        _(_this.bodies).forEach(function(el) {
            el.update(now);
        });

        _this.world.step((now - _this.lastTimeStep) / 1000);

        _this.sendState(now);

        _this.lastTimeStep = now;
    }, 1000 * this.timeStep);
};

Game.prototype.stop = function() {
    clearInterval(this.interval);
};

Game.prototype.sendState = function(now) {
    var _this = this,
        hasNew, hasRemove;

    function send(user) {
        var gameState = {};
        gameState[0] = _this.getGameState(user);
        gameState.time = now;

        if (hasNew) {
            gameState.newData = _this.getGameNewState(user);
        }

        if (hasRemove) {
            gameState.removeData = {
                bodies: _this.removeBodies
            };
        }

        //setTimeout(function() {
            user.send(3, gameState);
        //}, Math.floor(Math.random() * 500));
    }

    if (now - this.sendStateLastTime > this.sendStateInterval) {
        this.sendStateLastTime = now;

        hasNew = this.newBodies.length > 0 || this.newUsers.length > 0;
        hasRemove = this.removeBodies.length > 0;

        _(this.users).forEach(send);
        _(this.spectators).forEach(send);

        if (hasNew) {
            this.newBodies = [];
            this.newUsers = [];
        }

        if (hasRemove) {
            this.removeBodies = [];
        }

        _this.resetBodyUsedActions();
    }
};

// данные, которые отправляются через каждый шаг
Game.prototype.getGameState = function(user) {
    var state = [];

    state[0] = [];
    _(this.bodies).forEach(function(el) {
        var info = el.getInfo();
        if (info !== undefined) {
            state[0].push(info);
        }
    });

    state[1] = [];
    _(this.users).forEach(function(el) {
        var info = el.getInfo();
        if (info !== undefined) {
            state[1].push(info);
        }
    });

    return state;
};

Game.prototype.resetBodyUsedActions = function() {
    _(this.bodies).forEach(function(el) {
        el.resetActionsUsed();
    });
};

// данные отправляемые при подключении пользователя
Game.prototype.getGameFirstState = function(user) {
    var state = {};

    state.assets = this.assets;
    state.time = Date.now();
    state.world = {};
    state.world.worldSize = this.worldSize;
    state.world.timeStep = this.timeStep;
    state.world.id = this.id;
    state.world.gravity = this.gravity;
    state.world.applyDamping = this.applyDamping;

    state.sendStateInterval = this.sendStateInterval;

    state.bodies = [];
    _(this.bodies).forEach(function(el) {
        var info = el.getFirstInfo();
        if (info !== undefined) {
            state.bodies.push(info);
        }
    });

    state.users = _.map(this.users, function(el) {
        return el.getFirstInfo();
    });

    return state;
};

// данные о новых телах и пользователях
Game.prototype.getGameNewState = function(user) {
    var state = {};

    state.bodies = [];
    _(this.newBodies).forEach(function(el) {
        var info = el.getFirstInfo();
        if (info !== undefined) {
            state.bodies.push(info);
        }
    });


    state.users = _.map(this.newUsers, function(el) {
        return el.getFirstInfo();
    });

    return state;
};

Game.prototype.addPlayer = function(user) {
    this.users[user.id] = user;
    this.addBody(user.ship);

    this.newUsers.push(user);
};

Game.prototype.removePlayer = function(user) {
    if (this.users[user.id] !== undefined) {
        delete this.users[user.id];
    }
};

Game.prototype.addSpectator = function(user) {
    this.spectators[user.id] = user;
};

Game.prototype.removeSpectator = function(user) {
    if (this.spectators[user.id] !== undefined) {
        delete this.spectators[user.id];
    }
};

Game.prototype.addBody = function(body) {
    this.bodies[body.id] = body;
    body.game = this;
    this.world.addBody(body.body);

    this.newBodies.push(body);
};

Game.prototype.removeBody = function(body) {
    delete this.bodies[body.id];
    this.world.removeBody(body.body);
    body.game = undefined;
    this.removeBodies.push(body.id);
};

Game.prototype.getDateForNewPlayer = function() {
    var date = {};

    date.gameType = 0;
    date.shipType = 10;
    date.velocity = [0, 0];
    date.position = [-100, -100];
    date.angularVelocity = 0;
    date.angle = 0;

    return date;
};

Game.prototype.close = function() {
    clearInterval(this.interval);

    _(this.users).forEach(function(el) {
        el.send('gameClose');
        el.save();
    });

    // TODO: доделать
};

Game.prototype.impactEvent = function(ev) {
    body.collide(ev.bodyA._gameBody, ev.bodyB._gameBody);
};

module.exports = Game;