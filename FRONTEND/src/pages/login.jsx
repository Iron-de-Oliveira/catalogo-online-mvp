import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/server";
import "../styles/login.css";

const TEXTOS = {
  cliente: {
    titulo: "Entrar na sua conta",
    sub: "Use seu e-mail e senha para acessar o catálogo."
  },
  adm: {
    titulo: "Área do administrador",
    sub: "Entre com seu CPF e senha."
  },
  cadastro: {
    titulo: "Criar conta",
    sub: "Preencha os dados abaixo para se cadastrar."
  }
};

function Campo({ id, label, erro, type = "text", ...props }) {
  const [visivel, setVisivel] = useState(false);
  const ehSenha = type === "password";

  return (
    <div className="lg-campo">
      <label htmlFor={id}>{label}</label>

      <div className={`lg-input${ehSenha ? " lg-input--senha" : ""}`}>
        <input
          id={id}
          type={ehSenha && visivel ? "text" : type}
          aria-invalid={Boolean(erro)}
          aria-describedby={erro ? `${id}-erro` : undefined}
          {...props}
        />

        {ehSenha && (
          <button
            type="button"
            className="lg-mostrar"
            onClick={() => setVisivel((v) => !v)}
            aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
          >
            {visivel ? "Ocultar" : "Mostrar"}
          </button>
        )}
      </div>

      {erro && (
        <p id={`${id}-erro`} className="lg-erro-campo" role="alert">
          {erro}
        </p>
      )}
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();

  const [modo, setModo] = useState("cliente"); // "cliente" | "adm" | "cadastro"
  const [loginCliente, setLoginCliente] = useState({ email: "", senha: "" });
  const [loginAdmin, setLoginAdmin] = useState({ cpf: "", senha: "" });
  const [cadastro, setCadastro] = useState({ nome: "", email: "", senha: "" });
  const [errosCadastro, setErrosCadastro] = useState({});
  const [aviso, setAviso] = useState(null); // { tipo: "erro" | "ok", texto }
  const [carregando, setCarregando] = useState(false);

  function trocarModo(novoModo) {
    setModo(novoModo);
    setAviso(null);
    setErrosCadastro({});
  }

  function atualizar(setter) {
    return (event) => {
      const { name, value } = event.target;
      setter((atual) => ({ ...atual, [name]: value }));
    };
  }

  function atualizarCadastro(event) {
    const { name, value } = event.target;
    setCadastro((atual) => ({ ...atual, [name]: value }));
    setErrosCadastro((atuais) => ({ ...atuais, [name]: undefined }));
    setAviso(null);
  }

  function mensagemErro(error, padrao) {
    return error.response?.data?.error || padrao;
  }

  async function entrarCliente(event) {
    event.preventDefault();
    setCarregando(true);
    setAviso(null);

    try {
      const { data } = await api.post("/auth/login", loginCliente);

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      navigate("/");
    } catch (error) {
      console.error(error);
      setAviso({ tipo: "erro", texto: mensagemErro(error, "Erro ao realizar login.") });
    } finally {
      setCarregando(false);
    }
  }

  async function entrarAdmin(event) {
    event.preventDefault();
    setCarregando(true);
    setAviso(null);

    try {
      const { data } = await api.post("/auth/login-admin", loginAdmin);

      localStorage.setItem("token", data.token);
      localStorage.setItem("administrador", JSON.stringify(data.administrador));

      navigate("/admin");
    } catch (error) {
      console.error(error);
      setAviso({
        tipo: "erro",
        texto: mensagemErro(error, "Erro ao realizar login do administrador.")
      });
    } finally {
      setCarregando(false);
    }
  }

  async function cadastrar(event) {
    event.preventDefault();
    setCarregando(true);
    setAviso(null);
    setErrosCadastro({});

    try {
      await api.post("/auth/register", cadastro);

      // leva o e-mail para o login e avisa que deu certo
      setLoginCliente({ email: cadastro.email, senha: "" });
      setCadastro({ nome: "", email: "", senha: "" });
      setModo("cliente");
      setAviso({ tipo: "ok", texto: "Conta criada! Entre com seu e-mail e senha." });
    } catch (error) {
      console.error(error);

      if (error.response?.data?.errors) {
        setErrosCadastro(error.response.data.errors);
      } else {
        setAviso({ tipo: "erro", texto: mensagemErro(error, "Erro ao cadastrar usuário.") });
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="lg-page">
      <aside className="lg-hero">
        <img
          className="lg-hero-img"
          src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80"
          alt=""
        />

        <div className="lg-hero-content">
          <div className="lg-marca">
            <img src="/logo.png" alt="" />
            <span>Arte em Móveis</span>
          </div>

          <div className="lg-frase">
            <p>Móveis de madeira: o legado da natureza em seu lar.</p>
            <small>Cada peça, uma obra-prima da natureza.</small>
          </div>
        </div>
      </aside>

      <main className="lg-main">
        <button type="button" className="lg-voltar" onClick={() => navigate("/")}>
          ‹ Voltar ao catálogo
        </button>

        <section className="lg-card">
          <h1>{TEXTOS[modo].titulo}</h1>
          <p className="lg-sub">{TEXTOS[modo].sub}</p>

          {modo !== "cadastro" && (
            <div className="lg-tabs">
              <button
                type="button"
                className="lg-tab"
                aria-pressed={modo === "cliente"}
                onClick={() => trocarModo("cliente")}
              >
                Cliente
              </button>
              <button
                type="button"
                className="lg-tab"
                aria-pressed={modo === "adm"}
                onClick={() => trocarModo("adm")}
              >
                Administrador
              </button>
            </div>
          )}

          {modo === "cliente" && (
            <form className="lg-form" onSubmit={entrarCliente}>
              <Campo
                id="login-email"
                label="E-mail"
                type="email"
                name="email"
                placeholder="voce@email.com"
                autoComplete="email"
                value={loginCliente.email}
                onChange={atualizar(setLoginCliente)}
                required
              />
              <Campo
                id="login-senha"
                label="Senha"
                type="password"
                name="senha"
                autoComplete="current-password"
                value={loginCliente.senha}
                onChange={atualizar(setLoginCliente)}
                required
              />

              <button className="lg-btn" type="submit" disabled={carregando}>
                {carregando ? "Entrando..." : "Entrar"}
              </button>
            </form>
          )}

          {modo === "adm" && (
            <form className="lg-form" onSubmit={entrarAdmin}>
              <Campo
                id="adm-cpf"
                label="CPF"
                name="cpf"
                placeholder="Somente números"
                inputMode="numeric"
                maxLength={11}
                autoComplete="username"
                value={loginAdmin.cpf}
                onChange={(e) =>
                  setLoginAdmin((atual) => ({ ...atual, cpf: e.target.value.replace(/\D/g, "") }))
                }
                required
              />
              <Campo
                id="adm-senha"
                label="Senha"
                type="password"
                name="senha"
                autoComplete="current-password"
                value={loginAdmin.senha}
                onChange={atualizar(setLoginAdmin)}
                required
              />

              <button className="lg-btn lg-btn--ambar" type="submit" disabled={carregando}>
                {carregando ? "Entrando..." : "Entrar como administrador"}
              </button>
            </form>
          )}

          {modo === "cadastro" && (
            <form className="lg-form" onSubmit={cadastrar}>
              <Campo
                id="cad-nome"
                label="Nome"
                name="nome"
                placeholder="Seu nome completo"
                autoComplete="name"
                value={cadastro.nome}
                onChange={atualizarCadastro}
                erro={errosCadastro.nome}
                required
              />
              <Campo
                id="cad-email"
                label="E-mail"
                type="email"
                name="email"
                placeholder="voce@email.com"
                autoComplete="email"
                value={cadastro.email}
                onChange={atualizarCadastro}
                erro={errosCadastro.email}
                required
              />
              <Campo
                id="cad-senha"
                label="Crie uma senha"
                type="password"
                name="senha"
                autoComplete="new-password"
                value={cadastro.senha}
                onChange={atualizarCadastro}
                erro={errosCadastro.senha}
                required
              />

              <button className="lg-btn" type="submit" disabled={carregando}>
                {carregando ? "Cadastrando..." : "Criar conta"}
              </button>
            </form>
          )}

          {aviso && (
            <p
              className={`lg-aviso lg-aviso--${aviso.tipo}`}
              role={aviso.tipo === "erro" ? "alert" : "status"}
            >
              {aviso.texto}
            </p>
          )}

          {modo === "cliente" && (
            <p className="lg-troca">
              Ainda não tem conta?{" "}
              <button type="button" className="lg-link" onClick={() => trocarModo("cadastro")}>
                Cadastre-se
              </button>
            </p>
          )}

          {modo === "cadastro" && (
            <p className="lg-troca">
              Já tem conta?{" "}
              <button type="button" className="lg-link" onClick={() => trocarModo("cliente")}>
                Entrar
              </button>
            </p>
          )}
        </section>

        <p className="lg-rodape">Powered by decor&arte</p>
      </main>
    </div>
  );
}

export default LoginPage;