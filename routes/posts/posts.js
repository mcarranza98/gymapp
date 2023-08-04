var express = require('express');
var router = express.Router();
const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');



const posts = router.post('/usuarios/agregar', function(req, res, next) {

    const {nombre_usuario, telefono_usuario, radio_sexo, fecha_nacimiento, nombre_contacto, telefono_contacto, modalidad_actual, fecha_ingreso, fecha_ingreso_timestamp, sig_pago, sig_pago_timestamp} = req.body

    const db = new Database(path.join(__dirname, '..' , 'database' , 'usuarios.db'));


    const command = `INSERT INTO usuarios(id, nombre_usuario, telefono_usuario, radio_sexo, fecha_nacimiento, nombre_contacto, telefono_contacto, modalidad_actual, fecha_ingreso, fecha_ingreso_timestamp, sig_pago, sig_pago_timestamp) 
                    VALUES(@id, @nombre_usuario, @telefono_usuario, @radio_sexo, @fecha_nacimiento, @nombre_contacto, @telefono_contacto, @modalidad_actual, @fecha_ingreso, @fecha_ingreso_timestamp, @sig_pago, @sig_pago_timestamp)`;
                            
    const insert = db.prepare(command);
    
    const insertUsuario = db.transaction((config) => {
        
        insert.run(config);

        res.send({state: "success" , message : "Usuario agregado exitosamente."});

    });
    
    const uuid = uuidv4();

    const datosUsuario = {
        id: uuid,
        nombre_usuario,
        telefono_usuario,
        radio_sexo,
        fecha_nacimiento,
        nombre_contacto,
        telefono_contacto,
        modalidad_actual,
        fecha_ingreso,
        fecha_ingreso_timestamp,
        sig_pago,
        sig_pago_timestamp,
    };
     
    console.log({datosUsuario});
    
    insertUsuario(datosUsuario);

    db.close();

});


const updateUser = router.post('/usuarios/actualizar', function(req, res, next) {

    const {nombre_usuario, telefono_usuario, radio_sexo, fecha_nacimiento, nombre_contacto, telefono_contacto, modalidad_actual, fecha_ingreso, fecha_ingreso_timestamp, sig_pago, sig_pago_timestamp, id} = req.body

    const db = new Database(path.join(__dirname, '..' , 'database' , 'usuarios.db'));

    const datos = {

    }

    try {
        // Ejecutar la consulta de actualización
        const stmt = db.prepare(`
          UPDATE usuarios 
          SET nombre_usuario = ?, 
              telefono_usuario = ?, 
              radio_sexo = ?, 
              fecha_nacimiento = ?, 
              nombre_contacto = ?, 
              telefono_contacto = ?, 
              modalidad_actual = ?, 
              fecha_ingreso = ?, 
              fecha_ingreso_timestamp = ?, 
              sig_pago = ?, 
              sig_pago_timestamp = ? 
          WHERE id = ?;
        `);
    
        const result = stmt.run(
          nombre_usuario,
          telefono_usuario,
          radio_sexo,
          fecha_nacimiento,
          nombre_contacto,
          telefono_contacto,
          modalidad_actual,
          fecha_ingreso,
          fecha_ingreso_timestamp,
          sig_pago,
          sig_pago_timestamp,
          id
        );
    
        // Verificar si la actualización fue exitosa
        if (result.changes > 0) {
            res.send({state: "success" , message : "Usuario actualizado exitosamente."});
        } else {
          res.send({state: "warning" , message : "No se encontró ningún usuario con el ID proporcionado."});
        }
      } catch (error) {
        res.send({state: "warning" , message : "Error al actualizar al usuario."});
      } finally {
        // Cerrar la conexión a la base de datos
        db.close();
      }

    db.close();

});


