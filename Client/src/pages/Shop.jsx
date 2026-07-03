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
    <section className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 grid gap-5 border-b border-night/30 pb-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.32em] text-rust">Catalog / Drop 01</p>
          <h1 className="mt-2 text-5xl font-black uppercase leading-none sm:text-7xl">Shop Mithri</h1>
          <p className="mt-4 max-w-2xl text-sm font-semibold uppercase leading-6 tracking-[0.1em] text-black/60">Browse the latest tees and accessories.</p>
        </div>
        <label className="flex items-center gap-2 border border-night/30 bg-paper px-4 py-3">
          <SlidersHorizontal size={18} />
          <select className="bg-transparent text-xs font-black uppercase tracking-[0.16em] focus:outline-none" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </label>
      </div>
      <CategoryFilter activeCategory={category} categories={categories} onChange={setCategory} />
      {error ? <p className="mt-4 rounded-md bg-white px-4 py-3 text-sm font-semibold text-rust shadow-sm">Using local catalog while the API is unavailable.</p> : null}
      {loading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : null}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {!loading && filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
