import express from "express";
import { lista } from "../controllers/produtoController.js";

const produtoRouter = express.Router();

produtoRouter.get("/lista", lista);

produtoRouter.post("/novo", async (req, res) => {
  const { nome, valor } = req.body;

  if (parseFloat(valor) < 0) {
    return res.status(400).send({
      mensagem:
        "O valor não pode ser negativo seu jumento vai pagar pra comprar",
    });
  }

  try {
    await database.none("INSERT INTO produto (nome, valor) VALUES ($1, $2);", [
      nome,
      valor,
    ]);
    res.status(201).json({ mensagem: "Produto cadastrado com sucesso" });
  } catch (error) {
    console.error("mensagem: ", error);
    res.status(400).json({ mensagem: "Erro ao cadastrar o produto" });
  }
});

produtoRouter.delete("/deletar/:codprt", async (req, res) => {
  const { codpdt } = req.params;

  try {
    const result = await database.result(
      "DELETE FROM produto WHERE codpdt = $1;",
      [codpdt]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }

    res.status(200).json({ mensagem: "Produto foi deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar produto: ", error);
    res
      .status(500)
      .json({ mensagem: "Erro no servidor ao tentar deletar o produto" });
  }
});

export default produtoRouter;
