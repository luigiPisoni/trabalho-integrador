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
}
export default App;
