import Category from "../models/category.model.js";
import Discount from "../models/discount.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboardSummary = asyncHandler(async (_req, res) => {
  const [users, products, categories, orders, discounts] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Category.countDocuments({ isActive: true }),
    Order.countDocuments(),
    Discount.countDocuments({ isActive: true })
  ]);

  const revenue = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: null, total: { $sum: "$total" } } }
  ]);

  res.json({
    summary: {
      users,
      products,
      categories,
      orders,
      discounts,
      revenue: revenue[0]?.total ?? 0
    }
  });
});

export const getCatalogs = asyncHandler(async (_req, res) => {
  const catalogs = await Product.distinct("catalog", { isActive: true });
  res.json({ catalogs });
});

export const bulkUpdatePrices = asyncHandler(async (req, res) => {
  const { productIds = [], price, discountPrice } = req.body;
  const update = {};

  if (price !== undefined) update.price = price;
  if (discountPrice !== undefined) update.discountPrice = discountPrice;

  const result = await Product.updateMany({ _id: { $in: productIds } }, update, { runValidators: true });
  res.json({ modifiedCount: result.modifiedCount });
});
