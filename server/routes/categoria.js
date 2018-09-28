const express = require('express')

let {verificaToken,verificaAdminRole} = require('../middlewares/autenticacion')


let app = express();



let Categoria = require('../models/categoria')

/**
 * Consulta de todas las categorias
 */
app.get('/categoria',(req,res) =>{
    Categoria.find()
    .populate('usuario','nombre email')
    .sort('descripcion')
    .exec((err,categorias) =>{
        if (err)
            return res.status(400).json({
            ok: false,
            err
        })
        return res.json({
            ok : true,
            categorias
        })
    })
})

/**
 * Consulta categoria por id
 */
app.get('/categoria/:id',verificaToken, (req,res) =>{
    let id  = req.params.id;
    Categoria.findById(id)
    .populate('usuario','nombre email')
    .exec( (err,categoria) =>{
        if (err)
            return res.status(400).json({
            ok: false,
            err
        })
        return res.json({
            ok : true,
            categoria
        })
    })
})

/**
 * Creacion de una categoria
 */
app.post('/categoria',[verificaToken,verificaAdminRole], (req,res) =>{
    let body = req.body
    let id_user = req.usuario._id
    let categoria = new Categoria({
        descripcion : body.descripcion,
        usuario     : id_user
    })

    categoria.save((err,categoriaDB) => {
        if (err)
            return res.status(500).json({
            ok: false,
            err
        })
        return res.json ({
            ok : true,
            categoria : categoriaDB
        })
    })
})

/**
 * Actualizacion de una categoria
 */
app.put('/categoria/:id',verificaToken,(req,res) =>{
    let id  = req.params.id;
    let body = {descripcion : req.body.descripcion}
    Categoria.findByIdAndUpdate(id,body,{new : true, runValidators : true},(err,categoria) =>{
        if (err)
            return res.status(400).json({
            ok: false,
            err
        })
        return res.json({
            ok : true,
            categoria
        })
    })
})

/**
 * Eliminacion de una categoria
 */
app.delete('/categoria/:id',[verificaToken,verificaAdminRole],(req,res) =>{
    let id  = req.params.id;
    Categoria.findByIdAndDelete(id,(err,categoria) =>{
        if (err)
            return res.status(400).json({
            ok: false,
            err
        })
        return res.json({
            ok : true,
            categoria
        })
    })
})

module.exports = app;