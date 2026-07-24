import React, { useEffect } from 'react';
import { X, Layers, MessageSquare } from 'lucide-react';
import { ChatCommandCenter } from '../components/ChatCommandCenter';
import { CognitiveArchitectureView } from '../components/CognitiveArchitectureView';
import { AutonomousEngines } from '../components/AutonomousEngines';
import { LeadScraperPanel } from '../components/LeadScraperPanel';
import { MemoryVisualizer } from '../components/MemoryVisualizer';
import { HolographicCanvas } from '../components/HolographicCanvas';
import { ExperimentSandbox } from '../components/ExperimentSandbox';

interface MainContentProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  theme: 'dark' | 'light';
  runLangGraphFlow: (promptToRun?: string) => Promise<void>;
  runAutoHealing: () => void;
  isRunning: boolean;
  traces: any[];
  metrics: any;
  messages: any[];
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  diagnosticState: any;
  currentUser: any;
  agentMemories: any[];
  handleAddMemoryNode: (memory: any) => void;
  handleDeleteMemoryNode: (id: string) => void;
  handleAccessMemoryNode: (id: string) => void;
  coherence: number;
  setCoherence: React.Dispatch<React.SetStateAction<number>>;
}

export const MainContent: React.FC<MainContentProps> = (props) => {
  const { activeTab, setActiveTab, theme } = props;

  const isLight = theme === 'light';

  // Dismiss overlay when ESC key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeTab !== 'command_center') {
        setActiveTab('command_center');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, setActiveTab]);

  const overlayCardStyle = isLight
    ? "bg-white border border-slate-300 text-slate-900 shadow-2xl"
    : "bg-[#0b0c13] border border-indigo-500/30 text-slate-100 shadow-[0_0_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl";

  const isOverlayOpen = activeTab !== 'command_center';

  const tabTitles: Record<string, string> = {
    cognitive_arch: 'Cognitive Architecture & Graph Logic',
    leads: 'Lead Vault & HVAC Permit Scraper',
    autonomous_engines: 'Autonomous Execution Engines',
    memory: 'Agent Long-Term Memory (LTM)',
    sandbox: 'Experiment Sandbox & Code Runtime',
    cockpit: 'Telemetry Cockpit & Holographic Coherence'
  };

  return (
    <main className="flex-1 basis-[95%] min-w-[800px] p-2 sm:p-4 overflow-x-auto overflow-y-auto w-full flex flex-col h-full min-h-0 relative">
      {/* ── 1. MAIN BASE: CHAT COMMAND CENTER (Always mounted & active, taking 80%+ layout) ── */}
      <div className="flex-1 flex flex-col h-full min-h-0 w-full">
        <ChatCommandCenter
          onRunLangGraph={props.runLangGraphFlow}
          isRunning={props.isRunning}
          traces={props.traces}
          metrics={props.metrics}
          messages={props.messages}
          setMessages={props.setMessages}
          onAutoHeal={props.runAutoHealing}
          diagnosticState={props.diagnosticState}
          currentUser={props.currentUser}
          onNavigateTab={(tab: string) => props.setActiveTab(tab as any)}
        />
      </div>

      {/* ── 2. FEATURE OVERLAY MODAL (When sidebar items are pressed) ── */}
      {isOverlayOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-hidden animate-fadeIn"
          onClick={() => setActiveTab('command_center')}
        >
          <div
            className={`relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl ${overlayCardStyle} p-6 sm:p-8 flex flex-col gap-6`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* OVERLAY HEADER */}
            <div className="flex items-center justify-between border-b pb-4 border-slate-800/80 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
                      Module Overlay
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full">
                      {activeTab}
                    </span>
                  </div>
                  <h2 className={`text-lg font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {tabTitles[activeTab] || `Module View: ${activeTab}`}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('command_center')}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Return to Chat</span>
                </button>
                <button
                  onClick={() => setActiveTab('command_center')}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 border border-slate-700 transition-all cursor-pointer"
                  title="Close Overlay (ESC)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* OVERLAY BODY CONTENT */}
            <div className="flex-1 space-y-6">
              {activeTab === 'cognitive_arch' && (
                <CognitiveArchitectureView
                  onNavigateTab={(tab: string) => props.setActiveTab(tab as any)}
                />
              )}

              {activeTab === 'autonomous_engines' && (
                <AutonomousEngines
                  onApplyCoherenceBoost={(boost) =>
                    props.setCoherence((prev: number) =>
                      Math.min(100, Number((prev + boost).toFixed(1)))
                    )
                  }
                  systemHealth={props.metrics?.cpu || 98}
                />
              )}

              {activeTab === 'leads' && <LeadScraperPanel />}

              {activeTab === 'memory' && (
                <MemoryVisualizer
                  memories={props.agentMemories}
                  onAddMemory={props.handleAddMemoryNode}
                  onDeleteMemory={props.handleDeleteMemoryNode}
                  onAccessMemory={props.handleAccessMemoryNode}
                  theme={theme}
                />
              )}

              {activeTab === 'sandbox' && (
                <ExperimentSandbox
                  onApplyCoherenceBoost={(boost) =>
                    props.setCoherence((prev: number) =>
                      Math.min(100, Number((prev + boost).toFixed(1)))
                    )
                  }
                />
              )}

              {activeTab === 'cockpit' && (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between border-b pb-4 border-gray-800/60">
                    <h3 className={`font-mono text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                      Holographic Coherence Telemetry
                    </h3>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      Coherence: {props.coherence}%
                    </span>
                  </div>
                  <div className="h-[420px] w-full rounded-2xl overflow-hidden border relative flex items-center justify-center">
                    <HolographicCanvas
                      coherence={props.coherence}
                      activeTab={activeTab}
                      isProcessing={props.isRunning}
                      theme={theme}
                      mode="full"
                    />
                  </div>
                </div>
              )}

              {!['cognitive_arch', 'autonomous_engines', 'leads', 'memory', 'sandbox', 'cockpit'].includes(activeTab) && (
                <div className="flex flex-col gap-4 items-center text-center py-8">
                  <h3 className={`font-mono text-base font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>
                    Module Protocol: {activeTab.toUpperCase()}
                  </h3>
                  <p className={`text-xs max-w-md ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    You are viewing the {activeTab} overlay protocol. Select a module or return to the Chat Command Center.
                  </p>
                  <button
                    onClick={() => props.setActiveTab('command_center')}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-mono text-xs font-bold hover:bg-indigo-500 transition-all shadow-lg cursor-pointer"
                  >
                    Return to Chat Command Center
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

