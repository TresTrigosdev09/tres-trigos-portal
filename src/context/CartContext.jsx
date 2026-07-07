import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // items: { [productoId]: { producto, cantidad } }
  const [items, setItems] = useState({});

  function agregar(producto, cantidad = 1) {
    setItems((prev) => {
      const actual = prev[producto.id]?.cantidad ?? 0;
      return {
        ...prev,
        [producto.id]: { producto, cantidad: actual + cantidad },
      };
    });
  }

  function cambiarCantidad(productoId, cantidad) {
    setItems((prev) => {
      if (cantidad <= 0) {
        const copia = { ...prev };
        delete copia[productoId];
        return copia;
      }
      return { ...prev, [productoId]: { ...prev[productoId], cantidad } };
    });
  }

  function vaciar() {
    setItems({});
  }

  const lista = useMemo(() => Object.values(items), [items]);
  const totalItems = useMemo(
    () => lista.reduce((acc, it) => acc + it.cantidad, 0),
    [lista]
  );
  const totalPrecio = useMemo(
    () => lista.reduce((acc, it) => acc + it.cantidad * it.producto.precio, 0),
    [lista]
  );

  return (
    <CartContext.Provider
      value={{ lista, totalItems, totalPrecio, agregar, cambiarCantidad, vaciar }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
