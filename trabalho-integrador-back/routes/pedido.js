import express from "express";
import { database } from "../db/banco.js";
import {
  lista,
  deletar,
  atualizar,
  add_produto,
  remove_produto,
  edita_produto,
  add_prato,
  remove_prato,
  edita_prato,
  status,
  pedidosDoDia,
  pedidosTotais,
  atualizar_status,
} from "../controllers/pedidoController.js";

const pedidoRouter = express.Router();

pedidoRouter.get("/lista", lista);

pedidoRouter.delete("/deletar/:codigo", deletar);

pedidoRouter.put("/atualizar-status", atualizar_status);

pedidoRouter.put("/atualizar/:codigo", atualizar);

// adicionar produtos
pedidoRouter.put("/atualizar/add/produto/:codpdt", add_produto);

// remover produtos
pedidoRouter.put("/atualizar/rem/produto/:codpdt", remove_produto);

// editar quantidade de produtos
pedidoRouter.put("/atualizar/edit/produto/:codpdt", edita_produto);

// adicionar pratos
pedidoRouter.put("/atualizar/add/prato/:codprt", add_prato);

// remover pratos
pedidoRouter.put("/atualizar/rem/prato/:codprt", remove_prato);

// editar quantidade de pratos
pedidoRouter.put("/atualizar/edit/prato/:codprt", edita_prato);

pedidoRouter.get("/status", status);

pedidoRouter.get("/dia", pedidosDoDia);

pedidoRouter.get("/totais", pedidosTotais);
export default pedidoRouter;
