import { useState } from "react";
import "../styles/perfilUsuario.css";

function PerfilUsuario() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  return (
    <div className="perfil-container">
      <div className="perfil-topo">
        <div className="perfil-info">
          <div className="foto-perfil">👤</div>

          <input
            className="nome-usuario"
            value="Novo usuário"
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

      <div className="dados-container">
        <h1>Dados pessoais</h1>

        <div className="dado">Nome: Novo usuário</div>
        <div className="dado">Senha: ********</div>
        <div className="dado">Email: novousuario@gmail.com</div>
      </div>

      {mostrarFormulario && (
        <div className="formulario-edicao">
          <h3>Preencha os campos com as novas informações</h3>

          <div className="form-content">
            <div className="inputs">
              <input type="text" placeholder="Nome" />
              <input type="password" placeholder="Senha" />
              <input type="email" placeholder="Email" />
            </div>

            <div className="foto-upload">
              <p>Nova foto de perfil</p>
              <input type="file" />
            </div>
          </div>

          <div className="botoes">
            <button className="btn-atualizar">
              Atualizar
            </button>

            <button
              className="btn-cancelar"
              onClick={() => setMostrarFormulario(false)}
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