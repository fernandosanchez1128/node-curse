const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario')
const Producto = require('../models/producto')
const fs = require('fs')
const path = require('path')

// default options
app.use(fileUpload());



app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo
    let id = req.params.id
        //validar tipo
    let tipos = ['productos', 'usuarios']
    if (tipos.indexOf(tipo) < 0) {
        res.status(200).json({
            ok: false,
            err: {
                message: 'los tipos validos son ' + tipos.join(', '),
                tipo
            }
        })
    }
    if (!req.files) {
        return res.status(400).send.json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo',
                tipo
            }
        })
    }

    // archivo : nombre con el que se envia la imagen
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.')
    let extension = nombreCortado[nombreCortado.length - 1];
    //Extensiones permitida
    let extensiones = ['png', 'jpg', 'gif', 'jpeg']
    if (extensiones.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'las extensiones permitidas son :' + extensiones.join(', '),
                ext: extension
            }
        })
    }

    //Cambiar el nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, function(err) {
        if (err) {
            return res.status(500).send.json({
                ok: false,
                err
            })
        }

        imagenTipo(id, res, nombreArchivo, tipo)
    });
})

function imagenTipo(id, res, nombreArchivo, tipo) {
    let Object = tipo == 'usuarios' ? Usuario : Producto
    console.log(tipo)
    Object.findById(id, (err, objeto) => {
        if (err) {
            borraArchivo(nombreArchivo, tipo)
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!objeto) {
            borraArchivo(nombreArchivo, tipo)
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El usuario no existe"
                }
            })
        }
        borraArchivo(objeto.img, tipo)
        objeto.img = nombreArchivo
        objeto.save((err, objeto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                objeto,
                img: nombreArchivo
            })
        })
    })
}


function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`)
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen)
    }
}
module.exports = app