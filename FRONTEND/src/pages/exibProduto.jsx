import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { baseURL } from "../services/server";
import "../styles/exibProduto.css";

export default function ExibProduto() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function carregarProduto() {
      try {
        const response = await api.get(`/produtos/id/${id}`);
        setProduto(response.data);
      } catch (err) {
        console.error("Erro ao carregar produto:", err);
        setError("Não foi possível carregar o produto.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      carregarProduto();
    }
  }, [id]);

  const precoAtual = useMemo(() => {
    return produto ? Number(produto.preco) : 0;
  }, [produto]);

  const precoAntigo = useMemo(() => {
    return precoAtual > 0 ? (precoAtual * 1.2).toFixed(2) : "0.00";
  }, [precoAtual]);

  const estoqueIndisponivel = useMemo(() => {
    return produto && produto.estoque === 0;
  }, [produto]);

  if (loading) {
    return <div className="loading">Carregando produto...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!produto) {
    return <div className="error">Produto não encontrado.</div>;
  }

  return (
    <div className="showcase-container">
      <div className="product-view">
        <div className="product-image">
          <button className="back-button" onClick={() => navigate(-1)}>
            ←
          </button>

          <img src={produto.foto ? `${baseURL}${produto.foto}` : "/placeholder.png"} />
        </div>

        <div className="product-info">
          <div className="product-info-main">
            <h2>{produto.nome}</h2>
            
            <div className="price-section">
              <span className="old-price">De R$ {precoAntigo} por</span>
              <h1>R$ {precoAtual.toFixed(2)}</h1>
              <p className="installments">
                {produto.estoque > 0
                  ? `Em estoque • ${produto.estoque}`
                  : "Fora de estoque"}
              </p>

              <button className="whatsapp-btn">
                Finalize sua compra pelo WhatsApp
              </button> 
            </div>  
          </div>
        </div>
          

        <div className="details-box">
          <p><strong>{produto.nome}</strong></p>
          <div className={`stock ${estoqueIndisponivel ? 'unavailable' : ''}`}>
            <strong>
              {estoqueIndisponivel ? "Estoque indisponível." : "Estoque disponível."}
            </strong>
            <p>
              {estoqueIndisponivel
              ? "Este produto está temporariamente fora de estoque."
              : "Personalize a entrega com nosso vendedor no WhatsApp."}
            </p>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      <div className="related-products-container">
        <h3>Produtos Relacionados</h3>
        <div className="products-grid">
          <div className="product-card">
            <img src="/placeholder.png" alt="Produto" />
            <p className="product-name">Produto Exemplo</p>
            <div className="card-footer">
              <span>R$ 100.00</span>
              <button>Ver Mais</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
