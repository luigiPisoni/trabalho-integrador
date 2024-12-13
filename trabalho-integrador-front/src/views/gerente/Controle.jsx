import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Card from "../../components/Card";
import Header from "../../components/Header";
import PageHeader from "../../components/PageHeader";
import Modal from "../../components/Modal";
import server from "../../server";

function Controle() {
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState("pratos");
  const [action, setAction] = useState("novo");
  const [modal, setModal] = useState({
    open: false,
    titulo: "",
    codprt: null,
    codpdt: null,
    nome: "",
    valor: 0,
    ingredientes: [{}],
  });
  const [itens, setItens] = useState([]);

  const getLista = async () => {
    try {
      setLoading(true);
      const tabela = pagina === "pratos" ? "prato" : "produto";
      const response = await server.get(`/lista-${tabela}`);
      setItens(response.data);
      setLoading(false);
    } catch (erro) {
      console.error(erro);
      toast(`Erro ao listar os ${pagina}.`);
      setLoading(false);
    }
  };

  const handleSubmit = async (item) => {
    try {
      const tabela = pagina === "pratos" ? "prato" : "produto";

      let response;
      if (action === "novo") {
        response = await server.post(`/${tabela}/novo`, item);
        setModal({ ...modal, open: false });
        toast(
          `${pagina === "pratos" ? "Prato" : "Produto"} criado com sucesso!`
        );
        getLista();
      } else if (action == "atualizar") {
        const id = item.codprt || item.codpdt;
        response = await server.put(`/${tabela}/atualizar/${id}`, item);
        setModal({ ...modal, open: false });
        toast(
          `${pagina === "pratos" ? "Prato" : "Produto"} atualizado com sucesso!`
        );
        getLista();
      }
    } catch (erro) {
      console.error(erro);
      toast(`Erro ao atualizar o ${pagina}.`);
    }
  };

  useEffect(() => {
    getLista();
  }, [pagina]);

  return (
    <>
      <Header />
      <PageHeader
        titulo={`Controle de ${pagina === "pratos" ? "Pratos" : "Produtos"}`}
      />
      <div className="px-24 py-8">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setPagina("pratos")}
            className={`btn ${
              pagina === "pratos" ? "btn-primary" : "btn-secondary"
            }`}
          >
            Controle de Pratos
          </button>
          <button
            onClick={() => setPagina("produtos")}
            className={`btn ${
              pagina === "produtos" ? "btn-primary" : "btn-secondary"
            }`}
          >
            Controle de Produtos
          </button>
        </div>
        <Modal
          open={modal.open}
          close={() => setModal({ ...modal, open: false })}
          titulo={modal.titulo}
          codprt={modal.codprt}
          codpdt={modal.codpdt}
          nome={modal.nome}
          valor={modal.valor}
          ingredientes={modal.ingredientes}
          handleSubmit={handleSubmit}
        />
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {itens.map((item) => {
              const ingredientes =
                item.ingredientes?.map((i) => i.nome).join(", ") || "";

              return (
                <Card
                  key={item.codprt || item.codpdt}
                  nome={item.nome}
                  valor={item.valor}
                  descricao={
                    pagina === "pratos" ? ingredientes : item.descricao || ""
                  }
                  onClick={() => {
                    setModal({
                      open: true,
                      titulo: `Editar ${
                        pagina === "pratos" ? "prato" : "produto"
                      }`,
                      codprt: pagina === "pratos" ? item.codprt : null,
                      codpdt: pagina === "produtos" ? item.codpdt : null,
                      nome: item.nome,
                      valor: item.valor,
                      ingredientes:
                        pagina == "pratos" ? item.ingredientes || [{}] : [],
                    });
                    setAction("atualizar");
                  }}
                />
              );
            })}
            <Card
              onClick={() => {
                setModal({
                  open: true,
                  titulo: `Novo ${pagina === "pratos" ? "prato" : "produto"}`,
                  codprt: null,
                  codpdt: null,
                  nome: "",
                  valor: 0,
                  ingredientes: pagina === "pratos" ? [{}] : [],
                });
                setAction("novo");
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default Controle;
