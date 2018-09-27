//Puerto
process.env.PORT = process.env.port || 8080

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//Base de datos
let urlDB;

if (process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe'
}else{
    //ESTA VARIABLE DEBE AGREGARSE AL ENVIROMENT 
    //EJ HEROKU = heroku config:set MONGO_URI="<cadenaConexion>"
    urlDB = process.env.MONGO_URI 
}


process.env.URLDB = urlDB



//Vencimiento del token 


//SEED de autenticacion
process.env.CADUCIDAD_TOKEN = '10h';
//LA VARIABLE DEBE CREARSE EN HEROKU
process.env.SEED = process.env.SEED || 'SEED-UDEMY';

//google client

process.env.CLIENT_ID = process.env.CLIENT_ID || '360328691127-ormi20tbm63tu04lght31h28ve8n2gbh.apps.googleusercontent.com'
