import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import PageHeader from "../../components/PageHeader";
import server from "../../server";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  BarElement,
  Title,
} from "chart.js";


ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement,BarElement,Title, Tooltip, Legend);

function Dashboard() {
  const [chartData, setChartData] = useState(null); // Dados do gráfico
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    // Buscar dados do back-end
    const fetchData = async () => {
      try {
        const response = await server.get('/lucro/diario'); 
        const labels = response.data.lucro.map((item) => {
          // Garantir que as datas estão no formato correto (dia-mês-ano)
          return new Date(item.data).toLocaleDateString('pt-BR'); 
        });

        const receitas = response.data.lucro.map((item) => item.total);
        const lucros = response.data.lucro.map((item) => item.lucro);
        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Receitas (R$)",
              data: receitas,
              borderColor: "#4CAF50",
              backgroundColor: "rgba(76, 175, 80, 0.2)",
              borderWidth: 2,
              tension: 0.4,
            },
            {
              label: "Lucro (R$)",
              data: lucros,
              borderColor: "#FF9800",
              backgroundColor: "rgba(255, 152, 0, 0.2)",
              borderWidth: 2,
              tension: 0.4,
            },
          ],
        });
        setIsLoading(false); // Atualiza o estado para mostrar o gráfico
      } catch (error) {
        console.log("Erro ao buscar os dados do gráfico:", error.message);
        setIsLoading(false); // Atualiza o estado mesmo se ocorrer um erro
      }
    };

    fetchData();
  }, []);
  
  const [chartPedidos, setChartPedidos] = useState(null); // Dados do gráfico
  const [isLoadingP, setIsLoadingP] = useState(true); // Estado de carregamento

  useEffect(() => {
    // Buscar dados do backend
    const fetchPedido = async () => {
      try {
        const response = await server.get('/pedido/status'); // Endpoint de pedidos por status
        console.log(response.data);
        // Processamento dos dados para o gráfico
        const labels = response.data.status.map(item => item.status); // Status dos pedidos
        const totalPedidos = response.data.status.map(item => item.total); // Total de pedidos por status

        console.log('Labels:', labels);  // Verifique as labels
        console.log('Total de pedidos:', totalPedidos);  
        // Atualizar os dados do gráfico
        setChartPedidos({
          labels: labels,
          datasets: [
            {
              label: 'Pedidos por Status',
              data: totalPedidos,
              backgroundColor: [
                'rgba(76, 175, 80, 0.5)',
                'rgba(255, 152, 0, 0.5)',
                'rgba(33, 150, 243, 0.5)',
                'rgba(244, 67, 54, 0.5)',
                'rgba(158, 158, 158, 0.5)',
              ],
              borderColor: [
                'rgba(76, 175, 80, 1)',
                'rgba(255, 152, 0, 1)',
                'rgba(33, 150, 243, 1)',
                'rgba(244, 67, 54, 1)',
                'rgba(158, 158, 158, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });
        setIsLoadingP(false); // Atualiza o estado para mostrar o gráfico
      } catch (error) {
        console.error('Erro ao buscar os dados do gráfico:', error.message);
        setIsLoadingP(false); // Atualiza o estado mesmo se ocorrer um erro
      }
    };

    fetchPedido();
  }, []);

  // Configurações do gráfico
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <>
    
      <Header />
      <PageHeader titulo={"Dashboard"} />
      <div className="px-24 py-8">
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-light-green border border-gray-200 rounded-lg shadow p-4 text-center">
            <h3 className="uppercase text-lg font-semibold">Pedidos do Dia</h3>
            <p className="">1337</p>
          </div>
          <div className="bg-light-green border border-gray-200 rounded-lg shadow p-4 text-center">
            <h3 className="uppercase text-lg font-semibold">Pedidos Totais</h3>
            <p className="">1337</p>
          </div>
          <div className="bg-light-green border border-gray-200 rounded-lg shadow p-4 text-center">
            <h3 className="uppercase text-lg font-semibold">Clientes Registrados</h3>
            <p className="">1337</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-8">
          {/* Pedidos por Status */}
          <div className="bg-light-green border border-gray-200 rounded-lg shadow p-8">
            <h3 className="text-lg font-semibold mb-4">Pedidos por Status</h3>
            {isLoadingP ? (
              <p>Carregando dados...</p>
            ) : chartPedidos ? (
              <Line data={setChartPedidos} options={chartOptions} />
            ) : (
              <p>Erro ao carregar dados.</p>
            )}
          </div>
          {/* Gráfico de Receitas do Dia */}
          <div className="bg-light-green border border-gray-200 rounded-lg shadow p-8">
            <h3 className="text-lg font-semibold mb-4">Lucro do Dia</h3>
            {isLoading ? (
              <p>Carregando dados...</p>
            ) : chartData ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <p>Erro ao carregar dados.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
