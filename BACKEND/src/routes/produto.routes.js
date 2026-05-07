const { Router } = require('express')
const ProdutoController = require('../controllers/ProdutoController')

const produtoRoutes = Router()

const produtoController = new ProdutoController()

produtoRoutes.get('/', produtoController.listar)
produtoRoutes.post('/', produtoController.criar)

module.exports = produtoRoutes