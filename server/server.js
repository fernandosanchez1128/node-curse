const express = require('express')
const app = express()

const mongoose = require('mongoose');
const path = require ('path')
const bodyParser = require('body-parser')

require ('./config/config')



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//Configuracion global de rutas
app.use( require ('./routes/index'))

//habilitar la carpeta publica
app.use (express.static ( path.resolve (__dirname, '../public')))

mongoose.connect(process.env.URLDB, (err,res)=>{
    if (err)  throw err 
    console.log ('BASE DE DATOS ONLINE')
});
app.listen(process.env.PORT)


