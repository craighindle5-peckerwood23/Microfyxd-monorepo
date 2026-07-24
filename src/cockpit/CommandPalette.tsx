import React, { useState } from 'react';
import { Search, Terminal, Zap, Brain, Database, Compass, MessageSquare, ShieldAlert } from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onCommand: (action: string) => void;
  theme: 'dark' | 'light';
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onClose,
  onCommand,
  theme,
}) => {
  const [query, setQuery] = useState('');

  const commands = [
    { label: 'Run LangGraph Flow', action: 'runLangGraph', icon: Zap },
    { label: 'Run Auto-Healing Diagnostics', action: 'autoHeal', icon: ShieldAlert },
    { label: 'Go to Command Center', action: 'navcommandcenter', icon: MessageSquare },
    { label: 'Go to Cognitive Architecture', action: 'navcognitivearch', icon: Brain },
    { label: 'Go to Lead Vault & Permits', action: 'nav_leads', icon: Search },
    { label: 'Go to Agent Memory (LTM)', action: 'nav_memory', icon: Database },
    { label: 'Go to Autonomous Engines', action: 'nav_engines', icon: Zap },
    { label: 'Go to Experiment Sandbox', action: 'nav_sandbox', icon: Terminal },
    { label: 'Go to Telemetry Cockpit', action: 'nav_cockpit', icon: Compass },
  ];

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  if (!open) return null;

  const isLight = theme === 'light';

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-start justify-center pt-24 z-[999] p-4"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-xl rounded-2xl p-5 border shadow-2xl transition-all ${
          isLight
            ? 'bg-white border-slate-200'
            : 'bg-[#0b0c13]/95 border-indigo-500/30 text-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b pb-3 mb-3 border-gray-800">
          <Terminal className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search modules..."
            className={`w-full font-mono text-sm outline-none bg-transparent ${
              isLight ? 'text-slate-900 placeholder-slate-400' : 'text-indigo-200 placeholder-gray-500'
            }`}
          />
          <kbd className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-400">
            ESC
          </kbd>
        </div>

        <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.action}
                  onClick={() => onCommand(cmd.action)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl font-mono text-xs flex items-center justify-between transition-all cursor-pointer ${
                    isLight
                      ? 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                      : 'hover:bg-indigo-600/20 text-indigo-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-indigo-400" />
                    <span>{cmd.label}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 uppercase">Action</span>
                </button>
              );
            })
          ) : (
            <div className="p-4 text-center text-xs font-mono text-gray-500">
              No matching commands found.
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 rounded-xl bg-gray-800/40 hover:bg-gray-700/40 text-gray-300 font-mono text-xs transition-all cursor-pointer"
        >
          Close Palette
        </button>
      </div>
    </div>
  );
};
