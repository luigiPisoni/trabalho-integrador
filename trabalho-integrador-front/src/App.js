import "./App.css";
import "./output.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Header from "./components/Header";
import Featured from "./views/Featured";
import Login from "./views/Login";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Featured />} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
