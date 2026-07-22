import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import QuantityStepper from "../components/catalog/QuantityStepper";
import Button from "../components/common/Button";
import ProductImage from "../components/common/ProductImage";
import { obtenerEmpaque } from "../config/empaquesProductos";

const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { productos } = useAuth();
  const { agregar } = useCart();

  const producto = productos.find((p) => String(p.id) === String(id));

  if (!producto) {
    navigate("/catalogo");
    return null;
  }

  const paso = obtenerEmpaque(producto.referencia);
  const [cantidad, setCantidad] = useState(paso);
  const [imagenOk, setImagenOk] = useState(true);
  const [imagenHoverOk, setImagenHoverOk] = useState(true);

  function handleAgregar() {
    agregar(producto, cantidad);
    navigate("/catalogo");
  }

  const mostrarSegundaImagen = imagenOk && imagenHoverOk;

  return (
    <div className="pb-10">
      <button
        onClick={() => navigate("/catalogo")}
        className="mb-2 flex items-center gap-1 px-4 pt-4 text-sm font-medium text-brand-brown hover:text-brand-dark sm:px-6"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Volver al catálogo
      </button>

      <div className="grid gap-6 px-4 pt-2 sm:grid-cols-2 sm:gap-10 sm:px-6 sm:pt-4">
        <div className="flex flex-col gap-3 sm:h-[calc(100vh-160px)]">
          <div className="aspect-square w-full overflow-hidden rounded-xl sm:aspect-auto sm:min-h-0 sm:flex-1">
            <ProductImage
              id={producto.id}
              alt={producto.nombre}
              className="h-full w-full object-cover"
              onFallo={() => setImagenOk(false)}
            />
          </div>

          {mostrarSegundaImagen && (
            <div className="aspect-square w-full overflow-hidden rounded-xl sm:aspect-auto sm:min-h-0 sm:flex-1">
              <ProductImage
                id={producto.id}
                sufijo="-2"
                alt={producto.nombre}
                className="h-full w-full object-cover"
                onFallo={() => setImagenHoverOk(false)}
              />
            </div>
          )}
        </div>

        <div className="sm:pt-1">
          <h1 className="text-2xl font-bold uppercase tracking-wide text-brand-dark sm:text-3xl">
            {producto.nombre}
          </h1>
          <p className="mt-1 font-mono text-lg font-semibold text-brand-brownLight">
            {formatoCOP.format(producto.precio)}
            <span className="ml-1 text-xs font-normal text-brand-brown">/ {producto.unidad}</span>
          </p>

          {producto.descripcionLarga && (
            <p className="mt-4 text-sm leading-relaxed text-brand-dark">{producto.descripcionLarga}</p>
          )}

          {producto.ingredientes && (
            <p className="mt-3 text-xs leading-relaxed text-brand-brown">
              <span className="font-semibold">Ingredientes: </span>
              {producto.ingredientes}
            </p>
          )}

          <div className="mt-6 flex items-center gap-3">
          <QuantityStepper cantidad={cantidad} onCambiar={setCantidad} min={paso} paso={paso} />
            <Button variant="accent" className="flex-1" onClick={handleAgregar}>
              Agregar al carrito
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
