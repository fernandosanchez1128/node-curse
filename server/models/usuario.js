const mongoose = require ('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema


let roles = {
    values : ['ADMIN_ROLE', 'USER_ROLE'],
    message : '{VALUE} no es un rol valido'
}
let usuarioSchema = new Schema ({
    nombre : {
        type : String,
        required : [true, 'El nombre es necesario']
    },
    email : {
        type : String,
        unique : true,
        required : [true, 'El correo es necesario']
    },
    password : {
        type : String,
        required : [true, 'El contraseña es obligatoria']
    },
    img : {
        type : String,
        required : false
    },
    role : {
        type : String,
        default : 'USER_ROLE',
        enum : roles
    },
    estado : {
        type : Boolean,
        default : true
    },
    google : {
        type : Boolean,
        default : false
    }
})

usuarioSchema.plugin(uniqueValidator, {message : '{PATH} debe ser unico'});

module.exports = mongoose.model ('Usuario', usuarioSchema)