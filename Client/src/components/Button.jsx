export default function Button({ as: Component = "button", className = "", variant = "primary", ...props }) {
  const variants = {
    primary: "bg-ink text-white hover:bg-cedar",
    secondary: "border border-black/15 bg-white text-ink hover:border-cedar hover:text-cedar",
    ghost: "text-ink hover:bg-black/5"
  };

  return (
    <Component
      className={`button-motion focus-ring inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
