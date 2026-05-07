const { Router } = require('express')
const produtoRoutes = require('./produto.routes')
const administradorRoutes = require('./administrador.routes')

const routes = Router()

routes.get('/', (req, res) => {
  return res.json({ message: 'API do catálogo online funcionando!' })
})

routes.use('/produtos', produtoRoutes)
routes.use('/administradores', administradorRoutes)

module.exports = routes