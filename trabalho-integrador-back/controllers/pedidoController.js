import { database } from "../db/banco.js";
export async function novo(req, res) {
  try {
    let { cpf, valor, descricao, tipoPagamento, produtos, pratos } = req.body;
    if (parseFloat(valor) < 0) {
      return res.status(400).json({
        mensagem: "Houve um erro ao cadastrar seu pedido",
      });
    }

    await database.tx(async (tx) => {
      const criarPedido = await tx.one(
        "INSERT INTO pedido (cpf, valor, descricao, status, tipo_pagamento) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
        [cpf, valor, descricao ?? null, "pendente", tipoPagamento]
      );

      const criarPedidoProduto = produtos.map((produto) => {
        const { codpdt, quantidade = produto.qnt } = produto;
        return tx.none(
          "INSERT INTO pedido_produto (pedido_codigo, produto_codigo, quantidade) VALUES ($1, $2, $3);",
          [criarPedido.codigo, codpdt, quantidade]
        );
      });

      const criarPedidoPrato = pratos.map((prato) => {
        const { codprt, quantidade = prato.qnt } = prato;
        return tx.none(
          "INSERT INTO pedido_prato (pedido_codigo, prato_codigo, quantidade) VALUES ($1, $2, $3);",
          [criarPedido.codigo, codprt, quantidade]
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
}
export async function lista(req, res) {
  try {
    const pedidos = await database.any(
      "SELECT codigo, cpf, valor, datahora, descricao, status, tipo_pagamento FROM pedido ORDER BY CASE status WHEN 'preparando' THEN 1 WHEN 'pendente' THEN 2 WHEN 'saiu_entrega' THEN 3 WHEN 'entregue' THEN 4 WHEN 'cancelado' THEN 5 ELSE 6 END;"
    );

    // Verifica se pedidos foram encontrados
    if (!pedidos || pedidos.length === 0) {
      return res.status(404).json({ mensagem: "Nenhum pedido encontrado." });
    }

    for (const pedido of pedidos) {
      try {
        // Buscando a pessoa associada ao pedido
        const pessoa = await database.one(
          "SELECT cpf, nome, endereco, cargo FROM pessoa WHERE cpf = $1;",
          [pedido.cpf]
        );
        pedido.pessoa = pessoa;
        delete pedido.cpf;

        // Buscando os produtos associados ao pedido
        const produtos = await database.any(
          "SELECT produto_codigo, quantidade, nome, valor FROM pedido_produto JOIN produto ON produto.codpdt = pedido_produto.produto_codigo WHERE pedido_codigo = $1;",
          [pedido.codigo]
        );

        // Buscando os pratos associados ao pedido
        const pratos = await database.any(
          "SELECT prato_codigo, quantidade, nome, valor FROM pedido_prato JOIN prato ON prato.codprt = pedido_prato.prato_codigo WHERE pedido_codigo = $1;",
          [pedido.codigo]
        );

        pedido.produtos = produtos;
        pedido.pratos = pratos;
      } catch (innerError) {
        console.error(`Erro ao processar pedido ${pedido.codigo}:`, innerError);
        pedido.error = "Erro ao processar dados relacionados ao pedido";
      }
    }

    res.status(200).json(pedidos);
  } catch (error) {
    console.error("Erro ao buscar os pedidos:", error);
    res.status(400).json({ mensagem: "Erro ao buscar os pedidos!" });
  }
}

export async function deletar(req, res) {
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
}
export async function atualizar(req, res) {
  const { codigo } = req.params;

  var { valor, descricao, status, tipo_pagamento } = req.body;

  try {
    const pedidoExistente = await database.oneOrNone(
      "SELECT valor, descricao, status, tipo_pagamento FROM pedido WHERE codigo = $1;",
      [codigo]
    );

    if (!pedidoExistente) {
      return res
        .status(404)
        .json({ mensagem: "este codigo não existe meu MANO" });
    }

    valor = valor || pedidoExistente.valor;
    descricao = descricao || pedidoExistente.descricao;
    status = status || pedidoExistente.status;
    tipo_pagamento = tipo_pagamento || pedidoExistente.tipo_pagamento;

    await database.none(
      "UPDATE pedido SET valor = $1, descricao = $2, status = $3, tipo_pagamento = $4 WHERE codigo = $5;",
      [valor, descricao, status, tipo_pagamento, codigo]
    );

    res.status(200).json({ mensagem: "Pedido atualizado meu parça" });
  } catch (error) {
    console.error("Erro ao atualizar pedido:", error);
    res
      .status(500)
      .json({ mensagem: "Erro no servidor ao tentar atualizar o pedido" });
  }
}

export async function atualizar_status(req, res) {
  try {
    const { codigo, novo_status } = req.body;
    console.log(codigo, novo_status);

    await database.none("UPDATE pedido SET status = $1 WHERE codigo = $2", [
      novo_status,
      codigo,
    ]);

    res.json({ mensagem: "Status atualizado" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ mensagem: "Erro ao atualizar o status do pedido" });
  }
}
export async function add_produto(req, res) {
  const { cod } = req.params;
  const { produtos } = req.body;

  try {
    const pedidoExistente = await database.oneOrNone(
      "SELECT codigo FROM pedido WHERE codigo = $1;",
      [cod]
    );
    if (!pedidoExistente) {
      return res.status(404).json({ mensagem: "Pedido não encontrado" });
    }

    await database.tx(async (tx) => {
      const adicionarProdutos = produtos.map((produto) => {
        const { codigo, quantidade } = produto;
        return tx.none(
          "INSERT INTO pedido_produto (pedido_codigo, produto_codigo, quantidade) VALUES ($1, $2, $3);",
          [cod, codigo, quantidade]
        );
      });
      return tx.batch(adicionarProdutos);
    });

    res.status(200).json({ mensagem: "Produtos adicionados com sucesso" });
  } catch (error) {
    console.error("Erro ao adicionar produtos:", error);
    res
      .status(500)
      .json({ mensagem: "Erro no servidor ao tentar adicionar produtos" });
  }
}
export async function remove_produto(req, res) {
  const { cod } = req.params;
  const { produtos } = req.body;

  try {
    const pedidoExistente = await database.oneOrNone(
      "SELECT codigo FROM pedido WHERE codigo = $1;",
      [cod]
    );
    if (!pedidoExistente) {
      return res.status(404).json({ mensagem: "Pedido não encontrado" });
    }

    await database.tx(async (tx) => {
      const removerProdutos = produtos.map((codigo) => {
        return tx.none(
          "DELETE FROM pedido_produto WHERE pedido_codigo = $1 AND produto_codigo = $2;",
          [cod, codigo]
        );
      });
      return tx.batch(removerProdutos);
    });

    res.status(200).json({ mensagem: "Produtos removidos com sucesso" });
  } catch (error) {
    console.error("Erro ao remover produtos:", error);
    res
      .status(500)
      .json({ mensagem: "Erro no servidor ao tentar remover produtos" });
  }
}
export async function edita_produto(req, res) {
  const { cod } = req.params;
  const { produtos } = req.body;

  try {
    const pedidoExistente = await database.oneOrNone(
      "SELECT codigo FROM pedido WHERE codigo = $1;",
      [cod]
    );
    if (!pedidoExistente) {
      return res.status(404).json({ mensagem: "Pedido não encontrado" });
    }

    await database.tx(async (tx) => {
      const editarProdutos = produtos.map((produto) => {
        const { codigo, quantidade } = produto;
        return tx.none(
          "UPDATE pedido_produto SET quantidade = $1 WHERE pedido_codigo = $2 AND produto_codigo = $3;",
          [quantidade, cod, codigo]
        );
      });
      return tx.batch(editarProdutos);
    });

    res.status(200).json({ mensagem: "Produtos editados com sucesso" });
  } catch (error) {
    console.error("Erro ao editar produtos:", error);
    res
      .status(500)
      .json({ mensagem: "Erro no servidor ao tentar editar produtos" });
  }
}
export async function add_prato() {
  const { cod } = req.params;
  const { pratos } = req.body;

  try {
    const pedidoExistente = await database.oneOrNone(
      "SELECT codigo FROM pedido WHERE codigo = $1;",
      [cod]
    );
    if (!pedidoExistente) {
      return res.status(404).json({ mensagem: "Pedido não encontrado" });
    }

    await database.tx(async (tx) => {
      const adicionarPratos = pratos.map((prato) => {
        const { codigo, quantidade } = prato;
        return tx.none(
          "INSERT INTO pedido_prato (pedido_codigo, prato_codigo, quantidade) VALUES ($1, $2, $3);",
          [cod, codigo, quantidade]
        );
      });
      return tx.batch(adicionarPratos);
    });

    res.status(200).json({ mensagem: "Pratos adicionados com sucesso" });
  } catch (error) {
    console.error("Erro ao adicionar pratos:", error);
    res
      .status(500)
      .json({ mensagem: "Erro no servidor ao tentar adicionar pratos" });
  }
}
export async function remove_prato(req, res) {
  const { cod } = req.params;
  const { pratos } = req.body;

  try {
    const pedidoExistente = await database.oneOrNone(
      "SELECT codigo FROM pedido WHERE codigo = $1;",
      [cod]
    );
    if (!pedidoExistente) {
      return res.status(404).json({ mensagem: "Pedido não encontrado" });
    }

    await database.tx(async (tx) => {
      const removerPratos = pratos.map((codigo) => {
        return tx.none(
          "DELETE FROM pedido_prato WHERE pedido_codigo = $1 AND prato_codigo = $2;",
          [cod, codigo]
        );
      });
      return tx.batch(removerPratos);
    });

    res.status(200).json({ mensagem: "Pratos removidos com sucesso" });
  } catch (error) {
    console.error("Erro ao remover pratos:", error);
    res
      .status(500)
      .json({ mensagem: "Erro no servidor ao tentar remover pratos" });
  }
}
export async function edita_prato(req, res) {
  const { cod } = req.params;
  const { pratos } = req.body;

  try {
    const pedidoExistente = await database.oneOrNone(
      "SELECT codigo FROM pedido WHERE codigo = $1;",
      [cod]
    );
    if (!pedidoExistente) {
      return res.status(404).json({ mensagem: "Pedido não encontrado" });
    }

    await database.tx(async (tx) => {
      const editarPratos = pratos.map((prato) => {
        const { codigo, quantidade } = prato;
        return tx.none(
          "UPDATE pedido_prato SET quantidade = $1 WHERE pedido_codigo = $2 AND prato_codigo = $3;",
          [quantidade, cod, codigo]
        );
      });
      return tx.batch(editarPratos);
    });

    res.status(200).json({ mensagem: "Pratos editados com sucesso" });
  } catch (error) {
    console.error("Erro ao editar pratos:", error);
    res
      .status(500)
      .json({ mensagem: "Erro no servidor ao tentar editar pratos" });
  }
}
export async function status(req, res) {
  try {
    // Consulta SQL para contar pedidos por status
    const tabela = await database.query(
      "SELECT status, COUNT(*) as total FROM pedido WHERE DATE(datahora) = CURRENT_DATE GROUP BY status;"
    );

    // Retorne os dados com a chave 'tabela'
    res.json({ tabela });
  } catch (error) {
    console.error("Erro na consulta SQL:", error);
    res.status(500).json({ error: "Erro ao acessar o banco de dados." });
  }
}
export async function pedidosDoDia(req, res) {
  try {
    // Consulta para contar os pedidos feitos hoje
    const tabela = await database.query(
      "SELECT COUNT(*) as total FROM pedido WHERE DATE(datahora) = CURRENT_DATE;"
    );

    // Envia o total de pedidos do dia
    res.json({ totalPedidos: tabela[0].total });
  } catch (error) {
    console.error("Erro na consulta SQL:", error);
    res.status(500).json({ error: "Erro ao acessar o banco de dados." });
  }
}
export async function pedidosTotais(req, res) {
  try {
    // Consulta para contar todos os pedidos
    const tabela = await database.query(
      "SELECT COUNT(*) as total FROM pedido;"
    );

    // Envia o total de pedidos
    res.json({ totalPedidos: tabela[0].total });
  } catch (error) {
    console.error("Erro na consulta SQL:", error);
    res.status(500).json({ error: "Erro ao acessar o banco de dados." });
  }
}
