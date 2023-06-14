var express = require('express');
var router = express.Router();

/* GET home page. */
const index = router.get('/', function(req, res, next) {

  res.render('index', { title: 'Inicio' });

});

// module.exports = router;
module.exports = {index}
