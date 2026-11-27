const prisma = require('../config/prisma')

function obterProdutoId(valor) {
  const produtoId = Number(valor)
  return Number.isSafeInteger(produtoId) && produtoId > 0 ? produtoId : null
}

class ListaDesejosController {
  async listar(req, res) {
    try {
      const favoritos = await prisma.produtoFavorito.findMany({
        where: { usuarioId: req.userId },
        include: {
          produto: {
            include: {
              fotos: { orderBy: { ordem: 'asc' } }
            }
          }
        },
        orderBy: { criadoEm: 'desc' }
      })

      return res.status(200).json(favoritos)
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao carregar lista de desejos.' })
    }
  }

  async adicionar(req, res) {
    const produtoId = obterProdutoId(req.params.produtoId)
    if (!produtoId) {
      return res.status(400).json({ error: 'Produto inválido.' })
    }

    try {
      const produto = await prisma.produto.findUnique({
        where: { id: produtoId },
        select: { id: true }
      })

      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado.' })
      }

      const favorito = await prisma.produtoFavorito.upsert({
        where: {
          usuarioId_produtoId: { usuarioId: req.userId, produtoId }
        },
        create: { usuarioId: req.userId, produtoId },
        update: {},
        include: { produto: true }
      })

      return res.status(200).json(favorito)
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao adicionar produto à lista de desejos.' })
    }
  }

  async remover(req, res) {
    const produtoId = obterProdutoId(req.params.produtoId)
    if (!produtoId) {
      return res.status(400).json({ error: 'Produto inválido.' })
    }

    try {
      await prisma.produtoFavorito.deleteMany({
        where: { usuarioId: req.userId, produtoId }
      })

      return res.status(204).send()
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao remover produto da lista de desejos.' })
    }
  }
}

module.exports = new ListaDesejosController()
