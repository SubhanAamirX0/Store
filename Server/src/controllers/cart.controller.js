import Cart from "../models/cart.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

async function getOrCreateCart(userId) {
  return Cart.findOneAndUpdate(
    { user: userId },
    { $setOnInsert: { user: userId, items: [] } },
    { new: true, upsert: true }
  ).populate("items.product");
}

export const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  res.json({ cart });
});

export const addCartItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  const { product, quantity = 1, size, color } = req.body;
  const existing = cart.items.find(
    (item) => item.product._id.toString() === product && item.size === size && item.color === color
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ product, quantity, size, color });
  }

  await cart.save();
  await cart.populate("items.product");
  res.status(201).json({ cart });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(req.params.itemId);

  if (!item) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  item.quantity = req.body.quantity;
  await cart.save();
  await cart.populate("items.product");
  res.json({ cart });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items.pull(req.params.itemId);
  await cart.save();
  await cart.populate("items.product");
  res.json({ cart });
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();
  res.json({ cart });
});
