import express from "express";
import { login, cadastro } from "../controllers/pessoaController.js";

const publicRouter = express.Router();

publicRouter.post("/login", login);

publicRouter.post("/cadastro", cadastro);

export default publicRouter;
