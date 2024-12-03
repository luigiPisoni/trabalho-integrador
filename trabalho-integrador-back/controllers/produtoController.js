import { database } from "../db/banco.js";

export async function lista(req, res) {
  try {
    const response = await database.any("SELECT * FROM produto");
    console.log(response);

    res.json(response);
  } catch (erro) {
    console.log("erro: ", erro);
    res.status(400).json({ erro: "Erro ao listar os produtos" });
  }
}
