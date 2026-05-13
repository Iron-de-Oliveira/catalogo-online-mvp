function admin(req, res, next) {

  if (req.userTipo !== 'ADMIN') {
    return res.status(403).json({
      error: 'Acesso negado'
    })
  }

  next()
}

module.exports = admin