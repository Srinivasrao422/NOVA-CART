import mongoose from "mongoose";
import { Cart } from "../models/Cart.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { Coupon } from "../models/Coupon.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { computeCartTotals } from "../utils/cartPricing.js";

export const createOrderFromCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { paymentMethod, address, upiId, simulateFailure = false } = req.body || {};
  if (!paymentMethod) throw new AppError("paymentMethod is required", 400);
  if (!address) throw new AppError("address is required", 400);
  if (!["card", "upi"].includes(String(paymentMethod))) {
    throw new AppError("paymentMethod must be card or upi", 400);
  }
  if (String(paymentMethod) === "upi") {
    const upiPattern = /^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/;
    if (!upiId || !upiPattern.test(String(upiId).trim())) {
      throw new AppError("Invalid UPI ID format", 400);
    }
  }
  if (simulateFailure) {
    throw new AppError("Payment failed. Please try another method.", 402);
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) throw new AppError("Cart is empty", 400);

  // Recompute totals to ensure server-side authority
  const { couponDoc } = await computeCartTotals(cart);

  // Validate stock and snapshot product references
  const productIds = cart.items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: productIds } });
  const byId = new Map(products.map((p) => [String(p._id), p]));

  for (const item of cart.items) {
    const p = byId.get(String(item.product));
    if (!p) throw new AppError("Product in cart no longer exists", 400);
    if (p.stock < item.quantity) throw new AppError(`Insufficient stock for ${p.name}`, 400);
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Decrease stock
    for (const item of cart.items) {
      const updated = await Product.updateOne(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { session }
      );
      if (updated.modifiedCount !== 1) {
        throw new AppError("Stock changed, please retry", 409);
      }
    }

    if (couponDoc) {
      await Coupon.updateOne({ _id: couponDoc._id }, { $inc: { usedCount: 1 } }, { session });
    }

    const order = await Order.create(
      [
        {
          user: userId,
          items: cart.items.map((i) => ({
            productId: i.product,
            name: i.productName,
            image: i.productImage,
            quantity: i.quantity,
            priceAtTime: i.priceAtTime,
            subtotal: i.subtotal,
          })),
          totalAmount: cart.finalAmount,
          paymentMethod: String(paymentMethod).trim(),
          paymentStatus: "paid",
          paymentDetails:
            String(paymentMethod) === "card"
              ? { type: "card", masked: "**** **** **** 4242" }
              : { type: "upi", upiId: String(upiId).trim() },
          status: "pending",
          address,
          estimatedDeliveryAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
        },
      ],
      { session }
    );

    // Empty cart
    cart.items = [];
    cart.couponCode = null;
    cart.discount = 0;
    cart.totalAmount = 0;
    cart.finalAmount = cart.deliveryCharge || 0;
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ success: true, data: order[0] });
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    throw e;
  }
});

export const getOrdersByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId)) throw new AppError("Invalid userId", 400);
  if (String(req.user._id) !== String(userId) && req.user.role !== "admin") {
    throw new AppError("Forbidden", 403);
  }

  const orders = await Order.find({ user: userId }).sort("-createdAt");
  res.json({ success: true, data: orders });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId, status } = req.body || {};
  if (!orderId) throw new AppError("orderId is required", 400);
  if (!["pending", "shipped", "delivered"].includes(status)) {
    throw new AppError("Invalid status", 400);
  }

  const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
  if (!order) throw new AppError("Order not found", 404);

  res.json({ success: true, data: order });
});

