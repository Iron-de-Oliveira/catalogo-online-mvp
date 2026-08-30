const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../config/prisma')

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validarCadastro({ nome, email, senha }) {
  const errors = {}

  if (typeof nome !== 'string' || nome.length < 2 || nome.length > 100) {
    errors.nome = 'O nome deve ter entre 2 e 100 caracteres.'
  }

  if (typeof email !== 'string' || email.length > 254 || !EMAIL_REGEX.test(email)) {
    errors.email = 'Informe um e-mail válido.'
  }

  if (typeof senha !== 'string' || senha.length < 8 || senha.length > 72) {
    errors.senha = 'A senha deve ter entre 8 e 72 caracteres.'
  } else if (!/[a-z]/.test(senha) || !/[A-Z]/.test(senha) || !/\d/.test(senha) || !/[^A-Za-z0-9]/.test(senha)) {
    errors.senha = 'A senha deve conter letra maiúscula, minúscula, número e caractere especial.'
  }

  return errors
}

class AuthController {
  async register(req, res) {
    try {
      const { nome, email, senha } = req.body || {}

      const dadosCadastro = {
        nome: typeof nome === 'string' ? nome.trim().replace(/\s+/g, ' ') : nome,
        email: typeof email === 'string' ? email.trim().toLowerCase() : email,
        senha
      }

      const errors = validarCadastro(dadosCadastro)

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          error: 'Corrija os campos informados.',
          errors
        })
      }

      const usuarioExiste = await prisma.usuario.findUnique({
        where: {
          email: dadosCadastro.email
        }
      })

      if (usuarioExiste) {
        return res.status(400).json({
          error: 'Já existe uma conta com este e-mail.',
          errors: {
            email: 'Este e-mail já está em uso.'
          }
        })
      }

      const senhaHash = await bcrypt.hash(dadosCadastro.senha, 10)

      const usuario = await prisma.usuario.create({
        data: {
          nome: dadosCadastro.nome,
          email: dadosCadastro.email,
          senha: senhaHash
        }
      })

      return res.status(201).json({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      })
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return res.status(400).json({
          error: 'Já existe uma conta com este e-mail.',
          errors: {
            email: 'Este e-mail já está em uso.'
          }
        })
      }

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
      } catch (error) {
        senhaCorreta = false
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
