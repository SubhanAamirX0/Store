import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { products as fallbackProducts } from "../data/products.js";
import { useCatalog } from "../hooks/useCatalog.js";
import { useGsapStory } from "../hooks/useGsapStory.js";

const storyCards = [
  { title: "DROPPED IN LIMITED RUNS", copy: "Small quantities, tighter edits, and pieces built around the whole fit." },
  { title: "CUT FOR DAILY WEAR", copy: "Structured tees, fleece, outerwear, and accessories with a street-ready silhouette." },
  { title: "MADE TO HOLD ATTENTION", copy: "Quiet branding, strong images, and a collection-first shopping rhythm." }
];

export default function Home() {
  const scopeRef = useRef(null);
  const { products } = useCatalog();
  const featured = (products.length ? products : fallbackProducts).slice(0, 4);
  useGsapStory(scopeRef);

  return (
    <div ref={scopeRef} className="bg-paper">
      <section data-hero className="relative min-h-[78vh] overflow-hidden bg-ink text-paper sm:min-h-[calc(100vh-118px)]">
        <img
          data-hero-image
          className="absolute inset-0 h-full w-full object-cover opacity-35"
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1800&q=85"
          alt="Mithri fashion collection"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-ink via-ink/75 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-4 pb-6 sm:px-6 sm:pb-10 lg:px-8">
          <div className="mx-auto grid max-w-[1500px] gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p data-hero-line className="text-[10px] font-black uppercase tracking-[0.28em] text-paper/80 sm:text-xs sm:tracking-[0.34em]">
                Drop 01 / Everyday Uniform
              </p>
              <h1 data-hero-line className="mt-2 max-w-5xl text-4xl font-black uppercase leading-[0.92] tracking-normal sm:mt-3 sm:text-8xl lg:text-[8.5rem]">
                Mithri
              </h1>
              <div data-hero-line className="mt-4 flex max-w-3xl flex-col gap-4 border-t border-paper/35 pt-4 sm:mt-6 sm:flex-row sm:items-end sm:justify-between sm:gap-5 sm:pt-5">
                <p className="max-w-xl text-sm font-semibold uppercase leading-6 tracking-[0.08em] text-paper/86 sm:text-base sm:leading-7 sm:tracking-[0.12em]">
                  Clothing-brand merch with a sharper drop system, editorial imagery, and streetwear-ready staples.
                </p>
                <Button
                  as={Link}
                  to="/shop"
                  className="w-fit !bg-paper !px-4 !py-3 text-xs !text-ink hover:!bg-rust hover:!text-white sm:!px-5 sm:!py-4 sm:text-sm"
                >
                  Shop the drop <ArrowRight className="ml-2" size={17} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section data-story className="border-b border-night/40 bg-paper py-8 sm:py-12">
        <div className="mx-auto grid max-w-[1500px] gap-4 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {storyCards.map((card) => (
            <article data-story-card key={card.title} className="border border-night/30 bg-paper p-4 sm:p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-rust sm:text-xs sm:tracking-[0.28em]">{card.title}</p>
              <p className="mt-3 max-w-sm text-xs font-semibold uppercase leading-5 tracking-[0.06em] text-ink/70 sm:mt-4 sm:text-sm sm:leading-6 sm:tracking-[0.08em]">{card.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid border-b border-night/40 bg-ink text-paper lg:grid-cols-2">
        <Link to="/shop" className="group relative min-h-[340px] overflow-hidden border-b border-paper/20 lg:min-h-[560px] lg:border-b-0 lg:border-r">
          <img
            className="absolute inset-0 h-full w-full object-cover opacity-78 transition duration-700 group-hover:scale-105"
            src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1600&q=85"
            alt="Ready to wear collection"
            loading="lazy"
            decoding="async"
            style={{ objectPosition: "center 18%" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-paper/75 sm:text-xs sm:tracking-[0.34em]">Collection</p>
            <h2 className="mt-1 text-4xl font-black uppercase leading-none sm:mt-2 sm:text-6xl">Tees</h2>
          </div>
        </Link>
        <Link to="/shop" className="group relative min-h-[340px] overflow-hidden lg:min-h-[560px]">
          <img
            className="absolute inset-0 h-full w-full object-cover opacity-78 transition duration-700 group-hover:scale-105"
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=85"
            alt="Accessories collection"
            loading="lazy"
            decoding="async"
            style={{ objectPosition: "center 20%" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-paper/75 sm:text-xs sm:tracking-[0.34em]">Collection</p>
            <h2 className="mt-1 text-4xl font-black uppercase leading-none sm:mt-2 sm:text-6xl">Accessories</h2>
          </div>
        </Link>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-5 flex flex-col gap-4 border-b border-night/30 pb-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.26em] text-rust sm:text-xs sm:tracking-[0.3em]">New / Featured</p>
            <h2 className="mt-1 text-2xl font-black uppercase sm:mt-2 sm:text-5xl">Latest Pieces</h2>
          </div>
          <Link className="text-[11px] font-black uppercase tracking-[0.2em] text-ink hover:text-rust sm:text-xs sm:tracking-[0.22em]" to="/shop">
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
