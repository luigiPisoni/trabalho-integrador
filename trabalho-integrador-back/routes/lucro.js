import express from 'express';
import { database } from '../db/banco.js';

const lucroRouter = express.Router();

lucroRouter.get('/diario', async (req, res) => {
  console.log('asdasd');
  const tabela = await database.query(
    'SELECT datahora::timestamp::date as data, sum(valor) as total, sum(valor) * 0.3 as lucro from pedido group by data;'
  );
  res.json({ lucro: tabela });
});

export default lucroRouter;
