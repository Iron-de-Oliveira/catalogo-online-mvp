import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/server";
import "../styles/login.css";

function LoginPage() {
  const navigate = useNavigate();

  const [tela, setTela] = useState("inicio");

  const [cadastro, setCadastro] = useState({
    nome: "",
    email: "",
    senha: ""
  });

  const [loginCliente, setLoginCliente] = useState({
    email: "",
    senha: ""
  });

  const [loginAdmin, setLoginAdmin] = useState({
    cpf: "",
    senha: ""
  });

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const [mensagemLogin, setMensagemLogin] = useState("");
  const [erroLogin, setErroLogin] = useState("");
  const [carregandoLogin, setCarregandoLogin] = useState(false);

  const [mensagemLoginAdmin, setMensagemLoginAdmin] = useState("");
  const [erroLoginAdmin, setErroLoginAdmin] = useState("");
  const [carregandoLoginAdmin, setCarregandoLoginAdmin] = useState(false);

  function handleCadastroChange(event) {
    const { name, value } = event.target;

    setCadastro({
      ...cadastro,
      [name]: value
    });
  }

  function handleLoginClienteChange(event) {
    const { name, value } = event.target;

    setLoginCliente({
      ...loginCliente,
      [name]: value
    });
  }

  function handleLoginAdminChange(event) {
    const { name, value } = event.target;

    setLoginAdmin({
      ...loginAdmin,
      [name]: value
    });
  }

  function limparCadastro() {
    setCadastro({
      nome: "",
      email: "",
      senha: ""
    });

    setMensagem("");
    setErro("");
  }

  function limparLoginCliente() {
    setLoginCliente({
      email: "",
      senha: ""
    });

    setMensagemLogin("");
    setErroLogin("");
  }

  function limparLoginAdmin() {
    setLoginAdmin({
      cpf: "",
      senha: ""
    });

    setMensagemLoginAdmin("");
    setErroLoginAdmin("");
  }

  async function cadastrarUsuario() {
    try {
      setCarregando(true);
      setErro("");
      setMensagem("");

      const response = await api.post("/auth/register", cadastro);

      setMensagem("Usuário cadastrado com sucesso!");

      setCadastro({
        nome: "",
        email: "",
        senha: ""
      });

      console.log("Usuário criado:", response.data);

      setTimeout(() => {
        setTela("cliente");
      }, 1500);

    } catch (error) {
      console.log(error);

      if (error.response?.data?.error) {
        setErro(error.response.data.error);
      } else {
        setErro("Erro ao cadastrar usuário.");
      }

    } finally {
      setCarregando(false);
    }
  }

  async function fazerLoginCliente() {
    try {
      setCarregandoLogin(true);
      setErroLogin("");
      setMensagemLogin("");

      const response = await api.post("/auth/login", loginCliente);

      console.log("Login realizado:", response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("usuario", JSON.stringify(response.data.usuario));

      setMensagemLogin("Login realizado com sucesso!");

      navigate("/");

    } catch (error) {
      console.log(error);

      if (error.response?.data?.error) {
        setErroLogin(error.response.data.error);
      } else {
        setErroLogin("Erro ao realizar login.");
      }

    } finally {
      setCarregandoLogin(false);
    }
  }

  async function fazerLoginAdmin() {
    try {
      setCarregandoLoginAdmin(true);
      setErroLoginAdmin("");
      setMensagemLoginAdmin("");

      const response = await api.post("/auth/login-admin", loginAdmin);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "administrador",
        JSON.stringify(response.data.administrador)
      );

      setMensagemLoginAdmin("Login do administrador realizado com sucesso!");

      navigate("/admin");

    } catch (error) {
      console.log(error);

      if (error.response?.data?.error) {
        setErroLoginAdmin(error.response.data.error);
      } else {
        setErroLoginAdmin("Erro ao realizar login do administrador.");
      }

    } finally {
      setCarregandoLoginAdmin(false);
    }
  }

  return (
    <div className="container">
      <div className="left-side">
        {tela === "inicio" && (
          <>
            <h1>Seja bem vindo!</h1>

            <div className="cards">
              <div className="card">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
                  alt="Login"
                />

                <button
                  className="btn-login"
                  onClick={() => setTela("cliente")}
                >
                  Fazer login
                </button>
              </div>

              <div className="card">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"
                  alt="ADM"
                />

                <button
                  className="btn-adm"
                  onClick={() => setTela("adm")}
                >
                  Acessar como ADM
                </button>
              </div>
            </div>
          </>
        )}

        {tela === "cliente" && (
          <div className="form-container">
            <h1>Seja bem vindo!</h1>

            <label>Inserir email:</label>
            <input
              type="email"
              name="email"
              placeholder="****@gmail.com"
              value={loginCliente.email}
              onChange={handleLoginClienteChange}
            />

            <label>Insira senha:</label>
            <input
              type="password"
              name="senha"
              placeholder="********"
              value={loginCliente.senha}
              onChange={handleLoginClienteChange}
            />

            <div className="buttons">
              <button
                className="btn-clear"
                type="button"
                onClick={limparLoginCliente}
              >
                limpar
              </button>

              <button
                className="btn-enter"
                type="button"
                onClick={fazerLoginCliente}
                disabled={carregandoLogin}
              >
                {carregandoLogin ? "Entrando..." : "Entrar"}
              </button>
            </div>

            <p
              className="register"
              onClick={() => setTela("cadastro")}
            >
              Cadastrar-se
            </p>

            <button
              className="btn-back"
              onClick={() => setTela("inicio")}
            >
              ⬅ Sair
            </button>

            {mensagemLogin && (
              <p className="success-message">{mensagemLogin}</p>
            )}

            {erroLogin && (
              <p className="error-message">{erroLogin}</p>
            )}
          </div>
        )}

        {tela === "adm" && (
          <div className="form-container">
            <h1>Seja bem vindo!</h1>

            <label>Insira CPF:</label>
            <input
              type="text"
              name="cpf"
              placeholder="00055599988"
              value={loginAdmin.cpf}
              onChange={handleLoginAdminChange}
            />

            <label>Insira senha:</label>
            <input
              type="password"
              name="senha"
              placeholder="********"
              value={loginAdmin.senha}
              onChange={handleLoginAdminChange}
            />

            <div className="buttons">
              <button
                className="btn-enter"
                type="button"
                onClick={fazerLoginAdmin}
                disabled={carregandoLoginAdmin}
              >
                {carregandoLoginAdmin ? "Entrando..." : "Entrar"}
              </button>

              <button
                className="btn-clear"
                type="button"
                onClick={limparLoginAdmin}
              >
                limpar
              </button>
            </div>

            {mensagemLoginAdmin && (
              <p className="success-message">{mensagemLoginAdmin}</p>
            )}

            {erroLoginAdmin && (
              <p className="error-message">{erroLoginAdmin}</p>
            )}

            <button
              className="btn-back"
              onClick={() => setTela("inicio")}
            >
              ⬅ Sair
            </button>
          </div>
        )}

        {tela === "cadastro" && (
          <div className="form-container">
            <h1>Seja bem vindo!</h1>

            <label>Nome:</label>
            <input
              type="text"
              name="nome"
              placeholder="Jonas Judas Josias"
              value={cadastro.nome}
              onChange={handleCadastroChange}
            />

            <label>Inserir email:</label>
            <input
              type="email"
              name="email"
              placeholder="JJJ@gmail.com"
              value={cadastro.email}
              onChange={handleCadastroChange}
            />

            <label>Crie uma senha:</label>
            <input
              type="password"
              name="senha"
              placeholder="**********"
              value={cadastro.senha}
              onChange={handleCadastroChange}
            />

            <div className="buttons">
              <button
                className="btn-clear"
                onClick={limparCadastro}
                type="button"
              >
                limpar
              </button>

              <button
                className="btn-enter"
                onClick={cadastrarUsuario}
                type="button"
                disabled={carregando}
              >
                {carregando ? "Cadastrando..." : "Cadastrar"}
              </button>
            </div>

            <button
              className="btn-back"
              onClick={() => setTela("cliente")}
            >
              ⬅ Sair
            </button>

            {mensagem && (
              <p className="success-message">{mensagem}</p>
            )}

            {erro && (
              <p className="error-message">{erro}</p>
            )}
          </div>
        )}

        <div className="footer">
          <h3>ARTE EM MÓVEIS</h3>
          <p>Powered by decor&arte</p>
        </div>
      </div>

      <div className="right-side">
        <div className="box">
          <img
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
            alt="Mesa"
          />
        </div>

        <div className="box text-box">
          <p>
            Móveis de madeira:
            <br />
            O legado da natureza em seu lar.
          </p>
        </div>

        <div className="box text-box">
          <p>
            Durabilidade esculpida,
            conforto garantido.
          </p>
        </div>

        <div className="box">
          <img
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
            alt="Cama"
          />
        </div>

        <div className="box">
          <img
            src="https://images.unsplash.com/photo-1517705008128-361805f42e86"
            alt="Madeira"
          />
        </div>

        <div className="box text-box">
          <p>
            Cada peça,
            uma obra-prima da natureza.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;