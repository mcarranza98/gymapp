var express = require('express');
var router = express.Router();
const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');



const posts = router.post('/usuarios/agregar', function(req, res, next) {

    const {nombre_usuario, telefono_usuario, radio_sexo, fecha_nacimiento, nombre_contacto, telefono_contacto, modalidad, fecha_pago, fecha_pago_timestamp, sig_pago, sig_pago_timestamp} = req.body

    const db = new Database(path.join(__dirname, '..' , 'database' , 'usuarios.db'));


    const command = `INSERT INTO usuarios(id, nombre_usuario, telefono_usuario, radio_sexo, fecha_nacimiento, nombre_contacto, telefono_contacto, modalidad, fecha_pago, fecha_pago_timestamp, sig_pago, sig_pago_timestamp) 
                    VALUES(@id, @nombre_usuario, @telefono_usuario, @radio_sexo, @fecha_nacimiento, @nombre_contacto, @telefono_contacto, @modalidad, @fecha_pago, @fecha_pago_timestamp, @sig_pago, @sig_pago_timestamp)`;
                            
    const insert = db.prepare(command);
    
    const insertUsuario = db.transaction((config) => {
        
        insert.run(config);

        res.send({state: "success" , message : "Usuario agregado exitosamente."});

    });
    
    const uuid = uuidv4();

    const datosUsuario = {
        id: uuid,
        nombre_usuario: nombre_usuario,
        telefono_usuario: telefono_usuario,
        radio_sexo: radio_sexo,
        fecha_nacimiento: fecha_nacimiento,
        nombre_contacto: nombre_contacto,
        telefono_contacto: telefono_contacto,
        modalidad: modalidad,
        modalidad: modalidad,
        fecha_pago: fecha_pago,
        fecha_pago_timestamp: fecha_pago_timestamp,
        sig_pago: sig_pago,
        sig_pago_timestamp: sig_pago_timestamp,
    };
     
    //console.log(uuid);
    
    insertUsuario(datosUsuario);

    db.close();

});

const cambiarPrecio = router.post('/gimnasio/agregar/concepto', function(req, res, next) {

    const db = new Database(path.join(__dirname, '..' , 'database' , 'gimnasio.db'));

    const insertStatement = db.prepare('INSERT INTO conceptos (secuencia, id, concepto_pago, precio_pago) VALUES (?, ?, ?, ?)');

    const usuarios = [
        { secuencia: 1,id: 'f109714f-563c-48ae-9df1-5ecc7e3236e1', concepto_pago: 'Inscripción', precio_pago: 0.00 },
        { secuencia: 2,id: '9002cce4-ae35-48a9-96e9-90fb87ff7487', concepto_pago: 'Diario', precio_pago: 0.00 },
        { secuencia: 3,id: 'd698cdcd-eb40-40de-a348-21d5c8cd23cd', concepto_pago: 'Semanal', precio_pago: 0.00 },
        { secuencia: 4,id: '9f704126-6481-47ed-b2c4-d9a9795cc343', concepto_pago: 'Mensual', precio_pago: 0.00 },
        { secuencia: 5,id: '98471aec-3835-4abc-baf7-fcdd407c6e09', concepto_pago: 'Bimestral', precio_pago: 0.00 },
        { secuencia: 6,id: '4d0d79d8-37ce-471f-a135-362b881a5965', concepto_pago: 'Semestral', precio_pago: 0.00 },
        { secuencia: 7,id: '5b9ee11f-21e5-4409-97d7-73a1664d80bc', concepto_pago: 'Anual', precio_pago: 0.00 }
    ];secuencia: 1,

    usuarios.forEach(usuario => {
    insertStatement.run(usuario.secuencia, usuario.id, usuario.concepto_pago, usuario.precio_pago);
    });

    // Cerrar la conexión a la base de datos
    db.close();

});


const getConceptos = router.get('/gimnasio/obtener/conceptos', function(req, res, next) {

    const db = new Database(path.join(__dirname, '..' , 'database' , 'gimnasio.db'));

    let command = db.prepare('SELECT * FROM conceptos');
    const orders = command.all();

    res.send({state: "success" , orders});
    
    // Cerrar la conexión a la base de datos
    db.close();

});


const setPrecio = router.post('/gimnasio/actualizar/precio', function(req, res, next) {

    const {id, precio_pago} = req.body;

    const db = new Database(path.join(__dirname, '..' , 'database' , 'gimnasio.db'));

    const stmt = db.prepare('UPDATE conceptos SET precio_pago = ? WHERE id = ?');
    const result = stmt.run(precio_pago, id);

    res.send({state: "success" , message: 'Precio actualizado con éxito'});

    // Cerrar la conexión a la base de datos
    db.close();

});


const agregarDesc = router.post('/descuento/agregar', function(req, res, next) {

    const {codigo_descuento, concepto_descuento, nombre_descuento, tipo_descuento, valor_descuento} = req.body

    const db = new Database(path.join(__dirname, '..' , 'database' , 'descuentos.db'));


    const command = `INSERT INTO descuentos(id, codigo_descuento, concepto_descuento, nombre_descuento, tipo_descuento, valor_descuento) 
                    VALUES(@id, @codigo_descuento, @concepto_descuento, @nombre_descuento, @tipo_descuento, @valor_descuento)`;
                            
    const insert = db.prepare(command);
    
    const insertDescuento = db.transaction((config) => {
        
        insert.run(config);

        res.send({state: "success" , message : "Descuento agregado exitosamente."});

    });
    
    const uuid = uuidv4();

    const datosDescuento = {
        id: uuid,
        codigo_descuento: codigo_descuento,
        concepto_descuento: concepto_descuento,
        nombre_descuento: nombre_descuento,
        tipo_descuento: tipo_descuento,
        valor_descuento: valor_descuento,
    };
    
    insertDescuento(datosDescuento);

    db.close();

});

const getDescuentos = router.get('/gimnasio/obtener/descuentos', function(req, res, next) {

    const db = new Database(path.join(__dirname, '..' , 'database' , 'descuentos.db'));

    let command = db.prepare('SELECT * FROM descuentos');
    const desc = command.all();

    res.send({state: "success" , desc});
    
    // Cerrar la conexión a la base de datos
    db.close();

});


const eliminarDescuentos = router.post('/gimnasio/eliminar/descuentos', function(req, res, next) {

    const { id } = req.body;

    const db = new Database(path.join(__dirname, '..' , 'database' , 'descuentos.db'));

    const stmt = db.prepare('DELETE FROM descuentos WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes > 0) {
        res.send({state: "success" , message:'Se eliminó el descuento'});
    } else {
        res.send({state: "warning" , message:'Ocurrio un problema elimando el descuento'});
    }
    
    // Cerrar la conexión a la base de datos
    db.close();

});


const eliminarUsuario = router.post('/usuarios/eliminar/', function(req, res, next) {

    const { id } = req.body;

    const db = new Database(path.join(__dirname, '..' , 'database' , 'usuarios.db'));

    const stmt = db.prepare('DELETE FROM usuarios WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes > 0) {
        res.send({state: "success" , message:'Se eliminó el usuario'});
    } else {
        res.send({state: "warning" , message:'Ocurrio un problema elimando el usuario'});
    }
    
    // Cerrar la conexión a la base de datos
    db.close();

});


// module.exports = router;
module.exports = {
    posts,
    cambiarPrecio,
    getConceptos,
    setPrecio,
    agregarDesc,
    getDescuentos,
    eliminarDescuentos,
    eliminarUsuario
}
