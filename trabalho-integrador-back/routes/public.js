import express from "express";
import { lista } from "../controllers/pratoController.js";
import {
  login,
  cadastro,
} from "../controllers/pessoaController.js";

const publicRouter = express.Router();

publicRouter.get('/lista', lista);

publicRouter.post("/login", login);

publicRouter.post("/cadastro", cadastro);

export default publicRouter;