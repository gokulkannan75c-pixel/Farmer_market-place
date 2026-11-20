# Field & Fork — Farmer Marketplace

A beginner-friendly MERN marketplace starter: React + Vite for the storefront, Express for the API, and MongoDB with Mongoose for product listings.

## What it does

- Browse fresh produce listings and filter by category.
- Search by product, farmer, or location.
- Publish a product listing with price, quantity, farmer, and location.
- Save listings in MongoDB.

## Run it step by step

### 1. Install Node.js and MongoDB

Install Node.js (which includes npm) and have a MongoDB server available locally, or create a MongoDB Atlas database.

### 2. Configure the API

In a terminal from the project folder:

```powershell
Copy-Item server\.env.example server\.env
```

Edit `server\.env` and set `MONGODB_URI` to your local or Atlas connection string. Keep database credentials private.

### 3. Install dependencies

```powershell
npm install
npm run install:all
```

### 4. Start the app

Make sure MongoDB is running, then run:

```powershell
npm run dev
```

Open the Vite URL printed in the terminal (usually `http://localhost:5173`). The API runs on `http://localhost:5000`.

### 5. Add a listing

Select **Sell your harvest**, fill in the product details, and publish. Your listing is saved to MongoDB and appears in the market.

## API

- `GET /api/health` — API health check
- `GET /api/products?search=tomato&category=Vegetables` — browse and filter listings
- `POST /api/products` — create a listing

## Production build

```powershell
npm run build
```

## Current MVP boundaries

This starter does not yet include user accounts, payments, image uploads, or order management. Product images can be provided as public image URLs.
