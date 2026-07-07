export default function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}) {
  const base =
    "inline-flex w-full items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto";

  const variants = {
    primary: "bg-brand-dark text-white hover:opacity-90",
    secondary: "bg-transparent text-brand-dark ring-1 ring-inset ring-brand-slate hover:bg-brand-beige/30",
    accent: "bg-brand-brown text-white hover:opacity-90",
    danger: "bg-alert text-white hover:opacity-90",
  };

  return (
    <button type={type} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
