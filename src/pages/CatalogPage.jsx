import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/catalog/ProductCard";
import CategoryScrollRow from "../components/catalog/CategoryScrollRow";
import CartBar from "../components/cart/CartBar";

export default function CatalogPage() {
  const { cliente, productos } = useAuth();
  const { agregar } = useCart();

  // textoBusqueda: lo que el cliente escribe en la barra.
  // Empieza vacío, lo que significa "mostrar todo el catálogo".
  const [textoBusqueda, setTextoBusqueda] = useState("");

  // terminoBusqueda: versión limpia del texto para comparar.
  // Se convierte a minúsculas para que "CROISSANT" y "croissant" den el mismo resultado.
  const terminoBusqueda = textoBusqueda.trim().toLowerCase();

  // productosFiltrados: los productos que coinciden con lo que escribió el cliente.
  // Si no hay texto, devuelve todos los productos sin filtrar.
  // Si hay texto, devuelve solo los que tienen ese texto en su nombre.
  const productosFiltrados = useMemo(() => {
    if (!terminoBusqueda) return productos;
    return productos.filter((p) =>
      p.nombre.toLowerCase().includes(terminoBusqueda)
    );
  }, [productos, terminoBusqueda]);

  // categorias: agrupa los productos por su categoría para mostrarlos en secciones.
  // Solo se usa cuando NO hay búsqueda activa.
  // Cuando hay búsqueda, se muestran los resultados en una lista plana (sin secciones),
  // porque los resultados pueden venir de categorías distintas.
  const categorias = useMemo(() => {
    const mapa = new Map();
    for (const producto of productosFiltrados) {
      const categoria = producto.categoria || "Catálogo";
      if (!mapa.has(categoria)) mapa.set(categoria, []);
      mapa.get(categoria).push(producto);
    }
    return Array.from(mapa.entries());
  }, [productosFiltrados]);

  return (
    <div className="pb-28 pt-4">
      <div className="mb-4 px-4 sm:px-6">
        <h1 className="text-lg font-semibold text-brand-dark sm:text-xl">
          Hola, {cliente.nombre}
        </h1>
        <p className="text-sm text-brand-brown">Tus productos habituales, listos para pedir.</p>
      </div>

      {/* Barra de búsqueda.
          - type="search" activa el botón "x" nativo del navegador para limpiar.
          - El ícono de lupa es decorativo (aria-hidden), no es un botón.
          - onChange actualiza textoBusqueda en cada tecla, lo que filtra en tiempo real. */}
      <div className="relative mb-5 px-4 sm:px-6">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="pointer-events-none absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-brown sm:left-9"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="m16.5 16.5 3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={textoBusqueda}
          onChange={(e) => setTextoBusqueda(e.target.value)}
          placeholder="Buscar productos..."
          className="w-full rounded-xl border border-brand-brown/20 bg-white py-2.5 pl-9 pr-4 text-sm text-brand-dark outline-none focus:border-brand-dark"
        />
      </div>

      {/* Mensaje cuando la búsqueda no encuentra nada. */}
      {terminoBusqueda && productosFiltrados.length === 0 && (
        <div className="mx-4 rounded-xl bg-white p-6 text-center sm:mx-6">
          <p className="text-sm font-semibold text-brand-dark">
            Sin resultados para "{textoBusqueda}"
          </p>
          <p className="mt-1 text-xs text-brand-brown">
            Intenta con otro nombre o revisa la ortografía.
          </p>
        </div>
      )}

      {/* Catálogo sin búsqueda activa: productos organizados por sección con scroll horizontal. */}
      {!terminoBusqueda && (
        <div className="flex flex-col gap-7">
          {categorias.map(([categoria, items]) => (
            <section key={categoria}>
              <h2 className="mb-3 px-4 text-xs font-semibold uppercase tracking-widest text-brand-brown sm:px-6">
                {categoria}
              </h2>
              <CategoryScrollRow className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:px-6">
                {items.map((producto) => (
                  <ProductCard key={producto.id} producto={producto} onAgregar={agregar} />
                ))}
              </CategoryScrollRow>
            </section>
          ))}
        </div>
      )}

      {/* Resultados de búsqueda: las tarjetas mantienen el mismo tamaño que en el
          catálogo normal (w-40 sm:w-44 fijo). El contenedor usa flex-wrap para
          que pasen a la siguiente fila cuando no caben más, sin agrandarlas. */}
      {terminoBusqueda && productosFiltrados.length > 0 && (
        <div className="flex flex-wrap gap-3 px-4 sm:px-6">
          {productosFiltrados.map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              onAgregar={agregar}
            />
          ))}
        </div>
      )}

      <CartBar />
    </div>
  );
}
