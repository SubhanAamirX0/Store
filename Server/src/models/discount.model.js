import mongoose from "mongoose";

const discountSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Discount code is required"],
      uppercase: true,
      trim: true,
      unique: true
    },
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage"
    },
    value: {
      type: Number,
      required: [true, "Discount value is required"],
      min: [0, "Discount value cannot be negative"]
    },
    startsAt: Date,
    expiresAt: Date,
    maxUses: Number,
    usedCount: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Discount", discountSchema);
