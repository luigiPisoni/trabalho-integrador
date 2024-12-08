import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import PageHeader from "../../components/PageHeader";
import server from "../../server";

function ListarPedidos() {
  // Estado para armazenar os pedidos, carregamento e erros
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar os pedidos do servidor ao carregar o componente
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await server.get("/pedido/lista"); // Ajuste o endpoint para corresponder ao back-end
        if (response.data) {
          setPedidos(response.data); // Adapte para o formato do retorno do back-end
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
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <p className="text-center text-gray-600">Carregando pedidos...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : pedidos.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Cliente</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Total (R$)</th>
                <th className="py-3 px-6 text-left">Data</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {pedidos.map((pedido) => (
                <tr
                  key={pedido.codigo}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left">{pedido.codigo}</td>
                  <td className="py-3 px-6 text-left">{pedido.pessoa?.nome || "N/A"}</td>
                  <td className="py-3 px-6 text-left">{pedido.status}</td>
                  <td className="py-3 px-6 text-left">
                    {pedido.valor}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {new Date(pedido.datahora).toLocaleDateString("pt-BR")}
                  </td>
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
