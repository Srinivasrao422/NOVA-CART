import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { connectDB } from "./config/db.js";
import { Product } from "./models/Product.js";
import { seedProducts } from "./data/products.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

const PORT = Number(process.env.PORT || 5000);
const TRUST_PROXY = String(process.env.TRUST_PROXY || "false").toLowerCase() === "true";
if (TRUST_PROXY) app.set("trust proxy", 1);
if (!process.env.JWT_SECRET) {
  // eslint-disable-next-line no-console
  console.warn("JWT_SECRET not found in env. Using temporary dev fallback.");
  process.env.JWT_SECRET = "nova_cart_dev_secret_change_me";
}

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim()) : true,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  })
);

app.get("/health", (req, res) => res.json({ ok: true, name: "Nova Cart API" }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.use(notFound);
app.use(errorHandler);

async function start() {
  await connectDB(process.env.MONGO_URI);
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(seedProducts);
    // eslint-disable-next-line no-console
    console.log(`Auto-seeded ${seedProducts.length} products`);
  }
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Nova Cart backend running on port ${PORT}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server:", err);
  process.exit(1);
});

