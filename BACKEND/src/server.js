require('dotenv').config()

const express = require('express')
const cors = require('cors')
const path = require('path')
const routes = require('./routes/routes.router')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.use(routes)

const PORT = process.env.PORT || 3333

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})