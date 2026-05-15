const prisma = require('../config/prisma')

class ProdutoController {
  // listar todos os produtos cadastrados
  async listar(req, res) {
  try {
    const produtos = await prisma.produto.findMany()

    return res.status(200).json(produtos)
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      error: 'Erro ao listar produtos.'
    })
  }
}

  // criar um novo produto
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

  // listar produtos por categoria
  async listarPorCategoria(req, res) {
    try {
      const { categoria } = req.params
      const produtos = await prisma.produto.findMany({
        where: {
          categoria
        }
      })  
      return res.status(200).json(produtos)
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        error: 'Erro ao listar produtos por categoria.'
      })
    }
  }

  // listar produto por ID
  async listarPorId(req, res) {
    try {
      const { id } = req.params
      const produto = await prisma.produto.findUnique({
        where: {
          id: parseInt(id)
        } 
      })
      if (!produto) {
        return res.status(404).json({
          error: 'Produto não encontrado.'  
        })
      }
      return res.status(200).json(produto)
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        error: 'Erro ao listar produto por ID.'
      })
    }
  }

  // atualizar produto por ID
  async atualizar(req, res) {
    try {
      const { id } = req.params
      const {
        nome,
        categoria,
        estoque,
        descricao,
        foto,
        preco
      } = req.body
      const produto = await prisma.produto.update({
        where: {
          id: parseInt(id)
        },
        data: {
          nome,
          categoria,
          estoque,
          descricao,
          foto, 
          preco
        }
      })
      return res.status(200).json(produto)
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        error: 'Erro ao atualizar produto.'
      })
    }
  }

  // deletar produto por ID
  async deletar(req, res) {
    try {
      const { id } = req.params
      await prisma.produto.delete({
        where: {
          id: parseInt(id)
        }
      })
      return res.status(200).json({
        message: 'Produto deletado com sucesso.'
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        error: 'Erro ao deletar produto.'
      })
    }
  }
}

module.exports = new ProdutoController()