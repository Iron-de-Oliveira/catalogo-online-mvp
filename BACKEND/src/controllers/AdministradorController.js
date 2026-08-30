const prisma = require('../config/prisma')
const bcrypt = require('bcryptjs')

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

      return res.status(201).json({
        id: administrador.id,
        cpf: administrador.cpf
      })
    } catch (error) {
      console.log(error)

      return res.status(500).json({
        error: 'Erro ao criar administrador.'
      })
    }
  }
}

module.exports = new AdministradorController()
