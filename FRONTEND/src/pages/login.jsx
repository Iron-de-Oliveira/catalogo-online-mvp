
import { useState } from "react";
import "../styles/login.css";

function LoginPage() {

  // CONTROLE DAS TELAS
  const [tela, setTela] = useState("inicio");

  return (
    <div className="container">

      {/* LADO ESQUERDO */}
      <div className="left-side">

        {/* ========================= */}
        {/* TELA INICIAL */}
        {/* ========================= */}
        {tela === "inicio" && (
          <>
            <h1>Seja bem vindo!</h1>

            <div className="cards">

              {/* CARD LOGIN */}
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

              {/* CARD ADM */}
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

        {/* ========================= */}
        {/* TELA CLIENTE */}
        {/* ========================= */}
        {tela === "cliente" && (
          <div className="form-container">

            <h1>Seja bem vindo!</h1>

            <label>Inserir email:</label>

            <input
              type="email"
              placeholder="****@gmail.com"
            />

            <label>Insira senha:</label>

            <input
              type="password"
              placeholder="********"
            />

            <div className="buttons">

              <button className="btn-clear">
                limpar
              </button>

              <button className="btn-enter">
                Entrar
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

          </div>
        )}

        {/* ========================= */}
        {/* TELA ADM */}
        {/* ========================= */}
        {tela === "adm" && (
          <div className="form-container">

            <h1>Seja bem vindo!</h1>

            <label>Insira CPF:</label>

            <input
              type="text"
              placeholder="000.555.999-88"
            />

            <label>Insira senha:</label>

            <input
              type="password"
              placeholder="********"
            />

            <div className="buttons">

              <button className="btn-enter">
                Entrar
              </button>

              <button className="btn-clear">
                limpar
              </button>

            </div>

            <button
              className="btn-back"
              onClick={() => setTela("inicio")}
            >
              ⬅ Sair
            </button>

          </div>
        )}

        {/* ========================= */}
        {/* TELA CADASTRO */}
        {/* ========================= */}
        {tela === "cadastro" && (
          <div className="form-container">

            <h1>Seja bem vindo!</h1>

            <label>Nome:</label>

            <input
              type="text"
              placeholder="Jonas judas josisas"
            />

            <label>Inserir email:</label>

            <input
              type="email"
              placeholder="JJJ@gmail.com"
            />

            <label>Crie uma senha:</label>

            <input
              type="password"
              placeholder="**********"
            />

            <div className="buttons">

              <button className="btn-clear">
                limpar
              </button>

              <button className="btn-enter">
                Cadastrar
              </button>

            </div>

            <button
              className="btn-back"
              onClick={() => setTela("cliente")}
            >
              ⬅ Sair
            </button>

          </div>
        )}

        {/* FOOTER */}
        <div className="footer">
          <h3>ARTE EM MÓVEIS</h3>
          <p>Powered by decor&arte</p>
        </div>

      </div>

      {/* LADO DIREITO */}
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