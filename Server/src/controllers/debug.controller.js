import mongoose from "mongoose";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDebugStatus = asyncHandler(async (_req, res) => {
  const [categories, products, orders, users] = await Promise.all([
    Category.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    User.countDocuments()
  ]);

  res.json({
    database: mongoose.connection.name,
    readyState: mongoose.connection.readyState,
    counts: {
      categories,
      products,
      orders,
      users
    }
  });
});
