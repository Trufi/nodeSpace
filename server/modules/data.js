import _ from 'lodash';

// Округляем числовые значения: положения, скорости и т.д., до 3 знаков после запятой
const valuesRound = 3;

const round = _.curryRight(_.round)(valuesRound);

export function toClient(state) {
    return [
        state.time,
        changedToClient(state.changed),
        newToClient(state.new),
        removeToClient(state.removed)
    ];
}

function changedToClient(state) {
    return [
        _.map(state.bodies, bodyToClient),
        _.map(state.users, userToClient)
    ];
}

function bodyToClient(state) {
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

function userToClient(state) {
    return [
        state.id
    ];
}

function newToClient(state) {
    return [
        _.map(state.bodies, newBodyToClient),
        _.map(state.users, newUserToClient)
    ];
}

function removeToClient(state) {
    return [
        state.bodies
    ];
}

export function firstStateToClient(state) {
    state.game.bodies = _.map(state.game.bodies, newBodyToClient);
    state.game.users = _.map(state.game.users, newUserToClient);
    state.user = newUserToClient(state.user);

    return state;
}

function newBodyToClient(state) {
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

function newUserToClient(state) {
    return [
        state.id,
        state.type,
        state.name,
        state.shipId
    ];
}
