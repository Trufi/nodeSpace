var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var config = require('config');

module.exports = new MongoStore(config.mongo);