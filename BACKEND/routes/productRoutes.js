import { Router } from "express";
import { createProduct, getProductById, getProducts } from "../controllers/productController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", protect, requireRole("admin"), createProduct);

export default router;

