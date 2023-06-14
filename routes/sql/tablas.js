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
                    modalidad TEXT NOT NULL,
                    fecha_pago TEXT NOT NULL,
                    fecha_pago_timestamp INTEGER NOT NULL,
                    sig_pago TEXT NOT NULL,
                    sig_pago_timestamp INTEGER NOT NULL
                    )`;

db_main.prepare(initOrders).run();

db_main.close();