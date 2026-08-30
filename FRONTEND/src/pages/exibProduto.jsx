import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/server";

import "../styles/exibProduto.css";

export default function ExibProduto() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [zoomAtivo, setZoomAtivo] = useState(false);

  const [produto, setProduto] = useState(null);

  const [relacionados, setRelacionados] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function carregarProduto() {
      try {
        setLoading(true);

        // PRODUTO PRINCIPAL

        const response = await api.get(`/produtos/id/${id}`);

        const produtoAtual = response.data;

        setProduto(produtoAtual);

        // PRODUTOS RELACIONADOS

        const relacionadosResponse = await api.get(
          `/produtos/categoria/${produtoAtual.categoria}`
        );

        const produtosRelacionados =
          relacionadosResponse.data.filter(
            (item) => item.id !== produtoAtual.id
          );

        setRelacionados(produtosRelacionados);

      } catch (err) {

        console.error("Erro ao carregar produto:", err);

        setError("Não foi possível visualizar o produto.");

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
    return precoAtual > 0
      ? (precoAtual * 1.2).toFixed(2)
      : "0.00";
  }, [precoAtual]);

  const estoqueIndisponivel = useMemo(() => {
    return produto && Number(produto.estoque) === 0;
  }, [produto]);

  function irParaProduto(produtoId) {
    navigate(`/produto/${produtoId}`);
  }

  if (loading) {
    return (
      <div className="loading">
        Carregando produto...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        {error}
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="error">
        Produto não encontrado.
      </div>
    );
  }

  // 🔵 NÚMERO DA LOJA - troque pelo número real (DDI + DDD + número, só dígitos)
  const NUMERO_WHATSAPP_LOJA = "5563992679361"; // ex: 55 (Brasil) + DDD + número

  function finalizarCompraWhatsapp() {
    if (!produto) return;

    const link = window.location.href;

    const mensagem =
      `Olá! Tenho interesse em comprar o seguinte produto:\n\n` +
      `Produto: ${produto.nome}\n` +
      `Valor: R$ ${precoAtual.toFixed(2)}\n` +
      `Descrição: ${produto.descricao || "Sem descrição"}\n` +
      (produto.categoria ? `Categoria: ${produto.categoria}\n` : "") +
      `Link: ${link}\n\n` +
      `Gostaria de obter mais informações sobre a compra.`;

    const mensagemCodificada = encodeURIComponent(mensagem);

    const urlWhatsapp = `https://wa.me/${NUMERO_WHATSAPP_LOJA}?text=${mensagemCodificada}`;

    window.open(urlWhatsapp, "_blank");
  }

  function compartilharProduto() {
    const link = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: produto.nome,
        text: `Confira este produto: ${produto.nome}`,
        url: link
      });
    } else {
      navigator.clipboard.writeText(link);

      alert("Link do produto copiado!");
    }
  }

  return (
    <div className="showcase-container">

      {/* BOTÃO VOLTAR */}

      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        ❮
      </button>

      {/* TOPO */}

      <section className="product-view">

        {/* IMAGEM */}

        <div className="product-image">

          <img
            src={produto.foto || "/placeholder.png"}
            alt={produto.nome}
            className="main-product-image"
            onClick={() => setZoomAtivo(true)}
          />

        </div>

        {/* PAINEL */}

        <div className="product-panel">

          {/* ESQUERDA */}

          <div className="product-info">

            <h2>
              {produto.nome}
            </h2>

            <span className="old-price">
              De R$ {precoAntigo} por
            </span>

            <h1>
              R$ {precoAtual.toFixed(2)}
            </h1>

            <p className="stock-text">
              {produto.estoque > 0
                ? `Em estoque - ${produto.estoque}`
                : "Fora de estoque"}
            </p>

            <div className="whatsapp-area">

              <p>
                Finalize sua compra pelo Whatsapp
              </p>

              <button
                className="whatsapp-btn"
                onClick={finalizarCompraWhatsapp}
              >
                <img src="/whatsapp.png" alt="WhatsApp" />
              </button>
              <button
                className="share-btn"
                onClick={compartilharProduto}
              >
                Compartilhar produto
              </button>

            </div>

          </div>

          {/* DIREITA */}

          <div className="details-box">

            <div>

              <p>
                {produto.descricao || produto.nome}
              </p>

            </div>

            <div
              className={`stock ${estoqueIndisponivel
                ? "unavailable"
                : ""
                }`}
            >

              <strong>

                {estoqueIndisponivel
                  ? "Estoque indisponível."
                  : "Estoque disponível."}

              </strong>

              <p>

                {estoqueIndisponivel
                  ? "Este produto está temporariamente fora de estoque."
                  : "Personalize a entrega com nosso vendedor no whatsapp."}

              </p>

            </div>

          </div>

        </div>

      </section>

      {/* DIVISOR */}

      <div className="divider"></div>

      {/* RELACIONADOS */}

      <section className="related-products-container">

        <div className="products-grid">

          {relacionados.length === 0 ? (

            <p className="no-related">
              Nenhum produto relacionado encontrado.
            </p>

          ) : (

            relacionados.map((item) => (

              <div
                className="product-card"
                key={item.id}
              >
                <img
                  src={item.foto || "/placeholder.png"}
                  alt={item.nome}
                  className="related-clickable-image"
                  onClick={() => irParaProduto(item.id)}
                />

                <p className="product-name">
                  {item.nome}
                </p>

                <div className="card-footer">

                  <span>
                    R$ {Number(item.preco).toFixed(2)}
                  </span>

                  <button
                    onClick={() => irParaProduto(item.id)}
                  >
                    Ver Mais
                  </button>

                </div>

              </div>

            ))
          )}

        </div>

      </section>
      {/* MODAL ZOOM */}

      {zoomAtivo && (
        <div
          className="zoom-overlay"
          onClick={() => setZoomAtivo(false)}
        >
          <img
            src={produto.foto || "/placeholder.png"}
            alt={produto.nome}
            className="zoom-image"
          />
        </div>
      )}

    </div>
  );
}