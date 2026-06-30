import Order from "../models/order.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ orders });
});

export const listOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json({ orders });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (req.user.role !== "admin" && order.user._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You cannot view this order" });
  }

  res.json({ order });
});

export const createOrder = asyncHandler(async (req, res) => {
  const order = await Order.create({
    ...req.body,
    user: req.user._id
  });

  res.status(201).json({ order });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
      paymentStatus: req.body.paymentStatus
    },
    { new: true, runValidators: true }
  );

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json({ order });
});
