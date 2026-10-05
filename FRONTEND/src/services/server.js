import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:3333";

const api = axios.create({
  baseURL,
});

export { baseURL };
export default api;

export function imagemProdutoUrl(foto) {
  if (!foto) {
    return "/placeholder.png";
  }

  if (/^https?:\/\//i.test(foto)) {
    return foto;
  }

  return `${baseURL.replace(/\/$/, "")}/${foto.replace(/^\/+/, "")}`;
}

