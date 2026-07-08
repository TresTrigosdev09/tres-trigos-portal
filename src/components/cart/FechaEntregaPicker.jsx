import { useEffect, useState } from "react";

/**
 * Reglas de negocio confirmadas en reunión (7 julio 2026):
 *
 * 1. El cliente nunca puede elegir hoy ni mañana como fecha de entrega.
 * 2. No hay entregas los domingos — si la fecha mínima cae domingo, se salta al lunes.
 * 3. Los sábados SÍ se hacen pedidos y entregas, PERO solo hasta las 11:00am.
 *    Si hoy es sábado y ya pasó las 11am, este componente emite `bloqueado=true`
 *    y CartPage bloquea completamente el pedido.
 * 4. Los festivos SÍ se permiten (sin validación especial por ahora — comercial no
 *    proporcionó lista de festivos y se acordó que sí se puede pedir en festivos).
 */

/** Convierte una fecha JS a string YYYY-MM-DD (formato que acepta input[type=date]). */
function aStringFecha(fecha) {
  return fecha.toISOString().slice(0, 10);
}

/**
 * Calcula la primera fecha disponible para entrega.
 * Mínimo: hoy + 2 días. Si esa fecha cae domingo, avanza un día más (lunes).
 */
function calcularFechaMinima() {
  const minima = new Date();
  minima.setDate(minima.getDate() + 2);
  if (minima.getDay() === 0) {
    minima.setDate(minima.getDate() + 1);
  }
  return minima;
}

/**
 * Verifica si en este momento se pueden hacer pedidos.
 * Solo aplica restricción los sábados: no se aceptan pedidos después de las 11:00am.
 */
function verificarHorarioActual() {
  const ahora = new Date();
  const dia = ahora.getDay();
  const hora = ahora.getHours();
  const minutos = ahora.getMinutes();

  if (dia === 0) {
    return {
      bloqueado: true,
      motivo: "Los domingos no recibimos pedidos. Puedes volver el lunes.",
    };
  }

  if (dia === 6 && (hora > 11 || (hora === 11 && minutos > 0))) {
    return {
      bloqueado: true,
      motivo: "Los pedidos del sábado se reciben hasta las 11:00am.",
    };
  }

  return { bloqueado: false };
}

export default function FechaEntregaPicker({ onChange, onBloqueo }) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [error, setError] = useState("");

  const horario = verificarHorarioActual();
  const fechaMinima = calcularFechaMinima();

  useEffect(() => {
    if (horario.bloqueado) {
      onBloqueo?.(horario.motivo);
    }
  }, []);

  function handleChange(e) {
    const valor = e.target.value;
    if (!valor) {
      setFechaSeleccionada("");
      setError("");
      onChange?.(null);
      return;
    }

    // Verificar que no sea domingo (el input date no tiene forma nativa de excluir días).
    const fecha = new Date(valor + "T12:00:00"); // Mediodía para evitar problemas de zona horaria
    if (fecha.getDay() === 0) {
      setError("Los domingos no hay entregas. Por favor elige otro día.");
      setFechaSeleccionada("");
      onChange?.(null);
      return;
    }

    setError("");
    setFechaSeleccionada(valor);
    onChange?.(valor); // Formato YYYY-MM-DD que el backend convierte a YYYYMMDD para Siesa
  }

  if (horario.bloqueado) {
    return (
      <div className="mt-4 flex items-start gap-2 rounded-xl border border-alert/30 bg-alert/5 px-4 py-3">
        <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 h-4 w-4 flex-shrink-0 text-alert">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <p className="text-sm text-alert">{horario.motivo}</p>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl bg-white p-3">
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-brown">
        Fecha de entrega <span className="text-alert">*</span>
      </label>
      <p className="mb-2 text-[11px] text-brand-brown">
        Disponible desde el {fechaMinima.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}.
        No se hacen entregas los domingos.
      </p>
      <input
        type="date"
        value={fechaSeleccionada}
        min={aStringFecha(fechaMinima)}
        onChange={handleChange}
        className="w-full rounded-lg border border-brand-brown/30 bg-brand-cream px-3 py-2.5 text-sm text-brand-dark outline-none focus:border-brand-dark"
      />
      {error && (
        <p className="mt-1 text-xs text-alert">{error}</p>
      )}
    </div>
  );
}
