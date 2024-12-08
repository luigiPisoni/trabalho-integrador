import express from "express";
import { listaPrato } from "../controllers/pratoController.js";
import { listaProduto } from "../controllers/produtoController.js";
import { novo } from "../controllers/pedidoController.js";

const clienteRouter = express.Router();

clienteRouter.get("/lista-prato", listaPrato);

clienteRouter.get("/lista-produto", listaProduto);

clienteRouter.post("/novo-pedido", novo);

export default clienteRouter;
