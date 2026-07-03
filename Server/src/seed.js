import { connectDatabase } from "./config/db.js";
import Category from "./models/category.model.js";
import Product from "./models/product.model.js";
import User from "./models/user.model.js";

const onlyIfEmpty = process.argv.includes("--only-empty");
export const demoAdmin = {
  name: "Mithri Admin",
  email: "admin@mithri.store",
  password: "Admin1234!",
  role: "admin",
  isActive: true
};

const categories = [
  {
    name: "Tees",
    slug: "tees",
    description: "Graphic and everyday tees.",
    image: "",
    isActive: true
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Caps and carry goods.",
    image: "",
    isActive: true
  }
];

const products = [
  {
    title: "Signature Tee",
    slug: "signature-tee",
    description: "A clean everyday tee with a relaxed fit and bold print.",
    price: 49.0,
    discountPrice: 39.0,
    catalog: "Core",
    stock: 24,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White"],
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80"],
    isFeatured: true,
    isActive: true,
    categorySlug: "tees"
  },
  {
    title: "Daily Hat",
    slug: "daily-hat",
    description: "A low-profile hat with clean embroidery and an easy fit.",
    price: 28.0,
    discountPrice: 0,
    catalog: "Core",
    stock: 36,
    sizes: ["One size"],
    colors: ["Black", "Rust"],
    images: ["https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1200&q=80"],
    isFeatured: true,
    isActive: true,
    categorySlug: "accessories"
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

  await User.findOneAndUpdate(
    { email: demoAdmin.email },
    demoAdmin,
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  );

  console.log(
    `Seed complete: ${categoryDocs.size} categories, ${products.length} products, and 1 admin upserted.`
  );
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
