import express from 'express';
import { lista } from '../controllers/pratoController.js';
import { database } from '../db/banco.js';

const pratoRouter = express.Router();

pratoRouter.get('/lista', lista);

pratoRouter.post('/novo', async (req, res) => {
  const { nome, valor, ingredientes } = req.body;

  // Validação inicial
  if (parseFloat(valor) < 0) {
    return res.status(400).json({ erro: 'O valor não pode ser negativo' });
  }

  if (!Array.isArray(ingredientes) || ingredientes.length === 0) {
    return res.status(400).json({ erro: 'É necessário informar ao menos um ingrediente' });
  }

  try {
    // Inicia uma transação
    await database.tx(async (tx) => {
      // Insere o prato e obtém o ID gerado
      const criarPrato = await tx.one(
        'INSERT INTO prato (nome, valor) VALUES ($1, $2) RETURNING *;',
        [nome, valor]
      );
      const codprt = criarPrato.codprt;

      // Valida e insere os ingredientes
      for (const ingrediente of ingredientes) {
        const { codigo, quantidade } = ingrediente;

        // Verifica se o ingrediente existe
        const ingredienteExiste = await tx.oneOrNone(
          'SELECT 1 FROM ingrediente WHERE codigo = $1;',
          [codigo]
        );

        if (!ingredienteExiste) {
          throw new Error(`Ingrediente com código ${codigo} não encontrado`);
        }

        // Insere na tabela prato_ingrediente
        await tx.none(
          'INSERT INTO prato_ingrediente (prato_codigo, ingrediente_codigo, quantidade) VALUES ($1, $2, $3);',
          [codprt, codigo, quantidade]
        );
      }
    });

    // Resposta de sucesso
    res.status(201).json({ mensagem: 'Prato cadastrado com sucesso' });
  } catch (error) {
    console.error('Erro ao cadastrar prato:', error);

    // Trata erros de ingrediente não encontrado
    if (error.message.includes('Ingrediente com código')) {
      return res.status(400).json({ erro: error.message });
    }

    res.status(500).json({ erro: 'Erro no servidor ao cadastrar o prato' });
  }
});

pratoRouter.delete('/deletar/:codprt', async (req, res) => {
  const { codprt } = req.params;

  try {
    // Excluir o prato pelo código
    const result = await database.result('DELETE FROM prato WHERE codprt = $1;', [codprt]);

    // Verifica se o prato foi encontrado
    if (result.rowCount === 0) {
      return res.status(404).json({ erro: 'Prato não encontrado' });
    }

    res.status(200).json({ mensagem: 'Prato deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar prato:', error);
    res.status(500).json({ erro: 'Erro no servidor ao tentar deletar o prato' });
  }
});


export default pratoRouter;
