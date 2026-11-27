import "../styles/favorito.css";

export default function BotaoFavorito({
  favorito,
  carregando = false,
  onClick,
  className = "",
  children,
}) {
  return (
    <button
      type="button"
      className={`favorite-button ${className}`.trim()}
      aria-label={favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      aria-pressed={favorito}
      title={favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      disabled={carregando}
      onClick={onClick}
    >
      <span aria-hidden="true">{favorito ? "♥" : "♡"}</span>
      {children && <span>{children}</span>}
    </button>
  );
}
