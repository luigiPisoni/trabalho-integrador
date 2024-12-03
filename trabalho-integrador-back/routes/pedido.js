import express from 'express';
import { database } from '../db/banco.js';
import { novo } from '../controllers/pedidoController.js';

const pedidoRouter = express.Router();

pedidoRouter.post('/novo', novo);

pedidoRouter.get('/lista', async (req, res) => {
  try {
    const renomeiaIssoAquiLuigi = await database.any('SELECT * FROM pedido;');
    res.json(renomeiaIssoAquiLuigi);
  } catch (errorLuigi) {
    console.error('erro: ', errorLuigi);
    res.status(400).json({ erro: 'Erro ao listar pedidos' });
  }
});

export default pedidoRouter;
