import React, { useState } from 'react';
import { Order } from '../types';

interface PendingOrdersProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onSync: () => void;
}

const PendingOrders: React.FC<PendingOrdersProps> = ({ orders, onViewOrder, onSync }) => {
  const [search, setSearch] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = orders.filter((o) =>
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.tableNo.toLowerCase().includes(search.toLowerCase()) ||
    (o.customerName || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / entriesPerPage);
  const paginated = filtered.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const calcTotals = (order: Order) => {
    const subtotal = order.items.reduce((s, i) => s + i.menuItem.price * i.quantity, 0);
    const gst = subtotal * 0.05;
    const total = subtotal + gst;
    return { subtotal, gst, total: Math.round(total) };
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {/* Note */}
      <div className="flex items-center justify-between bg-gray-100 border border-gray-200 rounded p-3 mb-4">
        <p className="text-sm text-gray-700">
          <span className="text-red-600 font-semibold">*Note: </span>
          Use SYNC ORDERS Button If orders showing completed, but still showing in Pending orders List
        </p>
        <button
          onClick={onSync}
          className="flex items-center gap-2 bg-gray-700 text-white rounded px-4 py-1.5 text-sm font-semibold hover:bg-gray-800 transition"
        >
          🔄 SYNC ORDERS
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Show</span>
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            className="border border-gray-300 rounded px-1 py-0.5"
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <span>entries</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Search:</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#c0392b] text-white">
              <th className="px-3 py-2 text-left w-8"></th>
              <th className="px-3 py-2 text-left cursor-pointer hover:bg-red-700">
                Payment Status ↕
              </th>
              <th className="px-3 py-2 text-left cursor-pointer hover:bg-red-700">Order Id ↕</th>
              <th className="px-3 py-2 text-left cursor-pointer hover:bg-red-700">Date & Time ↕</th>
              <th className="px-3 py-2 text-left cursor-pointer hover:bg-red-700">Table No ↕</th>
              <th className="px-3 py-2 text-left cursor-pointer hover:bg-red-700">Rider ↕</th>
              <th className="px-3 py-2 text-left cursor-pointer hover:bg-red-700">Customer ↕</th>
              <th className="px-3 py-2 text-left cursor-pointer hover:bg-red-700">Table Status ↕</th>
              <th className="px-3 py-2 text-right cursor-pointer hover:bg-red-700">Total Amount (₹) ↕</th>
              <th className="px-3 py-2 text-right cursor-pointer hover:bg-red-700">Discount (%) ↕</th>
              <th className="px-3 py-2 text-right cursor-pointer hover:bg-red-700">Total GST ↕</th>
              <th className="px-3 py-2 text-right cursor-pointer hover:bg-red-700">Charges (%) ↕</th>
              <th className="px-3 py-2 text-right cursor-pointer hover:bg-red-700">Total Paid Amount (₹) ↕</th>
              <th className="px-3 py-2 text-center cursor-pointer hover:bg-red-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={14} className="text-center py-8 text-gray-400">No pending orders found</td>
              </tr>
            ) : (
              paginated.map((order, idx) => {
                const { subtotal, gst, total } = calcTotals(order);
                const dt = new Date(order.createdAt);
                const dateStr = `${dt.getFullYear()}-${(dt.getMonth() + 1).toString().padStart(2, '0')}-${dt.getDate().toString().padStart(2, '0')} ${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}`;
                return (
                  <tr key={order.id} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-red-50 transition`}>
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={selected.includes(order.id)}
                        onChange={() => toggleSelect(order.id)}
                        className="accent-red-500"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        order.paymentMode ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.paymentMode ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-medium text-blue-700">{order.id}</td>
                    <td className="px-3 py-2 text-gray-600">{dateStr}</td>
                    <td className="px-3 py-2">{order.tableNo}</td>
                    <td className="px-3 py-2 text-gray-400">--</td>
                    <td className="px-3 py-2 text-gray-400">{order.customerName || '--'}</td>
                    <td className="px-3 py-2">
                      <span className="text-gray-600">{order.status}</span>
                    </td>
                    <td className="px-3 py-2 text-right">{subtotal.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right">{(order.discount || 0).toFixed(1)}</td>
                    <td className="px-3 py-2 text-right">{gst.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right">{(order.charges || 0).toFixed(2)}</td>
                    <td className="px-3 py-2 text-right font-medium">{total.toFixed(2)}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onViewOrder(order)}
                          className="text-gray-500 hover:text-blue-600 p-1"
                          title="View"
                        >
                          👁️
                        </button>
                        <button className="text-gray-500 hover:text-green-600 p-1" title="Refresh">
                          🔄
                        </button>
                        <button className="text-gray-500 hover:text-red-600 p-1" title="Print">
                          🖨️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
        <span>
          Showing {Math.min((currentPage - 1) * entriesPerPage + 1, filtered.length)} to{' '}
          {Math.min(currentPage * entriesPerPage, filtered.length)} of {filtered.length} entries
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-[#c0392b] text-white border-[#c0392b]' : 'border-gray-300 hover:bg-gray-100'}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingOrders;
