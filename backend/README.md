# Backend API

This Flask application fornece uma API REST simples para fornecedores, produtos e pedidos de compra.
Agora ele se conecta a um banco de dados PostgreSQL utilizando SQLAlchemy.
Defina o URL do banco em um arquivo `.env` usando a variável `DATABASE_URL`.
Exemplo de conteúdo do `.env`:

```
DATABASE_URL=postgresql://usuario:senha@localhost:5432/banco
```

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

Start the application (o arquivo `.env` deve ter sido configurado):

```bash
cp ../.env.example ../.env  # apenas se ainda não existir
python app.py
```

The API will listen on port 5000. Na primeira execução o banco é criado
automaticamente com um fornecedor e um produto de exemplo.
