import express from 'express';
import { database } from '../db/banco.js';

const pedidoRouter = express.Router();

pedidoRouter.post('/novo', async (req, res) => {
  try {
    const { cpf, valor, descricao, tipoPagamento, produtos, pratos } = req.body;

    if (parseFloat(valor) < 0) {
      return res.status(400).json({
        mensagem: 'Mulheres não são bem vindas no clube dos meninos!',
      });
    }

    await database.tx(async (tx) => {
      const criarPedido = await tx.one(
        'INSERT INTO pedido (cpf, valor, descricao, datahora, status, tipo_pagamento) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
        [cpf, valor, descricao ?? null, new Date(1000000).toISOString(), 'pendente', tipoPagamento]
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
  } catch (error) {
    console.error('mensagem: ', error);
    res.status(400).json({ mensagem: 'Erro ao criar o pedido!' });
  }
});

pedidoRouter.get('/lista', async (req, res) => {
  try {
    const pedidos = await database.any(
      'SELECT codigo, cpf, valor, datahora, descricao, status, tipo_pagamento FROM pedido;'
    );
    for (const pedido of pedidos) {
      const pessoa = await database.one('SELECT cpf, nome, endereco, cargo FROM pessoa WHERE cpf = $1;', [pedido.cpf]);
      pedido.pessoa = pessoa;
      delete pedido.cpf;

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
    console.error('mensagem: ', error);
    res.status(400).json({ mensagem: 'Erro ao buscar os pedidos!' });
  }
});

pedidoRouter.delete('/deletar/:codigo', async (req, res) => {
  const { codigo } = req.params;

  try {
    // Excluir o pedido pelo código
    const result = await database.result('DELETE FROM pedido WHERE codigo = $1;', [codigo]);

    // Verifica se o pedido foi encontrado
    if (result.rowCount === 0) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado.' });
    }

    res.status(200).json({ mensagem: 'Pedido deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar pedido:', error);
    res.status(500).json({ mensagem: 'Erro no servidor ao tentar deletar o pedido.' });
  }
});

pedidoRouter.put('/atualizar/:codigo', async (req, res) => {
  const { codigo } = req.params;

  var { valor, descricao, status, tipo_pagamento } = req.body;

  try {
    const pedidoExistente = await database.oneOrNone(
      'SELECT valor, descricao, status, tipo_pagamento FROM pedido WHERE codigo = $1;',
      [codigo]
    );

    if (!pedidoExistente) {
      return res.status(404).json({ mensagem: 'este codigo não existe meu MANO' });
    }

    valor = valor || pedidoExistente.valor;
    descricao = descricao || pedidoExistente.descricao;
    status = status || pedidoExistente.status;
    tipo_pagamento = tipo_pagamento || pedidoExistente.tipo_pagamento;

    await database.none(
      'UPDATE pedido SET valor = $1, descricao = $2, status = $3, tipo_pagamento = $4 WHERE codigo = $5;',
      [valor, descricao, status, tipo_pagamento, codigo]
    );

    res.status(200).json({ mensagem: 'Pedido atualizado meu parça' });
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    res.status(500).json({ mensagem: 'Erro no servidor ao tentar atualizar o pedido' });
  }
});

// adicionar produtos
pedidoRouter.put('/atualizar/add/produto/:cod', async (req, res) => {
  const { cod } = req.params;
  const { produtos } = req.body;

  try {
    const pedidoExistente = await database.oneOrNone('SELECT codigo FROM pedido WHERE codigo = $1;', [cod]);
    if (!pedidoExistente) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado' });
    }

    await database.tx(async (tx) => {
      const adicionarProdutos = produtos.map((produto) => {
        const { codigo, quantidade } = produto;
        return tx.none('INSERT INTO pedido_produto (pedido_codigo, produto_codigo, quantidade) VALUES ($1, $2, $3);', [
          cod,
          codigo,
          quantidade,
        ]);
      });
      return tx.batch(adicionarProdutos);
    });

    res.status(200).json({ mensagem: 'Produtos adicionados com sucesso' });
  } catch (error) {
    console.error('Erro ao adicionar produtos:', error);
    res.status(500).json({ mensagem: 'Erro no servidor ao tentar adicionar produtos' });
  }
});

// remover produtos
pedidoRouter.put('/atualizar/rem/produto/:cod', async (req, res) => {
  const { cod } = req.params;
  const { produtos } = req.body;

  try {
    const pedidoExistente = await database.oneOrNone('SELECT codigo FROM pedido WHERE codigo = $1;', [cod]);
    if (!pedidoExistente) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado' });
    }

    await database.tx(async (tx) => {
      const removerProdutos = produtos.map((codigo) => {
        return tx.none('DELETE FROM pedido_produto WHERE pedido_codigo = $1 AND produto_codigo = $2;', [cod, codigo]);
      });
      return tx.batch(removerProdutos);
    });

    res.status(200).json({ mensagem: 'Produtos removidos com sucesso' });
  } catch (error) {
    console.error('Erro ao remover produtos:', error);
    res.status(500).json({ mensagem: 'Erro no servidor ao tentar remover produtos' });
  }
});

// editar quantidade de produtos
pedidoRouter.put('/atualizar/edit/produto/:cod', async (req, res) => {
  const { cod } = req.params;
  const { produtos } = req.body;

  try {
    const pedidoExistente = await database.oneOrNone('SELECT codigo FROM pedido WHERE codigo = $1;', [cod]);
    if (!pedidoExistente) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado' });
    }

    await database.tx(async (tx) => {
      const editarProdutos = produtos.map((produto) => {
        const { codigo, quantidade } = produto;
        return tx.none('UPDATE pedido_produto SET quantidade = $1 WHERE pedido_codigo = $2 AND produto_codigo = $3;', [
          quantidade,
          cod,
          codigo,
        ]);
      });
      return tx.batch(editarProdutos);
    });

    res.status(200).json({ mensagem: 'Produtos editados com sucesso' });
  } catch (error) {
    console.error('Erro ao editar produtos:', error);
    res.status(500).json({ mensagem: 'Erro no servidor ao tentar editar produtos' });
  }
});

// adicionar pratos
pedidoRouter.put('/atualizar/add/prato/:cod', async (req, res) => {
  const { cod } = req.params;
  const { pratos } = req.body;

  try {
    const pedidoExistente = await database.oneOrNone('SELECT codigo FROM pedido WHERE codigo = $1;', [cod]);
    if (!pedidoExistente) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado' });
    }

    await database.tx(async (tx) => {
      const adicionarPratos = pratos.map((prato) => {
        const { codigo, quantidade } = prato;
        return tx.none('INSERT INTO pedido_prato (pedido_codigo, prato_codigo, quantidade) VALUES ($1, $2, $3);', [
          cod,
          codigo,
          quantidade,
        ]);
      });
      return tx.batch(adicionarPratos);
    });

    res.status(200).json({ mensagem: 'Pratos adicionados com sucesso' });
  } catch (error) {
    console.error('Erro ao adicionar pratos:', error);
    res.status(500).json({ mensagem: 'Erro no servidor ao tentar adicionar pratos' });
  }
});

