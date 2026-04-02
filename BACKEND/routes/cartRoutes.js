import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { addToCart, applyCoupon, getCartByUser, removeCartItem, updateCartItem } from "../controllers/cartController.js";

const router = Router();

router.post("/add", protect, addToCart);
router.put("/update", protect, updateCartItem);
router.delete("/remove/:productId", protect, removeCartItem);
router.get("/:userId", protect, getCartByUser);
router.post("/apply-coupon", protect, applyCoupon);

export default router;

