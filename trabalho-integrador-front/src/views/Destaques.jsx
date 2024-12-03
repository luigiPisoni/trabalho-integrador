import PageHeader from "../components/PageHeader";
import Header from "../components/Header";
import Card from "../components/Card";

function Destaques() {
  const pratosDestaques = [
    {
      nome: "Prato em Destaque Lala",
      valor: 23.52,
      ingredientes: ["porco", "boi", "galinha"],
    },
    {
      nome: "Prato em Destaque Lele",
      valor: 23.53,
      ingredientes: ["raditi", "alface", "repolho"],
    },
    {
      nome: "Prato em Destaque Lili",
      valor: 23.51,
      ingredientes: ["cacetinho", "frances", "de forma"],
    },
    {
      nome: "Prato em Destaque Lolo",
      valor: 23.55,
      ingredientes: ["brigadeiro", "bolo", "picole"],
    },
    {
      nome: "Prato em Destaque Lulu",
      valor: 23.56,
      ingredientes: [
        "pinche",
        "pendejo",
        "quihwduqdwiuhohqdwiquwhodiquwhdoiuqhwdoiuqhwdioohiuqwdihuqhiuwd",
      ],
    },
  ];
  return (
    <>
      <Header />
      <PageHeader titulo={"Pratos em destaque"} />
      <div className="px-8 md:px-24 py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {pratosDestaques.map((prato) => {
            return (
              <Card
                nome={prato.nome}
                valor={prato.valor}
                ingredientes={prato.ingredientes}
                onClick={() => {
                  window.location.href = "/novo-pedido";
                }}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Destaques;
