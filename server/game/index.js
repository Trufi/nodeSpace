import log from '../modules/log';
import first from './games/first';

let game = {};

game.list = {
    0: first
};

game.getGameForSpectator = function() {
    return first;
};

game.getGameForPlayer = function(player) {
    return first;
};

game.closeAll = function(req, res) {
    first.close();

    log.info('All games shutdown!');
    res.send('All games shutdown!');
};

export {game as default};
