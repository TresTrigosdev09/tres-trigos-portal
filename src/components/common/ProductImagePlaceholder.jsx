/**
 * Se muestra cuando el producto no tiene `imagen`, o cuando la imagen
 * referenciada todavia no existe en /public/productos/. Apenas subas
 * fotos reales con el nombre correcto, esto deja de verse - no hay que
 * tocar codigo.
 */
export default function ProductImagePlaceholder({ className = "" }) {
  return (
    <div className={`flex items-center justify-center bg-brand-sand/50 ${className}`}>
      <svg viewBox="0 0 48 48" className="h-9 w-9 text-brand-brown/60" fill="none">
        <path
          d="M24 6v36M24 12c-4 0-7 3-7 3s3 3 7 3M24 12c4 0 7 3 7 3s-3 3-7 3M24 20c-4 0-7 3-7 3s3 3 7 3M24 20c4 0 7 3 7 3s-3 3-7 3M24 28c-4 0-7 3-7 3s3 3 7 3M24 28c4 0 7 3 7 3s-3 3-7 3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
