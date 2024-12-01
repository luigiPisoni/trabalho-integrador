import express from "express";
import banco from "../banco.js";
const router = express.Router();

const funcionarios = [
  {
    nome: "luigi",
    data_nascimento: "20/02/2000",
    salario: "2200",
  },
];

router.get("/listagem", async(req, res) => {
  try {
    const pessoas = await banco.query('SELECT * FROM pessoa;');
    const resultado = pessoas.rows;
    res.json(resultado);
  } catch (erro) {
  res.status(400).send("Erro ao listar pessoas")
  }
});

router.post("/cadastro",async (req, res) => {
  try {
    const { nome, cpf, senha, cargo, endereco }= req.body;
    const resultado = await banco.query("INSERT INTO pessoa (cpf, nome, senha, cargo, endereco) VALUES ($1, $2, $3, $4, $5);", [cpf, nome, senha, cargo, endereco]);
    res.json(resultado.rowCount == 1);
  } catch (erro) {
  res.status(400).send("Erro ao inserir usuario")
  }
});

export default router;
