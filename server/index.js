var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
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

var routes = require('./routes/index');

// Init game
require('./game');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../public')));

// error handlers
app.use((error, req, res, next) => {
    res.send(error);
});

module.exports = app;
