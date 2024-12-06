import express from "express";
import { database } from "../db/banco.js";

const pedidoRouter = express.Router();

pedidoRouter.post("/novo", async (req, res) => {
  try {
    console.log(req.body);

    const { cpf, valor, descricao, tipoPagamento, produtos, pratos } = req.body;

    if (parseFloat(valor) < 0) {
      return res.status(400).json({
        mensagem: "Mulheres não são bem vindas no clube dos meninos!",
      });
    }

    await database.tx(async (tx) => {
      const criarPedido = await tx.one(
        "INSERT INTO pedido (cpf, valor, descricao, status, tipo_pagamento) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
        [cpf, valor, descricao ?? null, "pendente", tipoPagamento]
      );

      const criarPedidoProduto = produtos.map((produto) => {
        const { codigo, quantidade } = produto;
        return tx.none(
          "INSERT INTO pedido_produto (pedido_codigo, produto_codigo, quantidade) VALUES ($1, $2, $3);",
          [criarPedido.codigo, codigo, quantidade]
        );
      });

      const criarPedidoPrato = pratos.map((prato) => {
        const { codigo, quantidade } = prato;
        return tx.none(
          "INSERT INTO pedido_prato (pedido_codigo, prato_codigo, quantidade) VALUES ($1, $2, $3);",
          [criarPedido.codigo, codigo, quantidade]
        );
      });

      return tx.batch([
        criarPedido,
        ...criarPedidoProduto,
        ...criarPedidoPrato,
      ]);
    });

    res.status(201).json({ mensagem: "Pedido criado com sucesso!" });
  } catch (error) {
    console.error("mensagem: ", error);
    res.status(400).json({ mensagem: "Erro ao criar o pedido!" });
  }
});

pedidoRouter.get("/lista", async (req, res) => {
  try {
    const pedidos = await database.any(
      "SELECT codigo, cpf, valor, datahora, descricao, status, tipo_pagamento FROM pedido;"
    );
    for (const pedido of pedidos) {
      const pessoa = await database.one(
        "SELECT cpf, nome, endereco, cargo FROM pessoa WHERE cpf = $1;",
        [pedido.cpf]
      );
      pedido.pessoa = pessoa;
      delete pedido.cpf;

      const produtos = await database.any(
        "SELECT produto_codigo, quantidade, nome, valor FROM pedido_produto JOIN produto ON produto.codpdt = pedido_produto.produto_codigo WHERE pedido_codigo = $1;",
        [pedido.codigo]
      );

      const pratos = await database.any(
        "SELECT prato_codigo, quantidade, nome, valor FROM pedido_prato JOIN prato ON prato.codprt = pedido_prato.prato_codigo WHERE pedido_codigo = $1;",
        [pedido.codigo]
      );

      pedido.produtos = produtos;
      pedido.pratos = pratos;
    }

    res.status(200).json(pedidos);
  } catch (error) {
    console.error("mensagem: ", error);
    res.status(400).json({ mensagem: "Erro ao buscar os pedidos!" });
  }
});

pedidoRouter.delete("/deletar/:codigo", async (req, res) => {
  const { codigo } = req.params;

  try {
    // Excluir o pedido pelo código
    const result = await database.result(
      "DELETE FROM pedido WHERE codigo = $1;",
      [codigo]
    );

    // Verifica se o pedido foi encontrado
    if (result.rowCount === 0) {
      return res.status(404).json({ mensagem: "Pedido não encontrado." });
    }

    res.status(200).json({ mensagem: "Pedido deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar pedido:", error);
    res
      .status(500)
      .json({ mensagem: "Erro no servidor ao tentar deletar o pedido." });
  }
});

export default pedidoRouter;
