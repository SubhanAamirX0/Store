import { SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CategoryFilter from "../components/CategoryFilter.jsx";
import ProductCard from "../components/ProductCard.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";
import { useCatalog } from "../hooks/useCatalog.js";

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const { products, categories, loading, error } = useCatalog();

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    setCategory(categoryParam || "All");
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    const list = category === "All" ? products : products.filter((product) => product.category === category);
    return [...list].sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      return a.id - b.id;
    });
  }, [category, products, sort]);

  return (
    <section className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-6 grid gap-4 border-b border-night/25 pb-5 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.26em] text-rust sm:text-xs sm:tracking-[0.32em]">Catalog / Drop 01</p>
          <h1 className="mt-1 text-4xl font-black uppercase leading-none sm:mt-2 sm:text-7xl">Shop Mithri</h1>
          <p className="mt-3 max-w-2xl text-xs font-semibold uppercase leading-5 tracking-[0.08em] text-black/60 sm:mt-4 sm:text-sm sm:leading-6 sm:tracking-[0.1em]">
            Browse the latest tees and accessories.
          </p>
        </div>
        <label className="flex items-center gap-2 border border-night/25 bg-paper px-3 py-2.5 sm:px-4 sm:py-3">
          <SlidersHorizontal size={18} />
          <select
            className="bg-transparent text-[11px] font-black uppercase tracking-[0.14em] focus:outline-none sm:text-xs sm:tracking-[0.16em]"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </label>
      </div>
      <CategoryFilter activeCategory={category} categories={categories} onChange={setCategory} />
      {error ? <p className="mt-4 rounded-md bg-white px-4 py-3 text-sm font-semibold text-rust shadow-sm">Using local catalog while the API is unavailable.</p> : null}
      {loading ? (
        <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : null}
      <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
        {!loading && filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
