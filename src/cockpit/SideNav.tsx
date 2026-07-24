import React from 'react';
import { MessageSquare, Brain, Database, Zap, Compass, Search, Code2 } from 'lucide-react';

interface SideNavProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  theme: 'dark' | 'light';
}

export const SideNav: React.FC<SideNavProps> = ({ activeTab, setActiveTab, theme }) => {
  const base =
    "flex flex-col items-center justify-center gap-1 p-2 rounded-xl text-[10px] font-mono transition-all cursor-pointer w-full text-center group relative";
  const inactive =
    theme === 'light'
      ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
      : "text-slate-400 hover:text-white hover:bg-slate-800/60";
  const active =
    "bg-gradient-to-br from-cyan-500 to-indigo-600 text-slate-950 font-bold shadow-lg shadow-indigo-500/30";

  const handleTabClick = (tab: string) => {
    if (activeTab === tab && tab !== 'command_center') {
      setActiveTab('command_center');
    } else {
      setActiveTab(tab);
    }
  };

  const btn = (tab: string, shortLabel: string, Icon: any, extra?: string) => (
    <button
      key={tab}
      onClick={() => handleTabClick(tab)}
      title={shortLabel}
      className={`${base} ${activeTab === tab ? active : inactive}`}
    >
      <Icon className={`w-4 h-4 shrink-0 ${activeTab === tab ? 'text-slate-950' : extra || ''}`} />
      <span className="truncate max-w-full text-[9px] leading-tight tracking-tighter">
        {shortLabel}
      </span>
    </button>
  );

  return (
    <aside
      className={`w-16 sm:w-20 shrink-0 border-r flex flex-col items-center gap-3 p-2 backdrop-blur-xl transition-colors duration-300 select-none ${
        theme === 'light'
          ? 'bg-white/80 border-slate-200'
          : 'bg-[#0b0c13]/80 border-gray-800'
      }`}
    >
      {/* Header Logo Badge */}
      <div className="flex flex-col items-center justify-center gap-1 py-1">
        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
        <span className={`text-[9px] font-mono font-bold tracking-widest uppercase ${theme === 'light' ? 'text-slate-700' : 'text-slate-400'}`}>
          MFX
        </span>
      </div>

      {/* Navigation Rail */}
      <nav className="flex flex-col gap-1.5 flex-1 w-full overflow-y-auto pr-0.5 scrollbar-none items-center">
        {btn('command_center', 'Chat', MessageSquare)}
        {btn('cognitive_arch', 'Cognitive', Brain, 'text-indigo-400')}
        {btn('leads', 'Leads', Search, 'text-cyan-400')}
        {btn('autonomous_engines', 'Engines', Zap, 'text-amber-400')}
        {btn('memory', 'Memory', Database, 'text-purple-400')}
        {btn('sandbox', 'Sandbox', Code2, 'text-emerald-400')}
        {btn('cockpit', 'Cockpit', Compass, 'text-cyan-400')}
      </nav>

      {/* Footer Status */}
      <div className={`p-1.5 rounded-lg border text-[9px] font-mono w-full text-center ${
        theme === 'light' ? 'bg-slate-100/80 border-slate-200 text-slate-600' : 'bg-black/40 border-gray-800/80 text-gray-500'
      }`}>
        <span className="text-emerald-400 font-bold block text-[8px] tracking-wider">LIVE</span>
      </div>
    </aside>
  );
};


