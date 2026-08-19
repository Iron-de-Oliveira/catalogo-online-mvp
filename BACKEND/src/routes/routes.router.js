const { Router } = require('express')
const auth = require('../middlewares/auth')
const upload = require('../middlewares/upload')

const produtoController = require('../controllers/ProdutoController')
const administradorController = require('../controllers/AdministradorController')
const userController = require('../controllers/UserController')
const authRoutes = require('./authRoutes')

const routes = Router()

routes.get('/', (req, res) => {
  return res.json({
    message: 'API do catálogo online funcionando!'
  })
})

// Rotas para autenticação
routes.use('/auth', authRoutes)

// Rotas para administradores
routes.post(
  '/administradores',
  auth,
  administradorController.criar
)

// Rotas para produtos
routes.get(
  '/produtos/id/:id',
  produtoController.listarPorId
)

routes.get(
  '/produtos/categoria/:categoria',
  produtoController.listarPorCategoria
)

routes.get(
  '/produtos',
  produtoController.listar
)

// Atualizar produto
routes.put(
  '/produtos/id/:id',
  auth,
  upload.single('foto'),
  produtoController.atualizar
)

// Criar produto
routes.post(
  '/produtos',
  upload.single('foto'),
  produtoController.criar
)

// Deletar produto
routes.delete(
  '/produtos/id/:id',
  produtoController.deletar
)

// Rotas para usuários
routes.post(
  '/usuarios',
  userController.criar
)

routes.get(
  '/usuarios',
  userController.listar
)

routes.get(
  '/usuarios/id/:id',
  auth,
  userController.encontrarPorId
)

routes.get(
  '/usuarios/email/:email',
  auth,
  userController.encontrarPorEmail
)

routes.delete(
  '/usuarios/email/:email',
  auth,
  userController.deletarPorEmail
)

routes.put(
  '/usuarios/email/:email',
  auth,
  userController.atualizarPorEmail
)

module.exports = routes