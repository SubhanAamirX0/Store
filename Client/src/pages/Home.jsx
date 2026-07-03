import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { products } from "../data/products.js";
import { useGsapStory } from "../hooks/useGsapStory.js";

const storyCards = [
  { title: "DROPPED IN LIMITED RUNS", copy: "Small quantities, tighter edits, and pieces built around the whole fit." },
  { title: "CUT FOR DAILY WEAR", copy: "Structured tees, fleece, outerwear, and accessories with a street-ready silhouette." },
  { title: "MADE TO HOLD ATTENTION", copy: "Quiet branding, strong images, and a collection-first shopping rhythm." }
];

export default function Home() {
  const scopeRef = useRef(null);
  const featured = products.slice(0, 4);
  useGsapStory(scopeRef);

  return (
    <div ref={scopeRef} className="bg-paper">
      <section data-hero className="relative min-h-[calc(100vh-118px)] overflow-hidden bg-ink text-paper">
        <img
          data-hero-image
          className="absolute inset-0 h-full w-full object-cover opacity-70"
          src="https://images.unsplash.com/photo-1506629905607-d9f297d94b7e?auto=format&fit=crop&w=1800&q=85"
          alt="Editorial Mithri collection"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-4 pb-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1500px]">
            <p data-hero-line className="text-xs font-black uppercase tracking-[0.34em] text-paper/80">
              Drop 01 / Everyday Uniform
            </p>
            <h1 data-hero-line className="mt-3 max-w-5xl text-6xl font-black uppercase leading-[0.9] tracking-normal sm:text-8xl lg:text-[8.5rem]">
              Mithri
            </h1>
            <div data-hero-line className="mt-6 flex max-w-3xl flex-col gap-5 border-t border-paper/35 pt-5 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-xl text-base font-semibold uppercase leading-7 tracking-[0.12em] text-paper/86">
                Clothing-brand merch with a sharper drop system, editorial imagery, and streetwear-ready staples.
              </p>
              <Button as={Link} to="/shop" className="w-fit bg-paper text-ink hover:bg-rust hover:text-white">
                Shop the drop <ArrowRight className="ml-2" size={17} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section data-story className="border-b border-night/40 bg-paper py-12">
        <div className="mx-auto grid max-w-[1500px] gap-4 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {storyCards.map((card) => (
            <article data-story-card key={card.title} className="border border-night/30 bg-paper p-5">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-rust">{card.title}</p>
              <p className="mt-4 max-w-sm text-sm font-semibold uppercase leading-6 tracking-[0.08em] text-ink/70">{card.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid border-b border-night/40 bg-ink text-paper lg:grid-cols-2">
        <Link to="/shop" className="group relative min-h-[560px] overflow-hidden border-b border-paper/20 lg:border-b-0 lg:border-r">
          <img
            className="absolute inset-0 h-full w-full object-cover opacity-78 transition duration-700 group-hover:scale-105"
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85"
            alt="Ready to wear collection"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-paper/75">Collection</p>
            <h2 className="mt-2 text-5xl font-black uppercase leading-none sm:text-6xl">Tees</h2>
          </div>
        </Link>
        <Link to="/shop" className="group relative min-h-[560px] overflow-hidden">
          <img
            className="absolute inset-0 h-full w-full object-cover opacity-78 transition duration-700 group-hover:scale-105"
            src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85"
            alt="Accessories collection"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-paper/75">Collection</p>
            <h2 className="mt-2 text-5xl font-black uppercase leading-none sm:text-6xl">Accessories</h2>
          </div>
        </Link>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between border-b border-night/30 pb-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-rust">New / Featured</p>
            <h2 className="mt-2 text-3xl font-black uppercase sm:text-5xl">Latest Pieces</h2>
          </div>
          <Link className="text-xs font-black uppercase tracking-[0.22em] text-ink hover:text-rust" to="/shop">
            View All
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
