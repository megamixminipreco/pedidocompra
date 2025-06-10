from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from datetime import datetime
from dotenv import load_dotenv

from models import db, Fornecedor, Produto, Pedido, PedidoItem, ProdutoComplemento

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, '.env'))

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/pedidodb')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)

db.init_app(app)

@app.route('/api/suppliers')
def get_suppliers():
    suppliers = Fornecedor.query.all()
    return jsonify([
        {
            'id': s.id,
            'name': s.nomefantasia or s.razaosocial,
            'min_order_qty': s.pedidominimoqtd,
            'min_order_value': float(s.pedidominimovalor or 0)
        }
        for s in suppliers
    ])

@app.route('/api/products')
def get_products():
    products = (
        db.session.query(Produto, ProdutoComplemento)
        .join(ProdutoComplemento, Produto.id == ProdutoComplemento.id_produto)
        .filter(ProdutoComplemento.id_loja == 1)
        .all()
    )
    result = []
    for prod, comp in products:
        result.append({
            'id': prod.id,
            'description': prod.descricaocompleta,
            'stock': float(comp.estoque or 0),
            'suggestion': 0
        })
    return jsonify(result)

@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.get_json()
    supplier_id = data.get('supplier_id')
    items = data.get('items', [])
    supplier = Fornecedor.query.get_or_404(supplier_id)
    order = Pedido(id_fornecedor=supplier.id, datacompra=datetime.utcnow())
    total = 0
    for it in items:
        product = Produto.query.get_or_404(it['product_id'])
        qty = float(it['quantity'])
        cost = float(it.get('cost', 0))
        order.items.append(PedidoItem(id_produto=product.id, quantidade=qty, custocompra=cost, valortotal=qty*cost))
        total += qty * cost
    order.valortotal = total
    db.session.add(order)
    db.session.commit()
    return jsonify({'id': order.id}), 201

@app.route('/api/orders')
def list_orders():
    orders = Pedido.query.all()
    result = []
    for o in orders:
        result.append({
            'id': o.id,
            'supplier': o.fornecedor.nomefantasia or o.fornecedor.razaosocial,
            'created_at': o.datacompra.isoformat() if o.datacompra else '',
            'total': float(o.valortotal or 0),
            'items': [
                {
                    'product': item.produto.descricaocompleta,
                    'quantity': float(item.quantidade),
                    'cost': float(item.custocompra or 0)
                } for item in o.items
            ]
        })
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
