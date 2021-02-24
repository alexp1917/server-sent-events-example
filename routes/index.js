var express = require('express');
var router = express.Router();

var resource = require('../resources/examples-resource');

/* GET home page. */
router.get('/', async (req, res, next) => {
  res.render('index', { title: 'Express', data: await resource.get() });
});

module.exports = router;
