import { Product } from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

export const getProducts = asyncHandler(async (req, res) => {
  const {
    category,
    brand,
    minPrice,
    maxPrice,
    discount,
    search,
    page = 1,
    limit = 12,
    sort = "-createdAt",
  } = req.query;

  const query = {};

  if (category) query.category = String(category);
  if (brand) query.brand = String(brand);
  if (discount != null) query.discount = { $gte: Number(discount) };

  if (minPrice != null || maxPrice != null) {
    query.price = {};
    if (minPrice != null) query.price.$gte = Number(minPrice);
    if (maxPrice != null) query.price.$lte = Number(maxPrice);
  }

  if (search) {
    const s = String(search).trim();
    query.$or = [
      { name: { $regex: s, $options: "i" } },
      { category: { $regex: s, $options: "i" } },
      { brand: { $regex: s, $options: "i" } },
    ];
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 12));
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    Product.find(query).sort(sort).skip(skip).limit(limitNum),
    Product.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: items,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError("Product not found", 404);
  res.json({ success: true, data: product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const payload = req.body || {};
  const required = ["name", "price", "category", "brand", "stock", "description"];
  for (const f of required) {
    if (payload[f] == null || payload[f] === "") {
      throw new AppError(`${f} is required`, 400);
    }
  }

  const product = await Product.create({
    name: String(payload.name).trim(),
    price: Number(payload.price),
    category: String(payload.category).trim(),
    brand: String(payload.brand).trim(),
    images: Array.isArray(payload.images) ? payload.images : [],
    stock: Number(payload.stock),
    originalPrice: payload.originalPrice != null ? Number(payload.originalPrice) : null,
    discount: payload.discount != null ? Number(payload.discount) : 0,
    ratings: payload.ratings != null ? Number(payload.ratings) : 0,
    reviewsCount: payload.reviewsCount != null ? Number(payload.reviewsCount) : 0,
    description: String(payload.description).trim(),
  });

  res.status(201).json({ success: true, data: product });
});

