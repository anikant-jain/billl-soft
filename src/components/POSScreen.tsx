import React, { useState, useRef } from 'react';
import { MenuItem, OrderItem, Order } from '../types';
import { menuCategories, menuItems } from '../data';
import BillModal from './BillModal';
import CustomerModal from './CustomerModal';

interface POSScreenProps {
  orderType: 'dine-in' | 'take-away' | 'door-delivery' | 'online';
  tableNo: string;
  onOrderSaved: (order: Order) => void;
  onBack?: () => void;
}

const POSScreen: React.FC<POSScreenProps> = ({ orderType, tableNo, onOrderSaved, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState(menuCategories[0]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBill, setShowBill] = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [selectedTable] = useState(tableNo || 'Table : 1');
  const nextId = useRef(1);

  const filteredItems = menuItems.filter(
    (item) =>
      item.category === selectedCategory &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addItem = (menuItem: MenuItem) => {
    const existing = orderItems.find((o) => o.menuItem.id === menuItem.id);
    if (existing) {
      setOrderItems(orderItems.map((o) =>
        o.menuItem.id === menuItem.id ? { ...o, quantity: o.quantity + 1 } : o
      ));
    } else {
      setOrderItems([...orderItems, {
        id: nextId.current++,
        menuItem,
        quantity: 1,
        remark: '',
      }]);
    }
  };

  const updateQuantity = (id: number, qty: number) => {
    if (qty <= 0) {
      setOrderItems(orderItems.filter((o) => o.id !== id));
    } else {
      setOrderItems(orderItems.map((o) => o.id === id ? { ...o, quantity: qty } : o));
    }
  };

  const subtotal = orderItems.reduce((sum, o) => sum + o.menuItem.price * o.quantity, 0);
  const cgst = subtotal * 0.025;
  const sgst = subtotal * 0.025;
  const total = subtotal + cgst + sgst;
  const roundOff = Math.round(total) - total;
  const grandTotal = Math.round(total);

  const buildOrder = (): Order => ({
    id: `TDO-R${Math.floor(10000 + Math.random() * 90000)}`,
    tableNo: selectedTable,
    orderType,
    items: orderItems,
    status: 'pending',
    createdAt: new Date(),
    discount: 0,
    charges: 0,
  });

  const handleSaveKOT = () => {
    if (orderItems.length === 0) return;
    const order = buildOrder();
    onOrderSaved(order);
    alert('KOT Saved Successfully!');
  };

  const handlePrintBill = () => {
    if (orderItems.length === 0) return;
    const order = buildOrder();
    setCurrentOrder(order);
    setShowBill(true);
  };

  const handleCancelItems = () => {
    setOrderItems([]);
  };

  const orderTypeLabel = {
    'dine-in': 'Dine In',
    'take-away': 'Take Away',
    'door-delivery': 'Door Delivery',
    'online': 'Online',
  }[orderType];

  const now = new Date();
  const dateStr = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Left: Menu */}
      <div className="flex flex-1 overflow-hidden bg-gray-100">
        {/* Category Sidebar */}
        <div className="w-36 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
          {menuCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-3 py-3 text-sm font-medium border-b border-gray-100 transition
                ${selectedCategory === cat
                  ? 'bg-red-50 text-red-600 border-l-4 border-l-red-500'
                  : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search */}
          <div className="p-3 bg-white border-b border-gray-200">
            <div className="flex items-center gap-2">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex-shrink-0 px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-600 transition"
                  title="Back to Tables"
                >
                  ← Tables
                </button>
              )}
              <input
                type="text"
                placeholder="Search items... ✕ To Clear"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-gray-400 hover:text-gray-600 px-2"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-3 gap-3">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => addItem(item)}
                  className="bg-white rounded-lg p-3 text-center border border-gray-200 hover:border-red-300 hover:shadow-md transition cursor-pointer"
                >
                  <div className="font-medium text-gray-800 text-sm mb-1">{item.name}</div>
                  <div className="text-red-500 text-sm font-medium">(Rs. {item.price})</div>
                </button>
              ))}
              {filteredItems.length === 0 && (
                <div className="col-span-3 text-center text-gray-400 py-10">
                  No items found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Order Panel */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col flex-shrink-0">
        {/* Order Info Header */}
        <div className="bg-gray-50 border-b border-gray-200 p-2">
          <div className="flex items-center justify-between gap-1 text-xs">
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded px-2 py-1">
              <span>🪑</span>
              <span className="font-medium">{selectedTable}</span>
            </div>
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded px-2 py-1">
              <span>🍴</span>
              <span className="font-medium">{orderTypeLabel}</span>
            </div>
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded px-2 py-1">
              <span>📋</span>
            </div>
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded px-2 py-1">
              <span>🕐</span>
              <span className="font-medium text-xs">{dateStr}</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="flex-1 overflow-y-auto">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-gray-800 text-white text-xs px-2 py-2 sticky top-0">
            <div className="col-span-4">Item Name</div>
            <div className="col-span-3 text-center">Quantity</div>
            <div className="col-span-2 text-right">Unit Price</div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-1 text-center">✏️</div>
          </div>

          {orderItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm">
              <span className="text-3xl mb-2">🛒</span>
              No items added yet
            </div>
          ) : (
            orderItems.map((item) => (
              <div key={item.id} className={`grid grid-cols-12 items-center px-2 py-2 border-b border-gray-100 text-xs
                ${item.toAdd ? 'bg-green-50' : ''}`}>
                <div className="col-span-4 font-medium text-gray-800 leading-tight">
                  {item.menuItem.name}
                  {item.remark && (
                    <div className="text-green-600 text-xs mt-0.5 bg-green-100 px-1 rounded">
                      To Add: {item.remark}
                    </div>
                  )}
                </div>
                <div className="col-span-3 flex items-center justify-center gap-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-5 h-5 bg-gray-100 rounded text-gray-600 hover:bg-gray-200 flex items-center justify-center"
                  >−</button>
                  <span className="w-5 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-5 h-5 bg-gray-100 rounded text-gray-600 hover:bg-gray-200 flex items-center justify-center"
                  >+</button>
                </div>
                <div className="col-span-2 text-right text-gray-700">{item.menuItem.price.toFixed(2)}</div>
                <div className="col-span-2 text-right text-gray-800 font-medium">
                  {(item.menuItem.price * item.quantity).toFixed(2)}
                </div>
                <div className="col-span-1 text-center">
                  <button className="text-gray-400 hover:text-gray-600">✏️</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Total */}
        <div className="border-t border-gray-300 p-3 bg-gray-50">
          <div className="flex justify-between items-center text-sm font-semibold text-gray-800">
            <span>Total Amount(Rs.)</span>
            <span className="text-base">{total.toFixed(2)}/-</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-2 border-t border-gray-200 grid grid-cols-3 gap-1">
          <button
            onClick={handleSaveKOT}
            className="col-span-1 flex items-center justify-center gap-1 bg-gray-700 text-white rounded px-2 py-2 text-xs font-semibold hover:bg-gray-800 transition"
          >
            💾 SAVE KOT
          </button>
          <button
            onClick={handleSaveKOT}
            className="col-span-1 flex items-center justify-center gap-1 bg-gray-600 text-white rounded px-2 py-2 text-xs font-semibold hover:bg-gray-700 transition"
          >
            📤 SAVE & PRINT KOT
          </button>
          <button
            onClick={handlePrintBill}
            className="col-span-1 flex items-center justify-center gap-1 bg-[#c0392b] text-white rounded px-2 py-2 text-xs font-semibold hover:bg-red-700 transition"
          >
            🖨️ PRINT/VIEW BILL
          </button>
        </div>
        <div className="p-2 pt-0 grid grid-cols-2 gap-1">
          <button
            onClick={handleCancelItems}
            className="flex items-center justify-center gap-1 bg-red-500 text-white rounded px-2 py-2 text-xs font-semibold hover:bg-red-600 transition"
          >
            ✕ CANCEL ITEMS
          </button>
          <button
            className="flex items-center justify-center gap-1 bg-blue-500 text-white rounded px-2 py-2 text-xs font-semibold hover:bg-blue-600 transition"
          >
            🖨️ REPRINT
          </button>
        </div>
      </div>

      {/* Bill Modal */}
      {showBill && currentOrder && (
        <BillModal
          order={currentOrder}
          orderItems={orderItems}
          subtotal={subtotal}
          cgst={cgst}
          sgst={sgst}
          total={total}
          roundOff={roundOff}
          grandTotal={grandTotal}
          onClose={() => setShowBill(false)}
          onSaveOrder={(order) => {
            onOrderSaved(order);
            setOrderItems([]);
            setShowBill(false);
          }}
        />
      )}

      {/* Customer Modal */}
      {showCustomer && (
        <CustomerModal onClose={() => setShowCustomer(false)} />
      )}
    </div>
  );
};

export default POSScreen;
