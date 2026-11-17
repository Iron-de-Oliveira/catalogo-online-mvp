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

const obterArquivos = (req) => [
  ...(req.files?.foto || []),
  ...(req.files?.fotos || [])
]

const uploadImagens = async (arquivos) => {
  const urls = []

  try {
    for (const arquivo of arquivos) {
      urls.push(await uploadImagem(arquivo))
    }

    return urls
  } catch (error) {
    await Promise.all(urls.map(excluirImagemSupabase))
    throw error
  }
}

const incluirFotos = {
  fotos: {
    orderBy: { ordem: 'asc' }
  }
}

class ProdutoController {

  // listar todos os produtos cadastrados
  async listar(req, res) {
    try {
      const produtos = await prisma.produto.findMany({
        include: incluirFotos
      })

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
        preco
      } = req.body

      if (
        !nome ||
        !categoria ||
        !estoque ||
        !descricao ||
        !preco
      ) {
        return res.status(400).json({
          error: 'Preencha todos os campos obrigatórios.'
        })
      }

      const arquivos = obterArquivos(req)

      if (!arquivos.length) {
        return res.status(400).json({
          error: 'Envie pelo menos uma foto do produto.'
        })
      }

      if (arquivos.length > 10) {
        return res.status(400).json({
          error: 'Envie no máximo 10 fotos por produto.'
        })
      }

      const urls = await uploadImagens(arquivos)

      try {
        const produto = await prisma.produto.create({
          data: {
            nome,

            categoria: categoria.toUpperCase(),

            estoque: parseInt(estoque),

            descricao,

            preco: parseFloat(preco),

            foto: urls[0],
            fotos: {
              create: urls.map((url, ordem) => ({ url, ordem }))
            },

            administrador: {
              connect: {
                id: Number(req.userId)
              }
            }
          },
          include: incluirFotos
        })

        return res.status(201).json(produto)
      } catch (error) {
        await Promise.all(urls.map(excluirImagemSupabase))
        throw error
      }

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
        },
        include: incluirFotos
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
        },
        include: incluirFotos
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

      const arquivos = obterArquivos(req)

      if (arquivos.length > 10) {
        return res.status(400).json({
          error: 'Envie no máximo 10 fotos por atualização.'
        })
      }

      const urlsEnviadas = await uploadImagens(arquivos)
      const possuiFotoPrincipalNova = Boolean(req.files?.foto?.length)
      const urlFotoPrincipalNova = possuiFotoPrincipalNova
        ? urlsEnviadas[0]
        : null
      const urlsNovas = urlsEnviadas.slice(possuiFotoPrincipalNova ? 1 : 0)

      try {
        const produto = await prisma.$transaction(async (transaction) => {
          let foto = req.body.foto || produtoAtual.foto

          if (urlFotoPrincipalNova) {
            foto = urlFotoPrincipalNova
          }

          const produtoAtualizado = await transaction.produto.update({
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

          if (foto !== produtoAtual.foto) {
            const imagemPrincipal = await transaction.produtoImagem.findFirst({
              where: {
                produtoId: produtoAtual.id,
                url: produtoAtual.foto
              }
            })

            if (imagemPrincipal) {
              await transaction.produtoImagem.update({
                where: { id: imagemPrincipal.id },
                data: { url: foto }
              })
            } else {
              await transaction.produtoImagem.create({
                data: {
                  produtoId: produtoAtual.id,
                  url: foto,
                  ordem: 0
                }
              })
            }
          }

          if (urlsNovas.length) {
            const quantidadeFotos = await transaction.produtoImagem.count({
              where: { produtoId: produtoAtual.id }
            })

            await transaction.produtoImagem.createMany({
              data: urlsNovas.map((url, index) => ({
                produtoId: produtoAtual.id,
                url,
                ordem: quantidadeFotos + index
              }))
            })
          }

          return transaction.produto.findUnique({
            where: { id: produtoAtualizado.id },
            include: incluirFotos
          })
        })

        if (urlFotoPrincipalNova) {
          await excluirImagemSupabase(produtoAtual.foto)
        }

        return res.status(200).json(produto)
      } catch (error) {
        await Promise.all(urlsEnviadas.map(excluirImagemSupabase))
        throw error
      }

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
        },
        include: incluirFotos
      })

      if (!produto) {
        return res.status(404).json({
          error: 'Produto não encontrado.'
        })
      }

      await prisma.produto.delete({
        where: {
          id: parseInt(id)
        }
      })

      await Promise.all([
        produto.foto,
        ...produto.fotos.map((imagem) => imagem.url)
      ].map(excluirImagemSupabase))

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
