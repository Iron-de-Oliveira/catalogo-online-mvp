import "../styles/style.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [logado, setLogado] = useState(!!localStorage.getItem("token"));

  function handleAuthButton() {
    if (logado) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      setLogado(false);
      navigate("/home");
    } else {
      navigate("/login");
    }
  }

  function irParaProduto() {
    navigate("/produto");
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
        <div className="product-card">
          <img src="/cadeira.png" alt="Produto" />
          <h3>Cadeira com estofado</h3>

          <div className="product-footer">
            <span>R$ 1855</span>
            <button onClick={irParaProduto}>Ver Mais</button>
          </div>
        </div>

        <div className="product-card">
          <img src="/guarda-roupa.png" alt="Produto" />
          <h3>Guarda Roupa 3 portas</h3>

          <div className="product-footer">
            <span>R$ 4855</span>
            <button onClick={irParaProduto}>Ver Mais</button>
          </div>
        </div>

        <div className="product-card">
          <img src="/mesa-redonda.png" alt="Produto" />
          <h3>Mesa Redonda</h3>

          <div className="product-footer">
            <span>R$ 3555</span>
            <button onClick={irParaProduto}>Ver Mais</button>
          </div>
        </div>

        <div className="product-card">
          <img src="/sofa.png" alt="Produto" />
          <h3>Sofá Retrô Rústico</h3>

          <div className="product-footer">
            <span>R$ 4555</span>
            <button onClick={irParaProduto}>Ver Mais</button>
          </div>
        </div>

        <div className="product-card">
          <img src="/cadeira-madeira.png" alt="Produto" />
          <h3>Cadeira de Madeira</h3>

          <div className="product-footer">
            <span>R$ 375</span>
            <button onClick={irParaProduto}>Ver Mais</button>
          </div>
        </div>
      </section>

      <section className="products-grid">
        <div className="product-card">
          <img src="/cadeira.png" alt="Produto" />
          <h3>Cadeira com estofado</h3>

          <div className="product-footer">
            <span>R$ 1855</span>
            <button onClick={irParaProduto}>Ver Mais</button>
          </div>
        </div>

        <div className="product-card">
          <img src="/guarda-roupa.png" alt="Produto" />
          <h3>Guarda Roupa 3 portas</h3>

          <div className="product-footer">
            <span>R$ 4855</span>
            <button onClick={irParaProduto}>Ver Mais</button>
          </div>
        </div>

        <div className="product-card">
          <img src="/mesa-redonda.png" alt="Produto" />
          <h3>Mesa Redonda</h3>

          <div className="product-footer">
            <span>R$ 3555</span>
            <button onClick={irParaProduto}>Ver Mais</button>
          </div>
        </div>

        <div className="product-card">
          <img src="/sofa.png" alt="Produto" />
          <h3>Sofá Retrô Rústico</h3>

          <div className="product-footer">
            <span>R$ 4555</span>
            <button onClick={irParaProduto}>Ver Mais</button>
          </div>
        </div>

        <div className="product-card">
          <img src="/cadeira-madeira.png" alt="Produto" />
          <h3>Cadeira de Madeira</h3>

          <div className="product-footer">
            <span>R$ 375</span>
            <button onClick={irParaProduto}>Ver Mais</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;