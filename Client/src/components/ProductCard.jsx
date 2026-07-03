import { ShoppingBag } from "lucide-react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { getFinalPrice } from "../data/products.js";
import { formatCurrency } from "../utils/currency.js";
import Button from "./Button.jsx";

function ProductCard({ product }) {
  const { addItem } = useCart();
  const cardRef = useRef(null);
  const [added, setAdded] = useState(false);
  const finalPrice = getFinalPrice(product);
  const images = useMemo(() => {
    const source = product.images?.length
      ? product.images
      : [product.image, product.hoverImage].filter(Boolean);
    return source.slice(0, 5);
  }, [product.hoverImage, product.image, product.images]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return undefined;

    card.classList.add("is-visible");

    if (!("IntersectionObserver" in window)) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          card.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -80px", threshold: 0.18 }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  function handleAdd() {
    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 900);
  }

  return (
    <article ref={cardRef} className="product-card group overflow-hidden border border-night/25 bg-paper shadow-soft">
      <Link to={`/products/${product.slug}`} className="relative block aspect-[3/4] overflow-hidden bg-mist">
        {images.map((image, index) => (
          <img
            key={`${product.slug}-${image}-${index}`}
            className="product-card-gallery absolute inset-0 h-full w-full object-cover"
            style={{
              animationDelay: `${index * 2.8}s`,
              animationDuration: `${images.length * 2.8}s`
            }}
            src={image}
            alt={index === 0 ? product.name : ""}
            aria-hidden={index !== 0}
            loading="lazy"
            decoding="async"
          />
        ))}
        <div className="absolute left-3 top-3 bg-paper px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-ink">
          New
        </div>
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-ink px-4 py-3 text-center text-[11px] font-black uppercase tracking-[0.24em] text-paper transition duration-300 group-hover:translate-y-0">
          Quick View
        </div>
      </Link>
      <div className="space-y-4 border-t border-night/15 p-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-rust">{product.category}</p>
          <Link to={`/products/${product.slug}`} className="mt-2 block text-sm font-black uppercase tracking-[0.12em] hover:text-rust">
            {product.name}
          </Link>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-night/70">{product.color}</p>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black">{formatCurrency(finalPrice)}</span>
              {product.discount ? <span className="text-xs text-night/45 line-through">{formatCurrency(product.price)}</span> : null}
            </div>
            <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-night/55">
              {product.stock > 0 ? `${product.stock} in stock` : product.stock === 0 ? "Limited availability" : "Ready to ship"}
            </p>
          </div>
          <div className="active:scale-95">
            <Button aria-label={`Add ${product.name}`} onClick={handleAdd} className={`px-3 ${added ? "bg-cedar" : ""}`}>
              {added ? "Added" : <ShoppingBag size={17} />}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default memo(ProductCard);
