import { AppError } from "../utils/AppError.js";

export function notFound(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const payload = {
    success: false,
    message: err.message || "Server error",
  };

  if (err instanceof AppError && err.details) {
    payload.details = err.details;
  }

  // Mongoose duplicate key
  if (err?.code === 11000) {
    const fields = Object.keys(err.keyValue || {});
    payload.message = `Duplicate value for: ${fields.join(", ")}`;
    return res.status(409).json(payload);
  }

  // Mongoose CastError
  if (err?.name === "CastError") {
    payload.message = "Invalid resource id";
    return res.status(400).json(payload);
  }

  // Mongoose ValidationError
  if (err?.name === "ValidationError") {
    payload.message = "Validation error";
    payload.details = Object.values(err.errors || {}).map((e) => e.message);
    return res.status(400).json(payload);
  }

  // Joi validation
  if (err?.isJoi) {
    payload.message = "Validation error";
    payload.details = err.details?.map((d) => d.message) ?? undefined;
    return res.status(400).json(payload);
  }

  if (process.env.NODE_ENV !== "production") {
    payload.stack = err.stack;
  }

  return res.status(statusCode).json(payload);
}

