// src/App.jsx
import { Routes, Route } from "react-router-dom";
import TopMenu from "./components/TopMenu";
import SeguirVendedor from "./pages/SeguirVendedor";
import QuemMeSegue from "./pages/QuemMeSegue";
import QuemEstouSeguindo from "./pages/QuemEstouSeguindo";
import DeixarDeSeguir from "./pages/DeixarDeSeguir";
import NovaPublicacao from "./pages/NovaPublicacao";
import Publicacoes from "./pages/Publicacoes";
import ProdutosPromocao from "./pages/ProdutosPromocao";
import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
  return (
    <div style={{ fontFamily: "Arial" }}>
      {/* menu fixo no topo */}
      <TopMenu />
      {/* área que muda conforme a rota */}
      <main style={{ padding: "20px" }}>
        <Routes>
          <Route path="/seguir-vendedor" element={<SeguirVendedor />} />
          <Route path="/quem-me-segue" element={<QuemMeSegue />} />
          <Route path="/quem-estou-seguindo" element={<QuemEstouSeguindo />} />
          <Route path="/deixar-de-seguir" element={<DeixarDeSeguir />} />
          <Route path="/nova-publicacao" element={<NovaPublicacao />} />
          <Route path="/publicacoes" element={<Publicacoes />} />
          <Route path="/produtos-promocao" element={<ProdutosPromocao />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;