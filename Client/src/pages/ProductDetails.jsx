import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/Button.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { useCart } from "../context/CartContext.jsx";
import { getFinalPrice } from "../data/products.js";
import { useCatalog } from "../hooks/useCatalog.js";
import { formatCurrency } from "../utils/currency.js";

export default function ProductDetails() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const { products } = useCatalog();
  const swipeStartRef = useRef(null);
  const galleryRef = useRef(null);
  const product = products.find((item) => item.slug === slug) ?? products[0];
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors?.[0] ?? product.color);
  const [activeImage, setActiveImage] = useState(0);
  const images = useMemo(
    () => (product.images?.length ? product.images : [product.image, product.hoverImage].filter(Boolean)),
    [product]
  );
  const related = useMemo(() => products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3), [product, products]);

  function scrollToImage(index) {
    const container = galleryRef.current;
    if (!container || !images.length) return;

    const nextIndex = (index + images.length) % images.length;
    const width = container.clientWidth || 1;
    container.scrollTo({ left: nextIndex * width, behavior: "smooth" });
    setActiveImage(nextIndex);
  }

  return (
    <section className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative overflow-hidden border border-black bg-mist">
          <div
            ref={galleryRef}
            className="no-scrollbar flex aspect-[3/4] overflow-x-auto scroll-smooth snap-x snap-mandatory"
            style={{ touchAction: "pan-x", scrollSnapType: "x mandatory" }}
            onTouchStart={(event) => {
              swipeStartRef.current = event.touches[0].clientX;
            }}
            onTouchEnd={(event) => {
              if (swipeStartRef.current === null) return;
              const endX = event.changedTouches[0].clientX;
              const delta = endX - swipeStartRef.current;
              swipeStartRef.current = null;

              if (Math.abs(delta) < 40) return;

              const container = event.currentTarget;
              const width = container.clientWidth || 1;
              const currentIndex = Math.round(container.scrollLeft / width);
              const nextIndex = delta < 0 ? Math.min(currentIndex + 1, images.length - 1) : Math.max(currentIndex - 1, 0);
              container.scrollTo({ left: nextIndex * width, behavior: "smooth" });
              setActiveImage(nextIndex);
            }}
            onScroll={(event) => {
              const container = event.currentTarget;
              const width = container.clientWidth || 1;
              const nextIndex = Math.round(container.scrollLeft / width);
              if (nextIndex !== activeImage) setActiveImage(nextIndex);
            }}
          >
            {images.map((image, index) => (
              <img
                key={`${product.slug}-${image}-${index}`}
                className="h-full w-full flex-none snap-start object-cover"
                style={{ minWidth: "100%" }}
                src={image}
                alt={index === 0 ? product.name : ""}
                aria-hidden={index !== 0}
                decoding="async"
                draggable="false"
              />
            ))}
          </div>
          {images.length > 1 ? (
            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3">
              <button
                type="button"
                className="pointer-events-auto focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full bg-paper/85 text-ink shadow-sm backdrop-blur hover:bg-paper"
                aria-label="Previous image"
                onClick={() => scrollToImage(activeImage - 1)}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="pointer-events-auto focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full bg-paper/85 text-ink shadow-sm backdrop-blur hover:bg-paper"
                aria-label="Next image"
                onClick={() => scrollToImage(activeImage + 1)}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          ) : null}
        </div>
        <div className="space-y-7 border border-black bg-paper p-5 sm:p-8">
          <Link className="text-xs font-black uppercase tracking-[0.22em] text-rust hover:text-ink" to="/shop">
            Back to shop
          </Link>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-rust">{product.category}</p>
            <h1 className="mt-3 text-5xl font-black uppercase leading-none sm:text-7xl">{product.name}</h1>
            <p className="mt-5 max-w-xl text-sm font-semibold uppercase leading-7 tracking-[0.08em] text-black/60">{product.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black uppercase">{formatCurrency(getFinalPrice(product))}</span>
            {product.discount ? <span className="text-lg text-black/40 line-through">{formatCurrency(product.price)}</span> : null}
            {product.discount ? <span className="bg-rust px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white">{product.discount}% off</span> : null}
          </div>
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em]">Choose size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((item) => (
                <button
                  key={item}
                  className={`focus-ring min-w-12 border px-4 py-3 text-xs font-black uppercase tracking-[0.16em] ${
                    size === item ? "border-ink bg-ink text-paper" : "border-black bg-paper"
                  }`}
                  onClick={() => setSize(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em]">Choose color</p>
            <div className="flex flex-wrap gap-2">
              {(product.colors ?? [product.color]).map((item) => (
                <button
                  key={item}
                  className={`focus-ring min-w-12 border px-4 py-3 text-xs font-black uppercase tracking-[0.16em] ${
                    color === item ? "border-rust bg-rust text-white" : "border-black bg-paper"
                  }`}
                  onClick={() => setColor(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <Button className="w-full py-4 uppercase tracking-[0.2em]" onClick={() => addItem(product, size, color)}>
            Add to cart
          </Button>
          <div className="grid gap-3 border border-black bg-paper p-5 text-xs font-black uppercase tracking-[0.12em] text-black/65">
            {["French terry cotton", "Easy exchanges within 14 days", "Free shipping over Rs 4000"].map((item) => (
              <p key={item} className="flex items-center gap-2">
                <CheckCircle2 className="text-rust" size={18} />
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
      {related.length ? (
        <div className="mt-16">
          <h2 className="mb-6 border-b border-black pb-4 text-3xl font-black uppercase">Related pieces</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
