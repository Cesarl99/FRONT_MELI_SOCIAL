// DeixarDeSeguir.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function DeixarDeSeguir() {
  const navigate = useNavigate();
  const [idUsuarioDeixardeSeguir, setIdUsuarioDeixardeSeguir] = useState("");
  const [erro, setErro] = useState(null);

  // tenta ler o usuário logado do localStorage
  const dados = localStorage.getItem("usuarioLogado");
  const usuarioLogado = dados ? JSON.parse(dados) : null;

  async function handleDeixarDeSeguir() {
    try {
      setErro(null);

      if (!usuarioLogado) {
        setErro(
          "Você precisa informar o ID do usuário logado no topo da tela."
        );
        return;
      }

      if (!idUsuarioDeixardeSeguir) {
        setErro("Informe o ID do usuário que você quer deixar de seguir.");
        return;
      }

      const idUsuarioLogado = usuarioLogado.id;

      const url = `http://localhost:8080/users/${idUsuarioLogado}/unfollow/${idUsuarioDeixardeSeguir}`;
      await axios.post(url);

      navigate("/");
    } catch (error) {
      // se o backend respondeu (status 4xx ou 5xx)
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Dados:", error.response.data);
        console.error("Headers:", error.response.headers);

        // tenta mostrar uma mensagem mais útil na tela
        const mensagemBackend =
          typeof error.response.data === "string"
            ? error.response.data
            : error.response.data?.message ||
              "Erro ao deixar de seguir usuário.";

        setErro(`Erro ${error.response.status}: ${mensagemBackend}`);
      }
    }
  }

  return (
    <div>
      <h1>Deixar de Seguir</h1>

      <p>
        Usuário logado:{" "}
        {usuarioLogado
          ? `${usuarioLogado.nome} (ID: ${usuarioLogado.id})`
          : "nenhum usuário definido ainda"}
      </p>
      <div style={{ marginBottom: "8px" }}>
        <label>
          ID do usuário que você quer deixar de seguir:
          <input
            type="number"
            value={idUsuarioDeixardeSeguir}
            onChange={(e) => setIdUsuarioDeixardeSeguir(e.target.value)}
          />
        </label>
      </div>

      <button onClick={handleDeixarDeSeguir}>Salvar</button>

      {erro && <p style={{ color: "red" }}>{erro}</p>}
    </div>
  );
}
export default DeixarDeSeguir;
