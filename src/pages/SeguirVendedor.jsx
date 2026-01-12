// src/pages/SeguirVendedor.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SeguirVendedor() {
  const navigate = useNavigate();
  const [idUsuarioASeguir, setIdUsuarioASeguir] = useState("");
  const [erro, setErro] = useState(null);

  // tenta ler o usuário logado do localStorage
  const dados = localStorage.getItem("usuarioLogado");
  const usuarioLogado = dados ? JSON.parse(dados) : null;

  async function handleSalvar() {
    try {
      setErro(null);

      if (!usuarioLogado) {
        setErro("Você precisa informar o ID do usuário logado no topo da tela.");
        return;
      }

      if (!idUsuarioASeguir) {
        setErro("Informe o ID do usuário que você quer seguir.");
        return;
      }

      const idUsuarioLogado = usuarioLogado.id;

      const url = `http://localhost:8080/users/${idUsuarioLogado}/follow/${idUsuarioASeguir}`;
      await axios.post(url);

      navigate("/");
    } catch (error) {
    
      if (error.response) {
          console.error("Status:", error.response.status);
          console.error("Dados:", error.response.data);
          console.error("Headers:", error.response.headers);
          const mensagemBackend =
              typeof error.response.data === "string"
              ? error.response.data
              : error.response.data?.message || "Erro ao deixar de seguir usuário.";

          setErro(`Erro ${error.response.status}: ${mensagemBackend}`);
      }
    }
  }

  return (
    <div>
      <h1>Seguir Vendedor</h1>

      <p>
        Usuário logado:{" "}
        {usuarioLogado
          ? `${usuarioLogado.nome} (ID: ${usuarioLogado.id})`
          : "nenhum usuário definido ainda"}
      </p>

      <div style={{ marginBottom: "8px" }}>
        <label>
          ID do usuário que você quer seguir:
          <input
            type="number"
            value={idUsuarioASeguir}
            onChange={(e) => setIdUsuarioASeguir(e.target.value)}
          />
        </label>
      </div>

      <button onClick={handleSalvar}>Salvar</button>

      {erro && <p style={{ color: "red" }}>{erro}</p>}
    </div>
  );
}

export default SeguirVendedor;