import PageHeader from "../components/PageHeader";
import ListCard from "../components/ListCard";
import { useState } from "react";
import { MoveRight, MoveLeft } from "lucide-react";

function NovoPedido() {
  // passo 1: pratos;
  // passo 2: produtos;
  // passo 3: descrição;
  const [passo, setPasso] = useState(1);

  const [carrinho, setCarrinho] = useState([]);
  const [valorTotal, setValorTotal] = useState(0);
  const [listaItens, setListaItens] = useState([
    {
      nome: "Prato em Destaque Lala",
      preco: 49.99,
      ingredientes: ["porco", "boi", "galinha"],
    },
    {
      nome: "Prato em Destaque Lele",
      preco: 2,
      ingredientes: ["raditi", "alface", "repolho"],
    },
    {
      nome: "Prato em Destaque Lili",
      preco: 3,
      ingredientes: ["cacetinho", "frances", "de forma"],
    },
    {
      nome: "Prato em Destaque Lolo",
      preco: 4,
      ingredientes: ["brigadeiro", "bolo", "picole"],
    },
    {
      nome: "Prato em Destaque Lulu",
      preco: 5,
      ingredientes: [
        "pinche",
        "pendejo",
        "quihwduqdwiuhohqdwiquwhodiquwhdoiuqhwdoiuqhwdioohiuqwdihuqhiuwd",
      ],
    },
  ]);

  const handlePassos = (acao) => {
    // verifica se o clique do botão é válido e pode ir ou voltar de passo.
    var novoPasso = passo;
    if (acao === "next") {
      if (passo < 3) {
        novoPasso = passo + 1;
        setPasso(novoPasso);
      }
    } else if (acao === "prev") {
      if (passo > 1) {
        novoPasso = passo - 1;
        setPasso(novoPasso);
      }
    }

    // passo 1: listar os pratos
    // é usado novoPasso pela assincronização no setPasso
    if (novoPasso === 1) {
      // pega os pratos do banco
      var listaPlaceholder = [
        {
          nome: "produto em Destaque Lele",
          preco: 2,
          ingredientes: ["raditi", "alface", "repolho"],
        },
        {
          nome: "produto em Destaque Lili",
          preco: 3,
          ingredientes: ["cacetinho", "frances", "de forma"],
        },
        {
          nome: "produto em Destaque Lolo",
          preco: 4,
          ingredientes: ["brigadeiro", "bolo", "picole"],
        },
        {
          nome: "produto em Destaque Lulu",
          preco: 5,
          ingredientes: [
            "pinche",
            "pendejo",
            "quihwduqdwiuhohqdwiquwhodiquwhdoiuqhwdoiuqhwdioohiuqwdihuqhiuwd",
          ],
        },
      ];

      setListaItens(listaPlaceholder);
    }

    if (novoPasso === 2) {
      // pega os pratos do banco
      var listaPlaceholder = [
        {
          nome: "produto em Destaque Lulu",
          preco: 5,
        },
      ];

      setListaItens(listaPlaceholder);
    }
  };

  // item = {nome, preco, qnt}
  const adicionaCarrinho = (item) => {
    // não dá pra modificar carrinho, só definir um novo valor.
    var carrinhoAtualizado = [...carrinho, item];

    setCarrinho(carrinhoAtualizado);
    setValorTotal(valorTotal + item.preco * item.qnt);
  };

  const removeCarrinho = (key) => {
    // cria uma nova lista sem o item removido.
    const carrinhoAtualizado = carrinho.filter((item) => item.nome !== key);
    const removedItem = carrinho.find((item) => item.nome === key);

    setCarrinho(carrinhoAtualizado);
    setValorTotal(valorTotal - removedItem.preco * removedItem.qnt);
  };

  return (
    <div>
      <PageHeader titulo={"Novo pedido"} />
      <div className="px-8 md:px-24 py-8">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 grid grid-cols-1 gap-4 h-fit">
            {listaItens.map((item) => {
              return (
                <ListCard
                  key={item.nome}
                  nome={item.nome}
                  preco={item.preco}
                  ingredientes={
                    item.ingredientes ? item.ingredientes.join(", ") : []
                  }
                  adicionaCarrinho={adicionaCarrinho}
                />
              );
            })}
          </div>
          <div>
            <div className="border-2 rounded-3xl overflow-hidden bg-light-green px-6 py-4">
              <p className="font-bold">Resumo do pedido</p>
              <div className="py-4">
                {carrinho.length > 0 &&
                  carrinho.map((item) => {
                    return (
                      <div
                        className="grid grid-cols-2 hover:bg-red-500 hover:cursor-pointer hover:pl-8 rounded-md transition-all"
                        onClick={() => removeCarrinho(item.nome)}
                      >
                        <div className="text-left">
                          <p className="">
                            {item.nome} x{item.qnt}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="">
                            R$ {(item.preco * item.qnt).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="grid grid-cols-2 pb-4">
                <div className="text-left">
                  <p className="font-bold">Total</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl">
                    R$ {valorTotal.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {passo != 1 && (
                  <button
                    className={`bg-gray-400 grid grid-cols-2 p-3 text-white rounded-md hover:opacity-80 transition-opacity w-full px-4`}
                    onClick={() => handlePassos("prev")}
                  >
                    <div>
                      <div>
                        <MoveLeft className="mr-auto" />
                      </div>
                    </div>
                    <div className="text-right">
                      <p>Voltar</p>
                    </div>
                  </button>
                )}
                <button
                  className={`bg-default-green grid grid-cols-2 p-3 text-white rounded-md hover:opacity-80 transition-opacity w-full px-4
                    ${passo === 1 && "col-span-2"}`}
                  onClick={() => handlePassos("next")}
                >
                  <div className="text-left">
                    <p>Próximo</p>
                  </div>
                  <div>
                    <div>
                      <MoveRight className="ml-auto" />
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NovoPedido;
