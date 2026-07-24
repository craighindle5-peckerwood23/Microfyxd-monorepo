import React from 'react';
import { Cpu, Database, Activity, Sun, Moon, Terminal } from 'lucide-react';

interface TopBarProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  metrics: {
    cpu: number;
    ram: number;
    temp: number;
    util?: number;
    activeAlerts?: string[];
    safetyOverride?: boolean;
  };
  currentUser: any;
  onOpenPalette: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  theme,
  toggleTheme,
  metrics,
  currentUser,
  onOpenPalette,
}) => {
  return (
    <header
      className={`h-16 px-6 border-b flex items-center justify-between gap-4 backdrop-blur-xl shrink-0 transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-slate-100/70 border-slate-200'
          : 'bg-[#0e1018]/70 border-gray-800'
      }`}
    >
      <div className="flex flex-col">
        <span className="font-mono text-[11px] font-bold text-indigo-400">
          Microfyxd Enterprise System
        </span>
        <span className={`font-mono text-[10px] ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
          {currentUser ? `Operator: ${currentUser.email || currentUser.displayName || 'Authenticated'}` : 'Operator: Unauthenticated'}
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs">
        <button
          onClick={onOpenPalette}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-mono text-xs border border-indigo-500/30 shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span>⌘K Command Palette</span>
        </button>

        <button
          onClick={toggleTheme}
          className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 font-mono transition-all cursor-pointer ${
            theme === 'light'
              ? 'bg-white/70 border-slate-300 text-slate-700 hover:bg-white'
              : 'bg-[#121420]/70 border-gray-700 text-indigo-300 hover:bg-gray-800'
          }`}
        >
          {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          <span className="text-xs">{theme === 'light' ? 'Dark' : 'Light'}</span>
        </button>

        <div className={`hidden sm:flex border rounded-xl p-2 px-3 items-center gap-3 backdrop-blur-xl ${
          theme === 'light' ? 'bg-white/80 border-slate-200' : 'bg-black/20 border-gray-800'
        }`}>
          <span className="flex items-center gap-1.5 font-mono text-indigo-300 text-xs">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" /> {metrics.cpu}%
          </span>
          <span className="flex items-center gap-1.5 font-mono text-purple-300 text-xs">
            <Database className="w-3.5 h-3.5 text-purple-400" /> {metrics.ram}%
          </span>
          <span className="flex items-center gap-1.5 font-mono text-emerald-300 text-xs">
            <Activity className="w-3.5 h-3.5 text-emerald-400" /> {metrics.temp}°C
          </span>
        </div>
      </div>
    </header>
  );
};
