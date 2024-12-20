import { database } from '../db/banco.js';
import express from 'express';

const ingredienteRouter = express.Router();

ingredienteRouter.get('/lista', async (req, res) => {
  try {
    const response = await database.any('SELECT codigo, nome, unidade FROM ingrediente;');
    res.json(response);
  } catch (error) {
    console.error('mensagem: ', error);
    res.status(400).json({ mensagem: 'Erro ao listar os ingredientes' });
  }
});

ingredienteRouter.post('/novo', async (req, res) => {
  const { nome, unidade } = req.body;

  try {
    await database.query('INSERT INTO ingrediente (nome, unidade) VALUES ($1, $2);', [nome, unidade]);
    res.status(201).json({ mensagem: 'Ingrediente cadastrado com sucesso' });
  } catch (error) {
    console.error('mensagem: ', error);
    res.status(400).json({ mensagem: 'Erro ao cadastrar o ingrediente' });
  }
});

ingredienteRouter.delete('/deletar/:codigo', async (req, res) => {
  const { codigo } = req.params;

  try {
    // Excluir o ingrediente pelo código
    const result = await database.result('DELETE FROM ingrediente WHERE codigo = $1;', [codigo]);

    if (result.rowCount === 0) {
      return res.status(404).json({ mensagem: 'Ingrediente não encontrado' });
    }

    res.status(200).json({ mensagem: 'Ingrediente deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar ingrediente: ', error);
    res.status(500).json({ mensagem: 'Erro no servidor ao tentar deletar o ingrediente' });
  }
});

ingredienteRouter.put('/atualizar/:codigo', async (req, res) => {
  const { codigo } = req.params;
  var { nome, unidade } = req.body;

  try {
    const ingredienteExistente = await database.oneOrNone('SELECT nome, unidade FROM ingrediente WHERE codigo = $1;', [
      codigo,
    ]);

    if (!ingredienteExistente) {
      return res.status(404).json({ mensagem: 'Ingrediente não encontrado' });
    }

    nome = nome || ingredienteExistente.nome;
    unidade = unidade || ingredienteExistente.unidade;

    await database.query('UPDATE ingrediente SET nome = $1, unidade = $2 WHERE codigo = $3;', [nome, unidade, codigo]);

    res.status(200).json({ mensagem: 'Ingrediente atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar ingrediente: ', error);
    res.status(500).json({ mensagem: 'Erro ao tentar atualizar o ingrediente' });
  }
});

export default ingredienteRouter;
