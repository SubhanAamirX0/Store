export default function Loader({ label = "Loading" }) {
  return (
    <div className="flex items-center gap-3 text-sm font-semibold text-cedar">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-cedar border-t-transparent" />
      {label}
    </div>
  );
}
