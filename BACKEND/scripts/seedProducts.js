import "dotenv/config";
import { connectDB } from "../config/db.js";
import { Product } from "../models/Product.js";
import { seedProducts } from "../data/products.js";

async function run() {
  await connectDB(process.env.MONGO_URI);
  await Product.deleteMany({});
  await Product.insertMany(seedProducts);
  // eslint-disable-next-line no-console
  console.log(`Seeded ${seedProducts.length} products`);
  process.exit(0);
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Seeding failed:", err);
  process.exit(1);
});

