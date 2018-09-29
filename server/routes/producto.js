const express = require('express')

let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')


let app = express();



let Producto = require('../models/producto')

/**
 * Consulta de todos los productos
 */
app.get('/producto', (req, res) => {
    let desde = Number(req.query.desde) || 0
    let limite = Number(req.query.limite) || 5
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .sort('descripcion')
        .exec((err, productos) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    err
                })
            Producto.count({ estado: true }, (err, total) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }
                return res.json({
                    ok: true,
                    total,
                    productos
                })
            })
        })
})

/**
 * Busqueda de un producto
 */

app.get('/producto/search/:term', verificaToken, (req, res) => {
    let term = req.params.term
    let regex = new RegExp(term, 'i')
    Producto.find({ disponible: true, nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .sort('descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            return res.json({
                ok: true,
                productos
            })
        })
})

/**
 * Consulta un producto por id
 */
app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    err
                })
            return res.json({
                ok: true,
                producto
            })
        })
})

/**
 * Creacion de un producto
 */
app.post('/producto', verificaToken, (req, res) => {
    let body = req.body
    let id_user = req.usuario._id
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: id_user,
    })

    producto.save((err, productoDB) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            })
        return res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })
})

/**
 * Actualizacion de una producto
 */
app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El producto no existe"
                }
            })
        }

        productoDB.nombre = body.nombre
        productoDB.descripcion = body.descripcion
        productoDB.precioUni = body.precioUni
        productoDB.categoria = body.categoria
        productoDB.disponible = body.disponible

        productoDB.save(productoDB, (err, productoActualizado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            return res.json({
                ok: true,
                producto: productoActualizado
            })
        })
    })

})

/**
 * Eliminacion de un producto
 */
app.delete('/producto/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    Producto.findById(id, (err, producto) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            })
        if (!producto) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            })
        }
        producto.disponible = false
        producto.save((err, productoStored) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            return res.json({
                ok: true,
                producto: productoStored
            })
        })

    })
})

module.exports = app