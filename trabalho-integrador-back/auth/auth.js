import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function criarToken(cpf, cargo) {
  return jwt.sign({ cpf, cargo }, process.env.TOKEN_KEY, { expiresIn: "1d" });
}

export function verificarToken(req, res, next) {
  try {
    let token = req.get("Authorization");

    if (!token || token.length < 5) {
      res.status(401).json({ mensagem: "Sessão inválida", invalidToken: true });
      return;
    }
    token = token.replace("Bearer ", "");
    jwt.verify(token ?? "", process.env.TOKEN_KEY);

    next();
  } catch (error) {
    console.log(error);

    res.status(401).json({ mensagem: "Sessão inválida", invalidToken: true });
  }
}

export function verificaGerencia(req, res, next) {
  try {
    let token = req.get("Authorization");

    if (!token || token.length < 5) {
      res.status(401).json({ mensagem: "Sessão inválida", invalidToken: true });
      return;
    }
    token = token.replace("Bearer ", "");
    const user = jwt.verify(token ?? "", process.env.TOKEN_KEY);

    if (user.cargo) {
      next();
    } else {
      res.status(401).json({ mensagem: "Sessão inválida", invalidToken: true });
    }
  } catch (error) {
    console.log(error);

    res.status(401).json({ mensagem: "Sessão inválida", invalidToken: true });
  }
}
