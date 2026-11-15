// Lógica de busca compartilhada (tirada do home.jsx)

export function normalizarTexto(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/_/g, " ")
    .trim();
}

const SINONIMOS = {
  cadeira: ["cadeira", "cadeiras"],
  mesa: ["mesa", "mesas", "mesa de jantar", "mesas de jantar"],
  quarto: ["quarto", "quartos", "cama", "camas", "guarda roupa", "guarda roupas"],
  sala: ["sala", "salas", "sofa", "sofas", "mesa de centro"],
  cozinha: ["cozinha", "cozinhas", "mesa", "mesas"],
  decoracao: ["decoracao", "decoracoes", "vaso", "vasos"],
  moveis: ["moveis", "movel"],
  rustico: ["rustico", "rusticos"],
  pecas: ["pecas", "peca"]
};

function gerarVariacoes(texto) {
  const base = normalizarTexto(texto);
  const variacoes = [base, base.endsWith("s") ? base.slice(0, -1) : `${base}s`];

  // "cadeiras" -> procura também as variações de "cadeira"
  const singular = base.endsWith("s") ? base.slice(0, -1) : base;
  const sinonimos = SINONIMOS[base] || SINONIMOS[singular];
  if (sinonimos) variacoes.push(...sinonimos);

  // filter(Boolean) evita variação vazia (ex.: digitar só "s") casar com tudo
  return [...new Set(variacoes.map(normalizarTexto))].filter(Boolean);
}

function textoCombina(valor, termo) {
  const valorNormalizado = normalizarTexto(valor);
  return gerarVariacoes(termo).some((variacao) => valorNormalizado.includes(variacao));
}

export function filtrarProdutos(produtos, termo) {
  const busca = String(termo || "").trim();
  if (!busca) return produtos;

  return produtos.filter(
    (p) =>
      textoCombina(p.nome, busca) ||
      textoCombina(p.categoria, busca) ||
      textoCombina(p.descricao, busca)
  );
}