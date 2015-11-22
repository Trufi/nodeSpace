import express from 'express';
import path from 'path';

import config from './config';
import log from './modules/log';
import * as socket from './socket';

log.info(`App start in ${process.env.NODE_ENV || 'production'} mode`);

const app = express();
const port = process.env.PORT || process.env.port || config.port;

const server = app.listen(port, log.info(`server listen on ${port} port`));

socket.initialize(server);

app.use(express.static(path.join(__dirname, '../client')));
app.use(express.static(path.join(__dirname, '../dist')));

// Init game
const game = require('./game');

app.get('/shutdown', game.closeAll);

// error handlers
app.use((error, req, res, next) => {
    res.send(error);
});
