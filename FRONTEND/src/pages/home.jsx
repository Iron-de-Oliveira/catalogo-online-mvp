import "../styles/style.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { baseURL } from "../services/server";

function Home() {
  const navigate = useNavigate();

  const [logado, setLogado] = useState(!!localStorage.getItem("token"));
  const [usuario, setUsuario] = useState(null);
  const [produtos, setProdutos] = useState([]);
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
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarProdutos();
  }, []);

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

  return (
    <div className="home-container">
      <header className="header">
        <div className="logo">
          <h2>Arte em móveis</h2>
        </div>

        <div className="search-bar">
          <input type="text" placeholder="Pesquisar..." />
          <span className="search-icon">🔍</span>
        </div>

        <div className="login-area">
          {logado && usuario && (
            <span className="usuario-logado">
              Olá, {usuario.nome}
            </span>
          )}

          <button onClick={handleAuthButton}>
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

          <button onClick={() => navigate("/produtos")}>
            Ver Produtos
          </button>
        </div>
      </section>

      <nav className="categories">
        <button>PRONTA ENTREGA ▼</button>
        <button>MESAS DE JANTAR ▼</button>
        <button>GUARDA ROUPAS ▼</button>
        <button>CADEIRAS ▼</button>
        <button>+ CATEGORIAS ▼</button>
      </nav>

      <section className="products-grid">
        {loading ? (
          <div className="loading">
            Carregando produtos...
          </div>
        ) : produtos.length === 0 ? (
          <div className="no-products">
            Nenhum produto disponível no momento.
          </div>
        ) : (
          produtos.map((produto) => (
            <div className="product-card" key={produto.id}>
              <img
                src={
                  produto.foto
                    ? `${baseURL}${produto.foto}`
                    : "/placeholder.png"
                }
                alt={produto.nome}
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