import { useEffect, useRef, useState } from "react";

/**
 * Scroll horizontal por arrastre con mouse (clic sostenido + mover),
 * mas flechas de apoyo. En touch (celular) no se interfiere nada.
 *
 * IMPORTANTE: NO se usa setPointerCapture aqui a proposito. Capturar el
 * puntero en el contenedor redirige TODOS los eventos siguientes
 * (incluyendo el click de los botones +/- y "Agregar" que estan adentro)
 * hacia el contenedor en vez del boton - eso fue justo el bug reportado.
 * En su lugar, se escucha el movimiento en `window` mientras se arrastra,
 * que no tiene ese efecto secundario.
 */
export default function CategoryScrollRow({ className = "", children }) {
  const scrollRef = useRef(null);
  const arrastrando = useRef(false);
  const movidoMasDe5px = useRef(false);
  const inicioX = useRef(0);
  const scrollInicio = useRef(0);

  const [puedeIzquierda, setPuedeIzquierda] = useState(false);
  const [puedeDerecha, setPuedeDerecha] = useState(false);

  function actualizarFlechas() {
    const el = scrollRef.current;
    if (!el) return;
    setPuedeIzquierda(el.scrollLeft > 4);
    setPuedeDerecha(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }

  useEffect(() => {
    actualizarFlechas();
    window.addEventListener("resize", actualizarFlechas);
    return () => window.removeEventListener("resize", actualizarFlechas);
  }, []);

  function handlePointerMove(e) {
    if (!arrastrando.current) return;
    const el = scrollRef.current;
    if (!el) return;
    const delta = e.clientX - inicioX.current;
    if (Math.abs(delta) > 5) movidoMasDe5px.current = true;
    el.scrollLeft = scrollInicio.current - delta;
  }

  function handlePointerUp() {
    const el = scrollRef.current;
    if (el) el.style.scrollSnapType = "";
    arrastrando.current = false;
    actualizarFlechas();
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
  }

  function handlePointerDown(e) {
    if (e.pointerType !== "mouse") return;
    // Si el clic empezo en un boton (+, -, Agregar), no arrastra nada -
    // deja que el boton responda normal, de inmediato.
    if (e.target.closest("button")) return;

    const el = scrollRef.current;
    if (!el) return;
    arrastrando.current = true;
    movidoMasDe5px.current = false;
    inicioX.current = e.clientX;
    scrollInicio.current = el.scrollLeft;
    el.style.scrollSnapType = "none";

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  }

  // Si hubo arrastre real (mas de 5px), evita que el click final abra el producto.
  function handleClickCapture(e) {
    if (movidoMasDe5px.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function moverScroll(direccion) {
    scrollRef.current?.scrollBy({ left: direccion * 320, behavior: "smooth" });
  }

  return (
    <div className="relative">
      {puedeIzquierda && (
        <button
          type="button"
          onClick={() => moverScroll(-1)}
          className="absolute left-1 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-dark shadow-md sm:flex"
          aria-label="Desplazar a la izquierda"
        >
          ‹
        </button>
      )}

      <div
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onScroll={actualizarFlechas}
        onClickCapture={handleClickCapture}
        className={`cursor-grab select-none active:cursor-grabbing ${className}`}
      >
        {children}
      </div>

      {puedeDerecha && (
        <button
          type="button"
          onClick={() => moverScroll(1)}
          className="absolute right-1 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-dark shadow-md sm:flex"
          aria-label="Desplazar a la derecha"
        >
          ›
        </button>
      )}
    </div>
  );
}
