import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function Header() {
  const { cliente, cerrarSesion } = useAuth();
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-20 bg-brand-cream">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-baseline gap-2">
          <img src="/logo-iniii.svg" alt="Logo Tres Trigos" className="h-8 w-auto" />
          <span className="hidden text-xs font-medium uppercase tracking-widest text-brand-brown sm:inline">
            Portal Institucional
          </span>
        </div>

        {cliente && (
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight text-brand-dark">{cliente.nombre}</p>
              <p className="font-mono text-xs leading-tight text-brand-brown">NIT {cliente.nit}</p>
            </div>

            <Link
              to="/historial"
              className="hidden text-sm font-medium text-brand-brown underline-offset-2 hover:text-brand-dark hover:underline sm:block"
            >
              Mis pedidos
            </Link>

            <Link
              to="/carrito"
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-brand-dark text-white transition-transform active:scale-95"
              aria-label={`Ver carrito, ${totalItems} articulos`}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="M3 4h2l2.2 11.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L20.5 8H6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="9" cy="20" r="1.4" fill="currentColor" />
                <circle cx="17" cy="20" r="1.4" fill="currentColor" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-sand text-[11px] font-bold text-brand-dark">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={cerrarSesion}
              className="text-xs font-medium text-brand-brown underline-offset-2 hover:underline"
            >
              Salir
            </button>
          </div>
        )}
      </div>
      <div className="ticket-divider" />
    </header>
  );
}
