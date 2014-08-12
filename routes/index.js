var express = require('express');
var router = express.Router();
var signup = require('./signup');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'nodeSpace' });
});

router.post('/signup', signup.post);

module.exports = router;
