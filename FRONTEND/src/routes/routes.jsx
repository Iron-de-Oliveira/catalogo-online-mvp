import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/home";
import LoginPage from "../pages/login";
import ExibProduto from "../pages/exibProduto";
import PerfilUsuario from "../pages/perfilusuario";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/produto/:id" element={<ExibProduto />} />
        <Route path="/perfil" element={<PerfilUsuario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;