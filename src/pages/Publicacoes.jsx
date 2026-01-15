// src/pages/Publicacoes.jsx
import { useEffect, useState } from "react";
import axios from "axios";

function Publicacoes() {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [ordenacao, setOrdenacao] = useState("novos");

  const dadosUsuario = localStorage.getItem("usuarioLogado");
  const usuarioLogado = dadosUsuario ? JSON.parse(dadosUsuario) : null;

  async function buscarPublicacoes(ordenacaoAtual) {
    try {
      setErro(null);
      setCarregando(true);

      if (!usuarioLogado) {
        setErro("Nenhum usuário logado. Informe o ID no topo da tela.");
        return;
      }

      const userId = usuarioLogado.id;

      let url;
      if (ordenacaoAtual == "novos") {
        url = `http://localhost:8080/products/followed/${userId}/list?order=date_desc`;
      } else {
        url = `http://localhost:8080/products/followed/${userId}/list?order=date_asc`;
      }

      console.log("Chamando URL:", url);

      const response = await axios.get(url);
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

  useEffect(() => {
    buscarPublicacoes(ordenacao);
  }, []);

  function handleChangeOrdenacao(e) {
    const novoValor = e.target.value;
    setOrdenacao(novoValor);
    buscarPublicacoes(novoValor);
  }

  return (
    <div style={{ padding: 16, fontFamily: "Arial, sans-serif" }}>
      <h1>Publicações</h1>

      {erro && <p style={{ color: "red" }}>{erro}</p>}
      {carregando && <p>Carregando Publicacoes...</p>}
      {!carregando && !erro && !dados && <p>Nenhum dado carregado.</p>}

      {dados && !erro && (
        <>
          <div style={{ marginBottom: 12 }}>
            <p>
              Total de Publicacoes:{" "}
              <strong>
                {dados.publicacoes ? dados.publicacoes.length : 0}
              </strong>
            </p>

            <div style={{ marginTop: 8 }}>
              <label>
                Ordenar publicações:
                <select
                  value={ordenacao}
                  onChange={handleChangeOrdenacao}
                  style={{ marginLeft: 8 }}
                >
                  <option value="novos">Mais novos</option>
                  <option value="antigos">Mais antigos</option>
                </select>
              </label>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #ccc", marginTop: 8 }}>
            {Array.isArray(dados.publicacoes) &&
            dados.publicacoes.length > 0 ? (
              dados.publicacoes.map((pub) => (
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
                      {pub.has_promo && (
                        <span
                          style={{
                            backgroundColor: "#00a650",
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "999px",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          Produto em promoção
                        </span>
                      )}
                    </span>
                    <br />
                    ID da Publicação: {pub.post_id}
                    <br />
                    Data: {pub.date}
                    <br />
                    Categoria: {pub.category}
                    <br />
                    {pub.has_promo && (
                      <span>
                        Preço:{" "}
                        <s>
                          {Number(pub.price).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </s>{" "}
                        Preço C/ Desconto:{" "}
                        {(
                          Number(pub.price) - Number(pub.discount)
                        ).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}{" "}
                        Desconto:{" "}
                        {Number(pub.discount).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                        <span
                          style={{
                            display: "inline-block",
                            marginTop: 4,
                            fontSize: 18,
                            textTransform: "uppercase",
                          }}
                        >
                          {/* se quiser escrever algo aqui, coloque o texto */}
                        </span>
                      </span>
                    )}
                    {!pub.has_promo && <span> Preço: {pub.price}</span>}
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
                    <br />
                  </span>
                </div>
              ))
            ) : (
              <p>Nenhuma publicação disponível.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Publicacoes;
