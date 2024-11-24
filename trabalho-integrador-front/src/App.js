import "./App.css";
import "./output.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Header from "./components/Header";
import Featured from "./views/Featured";

function App() {
  return (
    <div className="App">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route index element={<Featured />} />
          {/* <Route path="" element={<Home />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
