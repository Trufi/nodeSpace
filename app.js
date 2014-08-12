var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var log = require('modules/log')(module);

var routes = require('routes/index');
// var users = require('./routes/users');

var config = require('config');
var sockets = require('modules/socket');

var sessionStore = require('modules/sessionStore');


var app = express();
app.set('port', config.port);
app.set('host', config.host);

var server = app.listen(app.get('port'), app.set('host'), function () {
    log.info('server listen on ' + app.get('port') + ' port and host ' + app.set('host'));
});

sockets.init(server);

// Init game
var gameMain = require('./game/main');
var clientConnect = require('modules/clientconnect');
//gameMain.start();

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

module.exports = app;