import React from 'react';
import { OrderType } from '../types';

interface HeaderProps {
  activeTab: OrderType;
  setActiveTab: (tab: OrderType) => void;
  pendingCount?: number;
  onlineCount: number;
  onMenuToggle: () => void;
  view?: string;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onlineCount, onMenuToggle }) => {
  const tabs: { key: OrderType; label: string }[] = [
    { key: 'dine-in', label: 'DINE IN' },
    { key: 'take-away', label: 'TAKE AWAY' },
    { key: 'door-delivery', label: 'DOOR DELIVERY' },
    { key: 'online', label: 'ONLINE ORDERS' },
    { key: 'pending', label: 'PENDING ORDERS' },
  ];

  return (
    <header className="bg-[#c0392b] text-white flex items-center h-14 px-2 z-50 shadow-md flex-shrink-0">
      <button
        className="mr-3 p-2 hover:bg-white/20 rounded transition"
        onClick={onMenuToggle}
      >
        <div className="space-y-1">
          <span className="block w-5 h-0.5 bg-white"></span>
          <span className="block w-5 h-0.5 bg-white"></span>
          <span className="block w-5 h-0.5 bg-white"></span>
        </div>
      </button>

      <nav className="flex items-center flex-1 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative px-4 py-2 text-sm font-semibold tracking-wide transition rounded
              ${activeTab === tab.key
                ? 'bg-white text-[#c0392b]'
                : 'hover:bg-white/20 text-white'
              }`}
          >
            {tab.label}
            {tab.key === 'online' && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {onlineCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3 ml-auto">
        {/* Toggle */}
        <div className="flex items-center gap-1">
          <div className="relative">
            <div className="w-10 h-5 bg-blue-400 rounded-full flex items-center px-0.5">
              <div className="w-4 h-4 bg-white rounded-full ml-auto shadow"></div>
            </div>
          </div>
        </div>

        {/* WiFi */}
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>

        {/* User */}
        <div className="flex items-center gap-1">
          <div className="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
          <span className="text-sm font-medium">Toodo</span>
        </div>

        {/* More */}
        <button className="p-1 hover:bg-white/20 rounded">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
