import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    productName: { type: String, required: true, trim: true },
    productImage: { type: String, default: "", trim: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtTime: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true, index: true },
    items: { type: [cartItemSchema], default: [] },
    totalAmount: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    couponCode: { type: String, default: null, trim: true },
    deliveryCharge: { type: Number, default: 0, min: 0 },
    finalAmount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);