const cambiarPrecio = router.post('/gimnasio/agregar/concepto', function(req, res, next) {

    const db = new Database(path.join(__dirname, '..' , 'database' , 'gimnasio.db'));

    const insertStatement = db.prepare('INSERT INTO conceptos (secuencia, id, concepto_pago, precio_pago) VALUES (?, ?, ?, ?)');

    const usuarios = [
        { secuencia: 1,id: 'f109714f-563c-48ae-9df1-5ecc7e3236e1', concepto_pago: 'Inscripción', precio_pago: 0.00 },
        { secuencia: 2,id: '9002cce4-ae35-48a9-96e9-90fb87ff7487', concepto_pago: 'Día', precio_pago: 0.00 },
        { secuencia: 3,id: 'd698cdcd-eb40-40de-a348-21d5c8cd23cd', concepto_pago: 'Semana', precio_pago: 0.00 },
        { secuencia: 4,id: '9f704126-6481-47ed-b2c4-d9a9795cc343', concepto_pago: 'Mes', precio_pago: 0.00 },
        { secuencia: 5,id: '98471aec-3835-4abc-baf7-fcdd407c6e09', concepto_pago: 'Bimestre', precio_pago: 0.00 },
        { secuencia: 6,id: '4d0d79d8-37ce-471f-a135-362b881a5965', concepto_pago: 'Semestre', precio_pago: 0.00 },
        { secuencia: 7,id: '5b9ee11f-21e5-4409-97d7-73a1664d80bc', concepto_pago: 'Año', precio_pago: 0.00 }
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

const getPrecioConcepto = router.post('/gimnasio/concepto/info', function(req, res, next) {

    const {id} = req.body;

    const db = new Database(path.join(__dirname, '..' , 'database' , 'gimnasio.db'));

    let command = db.prepare('SELECT * FROM conceptos WHERE id = ?');
    const concepto = command.get(id);

    res.send({state: "success" , concepto});
    
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


const actPagoUser = router.post('/usuario/actualizar/pago', function(req, res, next) {

    const {id, modalidad_actual, sig_pago, sig_pago_timestamp} = req.body;

    console.log({id});

    const db = new Database(path.join(__dirname, '..' , 'database' , 'usuarios.db'));

    const stmt = db.prepare('UPDATE usuarios SET modalidad_actual = ?, sig_pago = ?, sig_pago_timestamp = ? WHERE id = ?');
    const result = stmt.run(modalidad_actual, sig_pago, sig_pago_timestamp, id);

    res.send({state: "success" , message: 'Usuario actualizado con éxito'});

    // Cerrar la conexión a la base de datos
    db.close();

});


const agregarDesc = router.post('/descuento/agregar', function(req, res, next) {

    const {codigo_descuento, concepto_descuento, nombre_descuento, tipo_descuento, valor_descuento, limite_usos, usos_actuales, limite_usuario, fecha_vencimiento, fecha_vencimiento_timestamp} = req.body

    const db = new Database(path.join(__dirname, '..' , 'database' , 'descuentos.db'));

    

    const command = `INSERT INTO descuentos(id, codigo_descuento, concepto_descuento, nombre_descuento, tipo_descuento, valor_descuento,  limite_usos, usos_actuales, limite_usuario, fecha_vencimiento, fecha_vencimiento_timestamp) 
                    VALUES(@id, @codigo_descuento, @concepto_descuento, @nombre_descuento, @tipo_descuento, @valor_descuento, @limite_usos, @usos_actuales, @limite_usuario, @fecha_vencimiento, @fecha_vencimiento_timestamp)`;
                            
    const insert = db.prepare(command);
    
    const insertDescuento = db.transaction((config) => {
        
        insert.run(config);

        res.send({state: "success" , message : "Descuento agregado exitosamente."});

    });
    
    const uuid = uuidv4();

    const datosDescuento = {
        id: uuid,
        codigo_descuento,
        concepto_descuento,
        nombre_descuento,
        tipo_descuento,
        valor_descuento,
        limite_usos, 
        usos_actuales,
        limite_usuario, 
        fecha_vencimiento, 
        fecha_vencimiento_timestamp
    };

    console.log({datosDescuento});
    
    insertDescuento(datosDescuento);

    db.close();

});


const editarDesc = router.post('/descuento/actualizar', function(req, res, next) {
    const {
      id,
      codigo_descuento,
      concepto_descuento,
      nombre_descuento,
      tipo_descuento,
      valor_descuento,
      limite_usos,
      usos_actuales,
      limite_usuario,
      fecha_vencimiento,
      fecha_vencimiento_timestamp
    } = req.body;

    const datos = {
        codigo_descuento,
        concepto_descuento,
        nombre_descuento,
        tipo_descuento,
        valor_descuento,
        limite_usos,
        usos_actuales,
        limite_usuario,
        fecha_vencimiento,
        fecha_vencimiento_timestamp,
        id
    }
  
    console.log({datos});

    const db = new Database(path.join(__dirname, '..', 'database', 'descuentos.db'));
  
    try {
        // Ejecutar la consulta de actualización
        const stmt = db.prepare(`
        UPDATE descuentos 
        SET codigo_descuento = ?, 
            concepto_descuento = ?, 
            nombre_descuento = ?, 
            tipo_descuento = ?, 
            valor_descuento = ?,  
            limite_usos = ?, 
            usos_actuales = ?, 
            limite_usuario = ?, 
            fecha_vencimiento = ?, 
            fecha_vencimiento_timestamp = ? 
            WHERE id = ?`);
    
        const result = stmt.run(
            codigo_descuento,
            concepto_descuento,
            nombre_descuento,
            tipo_descuento,
            valor_descuento,
            limite_usos,
            usos_actuales,
            limite_usuario,
            fecha_vencimiento,
            fecha_vencimiento_timestamp,
            id
        );
    
        // Verificar si la actualización fue exitosa
        if (result.changes > 0) {
            res.send({state: "success" , message : "Descuento actualizado exitosamente."});
        } else {
            res.send({state: "warning" , message : "No se encontró ningún descuento con el ID proporcionado."});
        }
        } catch (error) {
        res.send({state: "warning" , message : "Error al actualizar el descuento."});
        } finally {
        // Cerrar la conexión a la base de datos
        db.close();
        }
  
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


const getDescuento = router.post('/gimnasio/obtener/descuento', function(req, res, next) {

    const { id } = req.body;

    console.log(id);
    const db = new Database(path.join(__dirname, '..' , 'database' , 'descuentos.db'));

    let command = db.prepare('SELECT * FROM descuentos WHERE id = ?');
    const desc = command.get(id);

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


const consultarUsuario = router.post('/usuarios/consultar/', function(req, res, next) {

    const { id } = req.body;

    const db = new Database(path.join(__dirname, '..' , 'database' , 'usuarios.db'));

    let command = db.prepare('SELECT * FROM usuarios WHERE id=?');
    const datos = command.get(id);

    res.send({state: "success" , datos});
    
    // Cerrar la conexión a la base de datos
    db.close();

});


const agregarPago = router.post('/pagos/agregar', function(req, res, next) {

    const {descuentos_aplicados, fecha_pago, id_usuario, pago_concepto, pago_inscripcion, pago_modalidad, precio_inscripcion, precio_modalidad, precio_total, descuento_inscripcion, descuento_modalidad, nombre_usuario} = req.body

    const db = new Database(path.join(__dirname, '..' , 'database' , 'pagos.db'));


    const command = `INSERT INTO pagos(id, descuentos_aplicados, fecha_pago, id_usuario, pago_concepto, pago_inscripcion, pago_modalidad, precio_inscripcion, precio_modalidad, precio_total, descuento_inscripcion, descuento_modalidad, nombre_usuario) 
                    VALUES(@id, @descuentos_aplicados, @fecha_pago, @id_usuario, @pago_concepto, @pago_inscripcion, @pago_modalidad, @precio_inscripcion, @precio_modalidad, @precio_total, @descuento_inscripcion, @descuento_modalidad, @nombre_usuario)`;
                            
    const insert = db.prepare(command);
    
    const insertPago = db.transaction((config) => {
        
        insert.run(config);

        res.send({state: "success" , message : "Pago agregado exitosamente."});

    });
    
    const uuid = uuidv4();

    const datosPago = {
        id: uuid,
        descuentos_aplicados,
        fecha_pago,
        id_usuario,
        pago_concepto,
        pago_inscripcion,
        pago_modalidad,
        precio_inscripcion,
        precio_modalidad,
        precio_total,
        descuento_inscripcion,
        descuento_modalidad,
        nombre_usuario
    };
     
    console.log({datosPago});
    
    insertPago(datosPago);

    db.close();

});


const getPagos = router.get('/gimnasio/obtener/pagos', function(req, res, next) {

    const db = new Database(path.join(__dirname, '..' , 'database' , 'pagos.db'));

    let command = db.prepare('SELECT * FROM pagos');
    const orders = command.all();

    res.send({state: "success" , orders});
    
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
    eliminarUsuario,
    getPrecioConcepto,
    agregarPago,
    getPagos,
    consultarUsuario,
    actPagoUser,
    updateUser,
    editarDesc,
    getDescuento
}
