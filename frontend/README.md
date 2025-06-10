# Frontend

This directory contains a React application built with Vite. It communicates with the Flask
backend to list products and suppliers and to create purchase orders. The interface fetches
the supplier and product data from `/api/suppliers` and `/api/products` when you start a new
order.

## Usage

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

During development requests to `/api` are proxied to `localhost:5000`.
