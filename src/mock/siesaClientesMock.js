/**
 * MOCK — Estructura real de Siesa, NO datos de producción.
 *
 * Esto simula lo que devuelve la consulta `API_v2_Clientes` en Siesa Hub,
 * confirmado en Postman el [fecha de tu prueba]. Cuando exista el backend,
 * este archivo se reemplaza por la llamada real:
 *
 *   GET /apisestandar/v3/ejecutarconsultaestandar
 *     ?idCompania=6886
 *     &descripcion=API_v2_Clientes
 *     &paginacion=numPag=1|tamPag=100
 *     &parametros=f200_nit=''{nit}''
 *
 * IMPORTANTE: se dejan los nombres de campo EXACTOS de Siesa (f200_, f201_)
 * a propósito. No se renombran aquí para que el día de la integración real
 * el mapeo sea directo y no haya sorpresas de "¿este campo era cuál?".
 */

export const siesaClientesMock = [
  {
    f201_id_cia: 1,
    f200_rowid: 6,
    f200_id: "860002503",
    f200_nit: "860002503",
    f201_id_sucursal: "001",
    f201_descripcion_sucursal: "Supermercado El Exito",
    f201_ind_estado_bloqueado: 0,
    f201_id_moneda: "COP",
    f201_ind_calificacion: "A",
    f201_id_cond_pago: "C01",
    f201_dias_gracia: 5,
    f201_cupo_credito: 15000000,
    f201_id_lista_precio: "LP-INST-01",
    f201_ind_estado_activo: 1,
  },
  {
    f201_id_cia: 1,
    f200_rowid: 7,
    f200_id: "800456789",
    f200_nit: "800456789",
    f201_id_sucursal: "001",
    f201_descripcion_sucursal: "Hotel Dann Carlton",
    f201_ind_estado_bloqueado: 0,
    f201_id_moneda: "COP",
    f201_ind_calificacion: "A",
    f201_id_cond_pago: "C01",
    f201_dias_gracia: 8,
    f201_cupo_credito: 22000000,
    f201_id_lista_precio: "LP-INST-02",
    f201_ind_estado_activo: 1,
  },
  {
    f201_id_cia: 1,
    f200_rowid: 8,
    f200_id: "123456789",
    f200_nit: "123456789",
    f201_id_sucursal: "001",
    f201_descripcion_sucursal: "Colegio Los Alpes",
    f201_ind_estado_bloqueado: 1, // bloqueado -> el portal debe negar el ingreso
    f201_id_moneda: "COP",
    f201_ind_calificacion: "B",
    f201_id_cond_pago: "C01",
    f201_dias_gracia: 0,
    f201_cupo_credito: 0,
    f201_id_lista_precio: "LP-INST-03",
    f201_ind_estado_activo: 0,
  },
];

/** Simula la llamada GET a Siesa filtrando por NIT (usa el mismo filtro que usarás en Postman). */
export function buscarClienteSiesaPorNit(nit) {
  return siesaClientesMock.find((c) => c.f200_nit === nit) ?? null;
}
