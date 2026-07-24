import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#06070a]/80 backdrop-blur-xl border-t border-gray-900 text-[11px] text-gray-500 font-mono px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shrink-0">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Microfyxd Enterprise Management • Authorized Access Only</span>
      </div>
      <span>
        UTC Time: {new Date().toISOString().slice(0, 19).replace('T', ' ')}
      </span>
    </footer>
  );
};
