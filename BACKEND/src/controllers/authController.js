const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../config/prisma')

class AuthController {
  async register(req, res) {
    try {
      const { nome, email, senha } = req.body || {}

      const camposObrigatoriosPreenchidos = [nome, email, senha].every(
        (campo) => typeof campo === 'string' && campo.trim().length > 0
      )

      if (!camposObrigatoriosPreenchidos) {
        return res.status(400).json({
          error: 'Preencha todos os campos obrigatórios.'
        })
      }

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

  async loginAdmin(req, res) {
    try {
      const { cpf, senha } = req.body

      const administrador = await prisma.administrador.findUnique({
        where: {
          cpf
        }
      })

      if (!administrador) {
        return res.status(400).json({
          error: 'Administrador não encontrado'
        })
      }

      let senhaCorreta = false

      try {
        senhaCorreta = await bcrypt.compare(senha, administrador.senha)
      } catch (e) {
        senhaCorreta = false
      }

      // fallback para casos onde a senha foi salva sem hash
      if (!senhaCorreta) {
        senhaCorreta = senha === administrador.senha
      }

      if (!senhaCorreta) {
        return res.status(400).json({
          error: 'Senha inválida'
        })
      }

      const token = jwt.sign(
        {
          id: administrador.id,
          role: 'admin'
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '7d'
        }
      )

      return res.status(200).json({
        token,
        administrador: {
          id: administrador.id,
          cpf: administrador.cpf
        }
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        error: 'Erro ao fazer login do administrador'
      })
    }
  }
}

module.exports = new AuthController()
