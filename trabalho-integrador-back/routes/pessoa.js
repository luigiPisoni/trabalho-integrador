import { database } from '../db/banco.js';
import express from 'express';
import { hashPassword } from '../auth/auth.js';

const pessoaRouter = express.Router();

pessoaRouter.get('/lista', async (req, res) => {
  try {
    const response = await database.any('SELECT cpf, nome, endereco, cargo FROM pessoa;');
    res.json(response);
  } catch (error) {
    console.error('mensagem ', error);
    res.status(400).json({ mensagem: 'Erro ao listar as pessoas' });
  }
});

pessoaRouter.post('/cadastro', async (req, res) => {
  console.log(req.body);

  const { cpf, nome, senha, endereco, cargo } = req.body;

  if (!senha || senha.length < 8) {
    return res.status(400).json({ mensagem: 'A senha deve conter pelo menos 8 caracteres!' });
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
    console.error('mensagem ', error);
    res.status(400).json({ mensagem: 'Erro ao cadastrar a pessoa' });
  }
});

pessoaRouter.delete('/deletar/:cpf', async (req, res) => {
  const { cpf } = req.params;

  try {
    // verifica se a pessoa existe
    const pessoaExistente = await database.oneOrNone('SELECT cpf FROM pessoa WHERE cpf = $1;', [cpf]);

    if (!pessoaExistente) {
      return res.status(404).json({ mensagem: 'Pessoa não encontrada.' });
    }

    // exclui a pessoa
    const result = await database.result('DELETE FROM pessoa WHERE cpf = $1;', [cpf]);

    // verifica se a pessoa foi deletada
    if (result.rowCount === 0) {
      return res.status(404).json({ mensagem: 'Pessoa não encontrada para exclusão.' });
    }

    res.status(200).json({ mensagem: 'Pessoa deletada com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar pessoa:', error);
    res.status(500).json({ mensagem: 'Erro ao tentar deletar a pessoa.' });
  }
});

pessoaRouter.put('/atualizar/:cpf', async (req, res) => {
  const { cpf } = req.params;
  var { nome, endereco, cargo, senha } = req.body;

  try {
    // verifica se a pessoa existe
    const pessoaExistente = await database.oneOrNone(
      'SELECT nome, endereco, cargo, senha FROM pessoa WHERE cpf = $1;',
      [cpf]
    );

    if (!pessoaExistente) {
      return res.status(404).json({ mensagem: 'Pessoa não encontrada.' });
    }

    nome = nome || pessoaExistente.nome;
    endereco = endereco || pessoaExistente.endereco;
    cargo = cargo || pessoaExistente.cargo;
    senha = senha ? hashPassword(senha) : pessoaExistente.senha;

    // atualiza a pessoa
    await database.none('UPDATE pessoa SET nome = $1, endereco = $2, cargo = $3, senha = $4 WHERE cpf = $5;', [
      nome,
      endereco,
      cargo,
      senha,
      cpf,
    ]);

    res.status(200).json({ mensagem: 'Pessoa atualizada com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar pessoa:', error);
    res.status(500).json({ mensagem: 'Erro ao tentar atualizar a pessoa.' });
  }
});

export default pessoaRouter;
