import { database } from '../db/banco.js';
import express from 'express';
import { hashPassword } from '../renomear_luigi/auth.js';

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

  if (!senha || senha.length < 8) {
    return res.status(400).json({ erro: 'A senha deve conter pelo menos 8 caracteres!' });
  }

  const hashedPassword = hashPassword(senha);

  try {
    await database.none('INSERT INTO pessoa (cpf, nome, senha, endereco, cargo) VALUES ($1, $2, $3, $4, $5);', [
      cpf,
      nome,
      hashedPassword,
      endereco,
      cargo,
    ]);

    res.status(201).json({ mensagem: 'Pessoa cadastrada com sucesso' });
  } catch (error) {
    console.error('erro: ', error);
    res.status(400).json({ erro: 'Erro ao cadastrar a pessoa' });
  }
});

export default pessoaRouter;
