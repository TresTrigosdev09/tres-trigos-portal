import { useLocation, useNavigate } from "react-router-dom";
import StampBadge from "../components/common/StampBadge";
import Button from "../components/common/Button";

const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default function ConfirmationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    navigate("/catalogo");
    return null;
  }

  const { total, numeroPedido, estado } = state;
  const enProceso = estado === "en_proceso";

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-4 py-10 text-center sm:px-6">
      <StampBadge
        texto="PEDIDO CONFIRMADO"
        sub={numeroPedido ? `No. ${numeroPedido}` : "TRES TRIGOS"}
      />

      <p className="mt-8 font-mono text-2xl font-semibold text-brand-dark">
        {formatoCOP.format(total)}
      </p>

      {enProceso ? (
        <p className="mt-1 text-sm text-brand-brown">
          Tu pedido se está procesando. <span className="font-semibold text-brand-dark">No lo reenvíes.</span>{" "}
          Si en unos minutos no ves la confirmación, escríbenos por WhatsApp para verificarlo.
        </p>
      ) : numeroPedido ? (
        <p className="mt-1 text-sm text-brand-brown">
          Tu pedido <span className="font-semibold text-brand-dark">#{numeroPedido}</span> fue
          registrado en Siesa correctamente.
        </p>
      ) : (
        <p className="mt-1 text-sm text-brand-brown">
          Tu pedido fue registrado correctamente en Siesa.
        </p>
      )}

      <div className="mt-8 w-full max-w-sm rounded-xl bg-white p-5 text-left">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-brown">
          Datos para el pago
        </p>
        {/* TODO: reemplazar con los datos bancarios reales de Tres Trigos antes del deploy */}
        <p className="mt-2 text-sm text-brand-dark">Banco: Bancolombia · Cuenta Corriente</p>
        <p className="font-mono text-sm text-brand-dark">006-992900-00</p>
        <p className="mt-2 text-sm text-brand-dark">Llave: Bancolombia</p>
        <p className="font-mono text-sm text-brand-dark">@trestrigos2</p>
        <p className="mt-2 text-xs text-brand-brown">
          A nombre de Tres Trigos S.A.S. · NIT 901.002.505
        </p>
      </div>

      <Button variant="secondary" className="mt-8" onClick={() => navigate("/catalogo")}>
        Volver al catálogo
      </Button>
    </div>
  );
}
