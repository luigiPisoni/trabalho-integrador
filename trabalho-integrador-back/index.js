import express from "express";

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const port = 3001;

server.listen(port, () => {
  console.log("Server iniciado no port " + port);
});

server.post("/novo-prato", (req, res) => {
  console.log("tá chegando");

  var prato = req.body;

  if (
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
  const pratos = [{nome: 'chuchu ao molho branco', preco: '7,75', ingredientes: [{quantidade:'1', nome: 'chuchu'},{quantidade:'1', nome:'molho branco' }]}];
  res.json(pratos)
});

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


