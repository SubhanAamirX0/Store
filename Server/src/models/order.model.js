import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    size: String,
    color: String,
    image: String
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    postalCode: String,
    country: String
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: {
      type: [orderItemSchema],
      default: []
    },
    shippingAddress: shippingAddressSchema,
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    discountTotal: {
      type: Number,
      default: 0,
      min: 0
    },
    shippingTotal: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ["pending", "paid", "processing", "shipped", "delivered", "cancelled"],
      default: "pending"
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
