/**
 * Модуль занимается распаковкой данных пришедших с сервера.
 * Все данные из объектов переделываются в массивы, чтобы занимать меньше места.
 * На серверной части есть аналогичный модуль для упаковки.
 */
import _ from 'lodash';

/**
 * Распаковывает данные, которые шлются каждый игровой тик.
 *
 * @param {Array} state
 * @returns {Object}
 */
export function stateUnpack(state) {
    return {
        time: state[0],
        changed: changedUnpack(state[1]),
        'new': newUnpack(state[2]),
        removed: removeUnpack(state[3])
    };
}

function changedUnpack(state) {
    return {
        bodies: _.map(state[0], bodyUnpack),
        users: _.map(state[1], userUnpack)
    };
}

function bodyUnpack(state) {
    return {
        id: state[0],
        type: state[1],
        position: state[2],
        velocity: state[3],
        angularVelocity: state[4],
        angle: state[5],
        actionsUsed: state[6],
        hp: state[7]
    };
}

function userUnpack(state) {
    return {
        id: state[0]
    };
}

function newUnpack(state) {
    return {
        bodies: _.map(state[0], newBodyUnpack),
        users: _.map(state[1], newUserUnpack)
    };
}

function removeUnpack(state) {
    return {
        bodies: state[0]
    };
}

/**
 * Распаковывает данные, которые шлются только один раз вначале
 *
 * @param {Object} state
 * @returns {Object}
 */
export function firstStateUnpack(state) {
    state.game.bodies = _.map(state.game.bodies, newBodyUnpack);
    state.game.users = _.map(state.game.users, newUserUnpack);
    state.user = newUserUnpack(state.user);

    return state;
}

function newBodyUnpack(state) {
    return {
        id: state[0],
        type: state[1],
        position: state[2],
        velocity: state[3],
        angularVelocity: state[4],
        angle: state[5],
        actionsUsed: state[6],
        hp: state[7],
        mass: state[8],
        name: state[9]
    };
}

function newUserUnpack(state) {
    return {
        id: state[0],
        type: state[1],
        name: state[2],
        shipId: state[3]
    };
}
