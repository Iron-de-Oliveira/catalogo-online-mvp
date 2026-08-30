const jwt = require('jsonwebtoken')

function auth(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      error: 'Token não fornecido'
    })
  }

  const [tipo, token] = authHeader.split(' ')

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({
      error: 'Token inválido'
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.userId = decoded.id
    req.user = decoded

    next()
  } catch (error) {
    return res.status(401).json({
      error: 'Token inválido'
    })
  }
}

module.exports = auth
