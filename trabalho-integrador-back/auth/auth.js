import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function criarToken(key) {
  return jwt.sign({ key }, process.env.TOKEN_KEY, { expiresIn: "1d" });
}

export function verificarToken(req, res, next) {
  try {
    let token = req.get("Authorization");

    if (!token || token.length < 5) {
      res.status(401).json({ mensagem: "Sessão inválida" });
      return;
    }
    token = token.replace("Bearer ", "");

    jwt.verify(token, process.env.TOKEN_KEY);

    next();
  } catch (error) {
    console.log(error);

    res.status(401).json({ mensagem: "Sessão inválida" });
  }
}
