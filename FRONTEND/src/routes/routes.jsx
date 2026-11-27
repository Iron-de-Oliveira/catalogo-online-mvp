import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/home";
import LoginPage from "../pages/login";
import ExibProduto from "../pages/exibProduto";
import Busca from "../pages/busca";          
import TesteApi from "../pages/testeApi";
import PaginaAdministracao from "../pages/PaginaAdministracao";
import PerfilUsuario from "../pages/perfilusuario";
import ListaDesejos from "../pages/listaDesejos";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/produto/:id" element={<ExibProduto />} />
        <Route path="/busca" element={<Busca />} />   {/* <- NOVA */}
        <Route path="/teste-api" element={<TesteApi />} />
        <Route path="/admin" element={<PaginaAdministracao />} />
        <Route path="/perfil" element={<PerfilUsuario />} />
        <Route path="/lista-desejos" element={<ListaDesejos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;