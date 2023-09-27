const Database = require('better-sqlite3');
const path = require('path');
const axios = require('axios');

crearConceptos()


async function crearConceptos(){
    const db_questions = new Database(path.resolve(__dirname, '..',  'database' , 'gimnasio.db'));
    let command = db_questions.prepare('SELECT * FROM conceptos' );
    const orders = command.all();

    console.log(orders);
    console.log({orders:orders.length});

    if( orders.length == 0 ){
        console.log('hola');

        await axios.post('http://localhost:3000/gimnasio/agregar/concepto');
    }
}