import express from "express";

const router = express.Router();

const funcionarios = [
  {
    nome: "luigi",
    data_nascimento: "20/02/2000",
    salario: "2200",
  },
];

router.get("/listagem", (req, res) => {
  res.json(funcionarios);
});

router.post("/cadastro", (req, res) => {
  let novoFuncionario = req.body;

  res.json(novoFuncionario);
});
