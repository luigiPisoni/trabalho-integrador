import express from 'express';
import { database } from '../db/banco.js';

const pedidoRouter = express.Router();

pedidoRouter.post('/novo', async (req, res) => {
  try {
    const { cpf, valor, datahora, descricao, tipoPagamento, produtos, pratos } = req.body;

    if (parseFloat(valor) < 0) {
      return res.status(400).json({ erro: 'Mulheres não são bem vindas no clube dos meninos!' });
    }

    await database.tx(async (tx) => {
      const criarPedido = await tx.one(
        'INSERT INTO pedido (pessoa_id, valor, datahora, descricao, status, tipo_pagamento) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
        [cpf, valor, datahora, descricao ?? null, 'pendente', tipoPagamento]
      );

      const criarPedidoProduto = produtos.map((produto) => {
        const { codigo, quantidade } = produto;
        return tx.none('INSERT INTO pedido_produto (pedido_codigo, produto_codigo, quantidade) VALUES ($1, $2, $3);', [
          criarPedido.codigo,
          codigo,
          quantidade,
        ]);
      });

      const criarPedidoPrato = pratos.map((prato) => {
        const { codigo, quantidade } = prato;
        return tx.none('INSERT INTO pedido_prato (pedido_codigo, prato_codigo, quantidade) VALUES ($1, $2, $3);', [
          criarPedido.codigo,
          codigo,
          quantidade,
        ]);
      });

      return tx.batch([criarPedido, ...criarPedidoProduto, ...criarPedidoPrato]);
    });

    res.status(201).json({ mensagem: 'Pedido criado com sucesso!' });
  } catch (errorLuigi) {
    console.error('erro: ', errorLuigi);
    res.status(400).json({ erro: 'Erro ao criar o pedido!' });
  }
});

pedidoRouter.get('/lista', async (req, res) => {
  try {
    const pedidos = await database.any(
      'SELECT codigo, pessoa_id, valor, datahora, descricao, status, tipo_pagamento FROM pedido;'
    );
    for (const pedido of pedidos) {
      const pessoa = await database.one('SELECT cpf, nome, endereco, cargo FROM pessoa WHERE cpf = $1;', [
        pedido.pessoa_id,
      ]);
      pedido.pessoa = pessoa;
      delete pedido.pessoa_id;

      const produtos = await database.any(
        'SELECT produto_codigo, quantidade, nome, valor FROM pedido_produto JOIN produto ON produto.codpdt = pedido_produto.produto_codigo WHERE pedido_codigo = $1;',
        [pedido.codigo]
      );

      const pratos = await database.any(
        'SELECT prato_codigo, quantidade, nome, valor FROM pedido_prato JOIN prato ON prato.codprt = pedido_prato.prato_codigo WHERE pedido_codigo = $1;',
        [pedido.codigo]
      );

      pedido.produtos = produtos;
      pedido.pratos = pratos;
    }

    res.status(200).json(pedidos);
  } catch (error) {
    console.error('erro: ', error);
    res.status(400).json({ erro: 'Erro ao buscar os pedidos!' });
  }
});

export default pedidoRouter;
