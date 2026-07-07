import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config";
import Spinner from "../components/common/Spinner";

const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

/**
 * Convierte una fecha ISO de Siesa ("2026-06-26T00:00:00") a un texto
 * legible en español ("26 jun 2026") sin depender de librerías externas.
 */
function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Colores del badge de estado según lo que devuelve el backend.
 * Si llega un estado que no está mapeado aquí, se muestra en gris neutro.
 */
const COLORES_ESTADO = {
  "Cumplido": "bg-green-100 text-green-800",
  "Aprobado": "bg-brand-sand text-brand-dark",
  "En elaboración": "bg-blue-100 text-blue-800",
  "Retenido": "bg-yellow-100 text-yellow-800",
  "Anulado": "bg-red-100 text-red-800",
};

export default function HistorialPage() {
  const { cliente } = useAuth();
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarHistorial() {
      try {
        const respuesta = await fetch(`${API_BASE_URL}/api/historial/${cliente.nit}`);

        if (!respuesta.ok) {
          setError("No pudimos cargar tu historial en este momento. Intenta de nuevo.");
          return;
        }

        const datos = await respuesta.json();
        setPedidos(datos.pedidos);
      } catch {
        setError("No pudimos conectar con el servidor. ¿Está corriendo el backend?");
      } finally {
        setCargando(false);
      }
    }

    cargarHistorial();
  }, [cliente.nit]);

  return (
    <div className="px-4 pb-10 pt-4 sm:px-6">
      {cargando && <Spinner mensaje="Cargando tu historial de pedidos..." />}

      <div className="mb-5 flex items-center gap-3">
        <button
          onClick={() => navigate("/catalogo")}
          className="flex items-center gap-1 text-sm font-medium text-brand-brown hover:text-brand-dark"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Volver al catálogo
        </button>
      </div>

      <h1 className="mb-1 text-lg font-semibold text-brand-dark sm:text-xl">
        Historial de pedidos
      </h1>
      <p className="mb-5 text-sm text-brand-brown">Últimos 30 días</p>

      {error && (
        <div className="rounded-xl bg-alert/10 p-4 text-sm text-alert">{error}</div>
      )}

      {!cargando && !error && pedidos.length === 0 && (
        <div className="rounded-xl bg-white p-8 text-center">
          <p className="font-semibold text-brand-dark">Sin pedidos recientes</p>
          <p className="mt-1 text-sm text-brand-brown">
            No encontramos pedidos de los últimos 90 días.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {pedidos.map((pedido) => (
          <article key={pedido.numero} className="overflow-hidden rounded-xl bg-white shadow-sm">
            {/* Encabezado del pedido */}
            <div className="flex items-start justify-between border-b border-brand-sand/50 px-4 py-3 sm:px-5">
              <div>
                <p className="font-mono text-xs text-brand-brown">
                  Pedido #{pedido.numero}
                </p>
                <p className="text-sm font-semibold text-brand-dark">
                  {formatearFecha(pedido.fecha)}
                </p>
                {pedido.notas && (
                  <p className="mt-0.5 text-xs text-brand-brown">
                    {pedido.notas}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    COLORES_ESTADO[pedido.estado] ?? "bg-gray-100 text-gray-700"
                  }`}
                >
                  {pedido.estado}
                </span>
                <span className="font-mono text-sm font-semibold text-brand-dark">
                  {formatoCOP.format(pedido.total)}
                </span>
              </div>
            </div>

            {/* Ítems del pedido */}
            <div className="divide-y divide-brand-sand/30">
              {pedido.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-2.5 sm:px-5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-brand-dark">{item.nombre}</p>
                    <p className="text-xs text-brand-brown">
                      {item.cantidad} × {formatoCOP.format(item.precioUnitario)}
                    </p>
                  </div>
                  <p className="ml-4 font-mono text-sm text-brand-dark">
                    {formatoCOP.format(item.subtotal)}
                  </p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
