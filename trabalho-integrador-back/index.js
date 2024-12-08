import express from "express";
import cors from "cors";

import pratoRoute from "./routes/prato.js";
import pedidoRoute from "./routes/pedido.js";
import pessoaRoute from "./routes/pessoa.js";
import produtoRoute from "./routes/produto.js";
import ingredienteRoute from "./routes/ingrediente.js";
import lucroRoute from "./routes/gerente/lucro.js";
import { verificarToken, verificaGerencia } from "./auth/auth.js";
import publicRoute from "./routes/public.js";
import clienteRouter from "./routes/cliente.js";

const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const port = 3001;

server.listen(port, () => {
  console.log("Server iniciado no port " + port);
});

server.use("/", publicRoute);
server.use("/pedido", pedidoRoute);
// as rotas daqui pora baixo vai precisa do token
server.use(verificarToken);
server.use("/", clienteRouter);
// daqui pra baixo precisa ser admin, cargo = true
server.use(verificaGerencia);
server.use("/lucro", lucroRoute);
server.use("/prato", pratoRoute);
server.use("/produto", produtoRoute);

server.use("/pessoa", pessoaRoute);
server.use("/ingrediente", ingredienteRoute);
