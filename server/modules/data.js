/**
 * Модуль занимается запаковкой данных готовых к отправке на сервер.
 * Все данные из объектов переделываются в массивы, чтобы занимать меньше места.
 * На клиентской части есть аналогичный модуль для распаковки.
 */
import _ from 'lodash';

// Округляем числовые значения: положения, скорости и т.д., до 3 знаков после запятой
const valuesRound = 3;

const round = _.curryRight(_.round)(valuesRound);

/**
 * Запаковывает данные, которые шлются каждый игровой тик.
 *
 * @param {Object} state
 * @returns {Array}
 */
export function statePack(state) {
    return [
        state.time,
        changedPack(state.changed),
        newPack(state.new),
        removePack(state.removed)
    ];
}

function changedPack(state) {
    return [
        _.map(state.bodies, bodyPack),
        _.map(state.users, userPack)
    ];
}

function bodyPack(state) {
    return [
        state.id,
        state.type,
        _.map(state.position, round),
        _.map(state.velocity, round),
        round(state.angularVelocity),
        round(state.angle),
        state.actionsUsed,
        round(state.hp)
    ];
}

function userPack(state) {
    return [
        state.id
    ];
}

function newPack(state) {
    return [
        _.map(state.bodies, newBodyPack),
        _.map(state.users, newUserPack)
    ];
}

function removePack(state) {
    return [
        state.bodies
    ];
}

/**
 * Запаковывает данные, которые шлются только один раз вначале
 *
 * @param {Object} state
 * @returns {Object}
 */
export function firstStatePack(state) {
    state.game.bodies = _.map(state.game.bodies, newBodyPack);
    state.game.users = _.map(state.game.users, newUserPack);
    state.user = newUserPack(state.user);

    return state;
}

function newBodyPack(state) {
    return [
        state.id,
        state.type,
        _.map(state.position, round),
        _.map(state.velocity, round),
        round(state.angularVelocity),
        round(state.angle),
        state.actionsUsed,
        round(state.hp),
        state.mass,
        state.name
    ];
}

function newUserPack(state) {
    return [
        state.id,
        state.type,
        state.name,
        state.shipId
    ];
}
