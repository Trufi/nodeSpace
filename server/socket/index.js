import socketio from 'socket.io';

import log from '../modules/log';
import * as clients from '../clients';

let currentIo;

export function initialize(server) {
    currentIo = socketio.listen(server, {log: true});
    log.info('socket.io initialized');

    currentIo.sockets.on('connection', socket => {
        log.silly('New socket connection');
        clients.initialize(socket);
    });
}

export function io() {
    return currentIo;
}
