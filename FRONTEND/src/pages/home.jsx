import "../styles/style.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { imagemProdutoUrl } from "../services/server";
import { filtrarProdutos, normalizarTexto } from "../utils/busca";

function Home() {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [logado, setLogado] = useState(!!localStorage.getItem("token"));
  const [usuario, setUsuario] = useState(() => {
    try {
      const usuarioStorage = localStorage.getItem("usuario");
      return usuarioStorage ? JSON.parse(usuarioStorage) : null;
    } catch {
      return null;
    }
  });
  const [produtos, setProdutos] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({ categoria: "" });

  const categoriasDisponiveis = [
    { valor: "sala", nome: "Sala" },
    { valor: "cozinha", nome: "Cozinha" },
    { valor: "decoracao", nome: "Decoração" },
    { valor: "moveis", nome: "Móveis" },
    { valor: "rustico", nome: "Rústicos" },
    { valor: "pronta entrega", nome: "Pronta entrega" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const usuarioStorage = localStorage.getItem("usuario");

    if (token && usuarioStorage) {
      try {
        const usuarioSalvo = JSON.parse(usuarioStorage);
        if (usuarioSalvo.id) {
          api
            .get(`/usuarios/id/${usuarioSalvo.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then(({ data }) => {
              setUsuario(data);
              localStorage.setItem("usuario", JSON.stringify(data));
            })
            .catch((error) => {
              console.error("Erro ao atualizar dados do perfil:", error);
            });
        }
      } catch (error) {
        console.error("Dados locais do usuário inválidos:", error);
        localStorage.removeItem("usuario");
      }
    } else if (usuarioStorage) {
      try {
        setUsuario(JSON.parse(usuarioStorage));
      } catch {
        localStorage.removeItem("usuario");
      }
    }

    async function carregarProdutos() {
      try {
        const response = await api.get("/produtos");
        const lista = Array.isArray(response.data) ? response.data : [];
        setProdutos(lista);
        setProdutosFiltrados(lista);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarProdutos();
  }, []);

  // Fecha o menu quando clicar fora dele.
  useEffect(() => {
    function fecharAoClicarFora(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMostrarFiltros(false);
      }
    }

    function fecharComEscape(event) {
      if (event.key === "Escape") {
        setMostrarFiltros(false);
      }
    }

    document.addEventListener("mousedown", fecharAoClicarFora);
    document.addEventListener("touchstart", fecharAoClicarFora);
    document.addEventListener("keydown", fecharComEscape);

    return () => {
      document.removeEventListener("mousedown", fecharAoClicarFora);
      document.removeEventListener("touchstart", fecharAoClicarFora);
      document.removeEventListener("keydown", fecharComEscape);
    };
  }, []);

  function aplicarFiltros(termo = busca, categoria = filtros.categoria) {
    const categoriaNormalizada = normalizarTexto(categoria);
    const resultado = filtrarProdutos(produtos, termo).filter(
      (produto) =>
        !categoriaNormalizada ||
        normalizarTexto(produto.categoria).includes(categoriaNormalizada)
    );

    setProdutosFiltrados(resultado);
  }

  function filtrarPorCategoria(valor) {
    setBusca("");
    setFiltros({ categoria: valor });
    aplicarFiltros("", valor);
    setMostrarFiltros(false);
  }

  function mostrarTodosProdutos() {
    setBusca("");
    setFiltros({ categoria: "" });
    setProdutosFiltrados(produtos);
    setMostrarFiltros(false);
  }

  function pesquisarProdutos() {
    const termo = busca.trim();

    if (!termo) {
      aplicarFiltros("", filtros.categoria);
      return;
    }

    navigate(`/busca?q=${encodeURIComponent(termo)}`);
  }

  function limparPesquisaSeVazio(valor) {
    setBusca(valor);

    if (valor.trim() === "") {
      aplicarFiltros("", filtros.categoria);
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

  return (
    <div className="home-container">
      <header className="header">
        <div className="logo">
          <img src="/logo.png" alt="Arte em móveis" />
          <h2>Arte em móveis</h2>
        </div>

        <div className="search-bar" ref={menuRef}>
          <button
            type="button"
            className="menu-icon"
            aria-label="Abrir categorias"
            aria-expanded={mostrarFiltros}
            onClick={() => setMostrarFiltros((aberto) => !aberto)}
          >
            ☰
          </button>

          <input
            type="text"
            placeholder="Pesquisar..."
            value={busca}
            onChange={(e) => limparPesquisaSeVazio(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") pesquisarProdutos();
            }}
          />

          <button
            className="search-icon"
            type="button"
            onClick={pesquisarProdutos}
            aria-label="Pesquisar produtos"
          >
            🔍
          </button>

          {mostrarFiltros && (
            <div className="category-menu">
              <h3>Categorias</h3>

              <button
                type="button"
                className="category-menu-item"
                onClick={mostrarTodosProdutos}
              >
                Todas as categorias
              </button>

              {categoriasDisponiveis.map((categoria) => (
                <button
                  type="button"
                  className="category-menu-item"
                  key={categoria.valor}
                  onClick={() => filtrarPorCategoria(categoria.valor)}
                >
                  {categoria.nome}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="header-actions">
          {logado && usuario && (
            <button className="perfil-btn" onClick={irParaPerfil}>
              {usuario.fotoPerfil ? (
                <img
                  className="perfil-avatar"
                  src={imagemProdutoUrl(usuario.fotoPerfil)}
                  alt=""
                />
              ) : (
                <span className="perfil-icon" aria-hidden="true">👤</span>
              )}
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
            Durabilidade, conforto <br />
            e estilo direto da natureza <br />
            para sua casa.
          </h1>

          <button
            onClick={() =>
              document
                .getElementById("vitrine")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Ver Produtos
          </button>
        </div>
      </section>

      <section className="products-grid" id="vitrine">
        {loading ? (
          <div className="loading">Carregando produtos...</div>
        ) : produtosFiltrados.length === 0 ? (
          <div className="no-products">
            Nenhum produto encontrado para esses critérios.
          </div>
        ) : (
          produtosFiltrados.map((produto) => (
            <div className="product-card" key={produto.id}>
              <img
                src={imagemProdutoUrl(produto.foto)}
                alt={produto.nome}
                onClick={() => irParaProduto(produto.id)}
                className="clickable-product"
              />

              <div>
                <h3>{produto.nome}</h3>
              </div>

              <div className="product-footer">
                <span>R$ {Number(produto.preco).toFixed(2)}</span>
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
