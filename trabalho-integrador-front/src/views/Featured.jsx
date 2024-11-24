import PageHeader from "../components/PageHeader";
import Card from "../components/Card";

function Home() {
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
  return (
    <>
      <PageHeader />
      <div className="px-8 md:px-24 py-8 ">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {pratosDestaques.map((prato) => {
            return (
              <Card
                nome={prato.nome}
                preco={prato.preco}
                ingredientes={prato.ingredientes}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Home;
