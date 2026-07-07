import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";

export default function LoginPage() {
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  const [nit, setNit] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);

    const resultado = await iniciarSesion(nit.trim(), password);
    setCargando(false);

    if (!resultado.ok) {
      setError(resultado.mensaje);
      return;
    }
    navigate("/catalogo");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-cream px-4">
      {/* El Spinner aparece encima de todo mientras Siesa responde al login.
          Cubre la pantalla para evitar que el cliente haga clic varias veces. */}
      {cargando && <Spinner mensaje="Verificando tu cuenta en Siesa..." />}

      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <img src="/logo-iniii.svg" alt="Logo Tres Trigos" className="mx-auto h-20 w-auto" />
          <p className="mt-3 text-xs font-medium uppercase tracking-widest text-brand-brown">
            Portal de Clientes Institucionales
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-sm">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-brown">
            NIT
          </label>
          <input
            type="text"
            inputMode="numeric"
            required
            value={nit}
            onChange={(e) => setNit(e.target.value)}
            placeholder="900123456"
            className="mb-4 w-full rounded-lg border border-brand-brown/30 bg-brand-cream px-3 py-2.5 font-mono text-sm text-brand-dark outline-none focus:border-brand-dark"
          />

          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-brown">
            Contraseña
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mb-2 w-full rounded-lg border border-brand-brown/30 bg-brand-cream px-3 py-2.5 text-sm text-brand-dark outline-none focus:border-brand-dark"
          />

          {error && (
            <p className="mb-4 rounded-md bg-alert/10 px-3 py-2 text-xs font-medium text-alert">
              {error}
            </p>
          )}

          <Button type="submit" className="mt-4 w-full" disabled={cargando}>
            {cargando ? "Verificando..." : "Ingresar"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-brand-brown">
          ¿Problemas para ingresar? Escribe a tu asesor en Tres Trigos.
        </p>

        {/* Bloque de ayuda para desarrollo local.
            Solo visible cuando VITE_MODO_DEV=true está definido en el .env local.
            En producción esa variable no existe, así que este bloque no se renderiza. */}
        {import.meta.env.VITE_MODO_DEV === "true" && (
          <div className="mt-6 rounded-lg bg-brand-beige/30 p-3 text-[11px] text-brand-brown">
            <p className="font-semibold">DEV — La contraseña de todo cliente es su propio NIT:</p>
            <p>NIT 1037612866 (Corazón de Cacao)</p>
            <p>NIT 900282290 (Mundo Verde)</p>
            <p>NIT 900392211 (Pergamino - tiene 14 sucursales, prueba el selector)</p>
            <p>NIT 111111111 (no existe en Siesa - prueba el error)</p>
          </div>
        )}
      </div>
    </div>
  );
}
