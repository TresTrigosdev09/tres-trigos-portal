import { createContext, useContext, useState } from "react";
import { API_BASE_URL } from "../config";

const AuthContext = createContext(null);

const MENSAJES_POR_ESTADO = {
  400: "El NIT ingresado no es válido.",
  404: "Tu NIT no está registrado en Siesa. Contacta a Tres Trigos.",
  409: "Tu cuenta no tiene una lista de precios asignada. Contacta a Tres Trigos.",
  502: "No pudimos conectar con Siesa en este momento. Intenta de nuevo en un momento.",
};

export function AuthProvider({ children }) {
  const [cliente, setCliente] = useState(null);
  const [productos, setProductos] = useState([]);
  const [sucursales, setSucursales] = useState([]);

  /**
   * Regla de negocio confirmada: la contraseña de TODOS los clientes
   * institucionales es su propio NIT. No existe una tabla de contraseñas
   * separada - el "login" es: ¿coinciden NIT y contraseña? y ¿existe ese
   * NIT como cliente real en Siesa? Si las dos son ciertas, entra.
   *
   * OJO seguridad (anotado, no bloqueante): el NIT es un dato publico
   * (aparece en facturas, RUT, camara de comercio). Cualquiera que lo
   * conozca puede entrar al portal de ese cliente. Valido para una
   * primera version, pero antes de produccion real conviene agregar
   * una verificacion adicional (ej. PIN enviado por correo).
   */
  async function iniciarSesion(nit, password) {
    if (password !== nit) {
      return { ok: false, mensaje: "La contraseña debe ser tu NIT." };
    }

    try {
      const respuesta = await fetch(`${API_BASE_URL}/api/catalogo/${nit}`);

      if (!respuesta.ok) {
        const mensaje =
          MENSAJES_POR_ESTADO[respuesta.status] ??
          "Ocurrió un error inesperado al consultar Siesa.";
        return { ok: false, mensaje };
      }

      const datos = await respuesta.json();

      setCliente({
        nit: datos.cliente.nit,
        nombre: datos.cliente.nombre,
        listaPrecio: datos.cliente.listaPrecio,
      });
      setProductos(datos.productos);
      setSucursales(datos.sucursales ?? []);

      return { ok: true };
    } catch (err) {
      console.error("Error de red al conectar con el backend:", err);
      return {
        ok: false,
        mensaje: "No pudimos conectar con el servidor. ¿Está corriendo el backend en " + API_BASE_URL + "?",
      };
    }
  }

  function cerrarSesion() {
    setCliente(null);
    setProductos([]);
    setSucursales([]);
  }

  return (
    <AuthContext.Provider value={{ cliente, productos, sucursales, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
