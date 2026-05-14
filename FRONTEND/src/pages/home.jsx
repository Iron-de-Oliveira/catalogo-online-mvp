import { useState } from 'react'

import "../styles/style.css";
import { Link } from "react-router-dom";

function Home() {

  const [pagina, setPagina] = useState("home");

  // LOGIN
  if (pagina === "login") {
    return <Login />;
  }

  // PRODUTO
  if (pagina === "produto") {
    return <Produto />;
  }

  return (
    <div className="home-container">

      {/* HEADER */}
      <header className="header">

        <div className="logo">
          <h2>Arte em móveis</h2>
        </div>

        {/* BARRA DE PESQUISA */}
        <div className="search-bar">

          <input type="text" placeholder="Pesquisar..." />

          <span className="search-icon">
            🔍
          </span>

        </div>

        {/* LOGIN */}
        <div className="login-area">

          <button
            className="login-btn"
            onClick={() => setPagina("login")}
          >
            Entrar / Cadastrar
          </button>

        </div>

      </header>

      {/* HERO */}
      <section className="hero">

        <div className="hero-text">

          <h1>
            DURABILIDADE, CONFORTO <br />
            E ESTILO DIRETO DA NATUREZA <br />
            PARA SUA CASA.
          </h1>

          <button>
            Ver Produtos
          </button>

        </div>

      </section>

      {/* CATEGORIAS */}
      <nav className="categories">

        <button>PRONTA ENTREGA ▼</button>
        <button>MESAS DE JANTAR ▼</button>
        <button>GUARDA ROUPAS ▼</button>
        <button>CADEIRAS ▼</button>
        <button>+ CATEGORIAS ▼</button>

      </nav>

      {/* PRODUTOS */}
      <section className="products-grid">

        {/* PRODUTO 1 */}
        <div className="product-card">

          <img src="/cadeira.png" alt="Produto" />

          <h3>Cadeira com estofado</h3>

          <div className="product-footer">

            <span>R$ 1855</span>

            <button onClick={() => setPagina("produto")}>
              Ver Mais
            </button>

          </div>

        </div>

        {/* PRODUTO 2 */}
        <div className="product-card">

          <img src="/guarda-roupa.png" alt="Produto" />

          <h3>Guarda Roupa 3 portas</h3>

          <div className="product-footer">

            <span>R$ 4855</span>

            <button onClick={() => setPagina("produto")}>
              Ver Mais
            </button>

          </div>

        </div>

        {/* PRODUTO 3 */}
        <div className="product-card">

          <img src="/mesa-redonda.png" alt="Produto" />

          <h3>Mesa Redonda</h3>

          <div className="product-footer">

            <span>R$ 3555</span>

            <button onClick={() => setPagina("produto")}>
              Ver Mais
            </button>

          </div>

        </div>

        {/* PRODUTO 4 */}
        <div className="product-card">

          <img src="/sofa.png" alt="Produto" />

          <h3>Sofá Retrô Rústico</h3>

          <div className="product-footer">

            <span>R$ 4555</span>

            <button onClick={() => setPagina("produto")}>
              Ver Mais
            </button>

          </div>

        </div>

        {/* PRODUTO 5 */}
        <div className="product-card">

          <img src="/cadeira-madeira.png" alt="Produto" />

          <h3>Cadeira de Madeira</h3>

          <div className="product-footer">

            <span>R$ 375</span>

            <button onClick={() => setPagina("produto")}>
              Ver Mais
            </button>

          </div>

        </div>

      </section>

      {/* SEGUNDA LINHA */}
      <section className="products-grid">

        {/* PRODUTO 6 */}
        <div className="product-card">

          <img src="/cadeira.png" alt="Produto" />

          <h3>Cadeira com estofado</h3>

          <div className="product-footer">

            <span>R$ 1855</span>

            <button onClick={() => setPagina("produto")}>
              Ver Mais
            </button>

          </div>

        </div>

        {/* PRODUTO 7 */}
        <div className="product-card">

          <img src="/guarda-roupa.png" alt="Produto" />

          <h3>Guarda Roupa 3 portas</h3>

          <div className="product-footer">

            <span>R$ 4855</span>

            <button onClick={() => setPagina("produto")}>
              Ver Mais
            </button>

          </div>

        </div>

        {/* PRODUTO 8 */}
        <div className="product-card">

          <img src="/mesa-redonda.png" alt="Produto" />

          <h3>Mesa Redonda</h3>

          <div className="product-footer">

            <span>R$ 3555</span>

            <button onClick={() => setPagina("produto")}>
              Ver Mais
            </button>

          </div>

        </div>

        {/* PRODUTO 9 */}
        <div className="product-card">

          <img src="/sofa.png" alt="Produto" />

          <h3>Sofá Retrô Rústico</h3>

          <div className="product-footer">

            <span>R$ 4555</span>

            <button onClick={() => setPagina("produto")}>
              Ver Mais
            </button>

          </div>

        </div>

        {/* PRODUTO 10 */}
        <div className="product-card">

          <img src="/cadeira-madeira.png" alt="Produto" />

          <h3>Cadeira de Madeira</h3>

          <div className="product-footer">

            <span>R$ 375</span>

            <button onClick={() => setPagina("produto")}>
              Ver Mais
            </button>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;