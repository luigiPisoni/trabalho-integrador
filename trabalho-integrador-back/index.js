import express from "express";

const pratoRoute = require("./routes/prato");
const pedidoRoute = require("./routes/pedido");
const funcionarioRoute = require("./routes/funcionario");
const produtoRoute = require("./routes/produto");

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
