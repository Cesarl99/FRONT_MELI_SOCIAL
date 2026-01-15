// src/components/CampoPrecoMoeda.jsx
function CampoPrecoMoeda({ value, onChange }) {
  const reais = value / 100;

  const formatado =
    value !== null
      ? new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(reais)
      : "";

  function handleChange(e) {
    const somenteNumeros = e.target.value.replace(/\D/g, "");
    const centavos = somenteNumeros === "" ? 0 : Number(somenteNumeros);
    onChange(centavos);
  }

  return <input type="text" value={formatado} onChange={handleChange} />;
}

export default CampoPrecoMoeda;
