# Nova Cart Backend

Node.js + Express + MongoDB backend for the Nova Cart e-commerce app.

## Setup

1) Create a `.env` file (copy from `.env.example`):

- `PORT=5000`
- `MONGO_URI=mongodb://127.0.0.1:27017/nova_cart`
- `JWT_SECRET=...`

2) Install and run:

```bash
cd backend
npm install
npm run dev
```

Health check:
- `GET /health`

## API routes

Auth:
- `POST /api/auth/register`
- `POST /api/auth/login`

Products:
- `GET /api/products` (filters + pagination)
- `GET /api/products/:id`
- `POST /api/products` (admin)

Cart:
- `POST /api/cart/add`
- `PUT /api/cart/update`
- `DELETE /api/cart/remove/:productId`
- `GET /api/cart/:userId`
- `POST /api/cart/apply-coupon`

Orders:
- `POST /api/orders`
- `GET /api/orders/:userId`
- `PUT /api/orders/status` (admin)

