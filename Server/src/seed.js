import { connectDatabase } from "./config/db.js";
import Category from "./models/category.model.js";
import Product from "./models/product.model.js";

const onlyIfEmpty = process.argv.includes("--only-empty");

const categories = [
  {
    name: "New Arrivals",
    slug: "new-arrivals",
    description: "Fresh drops and newly added pieces.",
    image: "",
    isActive: true
  },
  {
    name: "Women",
    slug: "women",
    description: "Everyday essentials and statement pieces.",
    image: "",
    isActive: true
  },
  {
    name: "Men",
    slug: "men",
    description: "Clean staples and modern fits.",
    image: "",
    isActive: true
  }
];

const products = [
  {
    title: "Linen Everyday Set",
    slug: "linen-everyday-set",
    description: "A breathable matching set made for daily wear and easy styling.",
    price: 129.0,
    discountPrice: 99.0,
    catalog: "Core",
    stock: 18,
    sizes: ["S", "M", "L"],
    colors: ["Sand", "Olive"],
    images: ["https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80"],
    isFeatured: true,
    isActive: true,
    categorySlug: "new-arrivals"
  },
  {
    title: "Soft Cotton Hoodie",
    slug: "soft-cotton-hoodie",
    description: "A relaxed hoodie with a clean finish and everyday comfort.",
    price: 89.0,
    discountPrice: 72.0,
    catalog: "Core",
    stock: 24,
    sizes: ["M", "L", "XL"],
    colors: ["Stone", "Black"],
    images: ["https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"],
    isFeatured: true,
    isActive: true,
    categorySlug: "men"
  },
  {
    title: "Minimal Wrap Dress",
    slug: "minimal-wrap-dress",
    description: "An elegant wrap dress with a soft drape and versatile fit.",
    price: 149.0,
    discountPrice: 119.0,
    catalog: "Core",
    stock: 12,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Ivory", "Rose"],
    images: ["https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80"],
    isFeatured: false,
    isActive: true,
    categorySlug: "women"
  }
];

async function seed() {
  await connectDatabase();

  if (onlyIfEmpty) {
    const [categoryCount, productCount] = await Promise.all([
      Category.countDocuments(),
      Product.countDocuments()
    ]);

    if (categoryCount > 0 || productCount > 0) {
      console.log(
        `Seed skipped: database already has ${categoryCount} categories and ${productCount} products.`
      );
      process.exit(0);
    }
  }

  const categoryDocs = new Map();

  for (const category of categories) {
    const doc = await Category.findOneAndUpdate(
      { slug: category.slug },
      category,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    categoryDocs.set(category.slug, doc);
  }

  for (const product of products) {
    const category = categoryDocs.get(product.categorySlug);

    if (!category) {
      throw new Error(`Missing category for product seed: ${product.title}`);
    }

    const { categorySlug, ...productData } = product;

    await Product.findOneAndUpdate(
      { slug: productData.slug },
      { ...productData, category: category._id },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    );
  }

  console.log(`Seed complete: ${categoryDocs.size} categories and ${products.length} products upserted.`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
