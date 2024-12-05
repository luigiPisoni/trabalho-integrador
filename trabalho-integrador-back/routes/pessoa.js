import { database } from '../db/banco.js';
import express from 'express';
import { hashPassword } from '../auth/auth.js';

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

pessoaRouter.delete('/deletar/:cpf', async (req, res) => {
  const { cpf } = req.params;

  try {
    // Verificar se a pessoa existe
    const pessoaExistente = await database.oneOrNone('SELECT * FROM pessoa WHERE cpf = $1;', [cpf]);

    if (!pessoaExistente) {
      return res.status(404).json({ erro: 'Pessoa não encontrada.' });
    }

    // Excluir a pessoa
    const result = await database.result('DELETE FROM pessoa WHERE cpf = $1;', [cpf]);

    // Verifica se a pessoa foi deletada
    if (result.rowCount === 0) {
      return res.status(404).json({ erro: 'Pessoa não encontrada para exclusão.' });
    }

    res.status(200).json({ mensagem: 'Pessoa deletada com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar pessoa:', error);
    res.status(500).json({ erro: 'Erro ao tentar deletar a pessoa.' });
  }
});

export default pessoaRouter;

