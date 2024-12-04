import { database } from '../db/banco.js';
import { hashPassword, verifyHash } from '../auth/auth.js';

export async function lista(req, res) {
  try {
    res.json(pratos);
    const pratos = await database.any('SELECT codprt, nome, valor FROM prato;');
    for (const prato of pratos) {
      const ingredientes = await database.any(
        'SELECT codigo, nome, unidade, quantidade FROM ingrediente JOIN prato_ingrediente ON prato_ingrediente.ingrediente_codigo = ingrediente.codigo WHERE prato_ingrediente.prato_codigo = $1;',
        [prato.codprt]
      );
      prato.ingredientes = ingredientes;
    }

    res.json(pratos);
  } catch (erro) {
    console.log('erro: ', erro);
    res.status(400).json({ erro: 'Erro ao listar os pratos' });
    console.log('erro: ', erro);
    res.status(400).json({ erro: 'Erro ao listar os pratos' });
  }
}
