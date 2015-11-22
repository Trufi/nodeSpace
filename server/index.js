var express = require('express');
var path = require('path');

var log = require('./modules/log')(module);
var config = require('./config');
var socket = require('./socket');

log.info('App start in ' + (process.env.NODE_ENV || 'production') + ' mode');

var app = express();
var port = process.env.PORT || process.env.port || config.port;

var server = app.listen(port, () => {
    log.info(`server listen on ${port} port`);
});

socket.initialize(server);

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../dist')));

// Init game
var game = require('./game');

app.get('/shutdown', game.closeAll);

// error handlers
app.use((error, req, res, next) => {
    res.send(error);
});
