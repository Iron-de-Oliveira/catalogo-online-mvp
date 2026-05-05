const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "Backend rodando!" });
});

const PORT = 3333;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});