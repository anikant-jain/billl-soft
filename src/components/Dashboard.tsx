import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { Order } from '../types';

interface DashboardProps {
  orders: Order[];
}

const COLORS = ['#E91E63', '#2196F3', '#4CAF50', '#FF9800', '#9C27B0'];

const Dashboard: React.FC<DashboardProps> = ({ orders }) => {
  const [analysisTab, setAnalysisTab] = useState<'sales' | 'payment' | 'online' | 'graphical'>('payment');

  const monthlyOrders = orders.length;
  const monthlyRevenue = orders.reduce((sum, o) => {
    const subtotal = o.items.reduce((s, i) => s + i.menuItem.price * i.quantity, 0);
    return sum + Math.round(subtotal * 1.05);
  }, 0);

  const paymentData = orders.reduce((acc: Record<string, number>, order) => {
    const mode = order.paymentMode || 'cash';
    const subtotal = order.items.reduce((s, i) => s + i.menuItem.price * i.quantity, 0);
    const total = Math.round(subtotal * 1.05);
    acc[mode] = (acc[mode] || 0) + total;
    return acc;
  }, {});

  const paymentChartData = Object.entries(paymentData).map(([name, value]) => ({ name, value }));
  if (paymentChartData.length === 0) {
    paymentChartData.push({ name: 'cash', value: 902 }, { name: 'paytm', value: 209 });
  }

  const salesData = [
    { day: 'Mon', orders: 15, revenue: 12500 },
    { day: 'Tue', orders: 22, revenue: 18700 },
    { day: 'Wed', orders: 18, revenue: 15200 },
    { day: 'Thu', orders: 30, revenue: 24300 },
    { day: 'Fri', orders: 25, revenue: 21000 },
    { day: 'Sat', orders: 40, revenue: 35500 },
    { day: 'Sun', orders: 35, revenue: 30200 },
  ];

  const summaryCards = [
    {
      label: 'Monthly Order Placed',
      value: monthlyOrders || 105,
      valueColor: 'text-red-500',
      barColor: 'bg-red-500',
    },
    {
      label: 'Monthly Revenue',
      value: `₹${(monthlyRevenue || 105729).toLocaleString()}/-`,
      valueColor: 'text-blue-500',
      barColor: 'bg-blue-500',
    },
    {
      label: 'Monthly Lent Amount',
      value: `₹${687}/-`,
      valueColor: 'text-green-500',
      barColor: 'bg-green-500',
    },
    {
      label: 'Customer Feedback',
      value: 0,
      valueColor: 'text-orange-500',
      barColor: 'bg-orange-500',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 p-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg shadow p-4 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <p className="text-sm text-gray-500 font-medium leading-tight">{card.label}</p>
              <span className={`text-xl font-bold ${card.valueColor}`}>{card.value}</span>
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-1 ${card.barColor}`}></div>
          </div>
        ))}
      </div>

      {/* Analysis Tabs */}
      <div className="flex gap-1 px-4 mb-4">
        {[
          { key: 'sales', label: 'SALES ANALYSIS' },
          { key: 'payment', label: 'PAYMENT ANALYSIS' },
          { key: 'online', label: 'ONLINE PAYMENT ANALYSIS' },
          { key: 'graphical', label: 'GRAPHICAL ANALYSIS' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setAnalysisTab(tab.key as typeof analysisTab)}
            className={`px-4 py-2 text-sm font-semibold border rounded transition
              ${analysisTab === tab.key
                ? 'border-[#c0392b] text-[#c0392b] bg-white'
                : 'border-gray-300 text-gray-600 bg-white hover:border-red-300'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Analysis Content */}
      <div className="px-4 pb-4">
        {analysisTab === 'payment' && (
          <div className="grid grid-cols-2 gap-4">
            {/* Pie Chart */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="h-4 bg-[#c0392b] rounded-t -mt-4 -mx-4 mb-3"></div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={paymentChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {paymentChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Payment Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-[#c0392b] text-white px-4 py-3 flex items-center gap-2">
                <span>💳</span>
                <span className="font-semibold">payment</span>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-center text-gray-700 font-semibold">Payment Mode</th>
                    <th className="px-4 py-3 text-right text-gray-700 font-semibold">Quantity (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentChartData.map((row, idx) => (
                    <tr key={row.name} className={`border-t ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-4 py-3 text-center text-gray-600">{row.name}</td>
                      <td className="px-4 py-3 text-right font-medium">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {analysisTab === 'sales' && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="h-4 bg-[#c0392b] rounded-t -mt-4 -mx-4 mb-3"></div>
            <h3 className="font-semibold text-gray-700 mb-3">Weekly Sales Analysis</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#c0392b" name="Orders" />
                <Bar dataKey="revenue" fill="#3498db" name="Revenue (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {analysisTab === 'graphical' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="h-4 bg-[#c0392b] rounded-t -mt-4 -mx-4 mb-3"></div>
              <h3 className="font-semibold text-gray-700 mb-3">Order Type Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Dine In', value: 60 },
                      { name: 'Take Away', value: 25 },
                      { name: 'Door Delivery', value: 10 },
                      { name: 'Online', value: 5 },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label
                  >
                    {[0, 1, 2, 3].map((index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="h-4 bg-[#c0392b] rounded-t -mt-4 -mx-4 mb-3"></div>
              <h3 className="font-semibold text-gray-700 mb-3">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#c0392b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {analysisTab === 'online' && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="h-4 bg-[#c0392b] rounded-t -mt-4 -mx-4 mb-3"></div>
            <h3 className="font-semibold text-gray-700 mb-3">Online Payment Analysis</h3>
            <div className="text-center text-gray-400 py-12">
              <span className="text-5xl">💳</span>
              <p className="mt-3">No online payment data available</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="px-4 pb-4 grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="text-[#c0392b]">🍴</span> Today's Summary
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Orders</span>
              <span className="font-medium">{orders.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Revenue</span>
              <span className="font-medium text-green-600">₹{monthlyRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Pending</span>
              <span className="font-medium text-orange-500">{orders.filter((o) => o.status === 'pending').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Completed</span>
              <span className="font-medium text-green-600">{orders.filter((o) => o.status === 'completed').length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="text-[#c0392b]">🏆</span> Top Items
          </h3>
          <div className="space-y-2 text-sm">
            {['Margherita Pizza', 'BBQ Burger', 'Biriyani Rice', 'Fried Chicken', 'Cold Coffee'].map((item, idx) => (
              <div key={item} className="flex justify-between items-center">
                <span className="text-gray-600">{idx + 1}. {item}</span>
                <span className="text-[#c0392b] font-medium">{15 - idx * 2} orders</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="text-[#c0392b]">📊</span> Order Types
          </h3>
          <div className="space-y-2 text-sm">
            {[
              { label: 'Dine In', count: orders.filter((o) => o.orderType === 'dine-in').length || 8, color: 'bg-red-500' },
              { label: 'Take Away', count: orders.filter((o) => o.orderType === 'take-away').length || 3, color: 'bg-blue-500' },
              { label: 'Door Delivery', count: orders.filter((o) => o.orderType === 'door-delivery').length || 2, color: 'bg-green-500' },
              { label: 'Online', count: orders.filter((o) => o.orderType === 'online').length || 0, color: 'bg-orange-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between mb-0.5">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`${item.color} h-1.5 rounded-full`}
                    style={{ width: `${Math.min(100, (item.count / Math.max(1, orders.length)) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
