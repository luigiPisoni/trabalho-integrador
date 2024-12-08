import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Card from "../../components/Card";
import Header from "../../components/Header";
import PageHeader from "../../components/PageHeader";
import server from "../../server";

function Controle() {
  const [loading, setLoading] = useState(true);

  const [itens, setItens] = useState([]);

  const getLista = async (tabela) => {
    try {
      setLoading(true);
      const response = await server.get(`/lista/${tabela}`);
      // console.log(response.data);

      setItens(response.data);
      setLoading(false);
    } catch (erro) {
      console.log(erro);
      toast("Erro ao listar os itens.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getLista("prato");
  }, []);

  return (
    <>
      <Header />
      <PageHeader titulo={"Controle de pratos"} />
      <div className="px-24 py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {itens.map((item) => {
            let ingredientes = [];

            if ("ingredientes" in item) {
              for (const ingrediente of item.ingredientes) {
                ingredientes.push(ingrediente.nome);
              }
            }

            return (
              <Card
                nome={item.nome}
                valor={item.valor}
                ingredientes={ingredientes.join(", ") || []}
                onClick={() => {}}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Controle;
