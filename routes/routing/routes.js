const {index} = require('../index');
const {usuarios, loadUsuarios} = require('../usuarios');
const {gimnasio} = require('../gimnasio');
const { configuracion } = require('../configuracion');
const {posts, cambiarPrecio, getConceptos, setPrecio} = require('../posts/posts');


module.exports = [
    index,
    usuarios,
    loadUsuarios,
    gimnasio,
    configuracion,
    posts,
    cambiarPrecio,
    getConceptos,
    setPrecio
]