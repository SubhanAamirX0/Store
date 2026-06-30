import { useEffect, useMemo, useState } from "react";
import { categories as fallbackCategories, normalizeProduct, products as fallbackProducts } from "../data/products.js";
import { apiRequest } from "../utils/api.js";

export function useCatalog() {
  const [products, setProducts] = useState(fallbackProducts.map(normalizeProduct));
  const [categories, setCategories] = useState(fallbackCategories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCatalog() {
      try {
        const [productData, categoryData] = await Promise.all([
          apiRequest("/products", { cacheMs: 60000 }),
          apiRequest("/categories", { cacheMs: 120000 })
        ]);

        if (!active) return;
        const normalizedProducts = productData.products.map(normalizeProduct);
        setProducts(normalizedProducts.length ? normalizedProducts : fallbackProducts.map(normalizeProduct));
        setCategories([
          "All",
          ...(categoryData.categories.length
            ? categoryData.categories.map((category) => category.name)
            : fallbackCategories.filter((category) => category !== "All"))
        ]);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCatalog();
    return () => {
      active = false;
    };
  }, []);

  return useMemo(() => ({ products, categories, loading, error }), [categories, error, loading, products]);
}
