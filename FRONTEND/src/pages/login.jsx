import "../styles/login.css";

function Login() {
  return (
    <div className="login-container">
      {/* LADO ESQUERDO */}
      <div className="login-left">
        <h1>Seja bem vindo!</h1>

        <form className="login-form">
          <label>Inserir email:</label>

          <input
            type="email"
            placeholder="usuario@gmail.com"
          />

          <label>Inserir senha:</label>

          <input
            type="password"
            placeholder="********"
          />

          <div className="buttons">
            <button
              type="button"
              className="limpar-btn"
            >
              Limpar
            </button>

            <button
              type="submit"
              className="entrar-btn"
            >
              Entrar
            </button>
          </div>
        </form>

        <p className="cadastro-text">
          Cadastrar-se
        </p>

        <button className="sair-btn">
          ⮐ Sair
        </button>

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

export default Login;