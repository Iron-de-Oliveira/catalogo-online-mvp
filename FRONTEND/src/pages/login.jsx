import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/server";
import "../styles/login.css";

// função principal de login 
function LoginPage() {
  const navigate = useNavigate()

// ESTADOS PARA GERENCIAR TELAS E FORMULÁRIOS

  const [tela, setTela] = useState("inicio")
  const [cadastro, setCadastro] = useState({
  nome: "",
  email: "",
  senha: ""
});

// MENSAGENS DE SUCESSO E ERRO
const [mensagem, setMensagem] = useState("");
const [erro, setErro] = useState("");
const [carregando, setCarregando] = useState(false);

function handleCadastroChange(event) {
  const { name, value } = event.target;

  setCadastro({
    ...cadastro,
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

// ESTADOS PARA LOGIN
const [loginCliente, setLoginCliente] = useState({
  email: "",
  senha: ""
});

  // ESTADOS PARA LOGIN ADMIN
  const [loginAdmin, setLoginAdmin] = useState({
    cpf: "",
    senha: ""
  });

  const [mensagemLoginAdmin, setMensagemLoginAdmin] = useState("");
  const [erroLoginAdmin, setErroLoginAdmin] = useState("");
  const [carregandoLoginAdmin, setCarregandoLoginAdmin] = useState(false);

const [mensagemLogin, setMensagemLogin] = useState("");
const [erroLogin, setErroLogin] = useState("");
const [carregandoLogin, setCarregandoLogin] = useState(false);

// função para lidar com mudanças no formulário de login,
//  capturar inputs e atualizar o estado loginCliente
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

// função para realizar login do cliente, enviar dados para API
//e lidar com respostas
async function fazerLoginCliente() {
  try {

    setCarregandoLogin(true)
    setErroLogin("")
    setMensagemLogin("")

    const response = await api.post(
      "/auth/login",
      loginCliente
    )

    console.log("Login realizado:", response.data)

    localStorage.setItem(
      "token",
      response.data.token
    )

    localStorage.setItem(
      "usuario",
      JSON.stringify(response.data.usuario)
    )

    setMensagemLogin("Login realizado com sucesso!")

    localStorage.setItem("token", response.data.token)
    localStorage.setItem("usuario", JSON.stringify(response.data.usuario))

    navigate('/')

  } catch (error) {

    console.log(error)

    if (error.response?.data?.error) {
      setErroLogin(error.response.data.error)
    } else {
      setErroLogin("Erro ao realizar login.")
    }

  } finally {
    setCarregandoLogin(false)
  }
}

async function fazerLoginAdmin() {
  try {
    setCarregandoLoginAdmin(true)
    setErroLoginAdmin("")
    setMensagemLoginAdmin("")

    const response = await api.post(
      "/auth/login-admin",
      loginAdmin
    )

    localStorage.setItem("token", response.data.token)
    localStorage.setItem("administrador", JSON.stringify(response.data.administrador))

    setMensagemLoginAdmin("Login do administrador realizado com sucesso!")

    navigate('/admin')
  } catch (error) {
    console.log(error)

    if (error.response?.data?.error) {
      setErroLoginAdmin(error.response.data.error)
    } else {
      setErroLoginAdmin("Erro ao realizar login do administrador.")
    }
  } finally {
    setCarregandoLoginAdmin(false)
  }
}


  return (
    <div className="login-container">
      {/* LADO ESQUERDO */}
      <div className="login-left">
        <h1>Seja bem vindo!</h1>

        {/* TELA CLIENTE */}
        {tela === "cliente" && (
          <form className="login-form">
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
                onClick={() => {
                  setLoginCliente({ email: "", senha: "" });
                  setMensagemLogin("");
                  setErroLogin("");
                }}
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
              type="button"
              onClick={() => setTela("inicio")}
            >
              ⬅ Sair
            </button>

            {mensagemLogin && <p className="success-message">{mensagemLogin}</p>}
            {erroLogin && <p className="error-message">{erroLogin}</p>}
          </form>
        )}

        {/* TELA ADM */}
        {tela === "adm" && (
          <form className="login-form">
            <h1>Login Administrador</h1>

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
                onClick={() => {
                  setLoginAdmin({ cpf: "", senha: "" });
                  setMensagemLoginAdmin("");
                  setErroLoginAdmin("");
                }}
              >
                limpar
              </button>
            </div>

            <button
              className="btn-back"
              type="button"
              onClick={() => setTela("inicio")}
            >
              ⬅ Sair
            </button>

            {mensagemLoginAdmin && <p className="success-message">{mensagemLoginAdmin}</p>}
            {erroLoginAdmin && <p className="error-message">{erroLoginAdmin}</p>}
          </form>
        )}

        {/* FOOTER */}
        <div className="footer">
          <h3>ARTE EM MÓVEIS</h3>
          <p>Powered by decor&arte</p>
        </div>
      </div>

      {/* LADO DIREITO */}
      <div className="login-right">
        <div className="image-box">
          <img
            src="/mesa-redonda.png"
            alt="Mesa"
          />

          <p>
            Móveis de madeira:
            <br />
            O legado da natureza em seu lar.
          </p>
        </div>

        <div className="image-box">
          <p>
            Durabilidade esculpida,
            <br />
            conforto garantido.
          </p>

          <img
            src="/sofa.png"
            alt="Sofá"
          />
        </div>

        <div className="image-box">
          <img
            src="/cadeira-madeira.png"
            alt="Cadeira"
          />

          <p>
            Cada peça,
            <br />
            uma obra-prima da natureza.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;