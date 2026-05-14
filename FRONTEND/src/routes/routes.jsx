import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/home";
import LoginPage from "../pages/login";
import ExibProduto from "../pages/exibProduto";
import TesteApi from "../pages/testeApi";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/produto/:id" element={<ExibProduto />} />
        <Route path="/teste-api" element={<TesteApi />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;