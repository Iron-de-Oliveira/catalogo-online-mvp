const { Router } = require('express')
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const upload = require('../middlewares/upload')

const produtoController = require('../controllers/ProdutoController')
const administradorController = require('../controllers/AdministradorController')
const userController = require('../controllers/UserController')
const listaDesejosController = require('../controllers/ListaDesejosController')
const authRoutes = require('./authRoutes')

const routes = Router()

function clienteAutenticado(req, res, next) {
  if (req.user?.role === 'admin') {
    return res.status(403).json({ error: 'Esta funcionalidade está disponível apenas para clientes.' })
  }

  return next()
}

routes.get('/', (req, res) => {
  return res.json({
    message: 'API do catálogo online funcionando!'
  })
})

routes.use('/auth', authRoutes)

routes.get('/lista-desejos', auth, clienteAutenticado, listaDesejosController.listar)
routes.post('/lista-desejos/:produtoId', auth, clienteAutenticado, listaDesejosController.adicionar)
routes.delete('/lista-desejos/:produtoId', auth, clienteAutenticado, listaDesejosController.remover)

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
  upload.fields([
    { name: 'foto', maxCount: 1 },
    { name: 'fotos', maxCount: 10 }
  ]),
  produtoController.atualizar
)

routes.post(
  '/produtos',
  auth,
  admin,
  upload.fields([
    { name: 'foto', maxCount: 1 },
    { name: 'fotos', maxCount: 10 }
  ]),
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
routes.put(
  '/usuarios/email/:email',
  auth,
  upload.single('fotoPerfil'),
  userController.atualizarPorEmail
)

module.exports = routes
