import express from 'express';
import { lista, novo, deletar, atualizar } from '../controllers/produtoController.js';

const produtoRouter = express.Router();

produtoRouter.get('/lista', lista);

produtoRouter.post('/novo', novo);

produtoRouter.delete('/deletar/:codpdt', deletar);

produtoRouter.put('/atualizar/:codpdt', atualizar);

export default produtoRouter;
