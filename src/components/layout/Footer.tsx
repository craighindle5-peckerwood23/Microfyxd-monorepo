import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#06070a] border-t border-gray-900 text-[11px] text-gray-500 font-mono px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 shrink-0">
      <div className="flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Microfyxd Enterprise Hybrid Cockpit • Authorized Access Only</span>
      </div>
      <div className="flex items-center gap-4 text-[10px] text-gray-600">
        <span>AST Auto-Healer: ACTIVE</span>
        <span>20 Subsystems: NOMINAL</span>
        <span>UTC: {new Date().toISOString().slice(0, 19).replace('T', ' ')}</span>
      </div>
    </footer>
  );
};
