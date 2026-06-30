import Product from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { clearCache } from "../utils/cache.js";

export const listProducts = asyncHandler(async (req, res) => {
  const query = { isActive: true };

  if (req.query.category) query.category = req.query.category;
  if (req.query.catalog) query.catalog = req.query.catalog;

  const products = await Product.find(query).populate("category").sort({ createdAt: -1 });
  res.json({ products });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate("category");

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({ product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  clearCache("/api/products");
  res.status(201).json({ product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  clearCache("/api/products");
  res.json({ product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  clearCache("/api/products");
  res.json({ message: "Product archived", product });
});
