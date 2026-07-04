import { categories as fallbackCategories } from "../data/products.js";

export default function CategoryFilter({ activeCategory, onChange, categories = fallbackCategories }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category}
          className={`focus-ring whitespace-nowrap border px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] transition hover:-translate-y-0.5 active:scale-95 sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.2em] ${
            activeCategory === category
              ? "border-cedar bg-cedar text-paper"
              : "border-night/25 bg-paper text-ink hover:bg-cedar hover:text-paper"
          }`}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
