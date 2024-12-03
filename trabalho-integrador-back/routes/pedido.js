import express from "express";
import { novo } from "../controllers/pedidoController.js";

const pedidoRouter = express.Router();

// pedidoRouter.get("/listagem", (req, res) => {
//   const pedido = [
//     { nome: "prato feito", quantidade: "2", status: "em andamento" },
//   ];
//   res.json(pedido);
// });

pedidoRouter.post("/novo", novo);

export default pedidoRouter;
