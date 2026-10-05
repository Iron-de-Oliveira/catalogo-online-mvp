import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { imagemProdutoUrl } from "../services/server";
import "../styles/perfilusuario.css";

function PerfilUsuario() {
  const navigate = useNavigate();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: ""
  });

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const usuarioStorage = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");

    if (!token || !usuarioStorage) {
      navigate("/login");
      return;
    }

    const usuarioLogado = JSON.parse(usuarioStorage);

    setUsuario(usuarioLogado);

    setFormData({
      nome: usuarioLogado.nome || "",
      email: usuarioLogado.email || "",
      senha: ""
    });

    setPreviewFoto(usuarioLogado.fotoPerfil || null);

    api.get(`/usuarios/id/${usuarioLogado.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(({ data }) => {
      setUsuario(data);
      setPreviewFoto(data.fotoPerfil || null);
      localStorage.setItem("usuario", JSON.stringify(data));
    }).catch((error) => {
      console.error("Erro ao carregar foto do perfil:", error);
    });
  }, [navigate]);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function handleFotoChange(e) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    const tiposPermitidos = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!tiposPermitidos.includes(arquivo.type)) {
      setErro("Selecione uma imagem JPEG, PNG, GIF ou WebP.");
      e.target.value = "";
      return;
    }

    if (arquivo.size > 5 * 1024 * 1024) {
      setErro("A imagem deve ter no máximo 5 MB.");
      e.target.value = "";
      return;
    }

    setErro("");
    setFotoPerfil(arquivo);
    setPreviewFoto(URL.createObjectURL(arquivo));
  }

  async function atualizarUsuario() {
    try {
      setLoading(true);
      setMensagem("");
      setErro("");

      const token = localStorage.getItem("token");

      if (!formData.nome || !formData.email) {
        setErro("Nome e e-mail são obrigatórios.");
        return;
      }

      const dadosAtualizacao = new FormData();
      dadosAtualizacao.append("nome", formData.nome);
      dadosAtualizacao.append("email", formData.email);

      if (formData.senha.trim() !== "") {
        dadosAtualizacao.append("senha", formData.senha);
      }

      if (fotoPerfil) {
        dadosAtualizacao.append("fotoPerfil", fotoPerfil);
      }

      const response = await api.put(
        `/usuarios/email/${encodeURIComponent(usuario.email)}`,
        dadosAtualizacao,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      localStorage.setItem("usuario", JSON.stringify(response.data));

      setUsuario(response.data);
      setFotoPerfil(null);
      setPreviewFoto(response.data.fotoPerfil || null);

      setFormData({
        nome: response.data.nome || "",
        email: response.data.email || "",
        senha: ""
      });

      setMensagem("Dados atualizados com sucesso!");
      setMostrarFormulario(false);

    } catch (error) {
      console.log(error);

      setErro(
        error.response?.data?.error ||
        "Erro ao atualizar informações do usuário."
      );

    } finally {
      setLoading(false);
    }
  }

  function cancelarEdicao() {
    setMostrarFormulario(false);
    setErro("");
    setMensagem("");
    setFotoPerfil(null);
    setPreviewFoto(usuario.fotoPerfil || null);

    setFormData({
      nome: usuario.nome || "",
      email: usuario.email || "",
      senha: ""
    });
  }

  if (!usuario) {
    return (
      <div className="perfil-container">
        <p>Carregando perfil...</p>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      <div className="perfil-topo">
        <div className="perfil-info">
           <div
          className="back-home"
          onClick={() => navigate("/")}
        >
          ❮
        </div>
          <div className="foto-perfil">
            {previewFoto ? (
              <img src={imagemProdutoUrl(previewFoto)} alt={`Foto de ${usuario.nome}`} />
            ) : (
              "👤"
            )}
          </div>

          <input
            className="nome-usuario"
            value={usuario.nome}
            disabled
          />
        </div>

        <div className="perfil-acoes">
          <p>Atualizar informações pessoais</p>

          <button
            className="btn-atualizar"
            onClick={() => setMostrarFormulario(true)}
          >
            Atualizar
          </button>
        </div>

      </div>

      {mensagem && (
        <div className="success-message">
          {mensagem}
        </div>
      )}

      {erro && (
        <div className="error-message">
          {erro}
        </div>
      )}

      <div className="dados-container">
        <h1>Dados pessoais</h1>

        <div className="dado">
          Nome: {usuario.nome}
        </div>

        <div className="dado">
          Senha: ********
        </div>

        <div className="dado">
          Email: {usuario.email}
        </div>
      </div>

      {mostrarFormulario && (
        <div className="formulario-edicao">
          <h3>Preencha os campos com as novas informações</h3>

          <div className="form-content">
            <div className="inputs">
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                value={formData.nome}
                onChange={handleChange}
              />

              <input
                type="password"
                name="senha"
                placeholder="Nova senha"
                value={formData.senha}
                onChange={handleChange}
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="foto-upload">
              <p>Nova foto de perfil</p>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFotoChange}
              />
              <small>JPEG, PNG, GIF ou WebP. Máximo de 5 MB.</small>
            </div>
          </div>

          <div className="botoes">
            <button
              className="btn-atualizar"
              onClick={atualizarUsuario}
              disabled={loading}
            >
              {loading ? "Atualizando..." : "Atualizar"}
            </button>

            <button
              className="btn-cancelar"
              onClick={cancelarEdicao}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PerfilUsuario;