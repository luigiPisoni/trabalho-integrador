import { randomBytes, createHash, scryptSync } from 'crypto';
import { database } from '../db/banco.js';
import { criarToken } from '../auth/auth.js';

// salt = se não passar ele cria um novo
// password nunca pode ser null
function hashPassword(password, salt) {
  const databaseSalt = salt ?? randomBytes(16).toString('hex');
  const shaedPass = createHash('sha256').update(password).digest('hex');
  const backendPepper = `${databaseSalt}#${shaedPass}`;

  const hash = scryptSync(password, backendPepper, 40).toString('hex');
  return `${databaseSalt}.${hash}`;
}

function verifyHash(password, hashedPassword) {
  const [databaseSalt, hashValue] = hashedPassword.split('.');
  const [salt, hash] = hashPassword(password, databaseSalt).split('.');
  return salt === databaseSalt && hash === hashValue;
}

export async function lista(req, res) {
  try {
    const response = await database.any('SELECT cpf, nome, endereco, cargo FROM pessoa;');
    res.json(response);
  } catch (error) {
    console.error('mensagem ', error);
    res.status(400).json({ mensagem: 'Erro ao listar as pessoas' });
  }
}

export async function login(req, res) {
  const user = {
    cpf: req.body.cpf,
    senha: req.body.senha,
  };

  try {
    const response = await database.oneOrNone('SELECT senha FROM pessoa WHERE cpf = $1', user.cpf);

    const valida = verifyHash(user.senha, response.senha);

    if (valida === false) {
      res.status(400).json({ mensagem: 'Senha inválida' });
    } else {
      console.log(user.cpf);

      const token = criarToken(user.cpf);

      res.json({ mensagem: 'Logado com sucesso', token });
    }
  } catch (error) {
    console.error('mensagem ', error);
    res.status(400).json({ mensagem: 'Erro ao fazer login' });
  }
}

export async function cadastro(req, res) {
  const { cpf, nome, senha, endereco, cargo } = req.body;

  if (!senha || senha.length < 6) {
    return res.status(400).json({ mensagem: 'A senha deve conter pelo menos 6 caracteres!' });
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

    const token = criarToken(cpf);

    res.status(201).json({ mensagem: 'Cadastrado com sucesso', token });
  } catch (error) {
    console.error('mensagem ', error);
    res.status(400).json({ mensagem: 'Erro ao cadastrar' });
  }
}

export async function atualizar(req, res) {
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
}

export async function deletar(req, res) {
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
}
