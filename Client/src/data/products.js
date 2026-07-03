export const categories = ["All", "Tees", "Accessories"];

export const products = [
  {
    id: 1,
    slug: "signature-tee",
    name: "Signature Tee",
    category: "Tees",
    price: 49,
    discount: 20,
    color: "Black",
    sizes: ["S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    hoverImage: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80",
    description: "A clean everyday tee with a relaxed fit and bold print."
  },
  {
    id: 2,
    slug: "daily-hat",
    name: "Daily Hat",
    category: "Accessories",
    price: 28,
    discount: 0,
    color: "Rust",
    sizes: ["One size"],
    image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80",
    hoverImage: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=80",
    description: "A low-profile hat with clean embroidery and an easy fit."
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
    image: product.images?.[0] ?? product.image ?? product.hoverImage,
    images: product.images?.length
      ? product.images
      : [product.image, product.hoverImage].filter(Boolean),
    stock: product.stock ?? 0
  };
}
