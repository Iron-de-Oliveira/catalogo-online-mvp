import { useCallback, useEffect, useRef, useState } from "react";
import "../styles/carrosselProduto.css";

export default function CarrosselProduto({
  imagens = [],
  alt = "",
  intervalo = 4000,
  onAbrir,
}) {
  const [indice, setIndice] = useState(0);
  const [pausado, setPausado] = useState(false);
  const toqueX = useRef(null);
  const total = imagens.length;

  const proximo = useCallback(() => setIndice((i) => (i + 1) % total), [total]);
  const anterior = useCallback(
    () => setIndice((i) => (i - 1 + total) % total),
    [total]
  );

  useEffect(() => {
    if (pausado || total < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(proximo, intervalo);
    return () => clearInterval(id);
  }, [pausado, total, intervalo, proximo, indice]);

  function aoTocarInicio(e) {
    toqueX.current = e.touches[0].clientX;
  }

  function aoTocarFim(e) {
    if (toqueX.current === null) return;
    const diferenca = e.changedTouches[0].clientX - toqueX.current;
    toqueX.current = null;

    if (diferenca < -50) proximo();
    if (diferenca > 50) anterior();
  }

  function aoPressionarTecla(e) {
    if (e.key === "ArrowRight") proximo();
    if (e.key === "ArrowLeft") anterior();
  }

  if (total === 0) return null;

  return (
    <div
      className="cp"
      tabIndex={0}
      aria-roledescription="carrossel"
      aria-label={`Fotos de ${alt}`}
      onKeyDown={aoPressionarTecla}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
    >
      <div
        className="cp-janela"
        onTouchStart={aoTocarInicio}
        onTouchEnd={aoTocarFim}
      >
        <div
          className="cp-trilho"
          style={{ transform: `translateX(-${indice * 100}%)` }}
        >
          {imagens.map((src, i) => (
            <div
              className="cp-slide"
              key={`${src}-${i}`}
              aria-hidden={i !== indice}
            >
              <img
                src={src}
                alt={`${alt} - foto ${i + 1} de ${total}`}
                loading={i === 0 ? "eager" : "lazy"}
                draggable="false"
                onClick={() => onAbrir?.(src)}
              />
            </div>
          ))}
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              className="cp-seta cp-seta-esq"
              aria-label="Foto anterior"
              onClick={anterior}
            >
              ❮
            </button>
            <button
              type="button"
              className="cp-seta cp-seta-dir"
              aria-label="Próxima foto"
              onClick={proximo}
            >
              ❯
            </button>
            <span className="cp-contador">
              {indice + 1} / {total}
            </span>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="cp-miniaturas">
          {imagens.map((src, i) => (
            <button
              type="button"
              key={`mini-${src}-${i}`}
              className={i === indice ? "ativa" : ""}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === indice}
              onClick={() => setIndice(i)}
            >
              <img src={src} alt="" loading="lazy" draggable="false" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}