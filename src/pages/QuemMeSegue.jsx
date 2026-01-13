// src/pages/QuemMeSegue.jsx
import { useEffect, useState } from "react";
import axios from "axios";

function QuemMeSegue() {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const dadosUsuario = localStorage.getItem("usuarioLogado");
    const usuarioLogado = dadosUsuario ? JSON.parse(dadosUsuario) : null;

    if (!usuarioLogado) {
      setErro("Nenhum usuário logado. Informe o ID no topo da tela.");
      return;
    }

    async function buscarSeguidores() {
      try {
        setErro(null);
        setCarregando(true);

        const userId = usuarioLogado.id;

        const url = `http://localhost:8080/users/${userId}/followers/list`;
        const response = await axios.get(url);

        setDados(response.data);
      } catch (error) {
        console.error("Erro ao buscar seguidores:", error);

        if (error.response) {
          const mensagemBackend =
            typeof error.response.data === "string"
              ? error.response.data
              : error.response.data?.message || "Erro ao buscar seguidores.";

          setErro(`Erro ${error.response.status}: ${mensagemBackend}`);
        } else if (error.request) {
          setErro(
            "Servidor não respondeu. Verifique se o backend está rodando."
          );
        } else {
          setErro("Erro ao preparar requisição. Veja o console.");
        }
      } finally {
        setCarregando(false);
      }
    }

    buscarSeguidores();
  }, []);

  return (
    <div style={{ padding: 16, fontFamily: "Arial, sans-serif" }}>
      <h1>Meus seguidores</h1>

      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {carregando && <p>Carregando seguidores...</p>}

      {!carregando && !erro && !dados && <p>Nenhum dado carregado.</p>}

      {dados && !erro && (
        <>
          <div style={{ marginBottom: 12 }}>
            <p>
              Usuário logado: <strong>{dados.nomeUsuario}</strong> (ID:{" "}
              {dados.usuarioId})
            </p>
            <p>
              Seguidores:{" "}
              <strong>{dados.seguidores ? dados.seguidores.length : 0}</strong>
            </p>
          </div>

          <div style={{ borderTop: "1px solid #ccc", marginTop: 8 }}>
            {Array.isArray(dados.seguidores) && dados.seguidores.length > 0 ? (
              dados.seguidores.map((seg) => (
                <div
                  key={seg.user_id}
                  style={{
                    borderBottom: "1px solid #eee",
                    padding: "8px 0",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>
                    {seg.user_name} (ID: {seg.user_id})
                  </span>
                </div>
              ))
            ) : (
              <p>Esse usuário ainda não tem seguidores.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default QuemMeSegue;
