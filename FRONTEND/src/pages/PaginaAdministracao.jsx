import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/server";
import "../styles/paginaAdministracao.css";

export default function PaginaAdministracao() {
  const navigate = useNavigate();

  const [modo, setModo] = useState("catalogo");
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [produtoExpandido, setProdutoExpandido] = useState(null);

  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState(null);

  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    categoria: "COZINHA",
    estoque: "",
    descricao: "",
    preco: "",
    promocao: "",
    idAdministrador: 1
  });

  const categorias = [
    { label: "Móveis", value: "" },
    { label: "Peças", value: "PECAS" },
    { label: "Decoração", value: "RUSTICO" },
    { label: "Cozinha", value: "COZINHA" },
    { label: "Quarto", value: "QUARTO" },
    { label: "Sala", value: "SALA" }
  ];

  useEffect(() => {
    carregarProdutos();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const administrador = localStorage.getItem("administrador");

    if (!token || !administrador) {
      navigate("/login");
    }
  }, [navigate]);

  async function carregarProdutos() {
    try {
      const response = await api.get("/produtos");
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  }

  function mudarModo(novoModo) {
    setModo(novoModo);
    setProdutoSelecionado(null);
    setProdutoExpandido(null);
    setMensagem("");
    limparFormulario();
  }

  function handleInputChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function handleImageChange(e) {
    const file = e.target.files[0];

    if (file) {
      setImagem(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };

      reader.readAsDataURL(file);
    }
  }

  function limparFormulario() {
    setFormData({
      nome: "",
      categoria: "COZINHA",
      estoque: "",
      descricao: "",
      preco: "",
      promocao: "",
      idAdministrador: 1
    });

    setImagem(null);
    setPreview(null);
  }

  function preencherFormulario(produto) {
    setProdutoSelecionado(produto);
    setProdutoExpandido(null);

    setFormData({
      nome: produto.nome || "",
      categoria: produto.categoria || "COZINHA",
      estoque: produto.estoque || "",
      descricao: produto.descricao || "",
      preco: produto.preco || "",
      promocao: produto.promocao || "",
      idAdministrador: produto.administradorId || 1
    });

    setPreview(produto.foto ? `${api.defaults.baseURL}${produto.foto}` : null);
  }

  function expandirProduto(produto) {
    setProdutoExpandido(produto);
    setProdutoSelecionado(null);
  }

  async function criarProduto(e) {
    e.preventDefault();

    if (
      !formData.nome ||
      !formData.categoria ||
      !formData.estoque ||
      !formData.preco ||
      !imagem
    ) {
      setMensagem("Preencha todos os campos obrigatórios e selecione uma imagem.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const data = new FormData();
      data.append("nome", formData.nome);
      data.append("categoria", formData.categoria);
      data.append("estoque", formData.estoque);
      data.append("descricao", formData.descricao);
      data.append("preco", formData.preco);
      data.append("idAdministrador", formData.idAdministrador);
      data.append("foto", imagem);

      await api.post("/produtos", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      setMensagem("Produto publicado com sucesso!");
      limparFormulario();
      carregarProdutos();
      setModo("catalogo");
    } catch (error) {
      console.error(error);
      setMensagem(error.response?.data?.error || "Erro ao publicar produto.");
    } finally {
      setLoading(false);
    }
  }

  async function atualizarProduto(e) {
    e.preventDefault();

    if (!produtoSelecionado) {
      setMensagem("Selecione um produto para atualizar.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      let foto = produtoSelecionado.foto;

      if (imagem) {
        const uploadData = new FormData();
        uploadData.append("foto", imagem);

        const uploadResponse = await api.post("/upload", uploadData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        });

        foto = uploadResponse.data.url;
      }

      await api.put(
        `/produtos/id/${produtoSelecionado.id}`,
        {
          nome: formData.nome,
          categoria: formData.categoria,
          estoque: Number(formData.estoque),
          descricao: formData.descricao,
          preco: Number(formData.preco),
          foto
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMensagem("Produto atualizado com sucesso!");
      limparFormulario();
      setProdutoSelecionado(null);
      carregarProdutos();
    } catch (error) {
      console.error(error);
      setMensagem(error.response?.data?.error || "Erro ao atualizar produto.");
    } finally {
      setLoading(false);
    }
  }

  async function deletarProduto() {
    if (!produtoSelecionado) return;

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await api.delete(`/produtos/id/${produtoSelecionado.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMensagem("Produto deletado com sucesso!");
      setProdutoSelecionado(null);
      carregarProdutos();
    } catch (error) {
      console.error(error);
      setMensagem(error.response?.data?.error || "Erro ao deletar produto.");
    } finally {
      setLoading(false);
    }
  }

  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("administrador");
    navigate("/login");
  }

  const produtosFiltrados = produtos.filter((produto) => {
    const buscaNormalizada = busca.toLowerCase();

    const correspondeBusca =
      produto.nome?.toLowerCase().includes(buscaNormalizada) ||
      produto.categoria?.toLowerCase().includes(buscaNormalizada) ||
      String(produto.id).includes(buscaNormalizada);

    const correspondeCategoria = categoriaFiltro
      ? produto.categoria === categoriaFiltro
      : true;

    return correspondeBusca && correspondeCategoria;
  });

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-search">
          <span>🔍</span>
          <input
            type="text"
            placeholder="cod PTD: 0001"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className="admin-categories">
          {categorias.map((categoria) => (
            <button
              key={categoria.label}
              onClick={() => setCategoriaFiltro(categoria.value)}
              className={categoriaFiltro === categoria.value ? "active" : ""}
            >
              {categoria.label}
            </button>
          ))}
        </div>

        <button className="admin-exit" onClick={sair}>
          ↪ Sair
        </button>
      </aside>

      <main className="admin-content">
        <div className="admin-actions">
          <button
            className={`action-btn add ${modo === "adicionar" ? "selected" : ""}`}
            onClick={() => mudarModo("adicionar")}
          >
            Adicionar novo produto
          </button>

          <button
            className={`action-btn update ${modo === "atualizar" ? "selected" : ""}`}
            onClick={() => mudarModo("atualizar")}
          >
            Atualizar produto
          </button>

          <button
            className={`action-btn delete ${modo === "deletar" ? "selected" : ""}`}
            onClick={() => mudarModo("deletar")}
          >
            Deletar produto
          </button>
        </div>

        {mensagem && <div className="admin-message">{mensagem}</div>}

        {modo === "adicionar" && (
          <form className="admin-form-box" onSubmit={criarProduto}>
            <ImageBox
              title="Adicionar foto:"
              preview={preview}
              onChange={handleImageChange}
            />

            <div className="admin-form-fields">
              <input
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Nome do produto:"
              />

              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
              >
                <option value="COZINHA">Cozinha</option>
                <option value="SALA">Sala</option>
                <option value="QUARTO">Quarto</option>
                <option value="MESAS">Mesas</option>
                <option value="GUARDA_ROUPAS">Guarda roupas</option>
                <option value="PECAS">Peças</option>
                <option value="RUSTICO">Rústico</option>
              </select>

              <input
                name="estoque"
                type="number"
                value={formData.estoque}
                onChange={handleInputChange}
                placeholder="Inserir quantidade em estoque:"
              />

              <input
                name="preco"
                type="number"
                value={formData.preco}
                onChange={handleInputChange}
                placeholder="Inserir o valor do produto:"
              />

              <input
                name="promocao"
                value={formData.promocao}
                onChange={handleInputChange}
                placeholder="Adicionar promoção:"
              />
            </div>

            <div className="admin-description">
              <label>Descrição do produto:</label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
              />

              <div className="admin-form-buttons">
                <button type="button" className="cancel" onClick={limparFormulario}>
                  Cancelar
                </button>

                <button type="submit" className="publish" disabled={loading}>
                  {loading ? "Publicando..." : "Publicar"}
                </button>
              </div>
            </div>
          </form>
        )}

        {(modo === "atualizar" || modo === "deletar") && (
          <>
            <div className="admin-search-line">
              <input
                type="text"
                placeholder={
                  modo === "atualizar"
                    ? "Buscar produto para atualização"
                    : "Buscar produto para deleção"
                }
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>

            <div className="admin-carousel-wrapper">
              <div className="admin-carousel">
                {produtosFiltrados.map((produto) => (
                  <div className="admin-mini-card" key={produto.id}>
                    <img
                      src={
                        produto.foto
                          ? `${api.defaults.baseURL}${produto.foto}`
                          : "/placeholder.png"
                      }
                      alt={produto.nome}
                    />

                    <div className="mini-info">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>

                      <button
                        className={modo === "atualizar" ? "mini-update" : "mini-delete"}
                        onClick={() => preencherFormulario(produto)}
                      >
                        {modo === "atualizar" ? "Atualizar" : "Deletar"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {modo === "atualizar" && produtoSelecionado && (
          <>
            <div className="selected-product-box">
              <img
                src={
                  produtoSelecionado.foto
                    ? `${api.defaults.baseURL}${produtoSelecionado.foto}`
                    : "/placeholder.png"
                }
                alt={produtoSelecionado.nome}
              />

              <div className="selected-info">
                <p>Nome: {produtoSelecionado.nome}</p>
                <p>Categoria: {produtoSelecionado.categoria}</p>
                <p>Estoque: {produtoSelecionado.estoque}</p>
                <p>Valor: R$ {Number(produtoSelecionado.preco).toFixed(2)}</p>
                <p>Promoção: Nenhuma</p>
              </div>

              <div className="selected-description">
                <p>Descrição:</p>
                <span>{produtoSelecionado.descricao}</span>
              </div>
            </div>

            <form className="admin-form-box" onSubmit={atualizarProduto}>
              <ImageBox
                title="Atualizar fotos"
                preview={preview}
                onChange={handleImageChange}
              />

              <div className="admin-form-fields">
                <input name="nome" value={formData.nome} onChange={handleInputChange} />

                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                >
                  <option value="COZINHA">Cozinha</option>
                  <option value="SALA">Sala</option>
                  <option value="QUARTO">Quarto</option>
                  <option value="MESAS">Mesas</option>
                  <option value="GUARDA_ROUPAS">Guarda roupas</option>
                  <option value="PECAS">Peças</option>
                  <option value="RUSTICO">Rústico</option>
                </select>

                <input
                  name="estoque"
                  type="number"
                  value={formData.estoque}
                  onChange={handleInputChange}
                />

                <input
                  name="preco"
                  type="number"
                  value={formData.preco}
                  onChange={handleInputChange}
                />

                <input
                  name="promocao"
                  value={formData.promocao}
                  onChange={handleInputChange}
                />
              </div>

              <div className="admin-description">
                <label>Editar Descrição do produto:</label>

                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                />

                <div className="admin-form-buttons">
                  <button type="button" className="cancel" onClick={limparFormulario}>
                    Cancelar
                  </button>

                  <button type="submit" className="publish" disabled={loading}>
                    {loading ? "Atualizando..." : "Atualizar"}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}

        {modo === "deletar" && produtoSelecionado && (
          <div className="delete-confirm-box">
            <img
              src={
                produtoSelecionado.foto
                  ? `${api.defaults.baseURL}${produtoSelecionado.foto}`
                  : "/placeholder.png"
              }
              alt={produtoSelecionado.nome}
            />

            <div className="delete-info">
              <h3>Tem certeza que deseja excluir este produto do catálogo?</h3>
              <p>Nome: {produtoSelecionado.nome}</p>
              <p>Categoria: {produtoSelecionado.categoria}</p>
              <p>Descrição: {produtoSelecionado.descricao}</p>
              <p>Estoque: {produtoSelecionado.estoque}</p>
              <p>Preço: R$ {Number(produtoSelecionado.preco).toFixed(2)}</p>

              <div>
                <button
                  className="cancel-small"
                  onClick={() => setProdutoSelecionado(null)}
                >
                  Cancelar
                </button>

                <button
                  className="delete-small"
                  onClick={deletarProduto}
                  disabled={loading}
                >
                  {loading ? "Deletando..." : "Deletar"}
                </button>
              </div>
            </div>
          </div>
        )}

        {produtoExpandido && (
          <div className="expanded-product-box">
            <div className="expanded-image">
              <img
                src={
                  produtoExpandido.foto
                    ? `${api.defaults.baseURL}${produtoExpandido.foto}`
                    : "/placeholder.png"
                }
                alt={produtoExpandido.nome}
              />
            </div>

            <div className="expanded-info">
              <h2>{produtoExpandido.nome}</h2>

              <p>
                <strong>Categoria:</strong> {produtoExpandido.categoria}
              </p>

              <p>
                <strong>Estoque:</strong> {produtoExpandido.estoque}
              </p>

              <p>
                <strong>Preço:</strong> R$ {Number(produtoExpandido.preco).toFixed(2)}
              </p>

              <div className="expanded-description">
                {produtoExpandido.descricao || "Produto sem descrição cadastrada."}
              </div>

              <button
                className="expanded-close"
                onClick={() => setProdutoExpandido(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        <section className="admin-products-grid">
          {produtosFiltrados.map((produto) => (
            <div
              className="admin-product-card"
              key={produto.id}
              onClick={() => expandirProduto(produto)}
            >
              <img
                src={
                  produto.foto
                    ? `${api.defaults.baseURL}${produto.foto}`
                    : "/placeholder.png"
                }
                alt={produto.nome}
              />
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

function ImageBox({ title, preview, onChange }) {
  return (
    <div className="image-box">
      <label>{title}</label>

      <div className="main-image-upload">
        {preview ? (
          <img src={preview} alt="Preview" />
        ) : (
          <span>+</span>
        )}

        <input type="file" accept="image/*" onChange={onChange} />
      </div>

      <div className="small-image-row">
        <div>+</div>
        <div>+</div>
        <div>+</div>
      </div>
    </div>
  );
}