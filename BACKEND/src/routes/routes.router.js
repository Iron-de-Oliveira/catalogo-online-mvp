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
routes.post('/administradores', administradorController.criar)

// Rotas para produtos
routes.get('/produtos', produtoController.listar)
routes.get('/produtos/id/:id', produtoController.listarPorId)
routes.get('/produtos/categoria/:categoria', auth, produtoController.listarPorCategoria)
routes.put('/produtos/id/:id', auth, produtoController.atualizar)
routes.post('/produtos', upload.single('foto'), produtoController.criar)
routes.delete('/produtos/id/:id', produtoController.deletar)

// Rotas para usuários
routes.post('/usuarios', userController.criar)
routes.get('/usuarios', userController.listar)
routes.get('/usuarios/id/:id', auth, userController.encontrarPorId)
routes.get('/usuarios/email/:email', auth, userController.encontrarPorEmail)
routes.delete('/usuarios/email/:email', auth, userController.deletarPorEmail)
routes.put('/usuarios/email/:email', auth, userController.atualizarPorEmail)

module.exports = routes