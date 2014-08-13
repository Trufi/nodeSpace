var express = require('express');
var router = express.Router();
var signup = require('./signup');
var login = require('./login');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {title: 'nodeSpace'});
});

router.post('/signup', signup.post);
router.post('/login', login.post);

module.exports = router;
