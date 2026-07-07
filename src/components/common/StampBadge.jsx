/**
 * El "sello" circular - elemento de firma visual del portal.
 * Se usa en la confirmacion de pedido, evocando el sello/factura
 * que hoy emite Siesa para cada pedido.
 */
export default function StampBadge({ texto, sub }) {
  return (
    <div className="relative mx-auto flex h-40 w-40 -rotate-6 items-center justify-center rounded-full border-[3px] border-brand-dark text-brand-dark sm:h-48 sm:w-48">
      <div className="absolute inset-2 rounded-full border border-brand-dark/40" />
      <div className="px-4 text-center">
        <p className="font-display text-base leading-none tracking-wide sm:text-lg">{texto}</p>
        {sub && <p className="mt-2 font-mono text-[11px] leading-none text-brand-dark/80 sm:text-xs">{sub}</p>}
      </div>
    </div>
  );
}
