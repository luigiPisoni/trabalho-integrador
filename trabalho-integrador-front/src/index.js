import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import express from "express";

const server = express()

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
let cardapio = [
  { id: 1, nome: 'Pizza Margherita', preco: 35.00, ingredientes: ['Queijo', 'Molho de Tomate', 'Manjericão'] },
  { id: 2, nome: 'Hambúrguer de Frango', preco: 22.00, ingredientes: ['Frango', 'Queijo', 'Pão'] }
];
server.post('/criar-prato', (req, res) => {
  const { nome, preco, ingredientes } = req.body;
  if (!nome || !preco || !ingredientes || !Array.isArray(ingredientes)) {
      return res.status(400).json({ error: 'Nome, preço e ingredientes são obrigatórios' });
  }
  const novoPrato = { id: cardapio.length + 1, nome, preco, ingredientes };
  cardapio.push(novoPrato);
  res.json({ ...novoPrato, status: 'Prato criado com sucesso' });
});

server.put('/editar-prato/:id', (req, res) => {
  const { id } = req.params;
  const { nome, preco, ingredientes } = req.body;
  const prato = cardapio.find(p => p.id == id);
  if (!prato) return res.status(404).json({ error: 'Prato não encontrado' });
  if (nome) prato.nome = nome;
  if (preco) prato.preco = preco;
  if (ingredientes && Array.isArray(ingredientes)) prato.ingredientes = ingredientes;
  res.json({ ...prato, status: 'Prato atualizado com sucesso' });
});

// Remover prato
server.delete('/remover-prato/:id', (req, res) => {
  const { id } = req.params;
  const index = cardapio.findIndex(p => p.id == id);
  if (index === -1) return res.status(404).json({ error: 'Prato não encontrado' });
  cardapio.splice(index, 1);
  res.json({ id, status: 'Prato removido com sucesso' });
});

// Inicializando o servidor
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals