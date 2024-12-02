// import express from "express";

// const router = express.Router();

// const produtos = [
//   { nome: "Coca-cola", preco: "5,00", quantidade: "1", unidade: "litro" },
// ];

// router.get("/listagem", (req, res) => {
//   res.json(produtos);
// });

// router.post("/cadastro", (req, res) => {
//   var produto = req.body;

//   if (
//     produto.nome.length < 3 ||
//     parseFloat(produto.preco) <= 0 ||
//     parseFloat(produto.quantidade) < 1
//   ) {
//     res.status(400).json({ erro: "Produto inválido!!!" });
//   } else {
//     // res.send("Produto cadastrado!!!");
//     res.json(produto);
//   }
// });

// // router.put("/produtos/:id", (req, res) => {
// //   const id = parseInt(req.params.id); // pegando o id
// //   const produtoAtualizado = req.body; // pegando produto antigo

// //   const index = produtos.findIndex((produto) => produto.id === id); //encontrando produto

// //   if (index !== -1) {
// //     // Verifica se o produto foi encontrado
// //     if (
// //       produtoAtualizado.nome.length < 3 ||
// //       parseFloat(produtoAtualizado.preco) <= 0 ||
// //       produtoAtualizado.tamanho.length < 2
// //     ) {
// //       return res.status(400).send("Produto inválido!!!");
// //     }

// //     // Atualizamos o produto
// //     produtos[index] = { id, nome, preco, tamanho };
// //     res.send("Produto atualizado com sucesso!");
// //   } else {
// //     res.status(404).send("Produto não encontrado!");
// //   }
// // });

// // router.delete("/produtos/:id", (req, res) => {
// //   const id = parseInt(req.params.id);

// //   const index = produtos.findIndex((produto) => produto.id === id);
// //   if (index !== -1) {
// //     produtos.splice(index, 1); // removendo produto
// //     res.send("Produto removido com sucesso!");
// //   } else {
// //     res.status(404).send("Produto não encontrado!");
// //   }
// // });

// export default router;
