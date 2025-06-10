# Purchase Order System

This project contains a small demonstration of a purchase order system for supermarkets.
It features a Python (Flask) backend usando PostgreSQL via SQLAlchemy e um frontend React
construído com Vite. O código é inspirado nas especificações de uma plataforma inteligente de compras.

## Structure

- `backend/` – Flask REST API with models for suppliers, products and orders
- `frontend/` – React application used to interact with the API

## Running

1. Start the backend

```bash
cd backend
pip install -r requirements.txt
export DATABASE_URL=postgresql://usuario:senha@localhost:5432/banco
python app.py
```

2. In another terminal, start the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at <http://localhost:5173> and proxies API calls to
localhost:5000 where the Flask server runs.
