import { database } from "../db/banco.js";
// import { hashPassword, verifyHash } from "../auth/auth.js";

export async function listaPrato(req, res) {
  try {
    // res.json(pratos);
    const pratos = await database.any("SELECT codprt, nome, valor FROM prato;");
    for (const prato of pratos) {
      const ingredientes = await database.any(
        "SELECT codigo, nome, unidade, quantidade FROM ingrediente JOIN prato_ingrediente ON prato_ingrediente.ingrediente_codigo = ingrediente.codigo WHERE prato_ingrediente.prato_codigo = $1;",
        [prato.codprt]
      );
      prato.ingredientes = ingredientes;
    }

    res.json(pratos);
  } catch (erro) {
    console.log("erro: ", erro);
    res.status(400).json({ erro: "Erro ao listar os pratos" });
  }
}
export async function novo(req, res) {
  console.log(req.body);
  // return;
  const { nome, valor, ingredientes } = req.body;

  // Validação inicial
  if (parseFloat(valor) < 0) {
    return res.status(400).json({ mensagem: "O valor não pode ser negativo" });
  }

  if (!Array.isArray(ingredientes) || ingredientes.length === 0) {
    return res
      .status(400)
      .json({ mensagem: "É necessário informar ao menos um ingrediente" });
  }

  try {
    // Inicia uma transação
    await database.tx(async (tx) => {
      // Insere o prato e obtém o ID gerado
      const criarPrato = await tx.one(
        "INSERT INTO prato (nome, valor) VALUES ($1, $2) RETURNING *;",
        [nome, valor]
      );
      const codprt = criarPrato.codprt;

      // Valida e insere os ingredientes
      const inserirIngredientes = ingredientes.map(async (ingrediente) => {
        const { codigo, quantidade } = ingrediente;

        const ingredienteExiste = await tx.oneOrNone(
          "SELECT 1 FROM ingrediente WHERE codigo = $1;",
          [codigo]
        );

        if (!ingredienteExiste) {
          throw new Error(`Ingrediente com código ${codigo} não encontrado`);
        }

        // Insere na tabela prato_ingrediente
        return tx.none(
          "INSERT INTO prato_ingrediente (prato_codigo, ingrediente_codigo, quantidade) VALUES ($1, $2, $3);",
          [codprt, codigo, quantidade]
        );
      });

      return tx.batch([criarPrato, ...inserirIngredientes]);
    });

    // Resposta de sucesso
    res.status(201).json({ mensagem: "Prato cadastrado com sucesso" });
  } catch (error) {
    console.error("Erro ao cadastrar prato:", error);

    // Trata erros de ingrediente não encontrado
    if (error.message.includes("Ingrediente com código")) {
      return res.status(400).json({ mensagem: error.message });
    }

    res.status(500).json({ mensagem: "Erro no servidor ao cadastrar o prato" });
  }
}
export async function deletar(req, res) {
  const { codprt } = req.params;

  try {
    // Excluir o prato pelo código
    const result = await database.result(
      "DELETE FROM prato WHERE codprt = $1;",
      [codprt]
    );

    // Verifica se o prato foi encontrado
    if (result.rowCount === 0) {
      return res.status(404).json({ mensagem: "Prato não encontrado" });
    }

    res.status(200).json({ mensagem: "Prato deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar prato:", error);
    res
      .status(500)
      .json({ mensagem: "Erro no servidor ao tentar deletar o prato" });
  }
}

export async function atualizar(req, res) {
  console.log(req.params, req.body);

  const { codprt } = req.params;

  var { nome, valor } = req.body;

  if (valor && parseFloat(valor) < 0) {
    return res.status(400).json({ mensagem: "O valor não pode ser negativo" });
  }

  try {
    const pratoExistente = await database.oneOrNone(
      "SELECT nome, valor FROM prato WHERE codprt = $1;",
      [codprt]
    );
    if (!pratoExistente) {
      return res.status(404).json({ mensagem: "Prato não encontrado" });
    }

    nome = nome || pratoExistente.nome;
    valor = valor || pratoExistente.valor;

    await database.none(
      "UPDATE prato SET nome = $1, valor = $2 WHERE codprt = $3;",
      [nome, valor, codprt]
    );
    res.status(200).json({ mensagem: "Prato atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar prato:", error);
    res
      .status(500)
      .json({ mensagem: "Erro no servidor ao tentar atualizar o prato" });
  }
}
export async function add(req, res) {
  const { codprt } = req.params;
  const { ingredientes } = req.body;

  try {
    const pratoExistente = await database.oneOrNone(
      "SELECT valor FROM prato WHERE codprt = $1;",
      [codprt]
    );
    if (!pratoExistente) {
      return res.status(404).json({ mensagem: "Prato não encontrado" });
    }

    // Inicia uma transação
    await database.tx(async (tx) => {
      const inserirIngredientes = ingredientes.map(async (ingrediente) => {
        const { codigo, quantidade } = ingrediente;
        return await tx.none(
          "INSERT INTO prato_ingrediente (prato_codigo, ingrediente_codigo, quantidade) VALUES ($1, $2, $3);",
          [codprt, codigo, quantidade]
        );
      });

      return tx.batch([...inserirIngredientes]);
    });

    res
      .status(200)
      .json({ mensagem: "Adicionei vários matinhos no prato com sucesso" });
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ mensagem: "Deu erro porra" });
  }
}
export async function remove(req, res) {
  const { codprt } = req.params;
  const { ingredientes } = req.body;

  try {
    const pratoExistente = await database.oneOrNone(
      "SELECT valor FROM prato WHERE codprt = $1;",
      [codprt]
    );
    if (!pratoExistente) {
      return res.status(404).json({ mensagem: "Prato não encontrado" });
    }

    // Inicia uma transação
    await database.tx(async (tx) => {
      const removerIngredientes = ingredientes.map(async (codigo) => {
        return await tx.none(
          "DELETE FROM prato_ingrediente WHERE prato_codigo = $1 AND ingrediente_codigo = $2;",
          [codprt, codigo]
        );
      });

      return tx.batch([...removerIngredientes]);
    });

    res
      .status(200)
      .json({ mensagem: "Removi vários matinhos do prato com sucesso" });
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ mensagem: "Deu erro porra" });
  }
}
export async function ingredientes(req, res) {
  const { codprt } = req.params;
  const { ingredientes } = req.body;

  try {
    const pratoExistente = await database.oneOrNone(
      "SELECT valor FROM prato WHERE codprt = $1;",
      [codprt]
    );
    if (!pratoExistente) {
      return res.status(404).json({ mensagem: "Prato não encontrado" });
    }

    // Inicia uma transação
    await database.tx(async (tx) => {
      const atualizarIngredientes = ingredientes.map(async (ingrediente) => {
        const { codigo, quantidade } = ingrediente;
        return await tx.none(
          "UPDATE prato_ingrediente SET quantidade = $1 WHERE prato_codigo = $2 AND ingrediente_codigo = $3;",
          [quantidade, codprt, codigo]
        );
      });

      return tx.batch([...atualizarIngredientes]);
    });

    res
      .status(200)
      .json({ mensagem: "Atualizei vários matinhos do prato com sucesso" });
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ mensagem: "Deu erro porra" });
  }
}
