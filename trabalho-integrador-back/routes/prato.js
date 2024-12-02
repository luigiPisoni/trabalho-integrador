import express from "express";

const router = express.Router();

// lista placeholder só pra retornar alguma coisa
const pratos = [
  {
    id: "01",
    nome: "chuchu ao molho branco",
    preco: "7,75",
    ingredientes: [
      { quantidade: "4", nome: "chuchu" },
      { quantidade: "1", nome: "molho branco" },
    ],
  },
];

router.get("/listagem", (req, res) => {
  res.json(pratos);
});

router.post("/cadastro", (req, res) => {
  var prato = req.body;

  if (
    prato.nome.length < 3 ||
    parseFloat(prato.preco) <= 0 ||
    prato.ingredientes.length < 1
  ) {
    res.status(400).json({ erro: "Prato inválido!!!" });
  } else {
    // res.send("Prato cadastrado!!!");
    res.json(prato);
  }
});

// router.put("/:id", (req, res) => {
//   const id = parseInt(req.params.id); // pega o id
//   const pratoAtualizado = req.body; // pega o novo prato

//   const index = pratos.findIndex((prato) => prato.id === id); // encontrando prato

//   if (index !== -1) {
//     // Verifica se o prato foi encontrado
//     // if (
//     //   pratoAtualizado.nome.length < 3 ||
//     //   parseFloat(pratoAtualizado.preco) <= 0 ||
//     //   pratoAtualizado.ingredientes.length < 1
//     // ) {
//     //   return res.status(400).send("Prato inválido!!!");
//     // }

//     // Atualizamos o prato
//     // pratos[index] = { id, nome, preco, ingredientes };
//     // res.send("Prato atualizado com sucesso!");
//     res.json(prato[index]);
//   } else {
//     res.status(404).send("Prato não encontrado!");
//   }
// });

// router.delete("/:id", (req, res) => {
//   const id = parseInt(req.params.id);

//   const index = pratos.findIndex((prato) => prato.id === id);
//   if (index !== -1) {
//     // pratos.splice(index, 1); // removendo prato
//     // res.send("Prato removido com sucesso!");
//     res.send()
//   } else {
//     res.status(404).send("Prato não encontrado!");
//   }
// });

export default router;