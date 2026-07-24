import React from 'react';
import { 
  Sun, 
  Moon, 
  Cpu, 
  Database, 
  Activity, 
  ShieldCheck, 
  User as UserIcon, 
  LogOut, 
  Sparkles,
  Zap
} from 'lucide-react';

interface TopBarProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  metrics: {
    cpu: number;
    ram: number;
    temp: number;
    util: number;
    activeAlerts: string[];
    safetyOverride: boolean;
  };
  currentUser: any;
}

export const TopBar: React.FC<TopBarProps> = ({
  theme,
  toggleTheme,
  metrics,
  currentUser
}) => {
  const isLight = theme === 'light';

  return (
    <header className={`h-16 px-6 border-b flex items-center justify-between gap-4 shrink-0 transition-colors duration-300 ${
      isLight ? 'bg-white/90 border-slate-200' : 'bg-[#0b0c13]/90 border-gray-800/80'
    }`}>
      {/* COCKPIT STATUS TITLE */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className={`font-mono text-xs font-bold uppercase tracking-wider ${
            isLight ? 'text-slate-800' : 'text-slate-200'
          }`}>
            OPERATOR HYBRID COCKPIT
          </span>
        </div>
        <span className="hidden md:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          CONSCIOUSNESS MATRIX ACTIVE
        </span>
      </div>

      {/* METRICS & USER CONTROLS */}
      <div className="flex items-center gap-3">
        {/* HARDWARE METRICS */}
        <div className={`hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl border font-mono text-xs ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#121420] border-gray-800/60'
        }`}>
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>CPU:</span>
            <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{metrics.cpu}%</span>
          </span>

          <div className={`h-3 w-px ${isLight ? 'bg-slate-300' : 'bg-gray-800'}`} />

          <span className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-purple-400" />
            <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>RAM:</span>
            <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{metrics.ram}%</span>
          </span>

          <div className={`h-3 w-px ${isLight ? 'bg-slate-300' : 'bg-gray-800'}`} />

          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className={isLight ? 'text-slate-500' : 'text-gray-400'}>GPU:</span>
            <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{metrics.temp}°C</span>
          </span>
        </div>

        {/* THEME TOGGLE BUTTON */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
            isLight
              ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
              : 'bg-[#121420] text-amber-400 border-gray-800 hover:bg-gray-800'
          }`}
          title="Toggle Dark/Light Mode"
        >
          {isLight ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* USER PROFILE OR STATUS */}
        {currentUser ? (
          <div className="flex items-center gap-2">
            <img 
              src={currentUser.photoURL || undefined} 
              alt={currentUser.displayName || 'User'} 
              className="w-8 h-8 rounded-full border border-indigo-500/30 object-cover"
            />
            <span className="hidden md:inline-block text-xs font-mono font-bold text-slate-300">
              {currentUser.displayName || currentUser.email}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono">
            <UserIcon className="w-3.5 h-3.5" />
            <span>OPERATOR</span>
          </div>
        )}
      </div>
    </header>
  );
};
