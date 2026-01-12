// src/pages/QuantidadeSeguidoresVendedores.jsx
import { useState } from "react";
import axios from "axios";

function QuantidadeSeguidoresVendedor() {
  const [vendedorId, setVendedorId] = useState("");   // ID digitado
  const [dados, setDados] = useState(null);           // resposta do backend
  const [erro, setErro] = useState(null);             // mensagem de erro
  const [carregando, setCarregando] = useState(false);

  async function QtdDeSeguidores() {
    try {
      setErro(null);
      setDados(null);

      if (!vendedorId) {
        setErro("Informe o ID do vendedor.");
        return;
      }

      setCarregando(true);

      const url = `http://localhost:8080/users/${vendedorId}/followers/count`;
      const response = await axios.get(url);

      // espera algo assim:
      // { "userId": 234, "userName": "vendedor1", "followersCount": 35 }
      setDados(response.data);
    } catch (error) {
      console.error("Erro ao buscar followers:", error);

      if (error.response) {
        const mensagemBackend =
          typeof error.response.data === "string"
            ? error.response.data
            : error.response.data?.message || "Erro ao buscar followers.";

        setErro(`Erro ${error.response.status}: ${mensagemBackend}`);
      } else if (error.request) {
        setErro("Servidor não respondeu. Verifique se o backend está rodando.");
      } else {
        setErro("Erro ao preparar requisição. Veja o console.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div>
      <h1>Pesquise a quantidade de seguidores de determinado usuario</h1>

      {/* Campo para digitar o ID do vendedor */}
      <div style={{ marginBottom: "12px" }}>
        <label>
          ID do vendedor:
          <input
            type="number"
            value={vendedorId}
            onChange={(e) => setVendedorId(e.target.value)}
            style={{ marginLeft: "8px", width: "100px" }}
          />
        </label>
        <button
          onClick={QtdDeSeguidores}
          style={{ marginLeft: "8px" }}
        >
          Buscar
        </button>
      </div>

      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {carregando && <p>Carregando...</p>}

      {dados && !erro && !carregando && (
        <div>
          <p>
            Usuário: {dados.userName} (ID: {dados.userId})
          </p>
          <p>
            Número de seguidores:{" "}
            <strong>{dados.followersCount}</strong>
          </p>
        </div>
      )}
    </div>
  );
}

export default QuantidadeSeguidoresVendedor;