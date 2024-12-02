import  pg from 'pg';//

// var conString = "postgres://postgres:postgres@localhost:5432/integrador";//
// var client = new pg.Client(conString);//
// client.connect()//

// export default client;
require('dotenv').config();
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const express = require('express');
const app = express();
app.use(express.json());

app.post('/pessoa', async (req, res) => {
  const pessoa = req.body;

  if (!pessoa.codigo || !pessoa.pessoa_id || !pessoa.valor || !pessoa.datahora || !pessoa.descricao || !pessoa.status || !pessoa.tipo_pagamento) {
    return res.status(400).json({ erro: 'Campos obrigatórios faltando!' });
  }

  const { data, error } = await supabase
    .from('pessoa')
    .insert(pessoa);

  if (error) {
    return res.status(500).json({ erro: error.message });
  }

  res.status(201).json(data[0]);
});

app.get('/pessoas', async (req, res) => {
  const { data, error } = await supabase
    .from('pessoa')
    .select('*');

  if (error) {
    return res.status(500).json({ erro: error.message });
  }

  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
