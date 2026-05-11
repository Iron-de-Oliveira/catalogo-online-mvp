const prisma = require('../config/prisma')

class ProdutoController {
  async listar(req, res) {
    try {
      const produtos = await prisma.produto.findMany()

      return res.status(200).json(produtos)
    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao listar produtos.'
      })
    }
  }

  async criar(req, res) {
    try {
      const {
        nome,
        categoria,
        estoque,
        descricao,
        foto,
        preco,
        idAdministrador
      } = req.body

      if (!nome || !categoria || estoque === undefined || !foto || !preco || !idAdministrador) {
        return res.status(400).json({
          error: 'Por favor, preencha todos os campos obrigatórios.'
        })
      }

      const produto = await prisma.produto.create({
        data: {
        nome,
        categoria,
        estoque,
        descricao,
        foto,
        preco,
        administrador: {
            connect: {
            id: idAdministrador
          }
        }
      }
    })

    return res.status(201).json(produto)
    } catch (error) {
      console.log(error)

      return res.status(500).json({
        error: 'Erro ao criar produto.'
      })
    }
  }
}

module.exports = new ProdutoController()