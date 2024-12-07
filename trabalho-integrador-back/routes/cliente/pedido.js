import express from 'express';
import { database } from '../../db/banco.js';
import { novo,lista, deletar, atualizar,add_produto,remove_produto,edita_produto,add_prato,remove_prato,edita_prato } from '../../controllers/pedidoController.js';

const pedidoRouter = express.Router();

pedidoRouter.post('/novo', novo);

pedidoRouter.get('/lista', lista);

pedidoRouter.delete('/deletar/:codigo', deletar);

pedidoRouter.put('/atualizar/:codigo', atualizar);

// adicionar produtos
pedidoRouter.put('/atualizar/add/produto/:codpdt', add_produto);

// remover produtos
pedidoRouter.put('/atualizar/rem/produto/:codpdt', remove_produto);

// editar quantidade de produtos
pedidoRouter.put('/atualizar/edit/produto/:codpdt', edita_produto);

// adicionar pratos
pedidoRouter.put('/atualizar/add/prato/:codprt', add_prato);

// remover pratos
pedidoRouter.put('/atualizar/rem/prato/:codprt', remove_prato);

// editar quantidade de pratos
pedidoRouter.put('/atualizar/edit/prato/:codprt', edita_prato);

export default pedidoRouter;
