import express from 'express';
import { lista } from '../controllers/pratoController.js';
import { database } from '../db/banco.js';

const pratoRouter = express.Router();

pratoRouter.get('/lista', lista);

pratoRouter.post('/novo', async (req, res) => {
  const { nome, valor, ingredientes } = req.body;

  if (parseFloat(valor) < 0) {
    return res.status(400).json({ erro: 'O valor não pode ser negativo seu burro' });
  }

  try {
    await database.tx(async (tx) => {
      const criarPrato = await tx.one('INSERT INTO prato (nome, valor) VALUES ($1, $2) RETURNING *;', [nome, valor]);
      const codprt = criarPrato.codprt;
      const criarRelacoes = ingredientes.map((ingrediente) => {
        const { codigo, quantidade } = ingrediente;
        return tx.none(
          'INSERT INTO prato_ingrediente (prato_codigo, ingrediente_codigo, quantidade) VALUES ($1, $2, $3);',
          [codprt, codigo, quantidade]
        );
      });

      return tx.batch([criarPrato, ...criarRelacoes]);
    });

    res.json({ mensagem: 'Prato cadastrado com sucesso' });
  } catch (error) {
    console.error('erro: ', error);
    res.status(400).json({ erro: 'Erro ao cadastrar o prato' });
  }
});

// pratoRouter.post("/novo", (req, res) => {
//   var prato = req.body;

//   if (prato.nome.length < 3 || parseFloat(prato.preco) <= 0) {
//     res.status(400).json({ erro: "Prato inválido" });
//   } else {
//     // res.send("Prato cadastrado!!!");
//     res.json(prato);
//   }
// });

export default pratoRouter;
