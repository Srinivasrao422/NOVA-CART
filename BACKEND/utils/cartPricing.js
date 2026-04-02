import { Coupon } from "../models/Coupon.js";

export function computeItemSubtotal(priceAtTime, quantity) {
  const qty = Math.max(1, Number(quantity || 1));
  const price = Math.max(0, Number(priceAtTime || 0));
  return Number((price * qty).toFixed(2));
}

export async function computeCartTotals(cart) {
  cart.items = cart.items.map((i) => ({
    ...i.toObject?.(),
    product: i.product,
    quantity: i.quantity,
    priceAtTime: i.priceAtTime,
    subtotal: computeItemSubtotal(i.priceAtTime, i.quantity),
  }));

  const totalAmount = cart.items.reduce((sum, i) => sum + i.subtotal, 0);
  cart.totalAmount = Number(totalAmount.toFixed(2));

  let discount = 0;
  let couponDoc = null;
  const code = cart.couponCode?.trim();
  if (code) {
    couponDoc = await Coupon.findOne({ code: code.toUpperCase() });
    if (couponDoc && couponDoc.isUsable() && cart.totalAmount >= couponDoc.minAmount) {
      if (couponDoc.type === "fixed") {
        discount = couponDoc.value;
      } else {
        discount = (cart.totalAmount * couponDoc.value) / 100;
        if (couponDoc.maxDiscount != null) {
          discount = Math.min(discount, couponDoc.maxDiscount);
        }
      }
    } else {
      cart.couponCode = null;
    }
  }

  discount = Math.max(0, Math.min(discount, cart.totalAmount));
  cart.discount = Number(discount.toFixed(2));

  const deliveryCharge = Math.max(0, Number(cart.deliveryCharge || 0));
  cart.deliveryCharge = Number(deliveryCharge.toFixed(2));

  cart.finalAmount = Number((cart.totalAmount - cart.discount + cart.deliveryCharge).toFixed(2));
  return { couponDoc };
}

