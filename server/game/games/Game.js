import _ from 'lodash';
import p2 from 'p2';

import config from '../../config';
import * as body from '../body/index';
import time from '../../modules/time';
import * as data from '../../modules/data';

let idCounter = 0;

export default class Game {
    constructor() {
        this.id = ++idCounter;

        this._sendStateInterval = config.sendStateInterval;
        this._sendStateLastTime = 0;

        this._gravity = [0, 0];
        this._applyDamping = false;
        this._users = {};
        this._spectators = {};
        this._bodies = {};

        this._started = false;

        this._assets = {
            texture: {
                asteroid: 'asteroid.png',
                rectangle: 'rect.png',
                ship: 'ship2.png',
                bullet: 'bullet.gif'
            }
        };

        this._newBodies = [];
        this._removeBodies = [];
        this._newUsers = [];

        this._world = new p2.World({
            gravity: this._gravity,
            applyDamping: this._applyDamping
        });

        this._loop = this._loop.bind(this);

        this._impactEvents();
    }

    start() {
        this._lastTimeStep = time();
        this._started = true;

        setImmediate(this._loop);
    }

    _loop() {
        if (!this._started) { return; }

        setImmediate(this._loop);

        const now = time();

        if (now - this._lastTimeStep < config.minimalTimeBetweenGameLoop) { return; }

        _.forEach(this._users, el => el.updateActions(now));

        _.forEach(this._bodies, el => el.update(now));

        this._world.step((now - this._lastTimeStep) / 1000);

        this.sendState(now);

        this._lastTimeStep = now;
    }

    stop() {
        this._started = false;
    }

    sendState(now) {
        if (now - this._sendStateLastTime < this._sendStateInterval) { return; }

        this._sendStateLastTime = now;

        _.forEach(this._users, user => this._sendStateData(now, user));
        _.forEach(this._spectators, user => this._sendStateData(now, user));

        this._newBodies = [];
        this._newUsers = [];
        this._removeBodies = [];

        this._resetBodyUsedActions();
    }

    _sendStateData(now, user) {
        const state = {
            time: now,
            changed: this.getGameState(user)
        };

        // новые данные
        state.new = this.getGameNewState(user);

        // данные которые нужно удалить
        state.removed = {
            bodies: this._removeBodies
        };

        user.sendGameState(state);
    }

    // данные, которые отправляются через каждый шаг
    getGameState() {
        function getInfo(obj) {
            return _(obj)
                .map(el => el.getInfo())
                .filter(el => el !== null)
                .value();
        }

        return {
            bodies: getInfo(this._bodies),
            users: getInfo(this._users)
        };
    }

    _resetBodyUsedActions() {
        _.forEach(this._bodies, function(el) {
            el.resetActionsUsed();
        });
    }

    // данные отправляемые при подключении пользователя
    getGameFirstState(user) {
        let state = {};

        state.assets = this._assets;
        state.time = time();
        state.world = {};
        state.world.id = this.id;
        state.world.gravity = this._gravity;
        state.world.applyDamping = this._applyDamping;

        state.sendStateInterval = this._sendStateInterval;

        state.bodies = [];
        _.forEach(this._bodies, function(el) {
            let info = el.getFirstInfo();
            if (info !== undefined) {
                state.bodies.push(info);
            }
        });

        state.users = _.map(this._users, function(el) {
            return el.getFirstInfo();
        });

        return state;
    }

    // данные о новых телах и пользователях
    getGameNewState() {
        function getFirstInfo(obj) {
            return _(obj)
                .map(el => el.getFirstInfo())
                .filter(el => el !== null)
                .value();
        }

        return {
            bodies: getFirstInfo(this._newBodies),
            users: getFirstInfo(this._newUsers)
        };
    }

    addPlayer(user) {
        this._users[user.id] = user;
        this.addBody(user.ship);

        this._newUsers.push(user);
    }

    removePlayer(user) {
        if (this._users[user.id] !== undefined) {
            delete this._users[user.id];
        }
    }

    addSpectator(user) {
        this._spectators[user.id] = user;
    }

    removeSpectator(user) {
        if (this._spectators[user.id] !== undefined) {
            delete this._spectators[user.id];
        }
    }

    addBody(body) {
        this._bodies[body.id] = body;
        body.game = this;
        this._world.addBody(body.body);

        this._newBodies.push(body);
    }

    removeBody(body) {
        delete this._bodies[body.id];
        this._world.removeBody(body.body);
        body.game = undefined;
        this._removeBodies.push(body.id);
    }

    getDateForNewPlayer() {
        return {
            gameType: 0,
            shipType: 10,
            position: [-100, -100],
            velocity: [0, 0],
            angularVelocity: 0,
            angle: 0
        };
    }

    close() {
        this.stop();

        _.forEach(this._users, function(el) {
            el.send('gameClose');
            el.save();
        });

        // TODO: доделать
    }

    _impactEvents() {
        this._world.on('impact', function(ev) {
            body.collide(ev.bodyA._gameBody, ev.bodyB._gameBody);
        });

        this._world.on('beginContact', function(ev) {
            body.beginContact(ev.bodyA._gameBody, ev.bodyB._gameBody);
        });
    }
}
