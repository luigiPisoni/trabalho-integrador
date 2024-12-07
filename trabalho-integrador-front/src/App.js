import "./App.css";
import "./output.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./views/Login";
import Destaques from "./views/Destaques";
import NovoPedido from "./views/NovoPedido";
import Dashboard from "./views/Dashboard";

function App() {
  return (
    <div className="App">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        draggable={false}
      />
      <BrowserRouter>
        <Routes>
          <Route index element={<Destaques />} />
          <Route path="/novo-pedido" element={<NovoPedido />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
