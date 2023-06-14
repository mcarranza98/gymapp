const {index} = require('../index');
const {usuarios, loadUsuarios} = require('../usuarios');
const {gimnasio} = require('../gimnasio');
const { configuracion } = require('../configuracion');
const posts = require('../posts/posts');


module.exports = [
    index,
    usuarios,
    loadUsuarios,
    gimnasio,
    configuracion,
    posts
]