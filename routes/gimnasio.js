var express = require('express');
var router = express.Router();

const gimnasio = router.get('/gimnasio', function(req, res, next) {
  res.render('gimnasio', { title: 'Gimnasio' });
});

// module.exports = router;
module.exports = {gimnasio}
