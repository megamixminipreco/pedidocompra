from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


db = SQLAlchemy()


class Fornecedor(db.Model):
    __tablename__ = 'fornecedor'
    id = db.Column(db.Integer, primary_key=True)
    razaosocial = db.Column(db.String(40))
    nomefantasia = db.Column(db.String(60))
    pedidominimoqtd = db.Column(db.Integer)
    pedidominimovalor = db.Column(db.Numeric(11, 2))


class Produto(db.Model):
    __tablename__ = 'produto'
    id = db.Column(db.Integer, primary_key=True)
    descricaocompleta = db.Column(db.String(60))
    descricaoreduzida = db.Column(db.String(22))
    qtdembalagem = db.Column(db.Integer)


class ProdutoComplemento(db.Model):
    __tablename__ = 'produtocomplemento'
    id = db.Column(db.Integer, primary_key=True)
    id_produto = db.Column(db.Integer, db.ForeignKey('produto.id'))
    id_loja = db.Column(db.Integer)
    estoque = db.Column(db.Numeric(12, 3))
    precovenda = db.Column(db.Numeric(11, 4))
    custocomimposto = db.Column(db.Numeric(13, 4))

    produto = db.relationship('Produto')


class Pedido(db.Model):
    __tablename__ = 'pedido'
    id = db.Column(db.Integer, primary_key=True)
    id_loja = db.Column(db.Integer)
    id_fornecedor = db.Column(db.Integer, db.ForeignKey('fornecedor.id'), nullable=False)
    id_tipofretepedido = db.Column(db.Integer)
    datacompra = db.Column(db.Date, default=datetime.utcnow)
    dataentrega = db.Column(db.Date)
    valortotal = db.Column(db.Numeric(11, 2), default=0)
    id_situacaopedido = db.Column(db.Integer)
    observacao = db.Column(db.String(1500))
    id_comprador = db.Column(db.Integer)
    id_precotacaofornecedor = db.Column(db.Integer)
    id_tipoatendidopedido = db.Column(db.Integer)
    liberadodivergenciacomprador = db.Column(db.Boolean)
    valorfrete = db.Column(db.Numeric(11, 4))

    fornecedor = db.relationship('Fornecedor')
    items = db.relationship('PedidoItem', cascade='all, delete-orphan')


class PedidoItem(db.Model):
    __tablename__ = 'pedidoitem'
    id = db.Column(db.Integer, primary_key=True)
    id_pedido = db.Column(db.Integer, db.ForeignKey('pedido.id'), nullable=False)
    id_produto = db.Column(db.Integer, db.ForeignKey('produto.id'), nullable=False)
    quantidade = db.Column(db.Numeric(12, 3), nullable=False)
    qtdembalagem = db.Column(db.Integer)
    custocompra = db.Column(db.Numeric(13, 4))
    dataentrega = db.Column(db.Date)
    valortotal = db.Column(db.Numeric(11, 2))
    quantidadeatendida = db.Column(db.Numeric(12, 3))
    id_tipopedido = db.Column(db.Integer)
    custofinal = db.Column(db.Numeric(13, 4))

    produto = db.relationship('Produto')
