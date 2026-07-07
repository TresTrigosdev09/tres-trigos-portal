# Tres Trigos — Portal de Clientes Institucionales

## Como correrlo en tu maquina

**1. Backend primero** - este portal ya NO usa productos mock, necesita tu
backend corriendo en `http://localhost:3000` (ver proyecto `tres-trigos-backend`).

**2. Configura la URL del backend:**
```bash
cp .env.example .env
```
Por defecto apunta a `http://localhost:3000` - solo cambialo si tu backend
corre en otro puerto.

**3. Instala y corre:**
```bash
npm install
npm run dev
```

Abre la URL que te muestre la terminal (normalmente `http://localhost:5173`).

## Que es real y que sigue siendo mock

- **Cliente y productos**: REALES, vienen de Siesa a traves de tu backend
  (`/api/catalogo/:nit`). Esto incluye el precio vigente ya filtrado del
  historial y el nombre real del producto.
- **Contraseña de login**: todavia MOCK (`src/mock/usuariosPortalMock.js`).
  Esto vive ahi porque tu base de datos propia (PostgreSQL) aun no existe -
  esa es la siguiente pieza grande pendiente.

Datos de prueba para entrar (ver `src/mock/usuariosPortalMock.js`):

- NIT `1037612866` - clave `cacao2026` (Corazon de Cacao, cliente real)
- NIT `900282290` - clave `mundoverde2026` (Mundo Verde, cliente real)
- NIT `111111111` - clave `test2026` (no existe en Siesa, prueba el error 404)

## Estructura de carpetas

```
src/
├── mock/             <- TODO lo que hoy es falso. Cuando exista el backend,
│                         estos archivos se reemplazan por fetch() reales.
│   ├── siesaClientesMock.js     (simula GET API_v2_Clientes)
│   ├── usuariosPortalMock.js    (simula tu tabla propia de login)
│   └── productos.js             (simula GET /productos del backend)
│
├── context/          <- Estado global de la app
│   ├── AuthContext.jsx   (sesion del cliente)
│   └── CartContext.jsx   (carrito de compras)
│
├── components/
│   ├── layout/Header.jsx
│   ├── catalog/ProductCard.jsx, QuantityStepper.jsx
│   ├── cart/CartBar.jsx
│   └── common/Button.jsx, StampBadge.jsx
│
├── pages/             <- Una pantalla completa por archivo
│   ├── LoginPage.jsx
│   ├── CatalogPage.jsx
│   ├── CartPage.jsx
│   └── ConfirmationPage.jsx
│
├── App.jsx            <- Rutas y quien puede ver que
└── main.jsx            <- Punto de entrada
```

## Como conectar el backend real cuando exista

Hay 3 puntos exactos donde se hace el cambio, nada mas:

1. **`src/context/AuthContext.jsx` -> funcion `iniciarSesion`**
   Hoy llama a `validarLoginPortal` y `buscarClienteSiesaPorNit` (mocks).
   Cuando exista el backend, esto se vuelve:
   ```js
   const res = await fetch('/login', { method: 'POST', body: JSON.stringify({ nit, password }) });
   ```

2. **`src/pages/CatalogPage.jsx` -> dentro del `useEffect`**
   Hoy llama a `obtenerProductosDeCliente` (mock).
   Se vuelve:
   ```js
   const res = await fetch('/productos', { headers: { Authorization: `Bearer ${token}` } });
   ```

3. **`src/pages/CartPage.jsx` -> funcion `handleConfirmar`**
   Hoy genera un numero de pedido falso con `Date.now()`.
   Se vuelve:
   ```js
   const res = await fetch('/pedidos', { method: 'POST', headers: {...}, body: JSON.stringify({ items: lista }) });
   ```
   Esta es la llamada que en el backend dispara el conector
   `API_v1_Ventas_Comercial_PedidoVenta` hacia Siesa.

No hay que tocar nada de `components/` ni de `App.jsx` - esa es justamente
la ventaja de separar el mock por archivos: el dia de la integracion real
el cambio es quirurgico, no una reescritura.

## Decisiones de diseno

- **Mobile-first**: todo el layout se diseno primero para pantalla angosta;
  el carrito flota como barra inferior (patron de apps de delivery, familiar
  para quien hace el pedido desde el celular).
- **Paleta y tipografia**: ver tokens en `tailwind.config.js`. Evita el cliche
  de "panaderia = crema + serif + terracota" a proposito; usa un lenguaje de
  ticket de produccion (sello, perforado, mono para codigos).
- **Logo real**: pendiente. Cuando tengas el archivo del logo de Tres Trigos,
  reemplaza el texto "TRES TRIGOS" en `Header.jsx` y `LoginPage.jsx` por un
  `<img>`.
