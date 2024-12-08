import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Card from "../../components/Card";
import Header from "../../components/Header";
import PageHeader from "../../components/PageHeader";
import Modal from "../../components/Modal";
import server from "../../server";

function Controle() {
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({
    open: false,
    titulo: "Novo prato",
    codpdt: null,
    codprt: null,
    nome: "",
    valor: 0,
    ingredientes: [{}],
  });

  const [itens, setItens] = useState([]);

  const getLista = async (tabela) => {
    try {
      setLoading(true);
      const response = await server.get(`/lista-${tabela}`);

      setItens(response.data);
      setLoading(false);
    } catch (erro) {
      console.log(erro);
      toast("Erro ao listar os itens.");
      setLoading(false);
    }
  };

  const handleSubmit = async (item) => {
    console.log(item);
    const response = await server.put(
      `/prato/atualizar/${item.codprt || item.codpdt}`,
      item
    );
  };

  useEffect(() => {
    getLista("prato");
  }, []);

  return (
    <>
      <Header />
      <PageHeader titulo={"Controle de pratos"} />
      <Modal
        open={modal.open}
        close={() => {
          setModal(false);
        }}
        titulo={modal.titulo}
        codpdt={modal.codpdt}
        codprt={modal.codprt}
        nome={modal.nome}
        valor={modal.valor}
        ingredientes={modal.ingredientes}
        handleSubmit={handleSubmit}
      />
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
                key={item.codprt || item.codprt}
                nome={item.nome}
                valor={item.valor}
                // ingredientes={ingredientes.join(", ") || []}
                onClick={() => {
                  setModal({
                    open: true,
                    titulo: "Editar prato",
                    codprt: item.codprt || null,
                    codpdt: item.codpdt || null,
                    nome: item.nome,
                    valor: item.valor,
                    ingredientes: item.ingredientes,
                  });
                }}
              />
            );
          })}
          <Card
            onClick={() => {
              setModal({ open: true, titulo: "Novo prato" });
            }}
          />
        </div>
      </div>
    </>
  );
}

export default Controle;
