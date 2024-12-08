import express from "express";
import {
  novo,
  deletar,
  atualizar,
  add,
  remove,
  ingredientes,
} from "../controllers/pratoController.js";

const pratoRouter = express.Router();

pratoRouter.post("/novo", novo);

pratoRouter.delete("/deletar/:codprt", deletar);

pratoRouter.put("/atualizar/:codprt", atualizar);

// adicionar ingredientes
pratoRouter.put("/atualizar/add/:codprt", add);

// remove ingredinete
pratoRouter.put("/atualizar/rem/:codprt", remove);

// atualiza os valores
pratoRouter.put("/atualizar/ingredientes/:codprt", ingredientes);

export default pratoRouter;
