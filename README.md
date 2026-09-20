# ✨ Sparkle Sisterz

E-commerce storefront for **Sparkle Sisterz**, a handcrafted terracotta jewelry brand.
Customers browse the catalogue and place orders through WhatsApp; the owner manages
products and orders from a password-protected admin dashboard.

## Features

- **Storefront** — hero landing page, featured products, and a full catalogue
- **Categories** — Necklaces, Earrings, Bracelets, Rings, Anklets, Sets
- **Search & filter** by name, description, or category
- **Cart** with quantity control, persisted in the browser
- **WhatsApp checkout** — the cart is sent as a formatted order message
- **Admin dashboard** — add, edit and delete products, upload images, view orders
- **Responsive** — mobile-first, works on phone, tablet and desktop
- Prices in INR (₹)

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB (Atlas) via Mongoose |
| Images | Cloudinary (local disk fallback in development) |
| Auth | JWT + bcryptjs |

## Project structure

```
backend/          Express API
  config/         Image upload configuration
  models/         Mongoose schemas (Product, Order)
  routes/         /api/products, /api/orders, /api/admin
  middleware/     JWT auth guard
  seed.js         Loads the starter catalogue
frontend/         Next.js app
  app/            Routes (home, products, cart, admin)
  components/     Navbar, Hero, Footer, ProductCard
  context/        Cart state
```

## Running locally

**Requirements:** Node.js 20+, a MongoDB Atlas connection string.

**1. Backend**

```bash
cd backend
npm install
cp .env.example .env    # then fill in MONGODB_URI and the admin credentials
npm run seed            # optional: loads 8 sample products
npm run dev
```

The API starts on `http://localhost:5000`. Check `http://localhost:5000/api/health`.

**2. Frontend** (in a second terminal)

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The admin login is at `http://localhost:3000/admin`.

## Environment variables

Both apps read from their own file — see [`backend/.env.example`](backend/.env.example)
and [`frontend/.env.example`](frontend/.env.example) for the full list with comments.
Real `.env` files are gitignored and must never be committed.

## Deployment

The backend deploys to **Render** (blueprint in [`render.yaml`](render.yaml)) and the
frontend to **Vercel**, both from this repository.

1. **Render** — New → Blueprint → select this repo. Add every secret from
   `backend/.env.example` under Environment.
2. **Vercel** — New Project → select this repo → set **Root Directory** to `frontend`.
   Add the variables from `frontend/.env.example`, pointing `NEXT_PUBLIC_API_URL` at
   the Render URL plus `/api`.
3. Back on Render, set `FRONTEND_URL` to the Vercel URL so CORS allows it.

> Render's free tier sleeps after 15 minutes idle — the first request after a pause
> takes roughly 30 seconds to wake the server.

## Admin access

The dashboard lives at `/admin`. Credentials come from `ADMIN_USERNAME` and
`ADMIN_PASSWORD` in the backend environment; sessions are issued as JWTs signed
with `JWT_SECRET`.
