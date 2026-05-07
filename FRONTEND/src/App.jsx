import { useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="home-container">

      {/* HEADER */}
      <div className="header">

        <h2>Minha Loja</h2>

        <div>
          <button className="login-btn">
            Login
          </button>
        </div>

      </div>

      {/* CONTEÚDO */}
      <div>
        testando front end
      </div>

    </div>
  );
}

export default App;