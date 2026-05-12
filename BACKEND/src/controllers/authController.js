const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../config/prisma')

class AuthController {
  async register(req, res) {
    try {
      const { nome, email, senha } = req.body

      const usuarioExiste = await prisma.usuario.findUnique({
        where: {
          email
        }
      })

      if (usuarioExiste) {
        return res.status(400).json({
          error: 'Usuário já existe'
        })
      }

      const senhaHash = await bcrypt.hash(senha, 10)

      const usuario = await prisma.usuario.create({
        data: {
          nome,
          email,
          senha: senhaHash
        }
      })

      return res.status(201).json({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      })
    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao cadastrar usuário'
      })
    }
  }

  async login(req, res) {
    try {
      const { email, senha } = req.body

      const usuario = await prisma.usuario.findUnique({
        where: {
          email
        }
      })

      if (!usuario) {
        return res.status(400).json({
          error: 'Usuário não encontrado'
        })
      }

      const senhaCorreta = await bcrypt.compare(
        senha,
        usuario.senha
      )

      if (!senhaCorreta) {
        return res.status(400).json({
          error: 'Senha inválida'
        })
      }

      const token = jwt.sign(
        {
          id: usuario.id
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '7d'
        }
      )

      return res.status(200).json({
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email
        }
      })
    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao fazer login'
      })
    }
  }
}

module.exports = new AuthController()