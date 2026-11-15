import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api, { imagemProdutoUrl } from "../services/server";
import { filtrarProdutos } from "../utils/busca";
import "../styles/busca.css";

const formatarPreco = (valor) =>
  Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Busca() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const termo = (searchParams.get("q") || "").trim();

  const [campo, setCampo] = useState(termo);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [ordem, setOrdem] = useState("padrao");
  const [tentativa, setTentativa] = useState(0);

  // mantém o campo sincronizado quando a URL muda (voltar/avançar do navegador)
  useEffect(() => {
    setCampo(termo);
  }, [termo]);

  // os produtos são buscados uma vez; cada nova pesquisa só filtra a lista
  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      try {
        setLoading(true);
        setErro("");
        const { data } = await api.get("/produtos");
        if (!cancelado) setProdutos(data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        if (!cancelado) setErro("Não foi possível carregar os produtos.");
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, [tentativa]);

  const resultados = useMemo(() => {
    const lista = [...filtrarProdutos(produtos, termo)];

    if (ordem === "menor") lista.sort((a, b) => Number(a.preco) - Number(b.preco));
    if (ordem === "maior") lista.sort((a, b) => Number(b.preco) - Number(a.preco));
    if (ordem === "nome") {
      lista.sort((a, b) => String(a.nome).localeCompare(String(b.nome), "pt-BR"));
    }

    return lista;
  }, [produtos, termo, ordem]);

  function pesquisar(event) {
    event.preventDefault();
    const novoTermo = campo.trim();
    navigate(novoTermo ? `/busca?q=${encodeURIComponent(novoTermo)}` : "/busca");
  }

  function irParaProduto(id) {
    navigate(`/produto/${id}`);
  }

  return (
    <div className="bs-page">
      <header className="bs-header">
        <button type="button" className="bs-logo" onClick={() => navigate("/")}>
          <img src="/logo.png" alt="" />
          <span>Arte em móveis</span>
        </button>

        <form className="bs-busca" onSubmit={pesquisar} role="search">
          <input
            type="search"
            value={campo}
            onChange={(e) => setCampo(e.target.value)}
            placeholder="Pesquisar produtos..."
            aria-label="Pesquisar produtos"
          />
          <button type="submit">Buscar</button>
        </form>
      </header>

      <main className="bs-main">
        <button type="button" className="bs-voltar" onClick={() => navigate("/")}>
          ‹ Voltar ao catálogo
        </button>

        <div className="bs-topo">
          <div>
            <h1>{termo ? `Resultados para “${termo}”` : "Todos os produtos"}</h1>
            {!loading && !erro && (
              <p className="bs-contagem">
                {resultados.length}{" "}
                {resultados.length === 1 ? "produto encontrado" : "produtos encontrados"}
              </p>
            )}
          </div>

          <label className="bs-ordem">
            Ordenar por
            <select value={ordem} onChange={(e) => setOrdem(e.target.value)}>
              <option value="padrao">Padrão</option>
              <option value="menor">Menor preço</option>
              <option value="maior">Maior preço</option>
              <option value="nome">Nome (A–Z)</option>
            </select>
          </label>
        </div>

        {loading && (
          <div className="bs-grade" aria-busy="true">
            {Array.from({ length: 8 }, (_, i) => (
              <div className="bs-card bs-esqueleto" key={i} />
            ))}
          </div>
        )}

        {!loading && erro && (
          <div className="bs-vazio" role="alert">
            <h2>{erro}</h2>
            <p>Verifique sua conexão e tente de novo.</p>
            <button type="button" onClick={() => setTentativa((n) => n + 1)}>
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !erro && resultados.length === 0 && (
          <div className="bs-vazio">
            <h2>Nenhum produto encontrado{termo ? ` para “${termo}”` : ""}</h2>
            <p>Confira a ortografia ou tente termos como mesa, cadeira ou quarto.</p>
            <button type="button" onClick={() => navigate("/busca")}>
              Ver todos os produtos
            </button>
          </div>
        )}

        {!loading && !erro && resultados.length > 0 && (
          <div className="bs-grade">
            {resultados.map((produto) => (
              <article className="bs-card" key={produto.id}>
                <button
                  type="button"
                  className="bs-card-img"
                  onClick={() => irParaProduto(produto.id)}
                >
                  <img src={imagemProdutoUrl(produto.foto)} alt={produto.nome} loading="lazy" />
                  {Number(produto.estoque) === 0 && <span className="bs-selo">Sob encomenda</span>}
                </button>

                <div className="bs-card-corpo">
                  {produto.categoria && (
                    <span className="bs-categoria">{String(produto.categoria).replace(/_/g, " ")}</span>
                  )}
                  <h2>{produto.nome}</h2>

                  <div className="bs-card-rodape">
                    <strong>{formatarPreco(produto.preco)}</strong>
                    <button type="button" onClick={() => irParaProduto(produto.id)}>
                      Ver mais
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}