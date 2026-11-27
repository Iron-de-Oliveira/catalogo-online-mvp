import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api, { imagemProdutoUrl } from "../services/server";
import { NUMERO_WHATSAPP_LOJA } from "../utils/whatsapp";
import "../styles/listaDesejos.css";

function ListaDesejos() {
  const navigate = useNavigate();
  const location = useLocation();
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendentes, setPendentes] = useState(() => new Set());
  const [erro, setErro] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { from: location } });
      return;
    }

    let cancelado = false;
    api.get("/lista-desejos", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(({ data }) => {
      if (!cancelado) setFavoritos(data);
    }).catch((error) => {
      console.error("Erro ao carregar lista de desejos:", error);
      if (!cancelado) {
        setErro(error.response?.data?.error || "Não foi possível carregar sua lista de desejos.");
      }
    }).finally(() => {
      if (!cancelado) setLoading(false);
    });

    return () => {
      cancelado = true;
    };
  }, [location, navigate]);

  async function removerFavorito(produtoId) {
    const token = localStorage.getItem("token");
    setErro("");
    setPendentes((atuais) => new Set(atuais).add(produtoId));

    try {
      await api.delete(`/lista-desejos/${produtoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavoritos((atuais) => atuais.filter((item) => item.produtoId !== produtoId));
    } catch (error) {
      console.error("Erro ao remover produto da lista de desejos:", error);
      setErro(error.response?.data?.error || "Não foi possível remover este produto.");
    } finally {
      setPendentes((atuais) => {
        const atualizados = new Set(atuais);
        atualizados.delete(produtoId);
        return atualizados;
      });
    }
  }

  function negociarNoWhatsApp() {
    const itens = favoritos.map(({ produto }) =>
      `• ${produto.nome} — R$ ${Number(produto.preco).toFixed(2)}\n  ${window.location.origin}/produto/${produto.id}`
    ).join("\n");
    const mensagem = `Olá! Tenho interesse nestes produtos da minha lista de desejos:\n\n${itens}\n\nGostaria de negociar este pedido.`;
    const url = `https://wa.me/${NUMERO_WHATSAPP_LOJA}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="lista-desejos">
      <header className="lista-desejos-topo">
        <button type="button" onClick={() => navigate("/perfil")}>‹ Voltar ao perfil</button>
        <h1>Minha lista de desejos</h1>
        <p>Os produtos que você guardou para ver depois.</p>
      </header>

      {erro && <p className="lista-desejos-erro" role="alert">{erro}</p>}

      {loading ? (
        <p className="lista-desejos-vazio" aria-live="polite">Carregando sua lista...</p>
      ) : favoritos.length === 0 ? (
        <section className="lista-desejos-vazio">
          <h2>Sua lista ainda está vazia</h2>
          <p>Toque no coração de um produto para guardá-lo aqui.</p>
          <button type="button" onClick={() => navigate("/")}>Explorar produtos</button>
        </section>
      ) : (
        <>
          <section className="lista-desejos-grade" aria-label="Produtos desejados">
            {favoritos.map(({ produtoId, produto }) => (
              <article className="lista-desejos-card" key={produtoId}>
                <button
                  type="button"
                  className="lista-desejos-produto"
                  onClick={() => navigate(`/produto/${produto.id}`)}
                  aria-label={`Ver ${produto.nome}`}
                >
                  <img src={imagemProdutoUrl(produto.foto)} alt={produto.nome} />
                  <span>{produto.nome}</span>
                  <strong>
                    {Number(produto.preco).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </strong>
                </button>
                <button
                  type="button"
                  className="lista-desejos-remover"
                  onClick={() => removerFavorito(produtoId)}
                  disabled={pendentes.has(produtoId)}
                >
                  {pendentes.has(produtoId) ? "Removendo..." : "Remover"}
                </button>
              </article>
            ))}
          </section>
          <div className="lista-desejos-negociar">
            <button type="button" onClick={negociarNoWhatsApp}>
              Negociar lista pelo WhatsApp
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default ListaDesejos;
