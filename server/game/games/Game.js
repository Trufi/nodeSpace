import _ from 'lodash';
import p2 from 'p2';

import config from '../../config';
import * as body from '../body';

let idCounter = 0;

export default function Game() {
    this.id = ++idCounter;

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

    this.impactEvents();
}

Game.prototype.start = function() {
    var _this = this;

    this.lastTimeStep = Date.now();

    this.interval = setInterval(function() {
        var now = Date.now();

        _.forEach(_this.users, function(el) {
            el.updateActions(now);
        });

        _.forEach(_this.bodies, function(el) {
            el.update(now);
        });

        _this.world.step((now + 1 - _this.lastTimeStep) / 1000);

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
        var gameState = [];
        gameState[0] = now;
        gameState[1] = _this.getGameState(user);

        // новые данные
        if (hasNew) {
            gameState[2] = _this.getGameNewState(user);
        } else {
            gameState[2] = 0;
        }

        // данные которые нужно удалить
        if (hasRemove) {
            gameState[3] = [
                _this.removeBodies
            ];
        } else {
            gameState[3] = 0;
        }

        user.send(3, gameState);
    }

    if (now - this.sendStateLastTime > this.sendStateInterval) {
        this.sendStateLastTime = now;

        hasNew = this.newBodies.length > 0 || this.newUsers.length > 0;
        hasRemove = this.removeBodies.length > 0;

        _.forEach(this.users, send);
        _.forEach(this.spectators, send);

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
    _.forEach(this.bodies, function(el) {
        var info = el.getInfo();
        if (info !== undefined) {
            state[0].push(info);
        }
    });

    state[1] = [];
    _.forEach(this.users, function(el) {
        var info = el.getInfo();
        if (info !== undefined) {
            state[1].push(info);
        }
    });

    return state;
};

Game.prototype.resetBodyUsedActions = function() {
    _.forEach(this.bodies, function(el) {
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
    _.forEach(this.bodies, function(el) {
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
    var state = [];

    state[0] = [];
    _.forEach(this.newBodies, function(el) {
        var info = el.getFirstInfo();
        if (info !== undefined) {
            state[0].push(info);
        }
    });

    state[1] = _.map(this.newUsers, function(el) {
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

    _.forEach(this.users, function(el) {
        el.send('gameClose');
        el.save();
    });

    // TODO: доделать
};

Game.prototype.impactEvents = function() {
    this.world.on('impact', function(ev) {
        body.collide(ev.bodyA._gameBody, ev.bodyB._gameBody);
    });

    this.world.on('beginContact', function(ev) {
        body.beginContact(ev.bodyA._gameBody, ev.bodyB._gameBody);
    });
};
