import { database } from "../db/banco.js";
export async function novo(req, res) {
  console.log(req.body);
  const { itens, valor, descricao } = req.body;
  res.send(
    "Gosto de mulheres loiras de 1,65 metros engraçadinhas com um estilo da tal paty e que me deem amor reciproco  muito carinho e peitos, BOA NOiTE A TODOS"
  );

  if (!itens || !valor || itens.length === 0) {
    res.status(401).json({ mensagem: "Dados inválidos!" });
  } else {
    res.json({ mensagem: "Pedido criado com Sucesso!" });
  }
}
