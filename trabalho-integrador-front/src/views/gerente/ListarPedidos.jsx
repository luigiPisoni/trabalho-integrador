import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import PageHeader from "../../components/PageHeader";
import server from "../../server";
import { toast } from "react-toastify";

function ListarPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPedidos = async () => {
    try {
      const response = await server.get("/pedido/lista");

      if (response.data) {
        setPedidos(response.data);
      }
      setIsLoading(false);
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err.message);
      setError("Erro ao carregar pedidos. Tente novamente mais tarde.");
      setIsLoading(false);
    }
  };

  const handleStatus = async (codigo, novo_status) => {
    try {
      setIsLoading(true);
      const data = {
        codigo,
        novo_status,
      };

      const response = await server.put("/pedido/atualizar-status", data);
      setIsLoading(false);
      console.log(response.data);

      toast(response.data.mensagem);
      fetchPedidos();
    } catch (error) {
      console.log(error);

      setIsLoading(false);
      toast(error.data.mensagem);
    }
  };

  useEffect(() => {
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
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-md leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Cliente</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Itens</th>
                <th className="py-3 px-6 text-left">Total (R$)</th>
                <th className="py-3 px-6 text-left">Modo de Pagamento</th>
                <th className="py-3 px-6 text-left">Data</th>
                <th className="py-3 px-6 text-left">Descrição</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {pedidos.map((pedido) => {
                return (
                  <tr
                    key={pedido.codigo}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left ">{pedido.codigo}</td>
                    <td className="py-3 px-6 text-left">
                      {pedido.pessoa?.nome || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {
                        // pedido.status
                        <select
                          name="pagamento"
                          value={pedido.status}
                          className={`block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 sm:text-sm
                                  ${
                                    pedido.status === "preparando"
                                      ? "bg-yellow-500 text-white"
                                      : pedido.status === "pendente"
                                      ? "bg-gray-400 text-white"
                                      : pedido.status === "saiu_entrega"
                                      ? "bg-blue-500 text-white"
                                      : pedido.status === "entregue"
                                      ? "bg-green-500 text-white"
                                      : "bg-red-500 text-white" // Cancelado
                                  }`}
                          onChange={(e) => {
                            handleStatus(pedido.codigo, e.target.value);
                          }}
                        >
                          <option value="preparando">Preparando</option>
                          <option value="pendente">Pendente</option>
                          <option value="saiu_entrega">Entregando</option>
                          <option value="entregue">Entregue</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      }
                    </td>
                    <td className="py-3 px-6 text-left">
                      {pedido.pratos &&
                        pedido.pratos.map((prato) => {
                          return (
                            <p>
                              {prato.quantidade}x {prato.nome}
                            </p>
                          );
                        })}
                      {pedido.produtos &&
                        pedido.produtos.map((produto) => {
                          return (
                            <p>
                              {produto.quantidade}x {produto.nome}
                            </p>
                          );
                        })}
                    </td>
                    <td className="py-3 px-6 text-left">{pedido.valor}</td>
                    <td className="py-3 px-6 text-left">
                      {pedido.tipo_pagamento}
                    </td>

                    <td className="py-3 px-6 text-left">
                      {new Date(pedido.datahora).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-3 px-6 text-left">{pedido.descricao}</td>
                  </tr>
                );
              })}
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
