
// Lógica de busca compartilhada

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

// Calcula a diferença entre duas palavras.
function distanciaEdicao(a, b) {
  const matriz = Array.from(
    { length: a.length + 1 },
    () => Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matriz[i][0] = i;
  for (let j = 0; j <= b.length; j++) matriz[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const custo = a[i - 1] === b[j - 1] ? 0 : 1;

      matriz[i][j] = Math.min(
        matriz[i - 1][j] + 1,
        matriz[i][j - 1] + 1,
        matriz[i - 1][j - 1] + custo
      );
    }
  }

  return matriz[a.length][b.length];
}

// Verifica se duas palavras são iguais ou muito parecidas.
function palavrasParecidas(a, b) {
  if (a === b) return true;

  if (Math.abs(a.length - b.length) > 1) return false;

  if (a.length < 4 || b.length < 4) return false;

  return distanciaEdicao(a, b) <= 1;
}

function gerarVariacoes(texto) {
  const base = normalizarTexto(texto);

  const singular = base.endsWith("s")
    ? base.slice(0, -1)
    : base;

  const sinonimos = SINONIMOS[base] || SINONIMOS[singular] || [];

  return [...new Set([
    base,
    singular,
    `${base}s`,
    ...sinonimos
  ])].filter(Boolean);
}

function textoCombina(valor, termo) {
  const texto = normalizarTexto(valor);

  if (!texto) return false;

  const variacoes = gerarVariacoes(termo);

  // Primeiro verifica correspondências exatas e sinônimos.
  if (variacoes.some((variacao) => texto.includes(variacao))) {
    return true;
  }

  // Depois verifica pequenos erros de digitação.
  const palavrasBusca = normalizarTexto(termo).split(/\s+/);
  const palavrasTexto = texto.split(/\s+/);

  return palavrasBusca.every((palavraBusca) =>
    palavrasTexto.some((palavraTexto) =>
      palavrasParecidas(palavraBusca, palavraTexto)
    )
  );
}

export function filtrarProdutos(produtos, termo) {
  const busca = String(termo || "").trim();

  if (!busca) return produtos;

  return produtos.filter(
    (produto) =>
      textoCombina(produto.nome, busca) ||
      textoCombina(produto.categoria, busca) ||
      textoCombina(produto.descricao, busca)
  );
}
