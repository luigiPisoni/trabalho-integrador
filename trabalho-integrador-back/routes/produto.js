import express from "express";
import {
  novo,
  deletar,
  atualizar,
  listaProduto,
} from "../controllers/produtoController.js";

const produtoRouter = express.Router();

produtoRouter.get("/lista", listaProduto);

produtoRouter.post("/novo", novo);

produtoRouter.delete("/deletar/:codpdt", deletar);

produtoRouter.put("/atualizar/:codpdt", atualizar);

export default produtoRouter;
