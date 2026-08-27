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

  // deletar um usuário por email
  async deletarPorEmail(req, res) {
    try {
      const { email } = req.params
      const usuario = await prisma.cliente.delete({
        where: {
          email
        }
      })
      if (!usuario) {
        return res.status(404).json({
          error: 'Usuário não encontrado.'
        })
      }
      return res.status(200).json({
        message: 'Usuário deletado com sucesso.'
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        error: 'Erro ao deletar usuário.'
      })
    }
  }

  // atualizar um usuário por email
  async atualizarPorEmail(req, res) {
    try {
      const { email } = req.params;
      const { nome, senha, email: novoEmail } = req.body;

      const dadosAtualizacao = {};

      if (nome) {
        dadosAtualizacao.nome = nome;
      }

      if (senha) {
        dadosAtualizacao.senha = senha;
      }

      if (novoEmail && novoEmail !== email) {
        const emailExiste = await prisma.usuario.findUnique({
          where: {
            email: novoEmail
          }
        });

        if (emailExiste) {
          return res.status(400).json({
            error: "Novo e-mail já está cadastrado."
          });
        }

        dadosAtualizacao.email = novoEmail;
      }

      const usuario = await prisma.usuario.update({
        where: {
          email
        },
        data: dadosAtualizacao
      });

      return res.status(200).json({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      });

    } catch (error) {
      console.log(error);

      return res.status(500).json({
        error: "Erro ao atualizar usuário."
      });
    }
  }



}

module.exports = new UserController()