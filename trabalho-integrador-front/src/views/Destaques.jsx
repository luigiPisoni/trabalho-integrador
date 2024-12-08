import PageHeader from "../components/PageHeader";
import Header from "../components/Header";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import server from "../server";

function Destaques() {
  const [pratos, setPratos] = useState([]);

  const getLista = async () => {
    try {
      const response = await server.get(`/destaques`);
      setPratos(response.data);
    } catch (erro) {
      console.error(erro);
      toast(`Erro ao listar os pratos em destaque.`);
    }
  };

  useEffect(() => {
    getLista();
  }, []);

  return (
    <>
      <Header />
      <PageHeader titulo={"Pratos em destaque"} />
      <div className="px-8 md:px-24 py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {pratos.map((prato) => {
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
