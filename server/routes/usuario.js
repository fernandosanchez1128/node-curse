const express = require('express')
const Usuario = require('../models/usuario')
const app = express()

const bcrypt = require('bcrypt')
const _ = require('underscore')


const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')

app.get('/usuario', verificaToken, (req, res) => {
    let desde = Number(req.query.desde) || 0
    let limite = Number(req.query.limite) || 5

    //decir los campos que se desea retornar
    Usuario.find({ estado: true }, 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    err
                })

            Usuario.count({ estado: true }, (err, total) => {
                return res.json({
                    ok: true,
                    total,
                    usuarios
                })
            })

        })


})

app.post('/usuario', [verificaToken, verificaAdminRole], (req, res) => {
    let body = req.body

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        return res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})
app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'role', 'estado'])


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        return res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})
app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id
    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, UsuarioEliminado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!UsuarioEliminado) {
            return res.json({
                ok: true,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }
        return res.json({
            ok: true,
            usuario: UsuarioEliminado
        })
    })

})


module.exports = app