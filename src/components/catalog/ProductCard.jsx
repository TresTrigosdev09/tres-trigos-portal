import { useState } from "react";
import { Link } from "react-router-dom";
import QuantityStepper from "./QuantityStepper";
import Button from "../common/Button";
import ProductImage from "../common/ProductImage";
import { obtenerEmpaque } from "../../config/empaquesProductos";

const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default function ProductCard({ producto, onAgregar }) {
  const [cantidad, setCantidad] = useState(0);
  const [imagenOk, setImagenOk] = useState(true);
  const [imagenHoverOk, setImagenHoverOk] = useState(true);

  function handleAgregar() {
    if (cantidad === 0) return;
    onAgregar(producto, cantidad);
    setCantidad(0);
  }

  const mostrarHover = imagenOk && imagenHoverOk;
  const empaque = obtenerEmpaque(producto.referencia);
  return (
    <article className="flex w-40 flex-shrink-0 snap-start flex-col overflow-hidden rounded-xl bg-white shadow-sm sm:w-44">
      <Link to={`/producto/${producto.id}`} className="group relative block aspect-square w-full">
        <ProductImage
          id={producto.id}
          alt={producto.nombre}
          className={`absolute inset-0 h-full w-full object-cover ${mostrarHover ? "transition-opacity duration-200 group-hover:opacity-0" : ""}`}
          onFallo={() => setImagenOk(false)}
        />
        {mostrarHover && (
          <ProductImage
            id={producto.id}
            sufijo="-2"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            onFallo={() => setImagenHoverOk(false)}
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link to={`/producto/${producto.id}`}>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-brand-dark">
            {producto.nombre}
          </h3>
          <p className="font-mono text-sm font-semibold text-brand-brownLight">
            {formatoCOP.format(producto.precio)}
            <span className="ml-1 text-[11px] font-normal text-brand-brown">/ {producto.unidad}</span>
          </p>
        </Link>

        {empaque > 1 && (
        <p className="text-[10px] font-medium text-brand-brown/70">
          Empaque de {empaque} unds
        </p>
      )}

        <div className="mt-auto flex flex-col gap-2">
        <QuantityStepper cantidad={cantidad} onCambiar={setCantidad} paso={empaque} />
          <Button
            variant="accent"
            className="!w-full !px-2 !py-1.5 text-xs"
            disabled={cantidad === 0}
            onClick={handleAgregar}
          >
            Agregar
          </Button>
        </div>
      </div>
    </article>
  );
}
