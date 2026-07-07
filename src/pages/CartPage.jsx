import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { API_BASE_URL } from "../config";
import QuantityStepper from "../components/catalog/QuantityStepper";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";

const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default function CartPage() {
  const { cliente, sucursales } = useAuth();
  const { lista, totalPrecio, cambiarCantidad, vaciar } = useCart();
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [sucursalId, setSucursalId] = useState(
    sucursales.length === 1 ? sucursales[0].id : ""
  );
  const [observaciones, setObservaciones] = useState("");
  const [modalidadEntrega, setModalidadEntrega] = useState("entrega");

  const OPCIONES_ENTREGA = [
    { id: "entrega", label: "Entrega en mi sucursal" },
    { id: "laureles", label: "Recojo en Punto de Venta Laureles" },
    { id: "planta", label: "Recojo en Planta de Producción (La Estrella)" },
  ];

  const necesitaElegirSucursal = sucursales.length > 1;
  const sucursalLista = necesitaElegirSucursal ? sucursalId : sucursales[0]?.id;

  async function handleConfirmar() {
    if (necesitaElegirSucursal && !sucursalId) {
      setError("Elige a qué sucursal va el pedido antes de confirmar.");
      return;
    }

    setEnviando(true);
    setError("");

    const items = lista.map(({ producto, cantidad }) => ({
      referencia: producto.referencia ?? producto.id,
      cantidad,
      precioUnitario: producto.precio,
    }));

    const etiquetaEntrega = OPCIONES_ENTREGA.find((o) => o.id === modalidadEntrega)?.label ?? "";
    const notaFinal = [etiquetaEntrega, observaciones.trim()].filter(Boolean).join(" | ");

    try {
      const respuesta = await fetch(`${API_BASE_URL}/api/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nit: cliente.nit,
          items,
          sucursal: sucursalLista,
          notasGenerales: notaFinal,
        }),
      });

      if (!respuesta.ok) {
        const data = await respuesta.json().catch(() => ({}));
        setError(data.error || "No se pudo crear el pedido. Intenta de nuevo.");
        setEnviando(false);
        return;
      }

      const data = await respuesta.json();
      navigate("/confirmacion", {
        state: { total: totalPrecio, numeroPedido: data.numeroPedido ?? null },
      });
      vaciar();
    } catch (err) {
      setError("No se pudo conectar con el servidor. ¿Está corriendo el backend?");
    } finally {
      setEnviando(false);
    }
  }

  if (lista.length === 0) {
    return (
      <div className="px-4 py-10 text-center sm:px-6">
        <p className="text-sm font-semibold text-brand-dark">Tu carrito está vacío.</p>
        <Button variant="secondary" className="mt-4" onClick={() => navigate("/catalogo")}>
          Volver al catalogo
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 pb-32 pt-4 sm:px-6">
      {/* El Spinner aparece encima de todo mientras Siesa procesa el pedido.
          El mensaje es específico para que el cliente sepa exactamente qué está pasando. */}
      {enviando && <Spinner mensaje="Creando tu pedido en Siesa..." />}

      <button
        onClick={() => navigate("/catalogo")}
        className="mb-3 flex items-center gap-1 text-sm font-medium text-brand-brown hover:text-brand-dark"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Volver al catálogo
      </button>

      <h1 className="mb-4 text-lg font-semibold text-brand-dark sm:text-xl">Tu pedido</h1>

      {necesitaElegirSucursal && (
        <div className="mb-4 rounded-xl bg-white p-3">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-brown">
            ¿A qué sucursal va este pedido?
          </label>
          <select
            value={sucursalId}
            onChange={(e) => setSucursalId(e.target.value)}
            className="w-full rounded-lg border border-brand-brown/30 bg-brand-cream px-3 py-2.5 text-sm text-brand-dark outline-none focus:border-brand-dark"
          >
            <option value="">Selecciona una sucursal...</option>
            {sucursales.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {lista.map(({ producto, cantidad }) => (
          <div key={producto.id} className="flex items-center gap-3 rounded-xl bg-white p-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-brand-dark">{producto.nombre}</p>
              <p className="font-mono text-xs text-brand-brown">
                {formatoCOP.format(producto.precio)} / {producto.unidad}
              </p>
            </div>
            <QuantityStepper
              cantidad={cantidad}
              onCambiar={(nueva) => cambiarCantidad(producto.id, nueva)}
              min={0}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-white p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-brown">
          ¿Cómo recibes tu pedido?
        </p>
        <div className="flex flex-col gap-2">
          {OPCIONES_ENTREGA.map((opcion) => (
            <label
              key={opcion.id}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition ${
                modalidadEntrega === opcion.id
                  ? "border-brand-dark bg-brand-cream"
                  : "border-brand-brown/20 bg-transparent"
              }`}
            >
              <input
                type="radio"
                name="modalidad"
                value={opcion.id}
                checked={modalidadEntrega === opcion.id}
                onChange={() => setModalidadEntrega(opcion.id)}
                className="accent-brand-dark"
              />
              <span className="text-sm text-brand-dark">{opcion.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-white p-3">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-brown">
          Observaciones (opcional)
        </label>
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Ej: entregar antes de las 8am, el panini sin ajonjolí..."
          rows={3}
          className="w-full resize-none rounded-lg border border-brand-brown/30 bg-brand-cream px-3 py-2.5 text-sm text-brand-dark outline-none focus:border-brand-dark"
        />
      </div>

      <div className="fixed inset-x-0 bottom-0 bg-white px-4 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] sm:px-6">
        {error && (
          <p className="mx-auto mb-2 max-w-md rounded-md bg-alert/10 px-3 py-2 text-xs font-medium text-alert sm:max-w-none">
            {error}
          </p>
        )}
        <div className="mx-auto flex max-w-md items-center justify-between sm:max-w-none">
          <div>
            <p className="text-xs text-brand-brown">Total del pedido</p>
            <p className="font-mono text-lg font-semibold text-brand-dark">
              {formatoCOP.format(totalPrecio)}
            </p>
          </div>
          <Button
            onClick={handleConfirmar}
            disabled={enviando || (necesitaElegirSucursal && !sucursalId)}
            className="!w-auto px-6"
          >
            {enviando ? "Enviando..." : "Confirmar pedido"}
          </Button>
        </div>
      </div>
    </div>
  );
}
