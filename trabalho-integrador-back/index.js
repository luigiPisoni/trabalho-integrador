import express from "express";

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const port = 3001;

server.listen(port, () => {
  console.log("Server iniciado no port " + port);
});

//ROTAS DOS PRATOS ABAIXO
server.post("/novo-prato", (req, res) => {
  console.log("tá chegando");

  var prato = req.body;

  if (
    prato.id.length < 1 ||
    prato.nome.length < 3 ||
    parseFloat(prato.preco) <= 0 ||
    prato.ingredientes.length < 1
  ) {
    // CASO O PRATO SEJA INVÁLIDO
    res.status(400).send("Prato inválido!!!");
  } else {
    res.send("Prato cadastrado!!!");
  }

  res.send();
});

server.get('/pratos', (req, res) =>{
  const pratos = [{id: '01' ,nome: 'chuchu ao molho branco', preco: '7,75', ingredientes: [{quantidade:'1', nome: 'chuchu'},{quantidade:'1', nome:'molho branco' }]}];
  res.json(pratos)
});

server.put('/pratos/:id', (req, res) => {
  const id = parseInt(req.params.id); // pegando o id
  const pratoAtualizado = req.body; // pegando prato antigo
  
  const index = pratos.findIndex((prato) => prato.id === id); //encontrando prato

  if (index !== -1) {
    // Verifica se o prato foi encontrado
    if (
      pratoAtualizado.nome.length < 3 ||
      parseFloat(pratoAtualizado.preco) <= 0 ||
      pratoAtualizado.ingredientes.length < 1
    ) {
      return res.status(400).send("Prato inválido!!!");
    }

    // Atualizamos o prato
    pratos[index] = { id, nome, preco, ingredientes};
    res.send("Prato atualizado com sucesso!");
  } else {
    res.status(404).send("Prato não encontrado!");
  }
});

server.delete('/pratos/:id', (req, res) => {
  const id = parseInt(req.params.id); 

  const index = pratos.findIndex((prato) => prato.id === id); 
  if (index !== -1) {
    pratos.splice(index, 1); // removendo prato
    res.send("Prato removido com sucesso!");
  } else {
    res.status(404).send("Prato não encontrado!");
  }
});

//ROTAS DOS PEDIDOS ABAIXO
server.post('/novo-pedido', (req, res) =>{
  var pedido = req.body;

    if (parseInt(pedido.quantidade) < 1 || parseInt(pedido.quantidade) > 10 || !pedido.quantidade || parseInt(pedido.id) < 0) {
      res.status(400).send('Pedido invalido!');
      
    }else{
      res.send('Pedido criado!');
    }
});  

server.get('/pedidos', (req, res) => {
    const pedido = [{nome:'prato feito',quantidade:'2', id:'001'}];
    res.json(pedido);
});

//ROTAS DOS PRODUTOS ABAIXO
server.post("/novo-produto", (req, res) => {
  console.log("tá chegando");

  var produto = req.body;

  if (
    produto.id.length < 1 ||
    produto.nome.length < 3 ||
    parseFloat(produto.preco) <= 0 ||
    produto.tamanho.length < 2
  ) {
    res.status(400).send("Produto inválido!!!");
  } else {
    res.send("Produto cadastrado!!!");
  }
  res.send();
});

server.get('/produtos', (req, res) =>{
  const produtos = [{id: '1', nome: 'Coca-cola', preco: '5,00', tamanho: '1L'}];
  res.json(produtos)
});

server.put('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id); // pegando o id
  const produtoAtualizado = req.body; // pegando produto antigo
  
  const index = produtos.findIndex((produto) => produto.id === id); //encontrando produto

  if (index !== -1) {
    // Verifica se o produto foi encontrado
    if (
      produtoAtualizado.nome.length < 3 ||
      parseFloat(produtoAtualizado.preco) <= 0 ||
      produtoAtualizado.tamanho.length < 2
    ) {
      return res.status(400).send("Produto inválido!!!");
    }

    // Atualizamos o produto
    produtos[index] = { id, nome, preco, tamanho};
    res.send("Produto atualizado com sucesso!");
  } else {
    res.status(404).send("Produto não encontrado!");
  }
});

server.delete('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id); 

  const index = produtos.findIndex((produto) => produto.id === id); 
  if (index !== -1) {
    produtos.splice(index, 1); // removendo produto
    res.send("Produto removido com sucesso!");
  } else {
    res.status(404).send("Produto não encontrado!");
  }
});