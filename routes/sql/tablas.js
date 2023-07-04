const path = require('path');
const Database = require('better-sqlite3');
const fs = require('fs');

const dir = path.resolve(__dirname, '..', 'database');

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

const db_main = new Database(path.join(__dirname, '..' , 'database' , 'usuarios.db'));

const initOrders = `CREATE TABLE IF NOT EXISTS usuarios (
                    id TEXT NOT NULL,
                    nombre_usuario TEXT NOT NULL, 
                    telefono_usuario INTEGER NOT NULL, 
                    radio_sexo TEXT NOT NULL,
                    fecha_nacimiento TEXT NOT NULL,
                    nombre_contacto TEXT,
                    telefono_contacto INTEGER,
                    modalidad_actual TEXT NOT NULL,
                    fecha_ingreso TEXT NOT NULL,
                    fecha_ingreso_timestamp INTEGER NOT NULL,
                    sig_pago TEXT NOT NULL,
                    sig_pago_timestamp INTEGER NOT NULL
                    )`;

db_main.prepare(initOrders).run();

db_main.close();


const db_gimnasio = new Database(path.join(__dirname, '..' , 'database' , 'gimnasio.db'));

const initPagos = `CREATE TABLE IF NOT EXISTS conceptos (
                        secuencia INTEGER NOT NULL,
                        id TEXT NOT NULL,
                        concepto_pago TEXT NOT NULL, 
                        precio_pago NUMERIC NOT NULL
                    )`;

db_gimnasio.prepare(initPagos).run();

db_gimnasio.close();


const db_descuentos = new Database(path.join(__dirname, '..' , 'database' , 'descuentos.db'));

const initPromos = `CREATE TABLE IF NOT EXISTS descuentos (
                        id TEXT NOT NULL,
                        nombre_descuento TEXT NOT NULL,
                        codigo_descuento TEXT NOT NULL,
                        concepto_descuento TEXT NOT NULL,
                        tipo_descuento TEXT NOT NULL, 
                        valor_descuento TEXT NOT NULL
                        )`;

db_descuentos.prepare(initPromos).run();

db_descuentos.close();