/**
 * Spinner — indicador visual de "el sistema está trabajando".
 *
 * Se usa en dos situaciones concretas en el portal:
 *   1. Mientras el login consulta a Siesa (puede tardar 1-4 segundos)
 *   2. Mientras se envía un pedido a Siesa (puede tardar 2-3 segundos)
 *
 * Props:
 *   - mensaje (string, opcional): texto que aparece debajo del círculo.
 *     Ejemplo: "Verificando tu cuenta..." o "Creando tu pedido en Siesa..."
 *
 * El componente ocupa toda la pantalla con un fondo semitransparente.
 * Esto evita que el usuario haga clic en otros elementos mientras espera.
 */
export default function Spinner({ mensaje }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-dark/40 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label={mensaje || "Cargando..."}
    >
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white px-8 py-6 shadow-lg">
        <svg
          className="h-10 w-10 animate-spin text-brand-brown"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>

        {mensaje && (
          <p className="text-sm font-medium text-brand-brown">{mensaje}</p>
        )}
      </div>
    </div>
  );
}
