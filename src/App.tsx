import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import POSScreen from './components/POSScreen';
import TableView from './components/TableView';
import PendingOrders from './components/PendingOrders';
import Dashboard from './components/Dashboard';
import { Order, OrderType, Table } from './types';
import { initialTables, sampleOrders } from './data';

type ViewMode = 'pos' | 'tables' | 'pending' | 'dashboard' | 'allorders' | string;

function App() {
  const [activeTab, setActiveTab] = useState<OrderType>('dine-in');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('tables');
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [posContext, setPosContext] = useState<{
    orderType: 'dine-in' | 'take-away' | 'door-delivery' | 'online';
    tableNo: string;
  }>({ orderType: 'dine-in', tableNo: 'Table : 1' });

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const onlineCount = orders.filter((o) => o.orderType === 'online' && o.status === 'pending').length;

  // When activeTab changes, update the view accordingly
  useEffect(() => {
    if (activeTab === 'pending') {
      setViewMode('pending');
    } else if (activeTab === 'dine-in') {
      setViewMode('tables');
    } else {
      // For take-away, door-delivery, online - go straight to POS
      setPosContext({
        orderType: activeTab as 'take-away' | 'door-delivery' | 'online',
        tableNo: activeTab === 'take-away' ? 'Take Away' : activeTab === 'door-delivery' ? 'Door Delivery' : 'Online',
      });
      setViewMode('pos');
    }
  }, [activeTab]);

  const handleTableSelect = (table: Table) => {
    setSelectedTable(table);
    setPosContext({ orderType: 'dine-in', tableNo: table.name });
    setViewMode('pos');
    // Mark table as occupied
    setTables((prev) =>
      prev.map((t) => t.id === table.id ? { ...t, status: 'occupied' } : t)
    );
  };

  const handleOrderSaved = (order: Order) => {
    setOrders((prev) => {
      const exists = prev.find((o) => o.id === order.id);
      if (exists) return prev.map((o) => o.id === order.id ? order : o);
      return [...prev, order];
    });
    // If table order, update table status
    if (order.orderType === 'dine-in' && selectedTable) {
      const status = order.status === 'completed' ? 'available' : 'occupied';
      setTables((prev) =>
        prev.map((t) => t.id === selectedTable.id ? { ...t, status, orderId: order.id } : t)
      );
      if (order.status === 'completed') {
        setSelectedTable(null);
        setViewMode('tables');
      }
    }
  };

  const handleTableRefresh = (tableId: number) => {
    setTables((prev) =>
      prev.map((t) => t.id === tableId ? { ...t, status: 'available', orderId: undefined } : t)
    );
  };

  const handleSidebarView = (view: string) => {
    if (view === 'tables') {
      setViewMode('tables');
      setActiveTab('dine-in');
    } else if (view === 'dashboard') {
      setViewMode('dashboard');
    } else if (view === 'allorders') {
      setViewMode('pending');
    } else {
      setViewMode(view);
    }
    setSidebarOpen(false);
  };

  const handleSync = () => {
    // Simulate syncing - remove completed orders from pending
    setOrders((prev) => prev.filter((o) => o.status !== 'completed'));
  };

  const handleViewOrder = (order: Order) => {
    // Find the table and open POS with that order
    setPosContext({ orderType: order.orderType, tableNo: order.tableNo });
    setViewMode('pos');
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-100 font-sans">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar
        isOpen={sidebarOpen}
        currentView={viewMode}
        onViewChange={handleSidebarView}
      />

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingCount}
        onlineCount={onlineCount}
        onMenuToggle={() => setSidebarOpen((prev) => !prev)}
        view={viewMode}
      />

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden">
        {/* Dine-in: Show Table View or POS */}
        {viewMode === 'tables' && (
          <TableView
            tables={tables}
            onTableSelect={handleTableSelect}
            onTableRefresh={handleTableRefresh}
          />
        )}

        {viewMode === 'pos' && (
          <POSScreen
            orderType={posContext.orderType}
            tableNo={posContext.tableNo}
            onOrderSaved={handleOrderSaved}
            onBack={posContext.orderType === 'dine-in' ? () => setViewMode('tables') : undefined}
          />
        )}

        {viewMode === 'pending' && (
          <PendingOrders
            orders={orders}
            onViewOrder={handleViewOrder}
            onSync={handleSync}
          />
        )}

        {viewMode === 'dashboard' && (
          <Dashboard orders={orders} />
        )}

        {/* Other views placeholder */}
        {!['tables', 'pos', 'pending', 'dashboard'].includes(viewMode) && (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <span className="text-6xl">🚧</span>
              <p className="text-xl mt-4 font-medium">
                {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} - Coming Soon
              </p>
              <p className="text-sm mt-2">This section is under development</p>
            </div>
          </div>
        )}
      </main>

      {/* Status Bar */}
      <div className="bg-[#2c3e50] text-white text-xs px-4 py-1 flex items-center justify-between flex-shrink-0">
        <span>DigiRestro POS v2.0 | Restaurant Billing Software</span>
        <span className="flex items-center gap-3">
          <span className={`flex items-center gap-1 ${pendingCount > 0 ? 'text-orange-400' : 'text-green-400'}`}>
            ● {pendingCount > 0 ? `${pendingCount} Pending Orders` : 'All Orders Clear'}
          </span>
          <span>
            {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            {' '}
            {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </span>
      </div>
    </div>
  );
}

export default App;
