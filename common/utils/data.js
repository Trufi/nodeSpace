export function toClient(state) {
    return [
        state.time,
        changedToClient(state.changed),
        newToClient(state.new),
        state.removed
    ];
}

function changedToClient(state) {
    return [
        state.bodies,
        state.users
    ];
}

function newToClient(state) {
    return [
        state.bodies,
        state.users
    ];
}