// remover pratos
pedidoRouter.put('/atualizar/rem/prato/:cod', async (req, res) => {
  const { cod } = req.params;
  const { pratos } = req.body;

  try {
    const pedidoExistente = await database.oneOrNone('SELECT codigo FROM pedido WHERE codigo = $1;', [cod]);
    if (!pedidoExistente) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado' });
    }

    await database.tx(async (tx) => {
      const removerPratos = pratos.map((codigo) => {
        return tx.none('DELETE FROM pedido_prato WHERE pedido_codigo = $1 AND prato_codigo = $2;', [cod, codigo]);
      });
      return tx.batch(removerPratos);
    });

    res.status(200).json({ mensagem: 'Pratos removidos com sucesso' });
  } catch (error) {
    console.error('Erro ao remover pratos:', error);
    res.status(500).json({ mensagem: 'Erro no servidor ao tentar remover pratos' });
  }
});

// editar quantidade de pratos
pedidoRouter.put('/atualizar/edit/prato/:cod', async (req, res) => {
  const { cod } = req.params;
  const { pratos } = req.body;

  try {
    const pedidoExistente = await database.oneOrNone('SELECT codigo FROM pedido WHERE codigo = $1;', [cod]);
    if (!pedidoExistente) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado' });
    }

    await database.tx(async (tx) => {
      const editarPratos = pratos.map((prato) => {
        const { codigo, quantidade } = prato;
        return tx.none('UPDATE pedido_prato SET quantidade = $1 WHERE pedido_codigo = $2 AND prato_codigo = $3;', [
          quantidade,
          cod,
          codigo,
        ]);
      });
      return tx.batch(editarPratos);
    });

    res.status(200).json({ mensagem: 'Pratos editados com sucesso' });
  } catch (error) {
    console.error('Erro ao editar pratos:', error);
    res.status(500).json({ mensagem: 'Erro no servidor ao tentar editar pratos' });
  }
});

export default pedidoRouter;
