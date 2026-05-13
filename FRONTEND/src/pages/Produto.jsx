import "../styles/produto.css";

function Produto() {
  return (
    <div className="produto-container">

      <div className="produto-card">

        {/* IMAGEM */}
        <div className="produto-image">

          <img
            src="/sofa.png"
            alt="Produto"
          />

        </div>

        {/* INFORMAÇÕES */}
        <div className="produto-info">

          <h1>Sofá Retrô Rústico</h1>

          <p className="preco">
            R$ 4.555
          </p>

          <p className="descricao">
            Sofá produzido em madeira maciça com acabamento
            rústico premium, trazendo conforto e elegância
            para sua sala.
          </p>

          <div className="detalhes">

            <div className="item">
              <strong>Material:</strong>
              <span> Madeira Maciça</span>
            </div>

            <div className="item">
              <strong>Cor:</strong>
              <span> Marrom Rústico</span>
            </div>

            <div className="item">
              <strong>Tamanho:</strong>
              <span> 220cm x 90cm</span>
            </div>

          </div>

          <button className="comprar-btn">
            Comprar Agora
          </button>

        </div>

      </div>

    </div>
  );
}

export default Produto;