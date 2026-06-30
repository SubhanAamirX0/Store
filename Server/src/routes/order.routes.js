import { Router } from "express";
import {
  createOrder,
  getOrder,
  listMyOrders,
  listOrders,
  updateOrderStatus
} from "../controllers/order.controller.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.get("/mine", listMyOrders);
router.post("/", createOrder);
router.get("/", requireAdmin, listOrders);
router.get("/:id", getOrder);
router.patch("/:id/status", requireAdmin, updateOrderStatus);

export default router;
