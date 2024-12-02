import express from "express";
import * as dotenv from 'dotenv';//
dotenv.config();//

import pratoRoute from "./routes/prato.js";
import pedidoRoute from "./routes/pedido.js";
import funcionarioRoute from "./routes/funcionario.js";
import produtoRoute from "./routes/produto.js";

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const port = 3001;

server.listen(port, () => {
  console.log("Server iniciado no port " + port);
});

server.use("/prato", pratoRoute);
server.use("/pedido", pedidoRoute);
server.use("/funcionario", funcionarioRoute);
server.use("/produto", produtoRoute);
