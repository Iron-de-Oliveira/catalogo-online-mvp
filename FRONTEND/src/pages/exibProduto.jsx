// ProductShowcase.jsx
import React from "react";
import "../styles/exibProduto.css";

const products = [
  {
    id: 1,
    name: "Cadeira com estofado",
    price: "185",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800",
  },
  {
    id: 2,
    name: "Guarda Roupa 3 portas",
    price: "485",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800",
  },
  {
    id: 3,
    name: "Mesa Redonda",
    price: "355",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800",
  },
  {
    id: 4,
    name: "Sofá Retrô Rústico",
    price: "455",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800",
  },
  {
    id: 5,
    name: "Poltrona de Madeira",
    price: "375",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800",
  },
];

export default function ProductShowcase() {
  return (
    <div className="showcase-container">
      {/* TOPO */}
      <div className="product-view">
        {/* IMAGEM */}
        <div className="product-image">
          <button className="back-button">←</button>

          <img
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200"
            alt="Mesa de jantar"
          />
        </div>

        {/* INFORMAÇÕES */}
        <div className="product-info">
          <h2>
            MESA JMCAL LIVING 2.2
            <br />
            (5583) V/D RET ILUMINADO
            <br />
            para 8 pessoas
          </h2>

          <span className="old-price">De R$ 5.230,00 por</span>

          <h1>R$ 4.404,00</h1>

          <p className="installments">Em estoque • 4x</p>

          <button className="whatsapp-btn">
            WhatsApp
          </button>

          <div className="details-box">
            <p>
              Mesa de jantar JMCAL Living
              <br />
              com madeira MDF.
            </p>

            <ul>
              <li>Comprimento: 2.20m</li>
              <li>Largura: 90cm</li>
              <li>Altura: 75cm</li>
            </ul>
          </div>

          <div className="stock">
            <strong>Estoque disponível.</strong>
            <p>Personalize e entregue com nosso vendedor no WhatsApp.</p>
          </div>
        </div>
      </div>

      {/* DIVISOR */}
      <div className="divider"></div>

      {/* LISTA DE PRODUTOS */}
      <div className="products-grid">
        {products.map((item) => (
          <div className="product-card" key={item.id}>
            <img src={item.image} alt={item.name} />

            <p className="product-name">{item.name}</p>

            <div className="card-footer">
              <span>R$ {item.price}</span>

              <button>Ver Mais</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}