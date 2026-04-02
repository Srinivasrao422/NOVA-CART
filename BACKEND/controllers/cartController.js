import mongoose from "mongoose";
import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { Coupon } from "../models/Coupon.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { computeCartTotals, computeItemSubtotal } from "../utils/cartPricing.js";

async function getOrCreateCart(userId) {
  const existing = await Cart.findOne({ user: userId });
  if (existing) return existing;
  return Cart.create({ user: userId, items: [], deliveryCharge: 0 });
}

function effectiveProductPrice(product) {
  const price = Number(product.price || 0);
  const discount = Math.max(0, Math.min(100, Number(product.discount || 0)));
  const discounted = price * (1 - discount / 100);
  return Number(discounted.toFixed(2));
}

export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity = 1 } = req.body || {};
  if (!productId) throw new AppError("productId is required", 400);

  const qty = Math.max(1, Number(quantity || 1));
  const product = await Product.findById(productId);
  if (!product) throw new AppError("Product not found", 404);
  if (product.stock < qty) throw new AppError("Insufficient stock", 400);

  const cart = await getOrCreateCart(userId);
  const idx = cart.items.findIndex((i) => String(i.product) === String(product._id));
  const unitPrice = effectiveProductPrice(product);

  if (idx >= 0) {
    const newQty = cart.items[idx].quantity + qty;
    if (product.stock < newQty) throw new AppError("Insufficient stock", 400);
    cart.items[idx].productName = product.name;
    cart.items[idx].productImage = product.images?.[0] || "";
    cart.items[idx].quantity = newQty;
    cart.items[idx].priceAtTime = unitPrice;
    cart.items[idx].subtotal = computeItemSubtotal(unitPrice, newQty);
  } else {
    cart.items.push({
      product: product._id,
      productName: product.name,
      productImage: product.images?.[0] || "",
      quantity: qty,
      priceAtTime: unitPrice,
      subtotal: computeItemSubtotal(unitPrice, qty),
    });
  }

  await computeCartTotals(cart);
  await cart.save();

  res.json({ success: true, data: cart });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body || {};
  if (!productId) throw new AppError("productId is required", 400);
  const qty = Number(quantity);
  if (!Number.isFinite(qty) || qty < 1) throw new AppError("quantity must be >= 1", 400);

  const product = await Product.findById(productId);
  if (!product) throw new AppError("Product not found", 404);
  if (product.stock < qty) throw new AppError("Insufficient stock", 400);

  const cart = await getOrCreateCart(userId);
  const idx = cart.items.findIndex((i) => String(i.product) === String(product._id));
  if (idx < 0) throw new AppError("Item not in cart", 404);

  const unitPrice = effectiveProductPrice(product);
  cart.items[idx].productName = product.name;
  cart.items[idx].productImage = product.images?.[0] || "";
  cart.items[idx].quantity = qty;
  cart.items[idx].priceAtTime = unitPrice;
  cart.items[idx].subtotal = computeItemSubtotal(unitPrice, qty);

  await computeCartTotals(cart);
  await cart.save();
  res.json({ success: true, data: cart });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;
  if (!productId) throw new AppError("productId is required", 400);

  const cart = await getOrCreateCart(userId);
  cart.items = cart.items.filter((i) => String(i.product) !== String(productId));
  await computeCartTotals(cart);
  await cart.save();
  res.json({ success: true, data: cart });
});

export const getCartByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId)) throw new AppError("Invalid userId", 400);
  if (String(req.user._id) !== String(userId) && req.user.role !== "admin") {
    throw new AppError("Forbidden", 403);
  }

  const cart = await getOrCreateCart(userId);
  await cart.populate("items.product");
  res.json({ success: true, data: cart });
});

export const applyCoupon = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { couponCode } = req.body || {};
  if (!couponCode) throw new AppError("couponCode is required", 400);

  const code = String(couponCode).trim().toUpperCase();
  const coupon = await Coupon.findOne({ code });
  if (!coupon || !coupon.isUsable()) throw new AppError("Invalid coupon", 400);

  const cart = await getOrCreateCart(userId);
  cart.couponCode = code;
  await computeCartTotals(cart);
  await cart.save();

  res.json({ success: true, data: cart });
});

