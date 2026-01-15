// NovaPublicacao.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CampoPrecoMoeda from "../components/CampoPrecoMoeda";
function NovaPublicacao() {
  const navigate = useNavigate();

  const [nomeProduto, setNomeProduto] = useState("");
  const [tipoProduto, setTipoProduto] = useState("");
  const [marcaProduto, setMarcaProduto] = useState("");
  const [corProduto, setCorProduto] = useState("");
  const [notaProduto, setNotaProduto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [haDesconto, setHaDesconto] = useState(false);
  const [precoCentavosDesconto, setPrecoCentavosDesconto] = useState("");
  const [precoCentavos, setPrecoCentavos] = useState(0);

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
      !precoCentavos ||
      !tipoProduto ||
      !marcaProduto ||
      !corProduto ||
      !categoria ||
      !notaProduto
    ) {
      setErro("Preencha todos os campos");
      return;
    }

    if (precoCentavosDesconto > precoCentavos) {
      setErro(
        "O valor do desconto não pode ser igual ou superior que o preço do produto"
      );
      return;
    }

    const produto = {
      product_id: 0,
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
    const precoNumero = precoCentavos / 100;
    const precoDesconto = precoCentavosDesconto / 100;

    const publicacao = {
      user_id: usuarioLogado.id,
      post_id: null,
      date: hoje,
      product: produto,
      category: categoria ? Number(categoria) : null,
      price: precoNumero,
      has_promo: haDesconto,
      discount: precoDesconto,
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
            <CampoPrecoMoeda
              value={precoCentavos}
              onChange={setPrecoCentavos}
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
              Valor do Desconto (em Reais):
              <CampoPrecoMoeda
                value={precoCentavosDesconto}
                onChange={setPrecoCentavosDesconto}
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
