var express = require('express');
var router = express.Router();
var game = require('game');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {title: 'nodeSpace'});
});

router.get('/shutdown', game.closeAll);

module.exports = router;