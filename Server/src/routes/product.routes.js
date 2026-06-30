import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct
} from "../controllers/product.controller.js";
import { protect, requireAdmin } from "../middleware/auth.js";
import { cacheResponse } from "../utils/cache.js";

const router = Router();

router.get("/", cacheResponse(60000), listProducts);
router.get("/:slug", cacheResponse(60000), getProduct);
router.post("/", protect, requireAdmin, createProduct);
router.patch("/:id", protect, requireAdmin, updateProduct);
router.delete("/:id", protect, requireAdmin, deleteProduct);

export default router;
