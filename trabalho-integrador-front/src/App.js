import "./App.css";
import "./output.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Header from "./components/Header";

import Destaques from "./views/Destaques";
import NovoPedido from "./views/NovoPedido";

function App() {
  return (
    <div className="App">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route index element={<Destaques />} />
          <Route path="/novo-pedido" element={<NovoPedido />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
