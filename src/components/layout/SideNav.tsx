import React from 'react';
import { 
  MessageSquare, 
  Brain, 
  Search, 
  Zap, 
  Database, 
  Compass, 
  Activity, 
  Shield, 
  Layers, 
  Sliders, 
  Terminal, 
  Code, 
  Workflow, 
  BookOpen, 
  Globe
} from 'lucide-react';

interface SideNavProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  theme: 'dark' | 'light';
}

export const SideNav: React.FC<SideNavProps> = ({ activeTab, setActiveTab, theme }) => {
  const isLight = theme === 'light';

  const navItems = [
    { id: 'command_center', label: 'Chat Command Center', icon: MessageSquare, badge: 'Main', group: 'Core' },
    { id: 'cognitive_arch', label: 'Cognitive Arch (20 Nodes)', icon: Brain, badge: '20 Subsystems', group: 'Core' },
    { id: 'leads', label: 'Lead Vault & Permits', icon: Search, badge: 'HVAC Scraper', group: 'Core' },
    { id: 'autonomous_engines', label: 'Autonomous Engines', icon: Zap, badge: 'Active', group: 'Core' },
    { id: 'memory', label: 'Agent Memory & LTM', icon: Database, badge: 'Vector', group: 'Core' },
    { id: 'cockpit', label: 'Telemetry Cockpit', icon: Compass, badge: '3D Hologram', group: 'Core' },
    { id: 'quantum_tuning', label: 'Bio-Neural Calibration', icon: Sliders, group: 'System' },
    { id: 'sandbox', label: 'Experiment Sandbox', icon: Code, group: 'System' },
    { id: 'integrations', label: 'Workspace & Integrations', icon: Globe, group: 'System' },
  ];

  return (
    <aside className={`w-64 shrink-0 flex flex-col border-r transition-colors duration-300 ${
      isLight ? 'bg-white border-slate-200' : 'bg-[#08090f] border-gray-800/80'
    }`}>
      {/* BRAND HEADER */}
      <div className={`p-4 border-b flex items-center gap-3 ${
        isLight ? 'border-slate-200' : 'border-gray-800/80'
      }`}>
        <div className="bg-gradient-to-tr from-indigo-500 via-purple-500 to-rose-500 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
          <Brain className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className={`font-black text-base tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Microfyxd
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 font-bold border border-indigo-500/20">
              v2.5
            </span>
          </div>
          <p className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
            Hybrid Multi-Agent Cockpit
          </p>
        </div>
      </div>

      {/* NAVIGATION LIST */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className={`px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider ${
          isLight ? 'text-slate-400' : 'text-gray-500'
        }`}>
          Navigation Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-md shadow-indigo-500/20'
                  : isLight
                  ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  : 'text-gray-400 hover:bg-gray-900/60 hover:text-gray-200'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : isLight ? 'text-slate-500' : 'text-gray-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono shrink-0 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : isLight
                    ? 'bg-slate-100 text-slate-500'
                    : 'bg-gray-800 text-gray-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* FOOTER SYSTEM BADGE */}
      <div className={`p-3 border-t text-[10px] font-mono ${
        isLight ? 'border-slate-200 text-slate-500 bg-slate-50' : 'border-gray-800/80 text-gray-500 bg-[#05060a]'
      }`}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>LangGraph Engine Online</span>
        </div>
      </div>
    </aside>
  );
};
