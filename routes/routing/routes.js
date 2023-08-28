const {index} = require('../index');
const {usuarios, loadUsuarios} = require('../usuarios');
const {gimnasio} = require('../gimnasio');
const { configuracion } = require('../configuracion');
const {posts, cambiarPrecio, getConceptos, setPrecio, agregarDesc, 
    getDescuentos, eliminarDescuentos, eliminarUsuario, getPrecioConcepto, 
    agregarPago, getPagos, consultarUsuario, actPagoUser,editarDesc, getDescuento, actDesc,
    updateUser} = require('../posts/posts');


module.exports = [
    index,
    usuarios,
    loadUsuarios,
    gimnasio,
    configuracion,
    posts,
    cambiarPrecio,
    getConceptos,
    setPrecio,
    agregarDesc,
    getDescuentos,
    eliminarDescuentos,
    eliminarUsuario,
    getPrecioConcepto,
    agregarPago,
    getPagos,
    consultarUsuario,
    actPagoUser,
    editarDesc,
    getDescuento,
    actDesc,
    updateUser
]