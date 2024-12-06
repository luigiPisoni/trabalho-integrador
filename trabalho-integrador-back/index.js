import express from 'express';
import cors from 'cors';

import pratoRoute from './routes/prato.js';
import pedidoRoute from './routes/pedido.js';
import pessoaRoute from './routes/pessoa.js';
import produtoRoute from './routes/produto.js';
import ingredienteRoute from './routes/ingrediente.js';
import lucroRoute from './routes/lucro.js';

const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const port = 3001;

server.listen(port, () => {
  console.log('Server iniciado no port ' + port);
});

server.use('/prato', pratoRoute);
server.use('/pedido', pedidoRoute);
server.use('/pessoa', pessoaRoute);
server.use('/produto', produtoRoute);
server.use('/ingrediente', ingredienteRoute);
server.use('/lucro', lucroRoute);
