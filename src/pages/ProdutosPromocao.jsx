// src/pages/ProdutoPromocao.jsx
import { useEffect, useState } from "react";
import axios from "axios";
function ProdutoPromocao() {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [vendedorId, setVendedorId] = useState("");

  async function buscarPublicacoes() {
    try {
      setErro(null);
      setCarregando(true);

      if (!vendedorId) {
        setErro("Informe o ID do vendedor.");
        return;
      }

      const url = `http://localhost:8080/products/promo-pub/list?user_id=${vendedorId}`;

      const response = await axios.get(url);

      console.log(response);

      setDados(response.data);
    } catch (error) {
      console.error("Erro ao buscar Publicacoes:", error);

      if (error.response) {
        const mensagemBackend =
          typeof error.response.data === "string"
            ? error.response.data
            : error.response.data?.message || "Erro ao buscar publicacoes.";

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
    <div style={{ padding: 16, fontFamily: "Arial, sans-serif" }}>
      <h1>Pesquise um vendedor para consultar </h1>
      <h1>produtos em promoção</h1>

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
        <button onClick={buscarPublicacoes} style={{ marginLeft: "8px" }}>
          Buscar
        </button>
      </div>

      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {carregando && <p>Carregando Publicacoes...</p>}

      {dados && !erro && (
        <>
          <div style={{ marginBottom: 12 }}>
            <p>
              Usuario id: <strong>{dados.user_id}</strong>
            </p>
            <p>
              Publicacoes:{" "}
              <strong>{dados.posts ? dados.posts.length : 0}</strong>
            </p>
          </div>

          <div style={{ borderTop: "1px solid #ccc", marginTop: 8 }}>
            {Array.isArray(dados.posts) && dados.posts.length > 0 ? (
              dados.posts.map((pub) => (
                <div
                  key={pub.post_id}
                  style={{
                    borderBottom: "1px solid #eee",
                    padding: "8px 0",
                  }}
                >
                  <span style={{ fontWeight: "normal" }}>
                    (Vendedor (ID): {pub.user_id})
                    <br />
                    <span
                      style={{
                        display: "inline-block",
                        marginTop: 4,
                        fontSize: 20,
                        textTransform: "uppercase",
                      }}
                    >
                      <strong>Publicação</strong>
                    </span>
                    <br />
                    ID da Publicação: {pub.post_id}
                    <br />
                    Data: {pub.date}
                    <br />
                    Categoria: {pub.category}
                    <br />
                    Preço:{" "}
                    <s>
                      {Number(pub.price).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </s>{" "}
                    Preço C/ Desconto: {""}
                    {(Number(pub.price) - Number(pub.discount)).toLocaleString(
                      "pt-BR",
                      {
                        style: "currency",
                        currency: "BRL",
                      }
                    )}{" "}
                    Desconto{" "}
                    {Number(pub.discount).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                    <br />
                    <span
                      style={{
                        display: "inline-block",
                        marginTop: 4,
                        fontSize: 18,
                        textTransform: "uppercase",
                      }}
                    >
                      <strong>Produto</strong>
                    </span>
                    <br />
                    ID do Produto: {pub.product.product_id}
                    <br />
                    Título: {pub.product.product_name}
                    <br />
                    Tipo: {pub.product.type}
                    <br />
                    Cor: {pub.product.color}
                    <br />
                    Marca: {pub.product.brand}
                    <br />
                    Notas: {pub.product.notes}
                  </span>
                </div>
              ))
            ) : (
              <p>Nenhuma publicação em promoção disponivel</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
export default ProdutoPromocao;
