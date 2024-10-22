import "./App.css";
import "./output.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Header from "./components/Header";
// import Home from "./views/Home";

function App() {
  return (
    <div className="App">
      <Header />
      {/* <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          
        </Routes>
      </BrowserRouter> */
      }
      
    </div>
    
  );
  App.get('/cardapio', (req, res) => {
    const cardapio = [
        { id: 1, nome: 'Pizza Margherita', preco: 35.00 },
        { id: 2, nome: 'Hambúrguer de Frango', preco: 22.00 },
    ];
    res.json(cardapio);
});
}
export default App;
