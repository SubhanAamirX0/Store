import { Router } from "express";
import {
  createDiscount,
  deleteDiscount,
  listDiscounts,
  updateDiscount,
  validateDiscount
} from "../controllers/discount.controller.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/validate/:code", validateDiscount);
router.get("/", protect, requireAdmin, listDiscounts);
router.post("/", protect, requireAdmin, createDiscount);
router.patch("/:id", protect, requireAdmin, updateDiscount);
router.delete("/:id", protect, requireAdmin, deleteDiscount);

export default router;
