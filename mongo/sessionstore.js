var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var config = require('config');

var mongoUrl = process.env.NODE_ENV === 'development' ? config.mongo.urlDev : config.mongo.url;

module.exports = new MongoStore({url: mongoUrl});