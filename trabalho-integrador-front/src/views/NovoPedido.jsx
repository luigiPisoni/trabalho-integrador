import PageHeader from "../components/PageHeader";
import ListCard from "../components/ListCard";

function NovoPedido() {
  const pratosDestaques = [
    {
      nome: "Prato em Destaque Lala",
      preco: 23.52,
      ingredientes: ["porco", "boi", "galinha"],
    },
    {
      nome: "Prato em Destaque Lele",
      preco: 23.53,
      ingredientes: ["raditi", "alface", "repolho"],
    },
    {
      nome: "Prato em Destaque Lili",
      preco: 23.51,
      ingredientes: ["cacetinho", "frances", "de forma"],
    },
    {
      nome: "Prato em Destaque Lolo",
      preco: 23.55,
      ingredientes: ["brigadeiro", "bolo", "picole"],
    },
    {
      nome: "Prato em Destaque Lulu",
      preco: 23.56,
      ingredientes: [
        "pinche",
        "pendejo",
        "quihwduqdwiuhohqdwiquwhodiquwhdoiuqhwdoiuqhwdioohiuqwdihuqhiuwd",
      ],
    },
  ];

  const adicionarPrato = (itemCarrinho) => {
    // console.log(prato, valor, qnt);
    // carrinho.push({ ...prato, quantidade });
  };

  const carrinho = [];

  return (
    <div>
      <PageHeader titulo={"Novo pedido"} />
      <div className="px-8 md:px-24 py-8">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 grid grid-cols-1 gap-4">
            {pratosDestaques.map((prato) => {
              return (
                <ListCard
                  key={prato.nome}
                  nome={prato.nome}
                  preco={prato.preco}
                  ingredientes={prato.ingredientes.join(", ")}
                  onClick={adicionarPrato}
                />
              );
            })}
          </div>
          <div className="bg-slate-400">espaço do resumo do pedido</div>
        </div>
      </div>
    </div>
  );
}

export default NovoPedido;
