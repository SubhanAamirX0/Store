import Category from "../models/category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { clearCache } from "../utils/cache.js";

export const listCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  res.json({ categories });
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  clearCache("/api/categories");
  res.status(201).json({ category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  clearCache("/api/categories");
  res.json({ category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  clearCache("/api/categories");
  res.json({ message: "Category archived", category });
});
