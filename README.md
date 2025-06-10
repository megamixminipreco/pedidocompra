# Purchase Order System

This project contains a small demonstration of a purchase order system for supermarkets.
It features a Python (Flask) backend usando PostgreSQL via SQLAlchemy e um frontend React
construído com Vite. A interface inclui um painel de compra com gráficos (usando
`recharts`) e um assistente de IA fictício para análise de produtos, seguindo as
especificações de uma plataforma inteligente de compras.

## Structure

- `backend/` – Flask REST API with models for suppliers, products and orders
- `frontend/` – React application used to interact with the API

## Running

1. Start the backend

```bash
cd backend
pip install -r requirements.txt
cp ../.env.example ../.env  # configure DATABASE_URL dentro do arquivo
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
