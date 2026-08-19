const prisma = require('../config/prisma')
const supabase = require('../config/supabase')

const uploadImagem = async (file) => {
  if (!file) {
    return null
  }

  const extensao = file.originalname.split('.').pop().toLowerCase()

  const nomeArquivo = `${Date.now()}-${Math.round(
    Math.random() * 1E9
  )}.${extensao}`

  const caminho = `produtos/${nomeArquivo}`

  const { error } = await supabase.storage
    .from('produtos')
    .upload(caminho, file.buffer, {
      contentType: file.mimetype,
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Erro ao enviar imagem para o Supabase:', error)
    throw error
  }

  const { data } = supabase.storage
    .from('produtos')
    .getPublicUrl(caminho)

  return data.publicUrl
}

const excluirImagemSupabase = async (url) => {
  if (!url || !url.includes('/storage/v1/object/public/produtos/')) {
    return
  }

  try {
    const caminho = url.split('/storage/v1/object/public/produtos/')[1]

    const { error } = await supabase.storage
      .from('produtos')
      .remove([caminho])

    if (error) {
      console.error('Erro ao excluir imagem do Supabase:', error)
    }
  } catch (error) {
    console.error('Erro ao processar exclusão da imagem:', error)
  }
}

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
        preco,
        idAdministrador
      } = req.body

      if (
        !nome ||
        !categoria ||
        !estoque ||
        !descricao ||
        !preco ||
        !idAdministrador
      ) {
        return res.status(400).json({
          error: 'Preencha todos os campos obrigatórios.'
        })
      }

      const fotoUrl = await uploadImagem(req.file)

      const produto = await prisma.produto.create({
        data: {
          nome,

          categoria: categoria.toUpperCase(),

          estoque: parseInt(estoque),

          descricao,

          preco: parseFloat(preco),

          foto: fotoUrl,

          administrador: {
            connect: {
              id: Number(idAdministrador)
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

      const produtoAtual = await prisma.produto.findUnique({
        where: {
          id: parseInt(id)
        }
      })

      if (!produtoAtual) {
        return res.status(404).json({
          error: 'Produto não encontrado.'
        })
      }

      const {
        nome,
        categoria,
        estoque,
        descricao,
        preco
      } = req.body

      let foto = produtoAtual.foto

      // Se uma nova imagem foi enviada,
      // envia para o Supabase
      if (req.file) {

        foto = await uploadImagem(req.file)

        // Remove a imagem antiga do Supabase
        await excluirImagemSupabase(produtoAtual.foto)
      }

      const produto = await prisma.produto.update({
        where: {
          id: parseInt(id)
        },

        data: {
          nome,
          categoria,
          estoque: Number(estoque),
          descricao,
          foto,
          preco: Number(preco)
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

      // Remove a imagem do Supabase
      await excluirImagemSupabase(produto.foto)

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