import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import PageHeader from "../../components/PageHeader";
import server from "../../server";
function ListarPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapeiaStatus = (status) => {
    const separaStatus = {
      pendente: "Pendente",
      preparando: "Preparando",
      saiu_entrega: "Saiu para Entrega",
      entregue: "Entregue",
      cancelado: "Cancelado",
    };
    return separaStatus[status] || "Desconhecido";
  };
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        console.log("Buscando lista de pedidos...");
        const response = await server.get("/pedido/lista");
        console.log("Pedidos recebidos:", response.data);

        if (response.data) {
          const pedidosAtualizados = response.data.map((pedido) => ({
            ...pedido,
            statusDescricao: mapeiaStatus(pedido.status),
          }));
          const pedidosOrdenados = pedidosAtualizados.sort((a, b) => {
            const prioridade = { Pendente: 1, Preparando: 2, "Saiu para Entrega": 3, Entregue: 4, Cancelado: 5 };
            return (prioridade[a.statusDescricao] || 6) - (prioridade[b.statusDescricao] || 6);
          });
          setPedidos(pedidosOrdenados);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Erro ao buscar pedidos:", err.message);
        setError("Erro ao carregar pedidos. Tente novamente mais tarde.");
        setIsLoading(false);
      }
    };
    fetchPedidos();
  }, []);
  return (
    <>
      <Header />
      <PageHeader titulo="Lista de Pedidos" />
      <div className="container mx-auto px-16 py-8">
        {isLoading ? (
          <p className="text-center text-gray-600">Carregando pedidos...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : pedidos.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-md leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Cliente</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Itens</th>
                <th className="py-3 px-6 text-left">Total (R$)</th>
                <th className="py-3 px-6 text-left">Data</th>
                <th className="py-3 px-6 text-left">Descrição</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {pedidos.map((pedido) => (
                <tr
                  key={pedido.codigo}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left">{pedido.codigo}</td>
                  <td className="py-3 px-6 text-left">
                    {pedido.pessoa?.nome || "N/A"}
                  </td>
                  <td className="py-3 px-6 text-left">{pedido.statusDescricao}</td>
                  <td className="py-3 px-6 text-left">
                    {pedido.pratos &&
                      pedido.pratos.map((prato) => (
                        <p key={`prato-${prato.prato_codigo}`}>
                          {prato.quantidade}x {prato.nome}
                        </p>
                      ))}
                    {pedido.produtos &&
                      pedido.produtos.map((produto) => (
                        <p key={`produto-${produto.produto_codigo}`}>
                          {produto.quantidade}x {produto.nome}
                        </p>
                      ))}
                  </td>
                  <td className="py-3 px-6 text-left">{pedido.valor}</td>
                  <td className="py-3 px-6 text-left">
                    {new Date(pedido.datahora).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-3 px-6 text-left">{pedido.descricao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600">Nenhum pedido encontrado.</p>
        )}
      </div>
    </>
  );
}

export default ListarPedidos;
