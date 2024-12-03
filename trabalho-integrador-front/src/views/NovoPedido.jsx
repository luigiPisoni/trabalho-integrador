import PageHeader from "../components/PageHeader";
import ListCard from "../components/ListCard";
import server from "../server";
import { useEffect, useState } from "react";
import { MoveRight, MoveLeft } from "lucide-react";

function NovoPedido() {
  // passo 1: pratos;
  // passo 2: produtos;
  // passo 3: descrição;
  const [passo, setPasso] = useState(1);
  const [loading, setLoading] = useState(true);
  const [listaItens, setListaItens] = useState([]);

  const [carrinho, setCarrinho] = useState([]);
  const [valorTotal, setValorTotal] = useState(0);
  const [descricao, setDescricao] = useState("");

  const getLista = async (tabela) => {
    try {
      setLoading(true);
      const response = await server.get(`/${tabela}/lista`);
      // console.log(response.data);

      setListaItens(response.data);
      setLoading(false);
    } catch (erro) {
      console.log(erro);

      setLoading(false);
    }
  };

  const postPedido = async (pedido) => {
    try {
      setLoading(true);

      const response = await server.post("/pedido/novo", pedido);
      alert("pedido criado");
      window.location.href = "/";
    } catch (erro) {
      console.log(erro);
      alert(erro);
      setLoading(false);
    }
  };

  useEffect(() => {
    getLista("prato");
  }, []);

  // controla cada parte da criação de um novo pedido
  const handlePassos = async (acao) => {
    // verifica se o clique do botão é válido para ir ou voltar de passo.
    let novoPasso = passo;
    if (acao === "next") {
      if (passo < 3) {
        novoPasso = passo + 1;
        setPasso(novoPasso);
      } else if (passo === 3) {
        // aqui envia um novo pedido pro back

        if (carrinho.length <= 0 || valorTotal < 0) {
          alert("Sem itens no carrinho");
          return;
        }

        let novoPedido = {
          itens: carrinho,
          valorTotal,
          descricao,
        };

        setLoading(true);

        await postPedido(novoPedido);
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
      // pega a lista de pratos do banco
      getLista("prato");
    }

    if (novoPasso === 2) {
      // pega a lista de produtos do banco
      getLista("produto");
    }
  };

  // item = {nome, valor, qnt}
  const adicionaCarrinho = (item) => {
    // não dá pra modificar carrinho, só definir um novo valor.

    let novoItem = {
      nome: item.nome,
      valor: item.valor,
      qnt: item.qnt,
    };

    if (item.codprt < 0) {
      novoItem.codpdt = item.codpdt;
    } else {
      novoItem.codprt = item.codprt;
    }

    let carrinhoAtualizado = [...carrinho, novoItem];

    setCarrinho(carrinhoAtualizado);
    setValorTotal(valorTotal + item.valor * item.qnt);

    // console.log(carrinho);
  };

  const removeCarrinho = (item) => {
    let carrinhoAtualizado = [];
    let removedItem;

    // cria uma nova lista sem o item removido e desconta o preço do valor total
    if (item.codprt) {
      carrinhoAtualizado = carrinho.filter(
        // i.codprt || null é pra não comparar
        (i) => (i.codprt || null) !== item.codprt
      );

      removedItem = carrinho.find((i) => i.codprt === item.codprt);
    } else {
      carrinhoAtualizado = carrinho.filter(
        (i) => (i.codpdt || null) !== item.codpdt
      );
      removedItem = carrinho.find((i) => i.codpdt === item.codpdt);
    }

    setCarrinho(carrinhoAtualizado);
    setValorTotal(valorTotal - removedItem.valor * removedItem.qnt);
  };

  return (
    <div>
      <PageHeader titulo={"Novo pedido"} />
      <div className="px-8 md:px-24 py-8">
        <div className="grid grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-2 grid grid-cols-1 gap-4 h-fit">
              <p>carregando...</p>
            </div>
          ) : (
            <div className="col-span-2 grid grid-cols-1 gap-4 h-fit">
              {passo === 3 ? (
                // caso passo === 3, vai renderizar o textfield
                <div>
                  <label
                    htmlFor="custom-textfield"
                    className="block font-bold mb-2"
                  >
                    Descrição do pedido (opcional):
                  </label>
                  <textarea
                    id="custom-textfield"
                    type="text"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="border-2 rounded-md p-2 w-full h-fit"
                    placeholder="Ex: sem carne, mais cebola..."
                  />
                </div>
              ) : (
                listaItens.map((item) => (
                  <ListCard
                    key={item.nome}
                    codprt={item.codprt || -1}
                    codpdt={item.codpdt || -1}
                    nome={item.nome}
                    valor={item.valor}
                    ingredientes={
                      item.ingredientes ? item.ingredientes.join(", ") : []
                    }
                    adicionaCarrinho={adicionaCarrinho}
                  />
                ))
              )}
            </div>
          )}
          <div>
            <div className="border-2 rounded-3xl overflow-hidden bg-light-green px-6 py-4">
              <p className="font-bold">Resumo do pedido</p>
              <div className="py-4">
                {carrinho.length > 0 &&
                  carrinho.map((item) => {
                    return (
                      <div
                        className="grid grid-cols-2 hover:bg-red-500 hover:cursor-pointer hover:pl-8 rounded-md transition-all"
                        onClick={() => removeCarrinho(item)}
                      >
                        <div className="text-left">
                          <p className="">
                            {item.nome} x{item.qnt}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="">
                            R$ {(item.valor * item.qnt).toFixed(2)}
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
                {passo !== 1 && (
                  <button
                    className={`bg-gray-400 grid grid-cols-2 w-full px-4 p-3 text-white rounded-md disabled:opacity-75 hover:opacity-80 transition-opacity`}
                    onClick={() => handlePassos("prev")}
                    disabled={loading}
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
                  className={`bg-default-green grid grid-cols-2 w-full px-4 p-3 text-white rounded-md disabled:opacity-75 hover:opacity-80 transition-opacity 
                    ${passo === 1 && "col-span-2"}`}
                  onClick={() => handlePassos("next")}
                  disabled={loading}
                >
                  <div className="text-left">
                    <p>{passo == 3 ? "Finalizar" : "Próximo"}</p>
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
