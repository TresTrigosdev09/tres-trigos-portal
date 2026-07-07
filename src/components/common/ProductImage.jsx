import { useEffect, useState } from "react";
import ProductImagePlaceholder from "./ProductImagePlaceholder";

const EXTENSIONES = ["jpg", "jpeg", "webp", "png"];

/**
 * Prueba la misma foto en distintos formatos, en este orden:
 * jpg, jpeg, webp, png. Asi no importa en que formato te lleguen las
 * fotos de las carpetas - no hay que convertir nada a mano.
 *
 * Si ninguna extension existe, muestra el placeholder y avisa con
 * `onFallo` (por ejemplo, para que ProductCard sepa que no debe
 * intentar el efecto hover con la segunda foto).
 *
 * `id` es el id del producto en Siesa. `sufijo` es "" para la foto
 * principal o "-2" para la secundaria.
 */
export default function ProductImage({ id, sufijo = "", alt = "", className = "", onFallo }) {
  const [indice, setIndice] = useState(0);
  const agotado = indice >= EXTENSIONES.length;

  // No se llama onFallo directamente en el render - eso es lo que React
  // estaba reclamando ("actualizar un componente mientras se renderiza
  // otro"). Se avisa DESPUES del render, en un efecto.
  useEffect(() => {
    if (agotado) onFallo?.();
  }, [agotado]);

  if (agotado) {
    return <ProductImagePlaceholder className={className} />;
  }

  const src = `/productos/${id}${sufijo}.${EXTENSIONES[indice]}`;

  return (
    <img
      key={src}
      src={src}
      alt={alt}
      className={className}
      onError={() => setIndice((i) => i + 1)}
    />
  );
}
