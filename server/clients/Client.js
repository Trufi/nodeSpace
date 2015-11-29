import _ from 'lodash';

import log from '../modules/log';
import game from '../game';
import * as body from '../game/body';
import config from '../config';

let usersCount = 0;

// В клиенте содержится сокет, игрок клиента, сессия и информация о ней
export default class Client {
    constructor(options) {
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
    }

    applyData(data) {
        this.gameType = data.gameType || 0;
        this.name = data.name || (config.users.anonName + ++usersCount);
        this.dbId = data._id;

        this.createShip(data);
    }

    createShip(data) {
        let _this = this;

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
    }

    activateGame() {
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
    }

    socketOn() {
        log.silly('Client socketOn, id: %s', this.id);
        this.socket
            .removeAllListeners(5)
            .removeAllListeners(7)
            .on(5, data => {
                _.forEach(data, (el, i) => {
                    this.actionsDone[i] = el;
                });
            })
            .on(7, () => {
                this.socket.emit(8, Date.now());
            });
    };

    updateActions(now) {
        _.forEach(this.actionsDone, (el, i) => {
            this.action(now, i, el);
        });

        this.actionsDone = {};
    }

    action(now, name, options) {
        if (this.actions[name] !== undefined) {
            this.actions[name].use(now, options);
        }
    }

    getFirstState() {
        let state = {};

        state.game = this.game.getGameFirstState();
        state.user = this.getFirstInfo();

        return state;
    }

    getInfo() {
        let info = [];
        info[0] = this.id;
        return info;
    }

    getFirstInfo() {
        let info = [];
        info[0] = this.id;

        if (this.name !== undefined) {
            info[1] = 1; // type
            info[2] = this.name;
            info[3] = this.ship.id;
        } else {
            info[1] = 0; // type
        }

        return info;
    }

    send(name, data) {
        this.socket.emit(name, data);
    }

    destroy() {
        // TODO: destroy client
    }
}
