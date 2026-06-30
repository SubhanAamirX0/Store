export default function Input({ label, className = "", ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      <input
        className={`focus-ring w-full rounded-md border border-black/15 bg-white px-4 py-3 text-sm ${className}`}
        {...props}
      />
    </label>
  );
}
