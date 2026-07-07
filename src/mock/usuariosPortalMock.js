/**
 * MOCK — Tabla `usuarios_portal`, la que vive en TU base de datos (PostgreSQL),
 * no en Siesa. Aquí guardas la contraseña (hasheada en real, texto plano
 * aquí SOLO porque es mock de desarrollo) y el correo de contacto.
 *
 * Los NIT de aqui SI son reales en Siesa (ya los probaste en Postman/backend),
 * para que el login completo funcione de punta a punta. El ultimo es
 * a proposito ficticio - sirve para probar que el error "no encontrado
 * en Siesa" se vea bien en la pantalla de login.
 */

export const usuariosPortalMock = [
  { nit: "1037612866", password: "cacao2026", correo: "pedidos@corazondecacao.com" }, // real - Corazon de Cacao
  { nit: "900282290", password: "mundoverde2026", correo: "compras@mundoverde.com" }, // real - Mundo Verde
  { nit: "111111111", password: "test2026", correo: "test@example.com" }, // ficticio a proposito - prueba el error 404
];

/** Simula tu futuro endpoint POST /login en el backend Node/Express. */
export function validarLoginPortal(nit, password) {
  const usuario = usuariosPortalMock.find((u) => u.nit === nit);
  if (!usuario) {
    return { ok: false, motivo: "NIT no registrado en el portal." };
  }
  if (usuario.password !== password) {
    return { ok: false, motivo: "Contraseña incorrecta." };
  }
  return { ok: true, usuario };
}
