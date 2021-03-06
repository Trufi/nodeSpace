import log from '../modules/log';
import config from '../config';
import Client from './Client';

let idCounter = 0;

export const list = {};

export function initialize(socket) {
    const client = new Client({
        id: ++idCounter,
        socket: socket
    });

    list[client.id] = client;

    log.silly(`Create new client with id: ${client.id}`);

    const timeout = setTimeout(() => {
        log.error('User load timeout');

        if (client) {
            client.destroy();
        }
    }, config.waitingUsersLoad);

    socket.once(1, function() {
        clearTimeout(timeout);

        log.silly('Client onload');

        client.activateGame();

        enableSocketAuth(client);
    });
}

function enableSocketAuth(client) {
    client.socket
        .once('quickStart', function() {
            quickStart(client);
        });
}

function disableSocketAuth(client) {
    client.socket
        .removeAllListeners('quickStart');
}

function initNewPlayer(client, options = {}) {
    const game = client.game;

    const gameData = game.getDateForNewPlayer();

    if (options.name !== undefined) {
        gameData.name = options.name;
    }
    if (options._id !== undefined) {
        gameData._id = options._id;
    }

    client.applyData(gameData);

    game.removeSpectator(client);
    game.addPlayer(client);

    client.sendFirstGameState(client.getFirstState());
}

function quickStart(client) {
    initNewPlayer(client);
    log.silly(`User quickstart, id: ${client.id}, name: ${client.name}`);
    disableSocketAuth(client);
}
