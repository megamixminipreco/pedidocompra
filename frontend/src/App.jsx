import React, { useEffect, useState, useMemo } from 'react';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Cpu, FileSpreadsheet, PiggyBank,
  ShieldCheck, ShoppingCart, Sparkles, Target, TrendingUp, Zap
} from 'lucide-react';

// Componentes auxiliares
const MetricCard = ({ title, value, icon, trend }) => {
  const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-indigo-400';
  return (
    <div className="bg-gray-800 rounded-lg p-4 flex items-center">
      <div className={`p-3 rounded-lg ${trend === 'up' ? 'bg-green-900/50' : trend === 'down' ? 'bg-red-900/50' : 'bg-indigo-900/50'}`}>{icon}</div>
      <div className="ml-4">
        <div className="text-sm text-gray-400">{title}</div>
        <div className={`text-xl font-bold text-white ${trendColor}`}>{value}</div>
      </div>
    </div>
  );
};

// Tela inicial para selecionar fornecedores
const NewOrderStartScreen = ({ onStart }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetch('/api/suppliers').then(r => r.json()).then(setSuppliers);
  }, []);

  const toggle = id => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-3xl font-bold text-white">Novo Pedido</h1>
      <p className="text-gray-400">Selecione os fornecedores desejados</p>
      <ul className="space-y-2">
        {suppliers.map(s => (
          <li key={s.id} className="flex items-center gap-2">
            <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggle(s.id)} />
            <span>{s.name}</span>
          </li>
        ))}
      </ul>
      <button
        disabled={selected.length === 0}
        onClick={() => onStart(suppliers.filter(s => selected.includes(s.id)))}
        className="px-6 py-2 bg-indigo-600 text-white rounded-md disabled:bg-gray-600"
      >
        Iniciar Pedido
      </button>
    </div>
  );
};

// Modal resumido de análise (somente mostra info de IA fictícia)
const AnalysisModal = ({ product, onClose, onAction }) => {
  const [quantity, setQuantity] = useState(product.orderQty || product.suggestion);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-xl p-4 space-y-4">
        <h3 className="text-lg font-bold text-white mb-2">{product.description}</h3>
        <p className="text-sm text-gray-400">Sugestão da IA: {product.suggestion} unidades</p>
        <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-full p-2 bg-gray-700 text-white rounded" />
        <div className="text-right space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded text-white">Cancelar</button>
          <button onClick={() => { onAction({ ...product, quantity }); onClose(); }} className="px-4 py-2 bg-indigo-600 rounded text-white">Atualizar</button>
        </div>
      </div>
    </div>
  );
};

