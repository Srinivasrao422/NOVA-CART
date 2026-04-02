import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: null, min: 0 },
    category: { type: String, required: true, trim: true, index: true },
    brand: { type: String, required: true, trim: true, index: true },
    images: [{ type: String, trim: true }],
    stock: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 }, // percentage
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0, min: 0 },
    description: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);

