import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true
    },
    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, "Product description is required"]
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"]
    },
    discountPrice: {
      type: Number,
      min: [0, "Discount price cannot be negative"]
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"]
    },
    catalog: {
      type: String,
      default: "Core"
    },
    stock: {
      type: Number,
      min: [0, "Stock cannot be negative"],
      default: 0
    },
    sizes: {
      type: [String],
      default: []
    },
    colors: {
      type: [String],
      default: []
    },
    images: {
      type: [String],
      default: []
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

productSchema.virtual("name").get(function getNameAlias() {
  return this.title;
});

export default mongoose.model("Product", productSchema);
