import { Router } from "express";
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem
} from "../controllers/cart.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.get("/", getCart);
router.post("/items", addCartItem);
router.patch("/items/:itemId", updateCartItem);
router.delete("/items/:itemId", removeCartItem);
router.delete("/", clearCart);

export default router;
