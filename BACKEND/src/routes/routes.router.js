const { Router } = require('express')
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')

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

// Rota para upload de imagens
routes.post('/upload', upload.single('foto'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo foi enviado' })
  }

  return res.status(200).json({
    message: 'Arquivo enviado com sucesso',
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`
  })
})

// Rotas para autenticação
routes.use('/auth', authRoutes)

// Rotas para administradores
routes.post('/admin/login', administradorController.login)
routes.post('/administradores', administradorController.criar)

<<<<<<< HEAD
// Produtos públicos
routes.get('/produtos', produtoController.listar)
routes.get('/produtos/id/:id', produtoController.listarPorId)
routes.get('/produtos/categoria/:categoria', produtoController.listarPorCategoria)
=======
// Rotas para produtos
routes.get('/produtos', produtoController.listar)
routes.get('/produtos/id/:id', produtoController.listarPorId)
routes.get('/produtos/categoria/:categoria', auth, produtoController.listarPorCategoria)
routes.put('/produtos/id/:id', auth, produtoController.atualizar)
routes.post('/produtos', auth, produtoController.criar)
routes.delete('/produtos/id/:id', auth, produtoController.deletar)
>>>>>>> 6c358cda88dfd19c2ae80b99de77739ef3bb85f1

// Produtos protegidos
routes.post('/produtos', auth, admin,produtoController.criar)
routes.put('/produtos/id/:id', auth, admin, produtoController.atualizar)
routes.delete('/produtos/id/:id', auth, admin, produtoController.deletar)

// Usuários
routes.post('/usuarios', userController.criar)
<<<<<<< HEAD

// Usuários protegidos
routes.get('/usuarios', auth, userController.listar)
=======
routes.get('/usuarios', userController.listar)
>>>>>>> 6c358cda88dfd19c2ae80b99de77739ef3bb85f1
routes.get('/usuarios/id/:id', auth, userController.encontrarPorId)
routes.get('/usuarios/email/:email', auth, userController.encontrarPorEmail)
routes.delete('/usuarios/email/:email', auth, userController.deletarPorEmail)
routes.put('/usuarios/email/:email', auth, userController.atualizarPorEmail)

module.exports = routes