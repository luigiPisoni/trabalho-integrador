import express from "express";
import { login, cadastro } from "../controllers/pessoaController.js";
import { destaques } from "../controllers/pratoController.js";

const publicRouter = express.Router();

publicRouter.get("/destaques", destaques);

publicRouter.post("/login", login);

publicRouter.post("/cadastro", cadastro);

export default publicRouter;
