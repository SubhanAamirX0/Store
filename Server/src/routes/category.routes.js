import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory
} from "../controllers/category.controller.js";
import { protect, requireAdmin } from "../middleware/auth.js";
import { cacheResponse } from "../utils/cache.js";

const router = Router();

router.get("/", cacheResponse(120000), listCategories);
router.post("/", protect, requireAdmin, createCategory);
router.patch("/:id", protect, requireAdmin, updateCategory);
router.delete("/:id", protect, requireAdmin, deleteCategory);

export default router;
