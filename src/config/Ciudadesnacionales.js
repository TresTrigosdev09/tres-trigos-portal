/**
 * Ciudades de ruta nacional con monto mínimo de pedido.
 * Valores confirmados por comercial de Tres Trigos, julio 2026.
 *
 * Columnas de la tabla original:
 *   - minimo:    "Pedido Mínimo" — el portal bloquea el pedido si no llega a este valor
 *   - domicilio: "Domicilio a Cobrar" — referencia para futuras mejoras (hoy no se muestra)
 *
 * Cómo funciona la detección:
 *   El campo `patron` se busca dentro del nombre de la sucursal elegida por el cliente
 *   (insensible a mayúsculas). Si el nombre contiene el patrón, aplica ese mínimo.
 *   Ejemplo: sucursal "EMPRESA X BOGOTA SEDE NORTE" → detecta "BOGOT" → mínimo $1.050.000
 *
 * Nota sobre CARTAGO vs CARTAGENA:
 *   "CARTAGO" NO es substring de "CARTAGENA" así que no se confunden.
 */
export const CIUDADES_NACIONALES = [
  { patron: "BARRANCABERMEJA", minimo: 2875000, domicilio: 100000 },
  { patron: "BUCARAMANGA",     minimo: 2875000, domicilio: 100000 },
  { patron: "CARTAGENA",       minimo: 2875000, domicilio: 100000 },
  { patron: "SANTA MARTA",     minimo: 2875000, domicilio: 100000 },
  { patron: "BOGOT",           minimo: 1050000, domicilio:  50000 },
  { patron: "CALI",            minimo: 1224667, domicilio:  50000 },
  { patron: "CARTAGO",         minimo: 1224667, domicilio:  50000 },
  { patron: "IBAGUE",          minimo: 1224667, domicilio:  50000 },
  { patron: "MANIZALES",       minimo: 1224667, domicilio:  50000 },
  { patron: "PEREIRA",         minimo: 1224667, domicilio:  50000 },
];

const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

/**
 * Verifica si la sucursal elegida corresponde a una ciudad nacional
 * y si el total del pedido cumple con el mínimo requerido.
 *
 * @param {string} nombreSucursal - nombre de la sucursal elegida por el cliente
 * @param {number} totalPedido - total en pesos del pedido
 * @returns {{ bloqueado: boolean, mensaje?: string }}
 */
export function verificarMinimoCiudad(nombreSucursal, totalPedido) {
  if (!nombreSucursal) return { bloqueado: false };

  const nombreUpper = nombreSucursal.toUpperCase();

  for (const ciudad of CIUDADES_NACIONALES) {
    if (nombreUpper.includes(ciudad.patron.toUpperCase())) {
      if (totalPedido < ciudad.minimo) {
        return {
          bloqueado: true,
          mensaje:
            `Los pedidos con destino ${ciudad.patron} requieren un mínimo de ` +
            `${formatoCOP.format(ciudad.minimo)}. ` +
            `Tu pedido actual (${formatoCOP.format(totalPedido)}) no alcanza ese valor.`,
        };
      }
      return { bloqueado: false };
    }
  }

  return { bloqueado: false };
}