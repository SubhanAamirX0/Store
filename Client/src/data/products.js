export const categories = ["All", "T-Shirts", "Hoodies", "Outerwear", "Accessories"];

export const products = [
  {
    id: 1,
    slug: "signature-tee",
    name: "Batman VS Joker Tee",
    category: "T-Shirts",
    price: 2895,
    discount: 10,
    color: "Black",
    sizes: ["S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    hoverImage: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80",
    description: "Batman Versus Joker Tee."
  },
  {
    id: 2,
    slug: "cloud-hoodie",
    name: "Cloud Hoodie",
    category: "Hoodies",
    price: 72,
    discount: 0,
    color: "Bone",
    sizes: ["S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",
    hoverImage: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=900&q=80",
    description: "Midweight fleece with clean ribbing, relaxed shoulders, and quiet logo detail."
  },
  {
    id: 3,
    slug: "market-jacket",
    name: "Market Jacket",
    category: "Outerwear",
    price: 118,
    discount: 15,
    color: "Charcoal",
    sizes: ["M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80",
    hoverImage: "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&q=80",
    description: "A practical lightweight layer with oversized pockets and a structured shape."
  },
  {
    id: 4,
    slug: "daily-cap",
    name: "Daily Cap",
    category: "Accessories",
    price: 28,
    discount: 0,
    color: "Rust",
    sizes: ["One size"],
    image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80",
    hoverImage: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=80",
    description: "Low-profile cotton cap with tonal embroidery and an adjustable back strap."
  },
  {
    id: 5,
    slug: "studio-sweatshirt",
    name: "Studio Sweatshirt",
    category: "Hoodies",
    price: 64,
    discount: 12,
    color: "Moss",
    sizes: ["S", "M", "L"],
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80",
    hoverImage: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=900&q=80",
    description: "Brushed cotton crewneck built for workdays, weekends, and easy layering."
  },
  {
    id: 6,
    slug: "canvas-tote",
    name: "Canvas Tote",
    category: "Accessories",
    price: 22,
    discount: 0,
    color: "Natural",
    sizes: ["One size"],
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=900&q=80",
    hoverImage: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&w=900&q=80",
    description: "Heavy canvas carryall with reinforced handles and a printed Mithri wordmark."
  }
];

export function getFinalPrice(product) {
  if (product.discountPrice) return Math.round(product.discountPrice);
  return Math.round(product.price * (1 - (product.discount ?? 0) / 100));
}

export function normalizeProduct(product) {
  const categoryName = typeof product.category === "object" ? product.category?.name : product.category;
  const price = Number(product.price ?? 0);
  const discountPrice = product.discountPrice ? Number(product.discountPrice) : null;

  return {
    ...product,
    id: product._id ?? product.id,
    name: product.title ?? product.name,
    title: product.title ?? product.name,
    category: categoryName ?? "Catalog",
    price,
    discountPrice,
    discount: discountPrice && price ? Math.round((1 - discountPrice / price) * 100) : product.discount ?? 0,
    color: product.colors?.[0] ?? product.color ?? "Core",
    colors: product.colors?.length ? product.colors : [product.color ?? "Core"],
    sizes: product.sizes?.length ? product.sizes : ["One size"],
    image: product.images?.[0] ?? product.image,
    images: product.images?.length ? product.images : [product.image].filter(Boolean),
    stock: product.stock ?? 0
  };
}
