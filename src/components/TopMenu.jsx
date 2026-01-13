// src/components/TopMenu.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./TopMenu.css";

function TopMenu() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [idDigitado, setIdDigitado] = useState("");
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const dados = localStorage.getItem("usuarioLogado");
    if (dados) {
      setUsuarioLogado(JSON.parse(dados));
    }
  }, []);

  async function handleDefinirUsuario() {
    try {
      setErro(null);
      if (!idDigitado) {
        setErro("Informe um ID de usuário.");
        return;
      }

      const url = `http://localhost:8080/users/${idDigitado}`;
      const response = await axios.get(url);

      console.log(response);

      const usuario = {
        id: Number(idDigitado),
        nome: response.data.user_name,
      };

      localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
      setUsuarioLogado(usuario);
      setIdDigitado("");
    } catch (error) {
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Dados:", error.response.data);
        console.error("Headers:", error.response.headers);
        const mensagemBackend =
          typeof error.response.data === "string"
            ? error.response.data
            : error.response.data?.message ||
              "Erro ao deixar de seguir usuário.";

        setErro(`Erro ${error.response.status}: ${mensagemBackend}`);
      }
    }
  }

  function handleSair() {
    localStorage.removeItem("usuarioLogado");
    setUsuarioLogado(null);
  }

  return (
    <header className="top-header">
      <ul className="top-menu-list">
        <li>
          <Link to="/seguir-vendedor">Seguir Vendedor</Link>
        </li>
        <li>
          <Link to="/quantidade-seguidores-vendedor">
            Quantidade Seguidor Vendedor
          </Link>
        </li>
        <li>
          <Link to="/quem-me-segue">Quem Me Segue?</Link>
        </li>
        <li>
          <Link to="/quem-estou-seguindo">Quem Estou Seguindo?</Link>
        </li>
        <li>
          <Link to="/deixar-de-seguir">Deixar de Seguir</Link>
        </li>
        <li>
          <Link to="/nova-publicacao">Nova Publicação</Link>
        </li>
        <li>
          <Link to="/publicacoes">Publicações</Link>
        </li>
        <li>
          <Link to="/quantidade-promocao-vendedor">
            Quantidade Promoção (Vendedor)
          </Link>
        </li>
        <li>
          <Link to="/produtos-promocao">Produtos em Promoção</Link>
        </li>
      </ul>

      <div className="bem-vindo-wrapper">
        {usuarioLogado ? (
          <>
            <span>Bem vindo,</span>
            <span className="bem-vindo-nome">{usuarioLogado.nome} </span>
            <button className="sair-btn" onClick={handleSair}>
              Sair
            </button>
          </>
        ) : (
          <>
            <label className="id-label">
              ID usuário:
              <input
                type="number"
                value={idDigitado}
                onChange={(e) => setIdDigitado(e.target.value)}
                className="id-input"
              />
            </label>
            <button className="ok-btn" onClick={handleDefinirUsuario}>
              OK
            </button>
          </>
        )}
        {erro && <p style={{ color: "red" }}>{erro}</p>}
      </div>
    </header>
  );
}

export default TopMenu;
