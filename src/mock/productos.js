/**
 * MOCK — Resultado YA UNIDO de `productos_cliente JOIN productos`
 * (el JOIN que viste en SQLBolt). En el backend real, este es exactamente
 * el JSON que devolvería:
 *
 *   GET /productos   (con el JWT del cliente autenticado)
 *
 * Cada cliente (por NIT) tiene su propia lista de productos preferidos
 * y su propio precio pactado.
 *
 * `categoria` agrupa visualmente el catálogo (como en trestrigos.com).
 * Siesa no expone esto directamente todavía - cuando confirmes si
 * `f120_id_tipo_inv_serv` sirve para esto, se reemplaza aquí.
 *
 * Las imagenes ya NO se definen aqui - se calculan solas a partir del
 * `id` en ProductCard/ProductDetailPage: /productos/{id}.webp y
 * /productos/{id}-2.webp (hover). Ver public/productos/LEEME.txt.
 */

export const productosPorClienteMock = {
  "860002503": [
    { id: "PAN-001", nombre: "Baguette Clasico", descripcion: "Pan de masa madre 400g", precio: 4200, unidad: "und", categoria: "Panes de Masa Madre", descripcionLarga: "Pan rustico, fermentado 100% con masa madre durante mas de 20 horas. Corteza crocante y miga alveolada.", ingredientes: "Harina de trigo, masa madre, agua, sal." },
    { id: "SOU-010", nombre: "Sourdough Integral", descripcion: "Pan de masa madre integral 500g", precio: 5400, unidad: "und", categoria: "Panes de Masa Madre" },
    { id: "MUL-015", nombre: "Pan Multicereal", descripcion: "Pan de masa madre con semillas 450g", precio: 5100, unidad: "und", categoria: "Panes de Masa Madre" },
    { id: "BAG-003", nombre: "Bagel Semillas", descripcion: "Bagel con semillas 120g", precio: 3100, unidad: "und", categoria: "Panaderia Pequeña" },
    { id: "MUF-018", nombre: "Muffin Arandanos", descripcion: "Muffin con arandanos frescos", precio: 3600, unidad: "und", categoria: "Panaderia Pequeña" },
  ],
  "800456789": [
    { id: "PAN-001", nombre: "Baguette Clasico", descripcion: "Pan de masa madre 400g", precio: 4500, unidad: "und", categoria: "Panes de Masa Madre", descripcionLarga: "Pan rustico, fermentado 100% con masa madre durante mas de 20 horas. Corteza crocante y miga alveolada.", ingredientes: "Harina de trigo, masa madre, agua, sal." },
    { id: "SOU-010", nombre: "Sourdough Integral", descripcion: "Pan de masa madre integral 500g", precio: 5700, unidad: "und", categoria: "Panes de Masa Madre" },
    { id: "CRO-007", nombre: "Croissant Mantequilla", descripcion: "Croissant hojaldrado 90g", precio: 5200, unidad: "und", categoria: "Pasteleria" },
    { id: "BRI-012", nombre: "Brioche Yogur", descripcion: "Brioche suave con yogur", precio: 9800, unidad: "und", categoria: "Pasteleria" },
    { id: "ALM-022", nombre: "Croissant Almendras", descripcion: "Croissant relleno de almendras", precio: 6300, unidad: "und", categoria: "Pasteleria" },
  ],
  "123456789": [
    { id: "PAN-001", nombre: "Baguette Clasico", descripcion: "Pan de masa madre 400g", precio: 4000, unidad: "und", categoria: "Panes de Masa Madre", descripcionLarga: "Pan rustico, fermentado 100% con masa madre durante mas de 20 horas. Corteza crocante y miga alveolada.", ingredientes: "Harina de trigo, masa madre, agua, sal." },
    { id: "SAN-020", nombre: "Sanduche de Queso", descripcion: "Pan de molde con queso", precio: 4800, unidad: "und", categoria: "Sandwiches" },
    { id: "SAN-021", nombre: "Sanduche Jamon", descripcion: "Pan de molde con jamon y queso", precio: 5200, unidad: "und", categoria: "Sandwiches" },
  ],
};

/** Simula GET /productos?nit=... con el cliente ya autenticado. */
export function obtenerProductosDeCliente(nit) {
  return productosPorClienteMock[nit] ?? [];
}
