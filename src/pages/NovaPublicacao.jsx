// NovaPublicacao.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function NovaPublicacao() {
  const navigate = useNavigate();

  const [nomeProduto, setNomeProduto] = useState("");
  const [tipoProduto, setTipoProduto] = useState("");
  const [marcaProduto, setMarcaProduto] = useState("");
  const [corProduto, setCorProduto] = useState("");
  const [notaProduto, setNotaProduto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [preco, setPreco] = useState("");
  const [haDesconto, setHaDesconto] = useState(false);
  const [desconto, setDesconto] = useState("");

  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);

  let response;

  const dadosUsuario = localStorage.getItem("usuarioLogado");
  const usuarioLogado = dadosUsuario ? JSON.parse(dadosUsuario) : null;

  async function handleCriarPublicacao(e) {
    e.preventDefault();
    setErro(null);
    setSucesso(null);

    if (!usuarioLogado) {
      setErro("Você precisa informar o ID do usuário logado no topo.");
      return;
    }

    if (
      !nomeProduto ||
      !preco ||
      !tipoProduto ||
      !marcaProduto ||
      !corProduto ||
      !categoria ||
      !notaProduto ||
      !preco
    ) {
      setErro("Preencha todos os campos");
      return;
    }

    const produto = {
      product_name: nomeProduto,
      type: tipoProduto,
      brand: marcaProduto,
      color: corProduto,
      notes: notaProduto,
    };

    const hojeDate = new Date();
    const dia = String(hojeDate.getDate()).padStart(2, "0");
    const mes = String(hojeDate.getMonth() + 1).padStart(2, "0");
    const ano = hojeDate.getFullYear();
    const hoje = `${dia}-${mes}-${ano}`;

    const publicacao = {
      user_id: usuarioLogado.id,
      post_id: null,
      date: hoje,
      product: produto,
      category: categoria ? Number(categoria) : null,
      price: Number(preco),
      has_promo: haDesconto,
      discount: desconto ? Number(desconto) : 0,
    };

    console.log(publicacao);
    try {
      if (haDesconto) {
        console.log("produto promocao");
        response = await axios.post(
          "http://localhost:8080/products/promo-pub",
          publicacao
        );
      } else {
        response = await axios.post(
          "http://localhost:8080/products/publish",
          publicacao
        );
      }

      console.log("Publicação criada:", response.data);
      setSucesso("Publicação cadastrada com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Erro ao cadastrar publicação:", error);

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Dados:", error.response.data);
        console.error("Headers:", error.response.headers);

        const mensagemBackend =
          typeof error.response.data === "string"
            ? error.response.data
            : error.response.data?.message ||
              "Erro ao cadastrar uma nova publicação";

        setErro(`Erro ${error.response.status}: ${mensagemBackend}`);
      } else if (error.request) {
        setErro("Servidor não respondeu. Verifique se o backend está rodando.");
      } else {
        setErro("Erro ao preparar requisição. Veja o console.");
      }
    }
  }

  return (
    <div>
      <h1>Nova Publicação</h1>
      <p>
        Usuário logado:{" "}
        {usuarioLogado
          ? `${usuarioLogado.nome} (ID: ${usuarioLogado.id})`
          : "nenhum usuário definido"}
      </p>
      <form onSubmit={handleCriarPublicacao}>
        <div style={{ marginBottom: "8px" }}>
          <label>
            Título Do produto:
            <input
              type="text"
              value={nomeProduto}
              onChange={(e) => setNomeProduto(e.target.value)}
            />
          </label>
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label>
            Tipo Do produto:
            <input
              type="text"
              value={tipoProduto}
              onChange={(e) => setTipoProduto(e.target.value)}
            />
          </label>
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label>
            Marca Do Produto:
            <input
              type="text"
              value={marcaProduto}
              onChange={(e) => setMarcaProduto(e.target.value)}
            />
          </label>
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label>
            Cor Do Produto:
            <input
              type="text"
              value={corProduto}
              onChange={(e) => setCorProduto(e.target.value)}
            />
          </label>
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label>
            Notas Do Produto:
            <input
              type="text"
              value={notaProduto}
              onChange={(e) => setNotaProduto(e.target.value)}
            />
          </label>
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label>
            Categoria (ID numérico):
            <input
              type="number"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            />
          </label>
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label>
            Preço:
            <input
              type="number"
              step="0.01"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
            />
          </label>
        </div>

        <div style={{ marginBottom: "8px" }}>
          <label>
            Tem promoção?
            <input
              type="checkbox"
              checked={haDesconto}
              onChange={(e) => setHaDesconto(e.target.checked)}
            />
          </label>
        </div>

        {haDesconto && (
          <div style={{ marginBottom: "8px" }}>
            <label>
              Preço (C/ Desconto):
              <input
                type="number"
                value={desconto}
                onChange={(e) => setDesconto(e.target.value)}
              />
            </label>
          </div>
        )}

        <button type="submit">Salvar</button>
      </form>

      {erro && <p style={{ color: "red" }}>{erro}</p>}
      {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}
    </div>
  );
}

export default NovaPublicacao;
