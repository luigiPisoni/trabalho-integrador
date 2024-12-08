import express from 'express';
import moment from 'moment';
import { database } from '../../db/banco.js';

const lucroRouter = express.Router();

lucroRouter.get('/diario', async (req, res) => {
  try {
    const tabela = await database.query(
      'SELECT datahora::timestamp::date as data, SUM(valor) as total, SUM(valor) * 0.3 as lucro FROM pedido GROUP BY datahora::timestamp::date ORDER BY datahora::timestamp::date;'
    );

    // Processamento de dados com tratamento de erros
    const formattedData = tabela.map(row => {
      try {
        return {
          data: new Date(row.data).toLocaleDateString('pt-BR'),
          total: parseFloat(row.total),
          lucro: parseFloat(row.lucro),
        };
      } catch (error) {
        console.error('Erro ao formatar os dados da linha:', row, error);
        return null; // Retorna null para as linhas que falharem
      }
    }).filter(row => row !== null); // Remove as linhas que falharem

    res.json({ lucro: formattedData });

  } catch (error) {
    console.error('Erro na consulta SQL:', error);
    res.status(500).json({ error: 'Erro ao acessar o banco de dados.' });
  }
});

export default lucroRouter;
