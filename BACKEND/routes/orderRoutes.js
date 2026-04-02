import { Router } from "express";
import { protect, requireRole } from "../middleware/auth.js";
import { createOrderFromCart, getOrdersByUser, updateOrderStatus } from "../controllers/orderController.js";

const router = Router();

router.post("/", protect, createOrderFromCart);
router.get("/:userId", protect, getOrdersByUser);
router.put("/status", protect, requireRole("admin"), updateOrderStatus);

export default router;

