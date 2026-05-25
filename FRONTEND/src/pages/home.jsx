import "../styles/style.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { baseURL } from "../services/server";

function Home() {
  const navigate = useNavigate();

  const [mostrarMaisCategorias, setMostrarMaisCategorias] = useState(false);

  const [logado, setLogado] = useState(!!localStorage.getItem("token"));
  const [usuario, setUsuario] = useState(null);

  const [produtos, setProdutos] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);

  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuarioStorage = localStorage.getItem("usuario");

    if (usuarioStorage) {
      setUsuario(JSON.parse(usuarioStorage));
    }

    async function carregarProdutos() {
      try {
        const response = await api.get("/produtos");

        setProdutos(response.data);
        setProdutosFiltrados(response.data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarProdutos();
  }, []);

  function normalizarTexto(texto) {
    return String(texto || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/_/g, " ")
      .trim();
  }

  function gerarVariacoes(texto) {
    const normalizado = normalizarTexto(texto);

    const variacoes = [normalizado];

    if (normalizado.endsWith("s")) {
      variacoes.push(normalizado.slice(0, -1));
    } else {
      variacoes.push(`${normalizado}s`);
    }

    const mapaSinonimos = {
      cadeira: ["cadeira", "cadeiras"],
      cadeiras: ["cadeira", "cadeiras"],

      mesa: ["mesa", "mesas", "mesa de jantar", "mesas de jantar"],
      mesas: ["mesa", "mesas", "mesa de jantar", "mesas de jantar"],

      quarto: ["quarto", "quartos", "cama", "camas", "guarda roupa", "guarda roupas"],
      quartos: ["quarto", "quartos", "cama", "camas", "guarda roupa", "guarda roupas"],

      sala: ["sala", "salas", "sofa", "sofas", "mesa de centro"],
      salas: ["sala", "salas", "sofa", "sofas", "mesa de centro"],

      cozinha: ["cozinha", "cozinhas", "mesa", "mesas"],
      cozinhas: ["cozinha", "cozinhas", "mesa", "mesas"],

      decoracao: ["decoracao", "decoracoes", "decoração", "decorações", "vaso", "vasos"],
      decoração: ["decoracao", "decoracoes", "decoração", "decorações", "vaso", "vasos"],

      moveis: ["moveis", "móveis", "movel", "móvel"],
      móveis: ["moveis", "móveis", "movel", "móvel"],

      rustico: ["rustico", "rústico", "rusticos", "rústicos"],
      rústico: ["rustico", "rústico", "rusticos", "rústicos"],

      pecas: ["pecas", "peças", "peca", "peça"],
      peças: ["pecas", "peças", "peca", "peça"]
    };

    if (mapaSinonimos[normalizado]) {
      variacoes.push(...mapaSinonimos[normalizado]);
    }

    return [...new Set(variacoes.map((item) => normalizarTexto(item)))];
  }

  function textoCombina(valor, termoBusca) {
    const valorNormalizado = normalizarTexto(valor);
    const variacoesBusca = gerarVariacoes(termoBusca);

    return variacoesBusca.some((termo) =>
      valorNormalizado.includes(termo)
    );
  }

  function pesquisarProdutos() {
    const termo = busca.trim();

    if (termo === "") {
      setProdutosFiltrados(produtos);
      return;
    }

    const filtrados = produtos.filter((produto) => {
      return (
        textoCombina(produto.nome, termo) ||
        textoCombina(produto.categoria, termo) ||
        textoCombina(produto.descricao, termo)
      );
    });

    setProdutosFiltrados(filtrados);
  }

  function filtrarPorAtalho(termo) {
    const filtrados = produtos.filter((produto) => {
      return (
        textoCombina(produto.nome, termo) ||
        textoCombina(produto.categoria, termo) ||
        textoCombina(produto.descricao, termo)
      );
    });

    setBusca(termo);
    setProdutosFiltrados(filtrados);
  }

  function mostrarTodosProdutos() {
    setBusca("");
    setProdutosFiltrados(produtos);
  }

  function limparPesquisaSeVazio(valor) {
    setBusca(valor);

    if (valor.trim() === "") {
      setProdutosFiltrados(produtos);
    }
  }

  function handleAuthButton() {
    if (logado) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      setLogado(false);
      setUsuario(null);
      return;
    }

    navigate("/login");
  }

  function irParaProduto(id) {
    navigate(`/produto/${id}`);
  }

  function irParaPerfil() {
    navigate("/perfil");
  }
  function filtrarPorAtalho(termo) {
    const filtrados = produtos.filter((produto) => {
      return (
        textoCombina(produto.nome, termo) ||
        textoCombina(produto.categoria, termo) ||
        textoCombina(produto.descricao, termo)
      );
    });

    setBusca(termo);
    setProdutosFiltrados(filtrados);
  }

  function mostrarTodosProdutos() {
    setBusca("");
    setProdutosFiltrados(produtos);
  }

  return (
    <div className="home-container">
      <header className="header">
        <div className="logo">
          <img src="../public/logo.png" alt="Arte em móveis" />
          <h2>Arte em móveis</h2>
        </div>

        <div className="search-bar">
          <span className="menu-icon">☰</span>

          <input
            type="text"
            placeholder="Pesquisar..."
            value={busca}
            onChange={(e) => limparPesquisaSeVazio(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                pesquisarProdutos();
              }
            }}
          />

          <button
            className="search-icon"
            type="button"
            onClick={pesquisarProdutos}
          >
            🔍
          </button>
        </div>

        <div className="header-actions">
          {logado && usuario && (
            <button className="perfil-btn" onClick={irParaPerfil}>
              <span className="perfil-icon">👤</span>
              <span>Perfil</span>
            </button>
          )}

          <button className="login-btn" onClick={handleAuthButton}>
            {logado ? "Sair" : "Entrar / Cadastrar"}
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-text">
          <h1>
            DURABILIDADE, CONFORTO <br />
            E ESTILO DIRETO DA NATUREZA <br />
            PARA SUA CASA.
          </h1>
        </div>
      </section>

      <nav className="categories-container">
        <div className="categories">
          <button onClick={mostrarTodosProdutos}>
            PRONTA ENTREGA ▼
          </button>

          <button onClick={() => filtrarPorAtalho("mesa")}>
            MESAS DE JANTAR ▼
          </button>

          <button onClick={() => filtrarPorAtalho("quarto")}>
            QUARTO ▼
          </button>

          <button onClick={() => filtrarPorAtalho("cadeira")}>
            CADEIRAS ▼
          </button>

          <button
            onClick={() =>
              setMostrarMaisCategorias(!mostrarMaisCategorias)
            }
          >
            + CATEGORIAS
          </button>
        </div>

        {mostrarMaisCategorias && (
          <div className="extra-categories">
            <button onClick={() => filtrarPorAtalho("sala")}>
              SALA
            </button>

            <button onClick={() => filtrarPorAtalho("cozinha")}>
              COZINHA
            </button>

            <button onClick={() => filtrarPorAtalho("decoracao")}>
              DECORAÇÃO
            </button>

            <button onClick={() => filtrarPorAtalho("moveis")}>
              MÓVEIS
            </button>

            <button onClick={() => filtrarPorAtalho("rustico")}>
              RÚSTICOS
            </button>
          </div>
        )}
      </nav>

      <section className="products-grid">
        {loading ? (
          <div className="loading">
            Carregando produtos...
          </div>
        ) : produtosFiltrados.length === 0 ? (
          <div className="no-products">
            Nenhum produto encontrado para essa pesquisa.
          </div>
        ) : (
          produtosFiltrados.map((produto) => (
            <div className="product-card" key={produto.id}>
              <img
                src={
                  produto.foto
                    ? `${baseURL}${produto.foto}`
                    : "/placeholder.png"
                }
                alt={produto.nome}
                onClick={() => irParaProduto(produto.id)}
                className="clickable-product"
              />

              <div>
                <h3>{produto.nome}</h3>
              </div>

              <div className="product-footer">
                <span>
                  R$ {Number(produto.preco).toFixed(2)}
                </span>

                <button onClick={() => irParaProduto(produto.id)}>
                  Ver Mais
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default Home;