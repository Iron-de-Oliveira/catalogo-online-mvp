const { Router } = require('express')
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
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

routes.use('/auth', authRoutes)

routes.post(
  '/administradores',
  auth,
  admin,
  administradorController.criar
)

routes.get('/produtos/id/:id', produtoController.listarPorId)
routes.get('/produtos/categoria/:categoria', produtoController.listarPorCategoria)
routes.get('/produtos', produtoController.listar)

routes.put(
  '/produtos/id/:id',
  auth,
  admin,
  upload.single('foto'),
  produtoController.atualizar
)

routes.post(
  '/produtos',
  auth,
  admin,
  upload.single('foto'),
  produtoController.criar
)

routes.delete(
  '/produtos/id/:id',
  auth,
  admin,
  produtoController.deletar
)

routes.get('/usuarios/id/:id', auth, userController.encontrarPorId)
routes.get('/usuarios/email/:email', auth, userController.encontrarPorEmail)
routes.delete('/usuarios/email/:email', auth, userController.deletarPorEmail)
routes.put('/usuarios/email/:email', auth, userController.atualizarPorEmail)

module.exports = routes
