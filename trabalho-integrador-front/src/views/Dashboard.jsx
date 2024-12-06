import Header from "../components/Header";
import PageHeader from "../components/PageHeader";

// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function Dashboard() {
//   const pedidosPorStatusData = {
//     labels: ["10h", "12h", "14h", "16h", "18h"],
//     datasets: [
//       {
//         label: "Pedidos Pendentes",
//         data: [5, 10, 15, 10, 5],
//         borderColor: "#FF6384",
//         backgroundColor: "rgba(255, 99, 132, 0.2)",
//         borderWidth: 2,
//         tension: 0.4,
//       },
//       {
//         label: "Pedidos Entregues",
//         data: [2, 12, 8, 15, 20],
//         borderColor: "#36A2EB",
//         backgroundColor: "rgba(54, 162, 235, 0.2)",
//         borderWidth: 2,
//         tension: 0.4,
//       },
//     ],
//   };

//   // Dados para o gráfico de "Receitas do Dia"
//   const receitasDoDiaData = {
//     labels: ["Seg", "Ter", "Qua", "Qui", "Sex"], 
//      datasets: [
//       {
//         label: "Receitas (R$)",
//         data: [300, 500, 700, 800, 600],
//         borderColor: "#4CAF50",
//         backgroundColor: "rgba(76, 175, 80, 0.2)",
//         borderWidth: 2,
//         tension: 0.4,
//       },
//     ],
//   };

//   // Configurações comuns para os gráficos
//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//       tooltip: {
//         enabled: true,
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   };

  return (
    <>
      <Header />
      <PageHeader titulo={"Dashboard"} />
      <div className="px-24 py-8 ">
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
          
          <div className="bg-light-green border border-gray-200 rounded-lg shadow p-8">
            <h3 className="text-lg font-semibold mb-4">Pedidos por Status</h3>
            {/* <Line data={pedidosPorStatusData} options={chartOptions} /> */}
          </div>

          {/* Gráfico de Receitas do Dia */}
          <div className="bg-light-green border border-gray-200 rounded-lg shadow p-8">
            <h3 className="text-lg font-semibold mb-4">Receitas do Dia</h3>
            {/* <Line data={receitasDoDiaData} options={chartOptions} />
          */}</div> 
        </div>
      </div>
    </>
  );
}

export default Dashboard;