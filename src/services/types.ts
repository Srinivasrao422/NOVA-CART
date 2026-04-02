export type ApiProduct = {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  category: string;
  brand: string;
  images?: string[];
  stock: number;
  discount?: number;
  ratings?: number;
  reviewsCount?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiCartItem = {
  product: ApiProduct | string;
  productName?: string;
  productImage?: string;
  quantity: number;
  priceAtTime: number;
  subtotal: number;
};

export type ApiCart = {
  _id?: string;
  user: string;
  items: ApiCartItem[];
  totalAmount: number;
  discount: number;
  couponCode: string | null;
  deliveryCharge: number;
  finalAmount: number;
};

export type ApiOrderStatus = "pending" | "shipped" | "delivered";

export type ApiOrderItem = {
  productId: string;
  name: string;
  image?: string;
  quantity: number;
  priceAtTime: number;
  subtotal: number;
};

export type ApiOrder = {
  _id: string;
  user: string;
  items: ApiOrderItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus?: "pending" | "paid" | "failed";
  status: ApiOrderStatus;
  estimatedDeliveryAt?: string;
  address: Record<string, unknown>;
  createdAt: string;
};

