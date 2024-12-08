import { database } from "../db/banco.js";

export async function listaProduto(req, res) {
  try {
    const response = await database.any(
      "SELECT codpdt, nome, valor FROM produto"
    );
    res.json(response);
  } catch (erro) {
    console.log("erro: ", erro);
    res.status(400).json({ erro: "Erro ao listar os produtos" });
  }
}
export async function novo(req, res) {
  console.log(req.body);

  // return;
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
}
export async function deletar(req, res) {
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
}
export async function atualizar(req, res) {
  const { codpdt } = req.params;
  var { nome, valor } = req.body;

  if (valor && parseFloat(valor) < 0) {
    return res
      .status(400)
      .send({ mensagem: "O valor não pode ser negativo mano" });
  }

  try {
    const produtoExistente = await database.oneOrNone(
      "SELECT nome, valor FROM produto WHERE codpdt = $1;",
      [codpdt]
    );

    if (!produtoExistente) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }

    nome = nome || produtoExistente.nome;
    valor = valor || produtoExistente.valor;

    await database.none(
      "UPDATE produto SET nome = $1, valor = $2 WHERE codpdt = $3;",
      [nome, valor, codpdt]
    );

    res.status(200).json({ mensagem: "Produto atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar produto: ", error);
    res
      .status(500)
      .json({ mensagem: "Erro no servidor ao tentar atualizar o produto" });
  }
}
