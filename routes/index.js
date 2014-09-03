var express = require('express');
var router = express.Router();
var game = require('game');

/* GET home page. */
if (process.env.NODE_ENV !== 'development') {
    router.get('/', function (req, res) {
        res.render('index', {title: 'nodeSpace'});
    });
} else {
    router.get('/', function (req, res) {
        res.render('index_dev', {title: 'nodeSpace'});
    });
}

router.get('/shutdown', game.closeAll);

module.exports = router;