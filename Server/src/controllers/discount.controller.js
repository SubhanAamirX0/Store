import Discount from "../models/discount.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listDiscounts = asyncHandler(async (_req, res) => {
  const discounts = await Discount.find().sort({ createdAt: -1 });
  res.json({ discounts });
});

export const validateDiscount = asyncHandler(async (req, res) => {
  const code = req.params.code.toUpperCase();
  const discount = await Discount.findOne({ code, isActive: true });
  const now = new Date();

  if (!discount) {
    return res.status(404).json({ message: "Discount not found" });
  }

  if (discount.startsAt && discount.startsAt > now) {
    return res.status(400).json({ message: "Discount is not active yet" });
  }

  if (discount.expiresAt && discount.expiresAt < now) {
    return res.status(400).json({ message: "Discount has expired" });
  }

  if (discount.maxUses && discount.usedCount >= discount.maxUses) {
    return res.status(400).json({ message: "Discount usage limit reached" });
  }

  res.json({ discount });
});

export const createDiscount = asyncHandler(async (req, res) => {
  const discount = await Discount.create(req.body);
  res.status(201).json({ discount });
});

export const updateDiscount = asyncHandler(async (req, res) => {
  const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!discount) {
    return res.status(404).json({ message: "Discount not found" });
  }

  res.json({ discount });
});

export const deleteDiscount = asyncHandler(async (req, res) => {
  const discount = await Discount.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });

  if (!discount) {
    return res.status(404).json({ message: "Discount not found" });
  }

  res.json({ message: "Discount disabled", discount });
});
