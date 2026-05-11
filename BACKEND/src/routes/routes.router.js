const { Router } = require('express')

const produtoController = require('../controllers/ProdutoController')
const administradorController = require('../controllers/AdministradorController')
const userController = require('../controllers/UserController')

const routes = Router()

routes.get('/', (req, res) => {
  return res.json({
    message: 'API do catálogo online funcionando!'
  })
})

routes.post('/administradores', administradorController.criar)

routes.get('/produtos', produtoController.listar)
routes.post('/produtos', produtoController.criar)

// Rotas para usuários
routes.post('/usuarios', userController.criar)
routes.get('/usuarios', userController.listar)
routes.get('/usuarios/id/:id', userController.encontrarPorId)
routes.get('/usuarios/email/:email', userController.encontrarPorEmail)

module.exports = routes