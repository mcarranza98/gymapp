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

// module.exports = router;
module.exports = [
    posts
]
