const prisma = require('../config/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class AdministradorController {
  async criar(req, res) {
  try {
    const { cpf, senha } = req.body

    if (!cpf || !senha) {
      return res.status(400).json({
        error: 'Por favor, preencha todos os campos obrigatórios.'
      })
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    const administrador = await prisma.administrador.create({
      data: {
        cpf,
        senha: senhaHash
      }
    })

    return res.status(201).json(administrador)
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      error: 'Erro ao criar administrador.'
    })
  }
}
async login(req, res) {
  try {
    const { cpf, senha } = req.body

    const administrador = await prisma.administrador.findUnique({
      where: {
        cpf
      }
    })

    if (!administrador) {
      return res.status(400).json({
        error: 'Administrador não encontrado.'
      })
    }

    const senhaValida = await bcrypt.compare(
      senha,
      administrador.senha
    )

    if (!senhaValida) {
      return res.status(400).json({
        error: 'Senha inválida.'
      })
    }

    const token = jwt.sign(
      {
        id: administrador.id,
        tipo: 'ADMIN'
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
      error: 'Erro ao fazer login.'
    })
  }
}
}

module.exports = new AdministradorController()