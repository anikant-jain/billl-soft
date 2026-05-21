import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  currentView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: 'tables', label: 'Home', icon: '🏠' },
  { id: 'allorders', label: 'All Order', icon: '📋' },
  { id: 'dashboard', label: 'Sales Summary', icon: '📊' },
  { id: 'aggregator', label: 'Aggregator', icon: '🚩' },
  { id: 'takeaway', label: 'Take Away', icon: '🚶' },
  { id: 'doordelivery', label: 'Door Delivery', icon: '🍽️' },
  { id: 'dinein', label: 'Dine-in Orders', icon: '🍴' },
  { id: 'menustatus', label: 'Menu Status', icon: '🏷️' },
  { id: 'expense', label: 'Expense', icon: '💲' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, currentView, onViewChange }) => {
  return (
    <div
      className={`fixed left-0 top-0 h-full bg-[#2c3e50] text-white z-50 transition-all duration-300 flex flex-col
        ${isOpen ? 'w-56' : 'w-0 overflow-hidden'}`}
    >
      <div className="p-4 border-b border-white/20">
        <div className="text-xl font-bold text-white">DIGIRESTRO</div>
        <div className="text-xs text-gray-300">28/02/2029 (2260 days)</div>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-yellow-400">💲</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition
              ${currentView === item.id
                ? 'bg-white/20 text-white'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
