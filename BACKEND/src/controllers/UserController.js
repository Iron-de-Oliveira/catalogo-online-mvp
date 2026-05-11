const prisma = require("../config/prisma");

class UserController {

  // criar um novo usuário
  async criar(req, res) {
    try {

      const {
        nome,
        email,
        senha
      } = req.body

      if (!nome || !email || !senha) {
        return res.status(400).json({
          error: 'Preencha todos os campos obrigatórios.'
        })
      }

      const usuarioExiste = await prisma.cliente.findUnique({
        where: {
          email
        }
      })

      if (usuarioExiste) {
        return res.status(400).json({
          error: 'E-mail já cadastrado.'
        })
      }

      const usuario = await prisma.cliente.create({
        data: {
          nome,
          email,
          senha
        }
      })

      return res.status(201).json(usuario)

    } catch (error) {

      console.log(error)

      return res.status(500).json({
        error: 'Erro ao criar usuário.'
      })
    }
  }

  // encontrar todos os usuários cadastrados
  async listar(req, res) {
    try {

      const usuarios = await prisma.cliente.findMany()

      return res.status(200).json(usuarios)

    } catch (error) {

      console.log(error)

      return res.status(500).json({
        error: 'Erro ao listar usuários.'
      })
    }
  }

    // encontrar um usuário por ID
    async encontrarPorId(req, res) {
      try {
        const { id } = req.params

        const usuario = await prisma.cliente.findUnique({
          where: {
            id: parseInt(id)
          }
        })

        if (!usuario) {
          return res.status(404).json({
            error: 'Usuário não encontrado.'
          })
        }
        return res.status(200).json(usuario)
        } catch (error) {   
            console.log(error)
            return res.status(500).json({
                error: 'Erro ao encontrar usuário.'
            })
        }   
    }
    
    //encontrar um usuário por email
    async encontrarPorEmail(req, res) {
      try {
        const { email } = req.params
        
        const usuario = await prisma.cliente.findUnique({
          where: {
            email
          }
        })  
        if (!usuario) {
            return res.status(404).json({
                error: 'Usuário não encontrado.'
            })
        }   
        return res.status(200).json(usuario)
      } catch (error) {
        console.log(error)
        return res.status(500).json({
          error: 'Erro ao encontrar usuário.'
        })
      } 
    }

}

module.exports = new UserController()