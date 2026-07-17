import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Header from "./components/layout/Header";
import WhatsAppButton from "./components/common/WhatsAppButton";
import LoginPage from "./pages/LoginPage";
import CatalogPage from "./pages/CatalogPage";
import CartPage from "./pages/CartPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import HistorialPage from "./pages/HistorialPage";
import ProductDetailPage from "./pages/ProductDetailPage";

/** Bloquea el acceso a paginas internas si no hay sesion iniciada. */
function RutaProtegida({ children }) {
  const { cliente } = useAuth();
  if (!cliente) return <Navigate to="/" replace />;
  return children;
}

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-brand-cream">
      <Header />
      <main>{children}</main>
      <WhatsAppButton />
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/catalogo"
        element={
          <RutaProtegida>
            <Layout>
              <CatalogPage />
            </Layout>
          </RutaProtegida>
        }
      />
      <Route
        path="/producto/:id"
        element={
          <RutaProtegida>
            <Layout>
              <ProductDetailPage />
            </Layout>
          </RutaProtegida>
        }
      />
      <Route
        path="/carrito"
        element={
          <RutaProtegida>
            <Layout>
              <CartPage />
            </Layout>
          </RutaProtegida>
        }
      />
      <Route
        path="/historial"
        element={
          <RutaProtegida>
            <Layout>
              <HistorialPage />
            </Layout>
          </RutaProtegida>
        }
      />
      <Route
        path="/confirmacion"
        element={
          <RutaProtegida>
            <Layout>
              <ConfirmationPage />
            </Layout>
          </RutaProtegida>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
