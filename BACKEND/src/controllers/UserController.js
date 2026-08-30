const bcrypt = require('bcryptjs')
const prisma = require('../config/prisma')

class UserController {
  async encontrarPorId(req, res) {
    try {
      if (req.params.id !== req.userId) {
        return res.status(403).json({ error: 'Acesso não autorizado.' })
      }

      const usuario = await prisma.usuario.findUnique({
        where: { id: req.userId },
        select: { id: true, nome: true, email: true }
      })

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado.' })
      }

      return res.status(200).json(usuario)
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao encontrar usuário.' })
    }
  }

  async encontrarPorEmail(req, res) {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { email: req.params.email.toLowerCase() },
        select: { id: true, nome: true, email: true }
      })

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado.' })
      }

      if (usuario.id !== req.userId) {
        return res.status(403).json({ error: 'Acesso não autorizado.' })
      }

      return res.status(200).json(usuario)
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao encontrar usuário.' })
    }
  }

  async deletarPorEmail(req, res) {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { email: req.params.email.toLowerCase() },
        select: { id: true }
      })

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado.' })
      }

      if (usuario.id !== req.userId) {
        return res.status(403).json({ error: 'Acesso não autorizado.' })
      }

      await prisma.usuario.delete({ where: { id: req.userId } })
      return res.status(200).json({ message: 'Usuário deletado com sucesso.' })
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar usuário.' })
    }
  }

  async atualizarPorEmail(req, res) {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { email: req.params.email.toLowerCase() },
        select: { id: true }
      })

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado.' })
      }

      if (usuario.id !== req.userId) {
        return res.status(403).json({ error: 'Acesso não autorizado.' })
      }

      const { nome, senha, email: novoEmail } = req.body || {}
      const dadosAtualizacao = {}

      if (typeof nome === 'string' && nome.trim().length >= 2) {
        dadosAtualizacao.nome = nome.trim().replace(/\s+/g, ' ')
      }

      if (typeof senha === 'string' && senha.length > 0) {
        if (senha.length < 8 || senha.length > 72) {
          return res.status(400).json({ error: 'A senha deve ter entre 8 e 72 caracteres.' })
        }

        if (!/[a-z]/.test(senha) || !/[A-Z]/.test(senha) || !/\d/.test(senha) || !/[^A-Za-z0-9]/.test(senha)) {
          return res.status(400).json({
            error: 'A senha deve conter letra maiúscula, minúscula, número e caractere especial.'
          })
        }
        dadosAtualizacao.senha = await bcrypt.hash(senha, 10)
      }

      if (typeof novoEmail === 'string' && novoEmail.trim().length > 0) {
        dadosAtualizacao.email = novoEmail.trim().toLowerCase()
      }

      if (Object.keys(dadosAtualizacao).length === 0) {
        return res.status(400).json({ error: 'Informe ao menos um campo válido para atualizar.' })
      }

      const usuarioAtualizado = await prisma.usuario.update({
        where: { id: req.userId },
        data: dadosAtualizacao,
        select: { id: true, nome: true, email: true }
      })

      return res.status(200).json(usuarioAtualizado)
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Novo e-mail já está cadastrado.' })
      }

      return res.status(500).json({ error: 'Erro ao atualizar usuário.' })
    }
  }
}

module.exports = new UserController()
