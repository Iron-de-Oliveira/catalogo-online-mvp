import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/server";
import "../styles/perfilUsuario.css";

function PerfilUsuario() {
  const navigate = useNavigate();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuario, setUsuario] = useState(null);

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
  }, [navigate]);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
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

      const dadosAtualizacao = {
        nome: formData.nome,
        email: formData.email
      };

      if (formData.senha.trim() !== "") {
        dadosAtualizacao.senha = formData.senha;
      }

      const response = await api.put(
        `/usuarios/email/${usuario.email}`,
        dadosAtualizacao,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      localStorage.setItem("usuario", JSON.stringify(response.data));

      setUsuario(response.data);

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
          <div className="foto-perfil">👤</div>

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
              <input type="file" disabled />
              <small>
                Upload de foto ainda não configurado.
              </small>
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