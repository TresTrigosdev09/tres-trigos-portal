import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default function CartBar() {
  const { totalItems, totalPrecio } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-20">
      <div className="ticket-divider" />
      <Link
        to="/carrito"
        className="flex items-center justify-between bg-brand-dark px-4 py-3 text-white sm:px-6"
      >
        <span className="text-sm font-medium">
          {totalItems} {totalItems === 1 ? "producto" : "productos"}
        </span>
        <span className="flex items-center gap-2 font-semibold">
          <span className="font-mono text-sm">{formatoCOP.format(totalPrecio)}</span>
          <span className="text-sm">Ver pedido →</span>
        </span>
      </Link>
    </div>
  );
}
