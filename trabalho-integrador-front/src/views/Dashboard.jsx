import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import PageHeader from "../components/PageHeader";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function Dashboard() {
  const [chartData, setChartData] = useState(null); // Dados do gráfico
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    // Buscar dados do back-end
    const fetchData = async () => {
      try {
        const response = await fetch("/diario"); // Certifique-se de que a API está acessível
        const data = await response.json();

        // Processar os dados recebidos
        const labels = data.map((item) => item.data); // Datas
        const receitas = data.map((item) => item.total); // Totais
        const lucros = data.map((item) => item.lucro); // Lucros

        // Atualizar os dados do gráfico
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
        setIsLoading(false); // Finaliza o carregamento
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setIsLoading(false); // Finaliza o carregamento mesmo em caso de erro
      }
    };

    fetchData();
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
            {/* Você pode adicionar o gráfico de "Pedidos por Status" aqui */}
          </div>

          {/* Gráfico de Receitas do Dia */}
          <div className="bg-light-green border border-gray-200 rounded-lg shadow p-8">
            <h3 className="text-lg font-semibold mb-4">Lucro Do Dia</h3>
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
