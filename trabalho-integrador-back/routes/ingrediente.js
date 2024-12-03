import { database } from '../db/banco.js';
import express from 'express';

const ingredienteRouter = express.Router();

ingredienteRouter.get('/lista', async (req, res) => {
  try {
    const response = await database.any('SELECT codigo, nome, unidade FROM ingrediente;');
    res.json(response);
  } catch (error) {
    console.error('erro: ', error);
    res.status(400).json({ erro: 'Erro ao listar os ingredientes' });
  }
});

ingredienteRouter.post('/novo', async (req, res) => {
  const { nome, unidade } = req.body;

  try {
    await database.query('INSERT INTO ingrediente (nome, unidade) VALUES ($1, $2);', [nome, unidade]);
    res.status(201).json({ mensagem: 'Ingrediente cadastrado com sucesso' });
  } catch (error) {
    console.error('erro: ', error);
    res.status(400).json({ erro: 'Erro ao cadastrar o ingrediente' });
  }
});

export default ingredienteRouter;
