import _ from 'lodash';
import p2 from 'p2';

import config from '../../config';
import * as body from '../body/index';

let idCounter = 0;

export default class Game {
    constructor() {
        this.id = ++idCounter;

        this.timeStep = 1 / 60;

        this.sendStateInterval = config.sendStateInterval;
        this.sendStateLastTime = 0;

        this.gravity = [0, 0];
        this.applyDamping = false;
        this.users = {};
        this.spectators = {};
        this.bodies = {};

        this.started = false;

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

        this.loop = this.loop.bind(this);

        this.impactEvents();
    }

    start() {
        this.lastTimeStep = Date.now();
        this.started = true;

        setImmediate(this.loop);
    }

    loop() {
        if (!this.started) { return; }

        setImmediate(this.loop);

        const now = Date.now();

        if (now - this.lastTimeStep < config.minimalTimeBetweenGameLoop) { return; }

        _.forEach(this.users, el => el.updateActions(now));

        _.forEach(this.bodies, el => el.update(now));

        this.world.step((now - this.lastTimeStep) / 1000);

        this.sendState(now);

        this.lastTimeStep = now;
    }

    stop() {
        this.started = false;
    }

    sendState(now) {
        if (now - this.sendStateLastTime < this.sendStateInterval) { return; }

        this.sendStateLastTime = now;

        _.forEach(this.users, user => this._sendStateData(now, user));
        _.forEach(this.spectators, user => this._sendStateData(now, user));

        this.newBodies = [];
        this.newUsers = [];
        this.removeBodies = [];

        this.resetBodyUsedActions();
    }

    _sendStateData(now, user) {
        const gameState = [];
        gameState[0] = now;
        gameState[1] = this.getGameState(user);

        // новые данные
        if (this.newBodies.length || this.newUsers.length) {
            gameState[2] = this.getGameNewState(user);
        } else {
            gameState[2] = 0;
        }

        // данные которые нужно удалить
        if (this.removeBodies.length) {
            gameState[3] = [
                this.removeBodies
            ];
        } else {
            gameState[3] = 0;
        }

        user.send(3, gameState);
    }

    // данные, которые отправляются через каждый шаг
    getGameState(user) {
        let state = [];

        state[0] = [];
        _.forEach(this.bodies, function(el) {
            let info = el.getInfo();
            if (info !== undefined) {
                state[0].push(info);
            }
        });

        state[1] = [];
        _.forEach(this.users, function(el) {
            let info = el.getInfo();
            if (info !== undefined) {
                state[1].push(info);
            }
        });

        return state;
    }

    resetBodyUsedActions() {
        _.forEach(this.bodies, function(el) {
            el.resetActionsUsed();
        });
    }

    // данные отправляемые при подключении пользователя
    getGameFirstState(user) {
        let state = {};

        state.assets = this.assets;
        state.time = Date.now();
        state.world = {};
        state.world.id = this.id;
        state.world.gravity = this.gravity;
        state.world.applyDamping = this.applyDamping;

        state.sendStateInterval = this.sendStateInterval;

        state.bodies = [];
        _.forEach(this.bodies, function(el) {
            let info = el.getFirstInfo();
            if (info !== undefined) {
                state.bodies.push(info);
            }
        });

        state.users = _.map(this.users, function(el) {
            return el.getFirstInfo();
        });

        return state;
    }

    // данные о новых телах и пользователях
    getGameNewState(user) {
        let state = [];

        state[0] = [];
        _.forEach(this.newBodies, function(el) {
            let info = el.getFirstInfo();
            if (info !== undefined) {
                state[0].push(info);
            }
        });

        state[1] = _.map(this.newUsers, function(el) {
            return el.getFirstInfo();
        });

        return state;
    }

    addPlayer(user) {
        this.users[user.id] = user;
        this.addBody(user.ship);

        this.newUsers.push(user);
    }

    removePlayer(user) {
        if (this.users[user.id] !== undefined) {
            delete this.users[user.id];
        }
    }

    addSpectator(user) {
        this.spectators[user.id] = user;
    }

    removeSpectator(user) {
        if (this.spectators[user.id] !== undefined) {
            delete this.spectators[user.id];
        }
    }

    addBody(body) {
        this.bodies[body.id] = body;
        body.game = this;
        this.world.addBody(body.body);

        this.newBodies.push(body);
    }

    removeBody(body) {
        delete this.bodies[body.id];
        this.world.removeBody(body.body);
        body.game = undefined;
        this.removeBodies.push(body.id);
    }

    getDateForNewPlayer() {
        let date = {};

        date.gameType = 0;
        date.shipType = 10;
        date.velocity = [0, 0];
        date.position = [-100, -100];
        date.angularVelocity = 0;
        date.angle = 0;

        return date;
    }

    close() {
        this.stop();

        _.forEach(this.users, function(el) {
            el.send('gameClose');
            el.save();
        });

        // TODO: доделать
    }

    impactEvents() {
        this.world.on('impact', function(ev) {
            body.collide(ev.bodyA._gameBody, ev.bodyB._gameBody);
        });

        this.world.on('beginContact', function(ev) {
            body.beginContact(ev.bodyA._gameBody, ev.bodyB._gameBody);
        });
    }
}
