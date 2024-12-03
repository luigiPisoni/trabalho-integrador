import express from "express";
import { lista } from "../controllers/pratoController.js";

const pratoRouter = express.Router();

pratoRouter.get("/lista", lista);

// pratoRouter.post("/novo", (req, res) => {
//   var prato = req.body;

//   if (prato.nome.length < 3 || parseFloat(prato.preco) <= 0) {
//     res.status(400).json({ erro: "Prato inválido" });
//   } else {
//     // res.send("Prato cadastrado!!!");
//     res.json(prato);
//   }
// });

export default pratoRouter;
