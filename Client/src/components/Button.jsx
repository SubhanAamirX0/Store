export default function Button({ as: Component = "button", className = "", variant = "primary", ...props }) {
  const variants = {
    primary: "bg-cedar text-paper hover:bg-ink",
    secondary: "border border-night/20 bg-paper text-ink hover:border-cedar hover:text-cedar",
    ghost: "text-ink hover:bg-night/10"
  };

  return (
    <Component
      className={`button-motion focus-ring inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
