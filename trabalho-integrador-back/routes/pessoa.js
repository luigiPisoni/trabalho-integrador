import express from "express";

import {
  login,
  cadastro,
  atualizar,
  lista,
} from "../controllers/pessoaController.js";

const pessoaRouter = express.Router();

pessoaRouter.get("/lista", lista);

pessoaRouter.post("/login", login);

pessoaRouter.post("/cadastro", cadastro);

pessoaRouter.delete("/deletar/:cpf");

pessoaRouter.put("/atualizar/:cpf", atualizar);

export default pessoaRouter;
