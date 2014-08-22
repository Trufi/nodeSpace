var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var log = require('modules/log')(module);
var config = require('config');
var socket = require('socket');
var sessionStore = require('mongo/sessionStore');

require('mongo');

var app = express();

var server = app.listen(config.port, config.host, function () {
    log.info('server listen on %s port and %s host ', config.port, config.host);
});

socket.initialize(server);

//var clientConnect = require('modules/clientconnect');

var routes = require('routes/index');
// var users = require('./routes/users');


// Init game
require('game');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use(session({
    secret: config.session.secret,
    key: config.session.key,
    cookie: config.session.cookie,
    resave: true,
    saveUninitialized: true,
    store: sessionStore
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
//app.use('/users', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



/*var util = require('util');
setInterval(function() {
    console.log(util.inspect(process.memoryUsage()));
}, 1000);*/

module.exports = app;