# Backend API

This Flask application fornece uma API REST simples para fornecedores, produtos e pedidos de compra.
Agora ele se conecta a um banco de dados PostgreSQL utilizando SQLAlchemy.
Defina a variável de ambiente `DATABASE_URL` com a string de conexão, por exemplo:
`postgresql://usuario:senha@localhost:5432/banco`.

## Endpoints

- `GET /api/suppliers` – list suppliers
- `GET /api/products` – list products
- `POST /api/orders` – create a new order (JSON body)
- `GET /api/orders` – list orders with their items

## Running

Create a virtual environment and install dependencies:

```bash
pip install -r requirements.txt
```

Start the application (certifique-se de informar o `DATABASE_URL`):

```bash
export DATABASE_URL=postgresql://usuario:senha@localhost:5432/banco
python app.py
```

The API will listen on port 5000.
