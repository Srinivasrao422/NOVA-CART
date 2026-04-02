/**
 * Nova Cart backend integration (fetch).
 * Backend: http://localhost:5000 — start API before using these helpers.
 * Frontend: run Vite on port 3000 (e.g. `bun run dev -- --port 3000` or set `server.port` in vite.config).
 *
 * CORS: backend allows http://localhost:3000 (see nova-cart-backend FRONTEND_ORIGINS / server.js).
 */

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

type ApiSuccess<T> = { success: true } & T;
type ApiError = { success: false; message: string };

async function parseJson<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T;
  return data;
}

/** 1) Login — returns JWT; store it for cart/order calls. */
export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });
  const data = await parseJson<ApiSuccess<{ data: { user: unknown; token: string } }> | ApiError>(res);
  if (!res.ok || !('success' in data) || !data.success) {
    const msg = 'message' in data ? data.message : res.statusText;
    throw new Error(msg);
  }
  return data.data;
}

/** 2) Fetch all products (optional query filters). */
export async function fetchProducts(params?: Record<string, string>) {
  const qs = params ? new URLSearchParams(params).toString() : '';
  const url = qs ? `${API_BASE}/api/products?${qs}` : `${API_BASE}/api/products`;
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });
  const data = await parseJson<
    | ApiSuccess<{
        data: unknown[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
          hasNextPage: boolean;
          hasPrevPage: boolean;
        };
      }>
    | ApiError
  >(res);
  if (!res.ok || !('success' in data) || !data.success) {
    const msg = 'message' in data ? data.message : res.statusText;
    throw new Error(msg);
  }
  return data;
}

/** 3) Add product to cart (requires Bearer token). */
export async function addProductToCart(
  token: string,
  userId: string,
  productId: string,
  quantity = 1
) {
  const res = await fetch(`${API_BASE}/api/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, productId, quantity }),
    credentials: 'include',
  });
  const data = await parseJson<ApiSuccess<{ data: unknown }> | ApiError>(res);
  if (!res.ok || !('success' in data) || !data.success) {
    const msg = 'message' in data ? data.message : res.statusText;
    throw new Error(msg);
  }
  return data.data;
}

/** 4) Create order from server-side cart (requires Bearer token). */
export async function createOrder(
  token: string,
  userId: string,
  address: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    zip?: string;
    country?: string;
  },
  paymentMethod: string
) {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, address, paymentMethod }),
    credentials: 'include',
  });
  const data = await parseJson<ApiSuccess<{ data: { order: unknown } }> | ApiError>(res);
  if (!res.ok || !('success' in data) || !data.success) {
    const msg = 'message' in data ? data.message : res.statusText;
    throw new Error(msg);
  }
  return data.data.order;
}

/*
  ---------------------------------------------------------------------------
  Raw `fetch` examples (same contract as above; base URL = http://localhost:5000)
  ---------------------------------------------------------------------------

  // 1) Login
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@example.com', password: 'secret123' }),
    credentials: 'include',
  });
  const loginJson = await loginRes.json();
  const token = loginJson.data.token;
  const userId = loginJson.data.user.id;

  // 2) All products (optional filters)
  const productsRes = await fetch(
    'http://localhost:5000/api/products?category=electronics&brand=nike&price=1000',
    { method: 'GET', credentials: 'include' }
  );
  const productsJson = await productsRes.json();

  // 3) Add to cart
  await fetch('http://localhost:5000/api/cart/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, productId: 'PRODUCT_MONGO_ID', quantity: 1 }),
    credentials: 'include',
  });

  // 4) Create order (from cart; cart must not be empty)
  await fetch('http://localhost:5000/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userId,
      paymentMethod: 'card',
      address: {
        line1: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'US',
      },
    }),
    credentials: 'include',
  });
*/
