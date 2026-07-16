export default function QuantityStepper({ cantidad, onCambiar, min = 0, paso = 1 }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-flour px-2 py-1">
      <button
        type="button"
        onClick={() => onCambiar(Math.max(min, cantidad - paso))}
        disabled={cantidad <= min}
        className="flex h-8 w-8 items-center justify-center rounded-md bg-surface text-lg font-semibold text-ink shadow-sm disabled:opacity-40"
        aria-label="Disminuir cantidad"
      >
        −
      </button>
      <span className="w-6 text-center font-mono text-sm font-semibold text-ink" aria-live="polite">
        {cantidad}
      </span>
      <button
        type="button"
        onClick={() => onCambiar(cantidad + paso)}
        className="flex h-8 w-8 items-center justify-center rounded-md bg-surface text-lg font-semibold text-ink shadow-sm"
        aria-label="Aumentar cantidad"
      >
        +
      </button>
    </div>
  );
}