// Tela principal com grade de produtos e consolidação
const MultiOrderScreen = ({ suppliers, onBack, onFinalize }) => {
  const [products, setProducts] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(data => {
      setProducts(data);
      const supplierIds = suppliers.map(s => s.id);
      const rows = data.map(p => ({ ...p, orderQty: '', winnerSupplierId: supplierIds[0] || '' }));
      setGridData(rows);
    });
  }, [suppliers]);

  const handleGridChange = (productId, field, value) => {
    setGridData(prev => prev.map(r => r.id === productId ? { ...r, [field]: value } : r));
  };

  const openAnalysis = (prod) => {
    setSelectedProduct(prod);
    setIsModalOpen(true);
  };

  const handleUpdateFromModal = (updated) => {
    handleGridChange(updated.id, 'orderQty', updated.quantity);
  };

  const stagedOrders = useMemo(() => {
    const orders = {};
    gridData.filter(i => i.winnerSupplierId && Number(i.orderQty) > 0).forEach(item => {
      const supplierId = parseInt(item.winnerSupplierId, 10);
      if (!orders[supplierId]) {
        orders[supplierId] = { supplier: suppliers.find(s => s.id === supplierId), items: [], total: 0 };
      }
      orders[supplierId].items.push(item);
    });
    return orders;
  }, [gridData, suppliers]);

  return (
    <div className="animate-fade-in">
      {isModalOpen && selectedProduct && (
        <AnalysisModal product={selectedProduct} onClose={() => setIsModalOpen(false)} onAction={handleUpdateFromModal} />
      )}
      <header className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Painel de Compra</h1>
          <p className="text-gray-400">{suppliers.length} fornecedores selecionados</p>
        </div>
        <button onClick={onBack} className="flex items-center gap-2 bg-gray-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-600">
          <ArrowLeft size={16}/> <span>Voltar</span>
        </button>
      </header>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard title="Ruptura Evitada" value="92%" icon={<ShieldCheck size={20}/>} trend="up" />
        <MetricCard title="Redução de Excesso" value="35%" icon={<TrendingUp size={20}/>} trend="down" />
        <MetricCard title="Economia Mensal" value="R$ 24.760" icon={<PiggyBank size={20}/>} />
        <MetricCard title="Precisão IA" value="96.7%" icon={<Target size={20}/>} />
      </div>

      <button onClick={() => setGridData(prev => prev.map(i => ({ ...i, orderQty: i.suggestion })))} className="mb-4 flex items-center gap-2 bg-blue-600 py-2 px-4 rounded-md hover:bg-blue-700">
        <Sparkles className="mr-1"/> Preencher com Sugestões de IA
      </button>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
          <FileSpreadsheet className="mr-3 text-indigo-400"/>Grade de Produtos
        </h2>
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-700 text-xs uppercase text-gray-400">
              <tr>
                <th className="px-4 py-3">Produto</th>
                <th className="px-4 py-3 text-center">Estoque</th>
                <th className="px-4 py-3 text-center">Sugestão</th>
                <th className="px-4 py-3">Fornecedor</th>
                <th className="px-4 py-3 text-center">Qtd.</th>
              </tr>
            </thead>
            <tbody>
              {gridData.map(p => (
                <tr key={p.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="px-4 py-2 font-medium text-white">
                    {p.description}
                    <button onClick={() => openAnalysis(p)} className="text-indigo-400 ml-2 text-xs">
                      <Zap size={12}/> analisar
                    </button>
                  </td>
                  <td className="px-4 py-2 text-center">{p.stock}</td>
                  <td className="px-4 py-2 text-center text-indigo-300 font-bold">{p.suggestion}</td>
                  <td className="px-4 py-2">
                    <select value={p.winnerSupplierId} onChange={e => handleGridChange(p.id, 'winnerSupplierId', e.target.value)} className="w-full bg-gray-700 text-white rounded-md p-2 text-sm">
                      <option value="">Selecione...</option>
                      {suppliers.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input type="number" className="w-20 bg-gray-700 rounded-md p-2 text-center" value={p.orderQty} onChange={e => handleGridChange(p.id, 'orderQty', e.target.value)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
          <ShoppingCart className="mr-3 text-green-400"/>Pedidos em Consolidação
        </h2>
        <div className="space-y-4">
          {Object.keys(stagedOrders).length === 0 ? (
            <p className="text-gray-500 text-center py-4">Defina quantidades e fornecedores para consolidar.</p>
          ) : (
            Object.keys(stagedOrders).map(id => {
              const order = stagedOrders[id];
              return (
                <div key={id} className="bg-gray-800 rounded-lg p-4 border-l-4 border-indigo-500">
                  <h3 className="font-semibold text-lg text-indigo-300">{order.supplier.name}</h3>
                  <p className="text-sm text-gray-400">{order.items.length} itens</p>
                </div>
              );
            })
          )}
        </div>
        <div className="mt-6 text-right">
          <button onClick={() => onFinalize(stagedOrders)} className="bg-green-600 text-white font-bold py-3 px-8 rounded-md hover:bg-green-700 flex items-center gap-2 ml-auto disabled:bg-green-800" disabled={Object.keys(stagedOrders).length === 0}>
            <Cpu size={18}/> Enviar para Agente
          </button>
        </div>
      </div>
    </div>
  );
};

const OrderAgentScreen = ({ orders, onBackToStart }) => {
  const submit = async () => {
    for (const supplierId of Object.keys(orders)) {
      const order = orders[supplierId];
      const body = {
        supplier_id: parseInt(supplierId, 10),
        items: order.items.map(i => ({ product_id: i.id, quantity: i.orderQty, cost: 0 }))
      };
      await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    }
    alert('Pedidos enviados!');
    onBackToStart();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Agente de Compra</h1>
      <p className="text-gray-400">{Object.keys(orders).length} pedidos serão processados.</p>
      <button onClick={submit} className="px-6 py-2 bg-indigo-600 text-white rounded-md">Confirmar Envio</button>
    </div>
  );
};

export default function App() {
  const [mode, setMode] = useState('start');
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [finalizedOrders, setFinalizedOrders] = useState({});

  const handleStart = (suppliers) => {
    setSelectedSuppliers(suppliers);
    setMode('multi');
  };

  const handleBack = () => {
    setMode('start');
    setSelectedSuppliers([]);
    setFinalizedOrders({});
  };

  const handleFinalize = (orders) => {
    setFinalizedOrders(orders);
    setMode('agent');
  };

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen font-sans p-6">
      {mode === 'start' && <NewOrderStartScreen onStart={handleStart} />}
      {mode === 'multi' && <MultiOrderScreen suppliers={selectedSuppliers} onBack={handleBack} onFinalize={handleFinalize} />}
      {mode === 'agent' && <OrderAgentScreen orders={finalizedOrders} onBackToStart={handleBack} />}
    </div>
  );
}
