import { database } from '../db/banco.js';
import express from 'express';

const pessoaRouter = express.Router();

pessoaRouter.get('/lista', async (req, res) => {
  try {
    const renomeiaIssoAquiLuigi = await database.any('SELECT cpf, nome, endereco, cargo FROM pessoa;');
    res.json(renomeiaIssoAquiLuigi);
  } catch (errorLuigi) {
    console.error('erro: ', errorLuigi);
    res.status(400).json({ erro: 'Erro ao listar as pessoas' });
  }
});

pessoaRouter.post('/novo', async (req, res) => {
  const { cpf, nome, senha, endereco, cargo } = req.body;

  try {
    await database.none('INSERT INTO pessoa (cpf, nome, senha, endereco, cargo) VALUES ($1, $2, $3, $4, $5);', [
      cpf,
      nome,
      senha,
      endereco,
      cargo,
    ]);

    res.json({ mensagem: 'Pessoa cadastrada com sucesso' });
  } catch (error) {
    console.error('erro: ', error);
    res.status(400).json({ erro: 'Erro ao cadastrar a pessoa' });
  }
});

export default pessoaRouter;
