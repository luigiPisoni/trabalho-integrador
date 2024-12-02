// import express from "express";

// const router = express.Router();

// const pedidos = {
//   pratos: [{ nome: "prato", quantidade: 3 }],
//   produtos: [{ nome: "coquinha gelada", quantidade: 2 }],
// };

// router.get("/listagem", (req, res) => {
//   const pedido = [
//     { nome: "prato feito", quantidade: "2", status: "em andamento" },
//   ];
//   res.json(pedido);
// });

// router.post("/cadastro", (req, res) => {
//   var pedido = req.body;

//   if (parseInt(pedido.quantidade) < 1 || parseInt(pedido.quantidade) > 10) {
//     res.status(400).json({ erro: "Pedido inválido!!!" });
//   } else {
//     // res.send("Pedido criado!");
//     res.json({ ...pedido, status: "Aguardando confirmação" });
//   }
// });

// export default router;
