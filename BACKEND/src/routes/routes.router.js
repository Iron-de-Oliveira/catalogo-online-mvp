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

// Rotas para administradores
routes.post('/administradores', administradorController.criar)

// Rotas para produtos
routes.get('/produtos', produtoController.listar)
routes.get('/produtos/id/:id', produtoController.listarPorId)
routes.get('/produtos/categoria/:categoria', produtoController.listarPorCategoria)
routes.put('/produtos/id/:id', produtoController.atualizar)
routes.post('/produtos', produtoController.criar)
routes.delete('/produtos/id/:id', produtoController.deletar)

// Rotas para usuários
routes.post('/usuarios', userController.criar)
routes.get('/usuarios', userController.listar)
routes.get('/usuarios/id/:id', userController.encontrarPorId)
routes.get('/usuarios/email/:email', userController.encontrarPorEmail)
routes.delete('/usuarios/email/:email', userController.deletarPorEmail)
routes.put('/usuarios/email/:email', userController.atualizarPorEmail)

module.exports = routes