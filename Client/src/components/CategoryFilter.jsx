import { categories as fallbackCategories } from "../data/products.js";

export default function CategoryFilter({ activeCategory, onChange, categories = fallbackCategories }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category}
          className={`focus-ring whitespace-nowrap border px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] transition hover:-translate-y-0.5 active:scale-95 ${
            activeCategory === category
              ? "border-ink bg-ink text-paper"
              : "border-black bg-paper text-ink hover:bg-ink hover:text-paper"
          }`}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
