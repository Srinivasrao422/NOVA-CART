import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    throw new AppError("name, email and password are required", 400);
  }
  const normalizedEmail = String(email).toLowerCase().trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new AppError("Invalid email format", 400);
  }
  if (String(password).length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) throw new AppError("Email already in use", 409);

  const user = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    password: String(password),
  });

  const token = signToken(user._id);
  res.status(201).json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    throw new AppError("email and password are required", 400);
  }
  const normalizedEmail = String(email).toLowerCase().trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new AppError("Invalid email format", 400);
  }

  const user = await User.findOne({ email: normalizedEmail }).select("+password");
  if (!user) throw new AppError("Invalid credentials", 401);

  const ok = await user.comparePassword(String(password));
  if (!ok) throw new AppError("Invalid credentials", 401);

  const token = signToken(user._id);
  res.json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

export const googleAuth = asyncHandler(async (req, res) => {
  const { email, name, googleId } = req.body || {};
  if (!email || !name) {
    throw new AppError("email and name are required", 400);
  }
  const normalizedEmail = String(email).toLowerCase().trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new AppError("Invalid email format", 400);
  }

  let user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    // Create account for first-time Google user; random password keeps schema constraints.
    const generatedPassword = `g_${googleId || "oauth"}_${crypto.randomBytes(8).toString("hex")}`;
    user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: generatedPassword,
      role: "user",
    });
  }

  const token = signToken(user._id);
  res.json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

