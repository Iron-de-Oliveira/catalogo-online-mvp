import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/server";

export default function useListaDesejos() {
  const navigate = useNavigate();
  const location = useLocation();
  const [produtosIds, setProdutosIds] = useState(() => new Set());
  const [pendentes, setPendentes] = useState(() => new Set());

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let cancelado = false;
    api.get("/lista-desejos", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(({ data }) => {
      if (!cancelado) {
        setProdutosIds(new Set(data.map((item) => item.produtoId)));
      }
    }).catch((error) => {
      console.error("Erro ao carregar lista de desejos:", error);
    });

    return () => {
      cancelado = true;
    };
  }, []);

  const alternarFavorito = useCallback(async (produtoId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { from: location } });
      return;
    }

    if (pendentes.has(produtoId)) return;

    setPendentes((atuais) => new Set(atuais).add(produtoId));
    try {
      if (produtosIds.has(produtoId)) {
        await api.delete(`/lista-desejos/${produtoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProdutosIds((atuais) => {
          const atualizados = new Set(atuais);
          atualizados.delete(produtoId);
          return atualizados;
        });
      } else {
        await api.post(`/lista-desejos/${produtoId}`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProdutosIds((atuais) => new Set(atuais).add(produtoId));
      }
    } catch (error) {
      console.error("Erro ao atualizar lista de desejos:", error);
    } finally {
      setPendentes((atuais) => {
        const atualizados = new Set(atuais);
        atualizados.delete(produtoId);
        return atualizados;
      });
    }
  }, [location, navigate, pendentes, produtosIds]);

  return { produtosIds, pendentes, alternarFavorito };
}
