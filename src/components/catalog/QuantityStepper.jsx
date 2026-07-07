export default function QuantityStepper({ cantidad, onCambiar, min = 0 }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-brand-cream px-2 py-1">
      <button
        type="button"
        onClick={() => onCambiar(Math.max(min, cantidad - 1))}
        disabled={cantidad <= min}
        className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-lg font-semibold text-brand-dark shadow-sm disabled:opacity-40"
        aria-label="Disminuir cantidad"
      >
        −
      </button>
      <span className="w-6 text-center font-mono text-sm font-semibold text-brand-dark" aria-live="polite">
        {cantidad}
      </span>
      <button
        type="button"
        onClick={() => onCambiar(cantidad + 1)}
        className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-lg font-semibold text-brand-dark shadow-sm"
        aria-label="Aumentar cantidad"
      >
        +
      </button>
    </div>
  );
}
