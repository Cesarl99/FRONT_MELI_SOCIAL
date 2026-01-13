// src/components/TopMenu.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./TopMenu.css";

function TopMenu() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [idDigitado, setIdDigitado] = useState("");

  // Ao carregar, tenta ler o usuário salvo
  useEffect(() => {
    const dados = localStorage.getItem("usuarioLogado");
    if (dados) {
      setUsuarioLogado(JSON.parse(dados));
    }
  }, []);

  function handleDefinirUsuario() {
    if (!idDigitado) {
      alert("Informe um ID de usuário.");
      return;
    }

    // Aqui você pode depois chamar o backend para buscar o nome pelo ID
    const usuario = {
      id: Number(idDigitado),
      nome: `Usuario${idDigitado}`, // provisório, até buscar do backend
    };

    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
    setUsuarioLogado(usuario);
    setIdDigitado("");
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
            <span className="bem-vindo-nome">
              {usuarioLogado.nome} (ID: {usuarioLogado.id})
            </span>
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
      </div>
    </header>
  );
}

export default TopMenu;
