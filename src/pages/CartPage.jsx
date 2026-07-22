import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { API_BASE_URL } from "../config";
import { esTajable } from "../config/productosTajables";
import { verificarMinimoCiudad } from "../config/Ciudadesnacionales.js";
import QuantityStepper from "../components/catalog/QuantityStepper";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";
import FechaEntregaPicker from "../components/cart/FechaEntregaPicker";
import { obtenerEmpaque } from "../config/empaquesProductos";

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
  const [fechaEntrega, setFechaEntrega] = useState(null);
  const [pedidoBloqueadoPorHorario, setPedidoBloqueadoPorHorario] = useState(null);

  // Notas de tajado por producto: { [productoId]: "TAJADO" | "COMPLETO" }
  const [notasTajado, setNotasTajado] = useState({});

  const OPCIONES_ENTREGA = [
    { id: "entrega", label: "Entrega en mi sucursal" },
    { id: "laureles", label: "Recojo en Punto de Venta Laureles" },
    { id: "planta", label: "Recojo en Planta de Producción (La Estrella)" },
  ];

  const necesitaElegirSucursal = sucursales.length > 1;
  const sucursalLista = necesitaElegirSucursal ? sucursalId : sucursales[0]?.id;

  // Fuente única de verdad de la validación del carrito.
  // Devuelve la lista de campos obligatorios que aún faltan por llenar.
  // Si está vacía, el pedido se puede enviar.
  const camposFaltantes = [];

  if (necesitaElegirSucursal && !sucursalId) {
    camposFaltantes.push("Elegir la sucursal");
  }

  if (!fechaEntrega) {
    camposFaltantes.push("Elegir la fecha de entrega");
  }

  // Cada pan tajable debe tener elegido Tajado o Completo.
  const panesSinElegir = lista.filter(
    ({ producto }) =>
      esTajable(producto.referencia) && !notasTajado[producto.id]
  );
  if (panesSinElegir.length > 0) {
    camposFaltantes.push("Elegir Tajado o Completo en cada pan");
  }

  const puedeConfirmar = camposFaltantes.length === 0 && !pedidoBloqueadoPorHorario;

  async function handleConfirmar() {
    if (!puedeConfirmar) return;

    // Validar mínimo de pedido para ciudades de ruta nacional
    const sucursalNombre = sucursales.find((s) => s.id === sucursalLista)?.nombre ?? "";
    const validacionCiudad = verificarMinimoCiudad(sucursalNombre, totalPrecio);
    if (validacionCiudad.bloqueado) {
      const minimoFormateado = new Intl.NumberFormat("es-CO", {
        style: "currency", currency: "COP", maximumFractionDigits: 0,
      }).format(validacionCiudad.minimo);
      setError(
        `Los pedidos para ${validacionCiudad.ciudad} requieren un mínimo de ${minimoFormateado}. ` +
        `Tu pedido actual no alcanza ese valor.`
      );
      setEnviando(false);
      return;
    }

    setEnviando(true);
    setError("");

    // Marca única de este intento de pedido (idempotency key).
    // Nace aquí, viaja al backend y se estampa en Siesa. Si la creación
    // se cae por timeout, el backend la usa para verificar si el pedido
    // SÍ entró, en vez de adivinar. 36 caracteres: cabe en el campo de 50.
    const idempotencyKey = crypto.randomUUID().slice(0, 8);
    const etiquetaEntrega = OPCIONES_ENTREGA.find((o) => o.id === modalidadEntrega)?.label ?? "";
    const notaFinal = [etiquetaEntrega, observaciones.trim()].filter(Boolean).join(" | ");

    // Construir ítems incluyendo la nota de tajado de cada producto
    const items = lista.map(({ producto, cantidad }) => {
      const notaTajado = esTajable(producto.referencia)
        ? notasTajado[producto.id]
        : null;

      return {
        referencia: producto.referencia ?? producto.id,
        cantidad,
        precioUnitario: producto.precio,
        // Si el producto es tajable y el cliente eligió, esa nota va en f431_notas
        // Si hay observación de tajado + nada más, es solo la nota de tajado
        notas: notaTajado ?? "",
      };
    });

    try {
      const respuesta = await fetch(`${API_BASE_URL}/api/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nit: cliente.nit,
          items,
          sucursal: sucursalLista,
          notasGenerales: notaFinal,
          fechaEntrega, // YYYY-MM-DD, el backend lo convierte a YYYYMMDD para Siesa
          idempotencyKey, // marca única para verificar el pedido tras un timeout
        }),
      });

      const data = await respuesta.json().catch(() => ({}));

      // Fallo real: Siesa rechazó o no se creó. El cliente puede reintentar.
      if (!respuesta.ok || data.ok === false) {
        setError(data.error || "No se pudo crear el pedido. Intenta de nuevo.");
        setEnviando(false);
        return;
      }
      // En proceso: timeout no verificado. El pedido probablemente SÍ entró.
      // No reenviar. Vaciar carrito y avisar por WhatsApp.
      if (data.estado === "en_proceso") {
        vaciar();
        navigate("/confirmacion", {
          state: { total: totalPrecio, estado: "en_proceso" },
        });
        return;
      }
      // Confirmado (camino feliz o timeout verificado): confirmación normal.
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
          Volver al catálogo
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 pb-32 pt-4 sm:px-6">
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

      {/* Selector de sucursal */}
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
              <option key={s.id} value={s.id}>{s.nombre}</option>
            ))}
          </select>
        </div>
      )}

      {/* Lista de productos */}
      <div className="flex flex-col gap-3">
        {lista.map(({ producto, cantidad }) => (
          <div key={producto.id} className="rounded-xl bg-white p-3">
            <div className="flex items-center gap-3">
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
                paso={obtenerEmpaque(producto.referencia)}
              />
            </div>

            {/* Opción Tajado/Completo — solo para panes que lo soportan */}
              {esTajable(producto.referencia) && (
                <div className={`mt-2 flex items-center gap-2 border-t pt-2 ${
                  !notasTajado[producto.id] ? "border-alert/40" : "border-brand-sand/40"
                }`}>
                  <p className={`mr-1 text-[11px] font-semibold uppercase tracking-wide ${
                    !notasTajado[producto.id] ? "text-alert" : "text-brand-brown"
                  }`}>
                    ¿Cómo lo prefieres? *
                  </p>
                {["TAJADO", "COMPLETO"].map((opcion) => (
                  <label
                    key={opcion}
                    className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition ${
                      notasTajado[producto.id] === opcion
                        ? "border-brand-dark bg-brand-cream font-semibold text-brand-dark"
                        : "border-brand-brown/20 text-brand-brown"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`tajado-${producto.id}`}
                      value={opcion}
                      checked={notasTajado[producto.id] === opcion}
                      onChange={() =>
                        setNotasTajado((prev) => ({ ...prev, [producto.id]: opcion }))
                      }
                      className="sr-only"
                    />
                    {opcion === "TAJADO" ? "Tajado" : "Completo"}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modalidad de entrega */}
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

      {/* Fecha de entrega */}
      <FechaEntregaPicker
        onChange={setFechaEntrega}
        onBloqueo={setPedidoBloqueadoPorHorario}
      />

      {/* Observaciones */}
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

      {/* Nota de domicilio cuando el pedido es menor a $100.000 */}
      {totalPrecio < 100000 && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600">
            <path
              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
          <p className="text-xs leading-relaxed text-amber-800">
            <span className="font-semibold">Nota sobre domicilio:</span> Los pedidos con valor
            inferior a $100.000 tienen cobro de domicilio adicional, el cual será incluido por
            nuestro equipo al procesar tu pedido.
          </p>
        </div>
      )}

      {/* Barra inferior fija con el total y el botón de confirmar */}
      <div className="fixed inset-x-0 bottom-0 bg-white px-4 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] sm:px-6">
        {/* Bloqueo por horario (sábados después de las 11am, domingos) */}
        {pedidoBloqueadoPorHorario && (
          <p className="mx-auto mb-2 max-w-md rounded-md bg-alert/10 px-3 py-2 text-xs font-medium text-alert sm:max-w-none">
            {pedidoBloqueadoPorHorario}
          </p>
        )}
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
          <div className="group relative">
            {/* Mensaje que aparece al hacer hover cuando faltan campos */}
            {!puedeConfirmar && !enviando && (
              <div className="pointer-events-none absolute bottom-full right-0 mb-2 hidden w-56 rounded-lg bg-brand-dark px-3 py-2 text-left text-xs text-white shadow-lg group-hover:block">
                <p className="mb-1 font-semibold">Falta completar:</p>
                <ul className="list-inside list-disc space-y-0.5">
                  {camposFaltantes.map((campo) => (
                    <li key={campo}>{campo}</li>
                  ))}
                  {pedidoBloqueadoPorHorario && <li>{pedidoBloqueadoPorHorario}</li>}
                </ul>
                {/* Flechita del tooltip */}
                <div className="absolute right-6 top-full h-0 w-0 border-x-4 border-t-4 border-x-transparent border-t-brand-dark" />
              </div>
            )}
            <Button
              onClick={handleConfirmar}
              disabled={enviando || !puedeConfirmar}
              className="!w-auto px-6"
            >
              {enviando ? "Enviando..." : "Confirmar pedido"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );}
