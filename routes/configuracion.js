var express = require('express');
var router = express.Router();

const configuracion = router.get('/configuracion', function(req, res, next) {
  res.render('configuracion', { title: 'Configuración' });
});

// module.exports = router;
module.exports = {configuracion}
