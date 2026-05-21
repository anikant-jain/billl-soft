import React, { useState, useEffect } from 'react';
import { Table } from '../types';
import { tableSections } from '../data';

interface TableViewProps {
  tables: Table[];
  onTableSelect: (table: Table) => void;
  onTableRefresh: (tableId: number) => void;
}

const TableView: React.FC<TableViewProps> = ({ tables, onTableSelect, onTableRefresh }) => {
  const [activeSection, setActiveSection] = useState(tableSections[0]);
  const [timers, setTimers] = useState<Record<number, number>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const next = { ...prev };
        tables.forEach((t) => {
          if (t.status === 'occupied' || t.status === 'bill-printed') {
            next[t.id] = (next[t.id] || 0) + 1;
          }
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [tables]);

  const sectionTables = tables.filter((t) => t.section === activeSection);

  const formatTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h} : ${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`;
  };

  const getTableColor = (status: string) => {
    switch (status) {
      case 'occupied': return 'text-green-600';
      case 'bill-printed': return 'text-red-600';
      default: return 'text-green-600';
    }
  };

  const getTableCircleColor = (status: string) => {
    switch (status) {
      case 'occupied': return '#8B4513';
      case 'bill-printed': return '#8B4513';
      default: return '#D2691E';
    }
  };

  return (
    <div className="flex-1 overflow-hidden bg-gray-100 flex flex-col">
      {/* Section Tabs */}
      <div className="flex gap-2 p-3 bg-white border-b border-gray-200 flex-shrink-0">
        {tableSections.map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-1.5 rounded text-sm font-semibold border transition
              ${activeSection === section
                ? 'bg-[#c0392b] text-white border-[#c0392b]'
                : 'bg-white text-gray-700 border-gray-300 hover:border-red-300'
              }`}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Tables Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-5 gap-6">
          {sectionTables.map((table) => (
            <div key={table.id} className="flex flex-col items-center">
              {/* Table Name */}
              <div className={`font-semibold text-sm mb-1 ${getTableColor(table.status)}`}>
                {table.name}
              </div>

              {/* Refresh Icon */}
              <button
                onClick={() => onTableRefresh(table.id)}
                className="text-green-500 hover:text-green-700 mb-1 text-xs"
                title="Refresh"
              >
                🔄
              </button>

              {/* Table SVG */}
              <button
                onClick={() => onTableSelect(table)}
                className="relative group"
                title={`${table.name} - ${table.status}`}
              >
                <TableIcon color={getTableCircleColor(table.status)} status={table.status} />
              </button>

              {/* Timer & Actions for occupied tables */}
              {(table.status === 'occupied' || table.status === 'bill-printed') && (
                <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
                  <button className="hover:text-gray-800" title="Transfer">↔</button>
                  <button className="hover:text-gray-800" title="Add">+</button>
                </div>
              )}
              {(table.status === 'occupied' || table.status === 'bill-printed') && timers[table.id] && (
                <div className="text-xs text-gray-600 mt-0.5">{formatTimer(timers[table.id] || 0)}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TableIcon: React.FC<{ color: string; status: string }> = ({ color, status }) => (
  <svg width="90" height="90" viewBox="0 0 100 100" className="hover:opacity-80 transition">
    {/* Chair Top */}
    <rect x="35" y="2" width="30" height="18" rx="4" fill={color} opacity="0.8" />
    {/* Chair Bottom */}
    <rect x="35" y="80" width="30" height="18" rx="4" fill={color} opacity="0.8" />
    {/* Chair Left */}
    <rect x="2" y="35" width="18" height="30" rx="4" fill={color} opacity="0.8" />
    {/* Chair Right */}
    <rect x="80" y="35" width="18" height="30" rx="4" fill={color} opacity="0.8" />
    {/* Table Circle */}
    <circle cx="50" cy="50" r="26" fill={color} />
    {/* Bill Printed overlay */}
    {status === 'bill-printed' && (
      <>
        <circle cx="50" cy="50" r="26" fill="#c0392b" opacity="0.85" />
        <text x="50" y="47" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">BILL</text>
        <text x="50" y="57" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">PRINTED</text>
      </>
    )}
  </svg>
);

export default TableView;
