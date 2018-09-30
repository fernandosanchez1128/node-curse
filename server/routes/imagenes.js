const express = require('express');
const fs = require('fs')
const path = require('path')
const app = express();
let { verificaTokenImg } = require('../middlewares/autenticacion')

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    console.log('getting image')
    let no_image = '../assets/no-image.jpg'
    let tipo = req.params.tipo
    let img = req.params.img

    let tipos = ['usuarios', 'productos']

    let pathImg = `../../uploads/${tipo}/${img}`

    let imagePath = path.resolve(__dirname, pathImg)
    imagePath = fs.existsSync(imagePath) ? imagePath : path.resolve(__dirname, no_image)
    res.sendFile(imagePath)
})


module.exports = app