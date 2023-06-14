var express = require('express');
var router = express.Router();
const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


const usuarios = router.get('/usuarios', function(req, res, next) {
  res.render('usuarios', { title: 'Usuarios' });
});


const loadUsuarios = router.get('/usuarios/cargar', function(req, res, next) {
  
    try{

        const db = new Database(path.join(__dirname , 'database' , 'usuarios.db'));

        db.pragma('journal_mode = WAL');

        const command = db.prepare('SELECT * FROM usuarios');
        const usuarios = command.all();


        db.close();
        res.send({ res: usuarios });

    }catch(e){

        console.log(e);

    }
    


});

// module.exports = router;
module.exports = {usuarios, loadUsuarios}
