const { Router } = require('express')

const adm = Router()

const administradorController = require('../controllers/AdministradorController')

adm.post('/', administradorController.criar)

module.exports = adm