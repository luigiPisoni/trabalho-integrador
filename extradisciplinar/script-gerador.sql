CREATE TABLE
  pessoa (
    cpf char(14) PRIMARY KEY,
    nome varchar(100) NOT NULL,
    senha varchar(128) NOT NULL,
    endereco varchar(100) NOT NULL,
    cargo boolean
  );

CREATE TABLE
  produto (
    codpdt serial PRIMARY KEY,
    nome varchar(100) NOT NULL,
    valor decimal(10, 2) NOT NULL
  );

CREATE TABLE
  ingrediente (
    codigo serial PRIMARY KEY,
    nome varchar(100) NOT NULL,
    unidade varchar(10) NOT NULL
  );

CREATE TABLE
  prato (
    codprt serial PRIMARY KEY,
    nome varchar(100) NOT NULL,
    valor decimal(10, 2) NOT NULL
  );

CREATE TABLE
  prato_ingrediente (
    prato_codigo int,
    ingrediente_codigo int,
    quantidade int NOT NULL,
    FOREIGN KEY (prato_codigo) REFERENCES prato (codprt) ON DELETE SET NULL,
    FOREIGN KEY (ingrediente_codigo) REFERENCES ingrediente (codigo) ON DELETE SET NULL,
    PRIMARY KEY (prato_codigo, ingrediente_codigo)
  );

CREATE TYPE status_pedido as enum (
  'pendente',
  'preparando',
  'saiu_entrega',
  'entregue',
  'cancelado'
);

CREATE TYPE tipo_pagamento as enum (
  'dinheiro',
  'pix',
  'cartao_credito',
  'cartao_debito',
  'outro'
);

CREATE TABLE
  pedido (
    codigo serial PRIMARY KEY,
    cpf char(14),
    valor decimal(10, 2) NOT NULL,
    datahora timestamp NOT NULL,
    descricao text,
    status status_pedido NOT NULL,
    tipo_pagamento tipo_pagamento NOT NULL,
    FOREIGN KEY (cpf) REFERENCES pessoa (cpf) ON DELETE SET NULL
  );

CREATE TABLE
  pedido_prato (
    pedido_codigo int,
    prato_codigo int,
    quantidade int not null,
    FOREIGN KEY (pedido_codigo) REFERENCES pedido (codigo) ON DELETE SET NULL,
    FOREIGN KEY (prato_codigo) REFERENCES prato (codprt) ON DELETE SET NULL,
    PRIMARY KEY (pedido_codigo, prato_codigo)
  );

CREATE TABLE
  pedido_produto (
    pedido_codigo int,
    produto_codigo int,
    quantidade int not null,
    FOREIGN KEY (pedido_codigo) REFERENCES pedido (codigo) ON DELETE SET NULL,
    FOREIGN KEY (produto_codigo) REFERENCES produto (codpdt) ON DELETE SET NULL,
    PRIMARY KEY (pedido_codigo, produto_codigo)
  );