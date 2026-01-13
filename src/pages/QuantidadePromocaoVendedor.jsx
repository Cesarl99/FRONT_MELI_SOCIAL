// src/pages/QuantidadeSeguidoresVendedores.jsx
import { useState } from "react";
import axios from "axios";

function QuantidadePromocaoVendedor() {
  const [vendedorId, setVendedorId] = useState(""); // ID digitado
  const [dados, setDados] = useState(null); // resposta do backend
  const [erro, setErro] = useState(null); // mensagem de erro
  const [carregando, setCarregando] = useState(false);

  async function QtdDePromoacao() {
    try {
      setErro(null);
      setDados(null);

      if (!vendedorId) {
        setErro("Informe o ID do vendedor.");
        return;
      }

      setCarregando(true);

      const url = `http://localhost:8080/products/promo-pub/count?user_id=${vendedorId}`;
      const response = await axios.get(url);

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
      <h1>Pesquise vendedor para apresentar a quantidade de promoções</h1>

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
        <button onClick={QtdDePromoacao} style={{ marginLeft: "8px" }}>
          Buscar
        </button>
      </div>

      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {carregando && <p>Carregando...</p>}

      {dados && !erro && !carregando && (
        <div>
          <p>
            Usuário: {dados.user_name} (ID: {dados.user_id})
          </p>
          <p>
            Número de Promoções: <strong>{dados.promo_products_count}</strong>
          </p>
        </div>
      )}
    </div>
  );
}

export default QuantidadePromocaoVendedor;
