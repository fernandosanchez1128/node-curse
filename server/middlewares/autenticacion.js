
const jwt = require('jsonwebtoken');
/**
 * valida que el token enviado sea valido
 * @param {*} req  : peticion 
 * @param {*} res  : respuesta a la peticion
 * @param {*} next : siguiente metodo a ejecutar
 */
let verificaToken = (req, res, next) => {

    let token = req.get('Authorization');
    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token inválido'
                }
            })
        }

        req.usuario = decode.usuario
        next();
    })
}

/**
 * valida que el rol del usuario sea de admin
 * @param {*} req  : peticion 
 * @param {*} res  : respuesta a la peticion
 * @param {*} next : siguiente metodo a ejecutar
 */
let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario
    if (usuario.role === 'ADMIN_ROLE'){
        next ()
    }else{
        return res.json ({
            ok : false,
            err :{
                message : 'El usuario no es administrador'
            }
        })
    }
}


module.exports = {
    verificaToken, 
    verificaAdminRole
}