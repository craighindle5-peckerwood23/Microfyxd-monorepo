import React, { useState, useRef } from 'react';
import { ChatCommandCenter } from '../ChatCommandCenter';
import { CognitiveArchitectureView } from '../CognitiveArchitectureView';
import { AutonomousEngines } from '../AutonomousEngines';
import { LeadScraperPanel } from '../LeadScraperPanel';
import { MemoryVisualizer } from '../MemoryVisualizer';
import { ExperimentSandbox } from '../ExperimentSandbox';
import { HolographicCanvas } from '../HolographicCanvas';
import { Search, Database, RefreshCw, Send, Mic, MicOff } from 'lucide-react';

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

export const MainContent: React.FC<MainContentProps> = ({
  activeTab,
  setActiveTab,
  theme,
  runLangGraphFlow,
  runAutoHealing,
  isRunning,
  traces,
  metrics,
  messages,
  setMessages,
  diagnosticState,
  currentUser,
  agentMemories,
  handleAddMemoryNode,
  handleDeleteMemoryNode,
  handleAccessMemoryNode,
  coherence,
  setCoherence
}) => {
  const isLight = theme === 'light';
  const [prompt, setPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  if (activeTab === 'command_center') {
    return (
      <main className="flex-1 p-4 sm:p-6 overflow-hidden w-full relative z-10 flex flex-col">
        <ChatCommandCenter
          onRunLangGraph={runLangGraphFlow}
          isRunning={isRunning}
          traces={traces}
          metrics={metrics}
          messages={messages}
          setMessages={setMessages}
          onAutoHeal={runAutoHealing}
          diagnosticState={diagnosticState}
          currentUser={currentUser}
          onNavigateTab={(tab: string) => setActiveTab(tab as any)}
        />
      </main>
    );
  }

  if (activeTab === 'cognitive_arch') {
    return (
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto w-full relative z-10 flex flex-col">
        <CognitiveArchitectureView onNavigateTab={(tab: string) => setActiveTab(tab as any)} />
      </main>
    );
  }

  if (activeTab === 'autonomous_engines') {
    return (
      <main className="flex-1 p-6 overflow-y-auto w-full relative z-10 flex flex-col items-center">
        <div className="w-full max-w-6xl flex flex-col items-start gap-4">
          <button 
            onClick={() => setActiveTab('command_center')} 
            className="px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/20 font-mono text-xs font-bold transition-all"
          >
            ← Return to Chat Command Center
          </button>
          <div className="w-full">
            <AutonomousEngines 
              onApplyCoherenceBoost={(boost) => setCoherence(prev => Math.min(100, Number((prev + boost).toFixed(1))))}
              systemHealth={metrics.cpu}
            />
          </div>
        </div>
      </main>
    );
  }

  if (activeTab === 'leads') {
    return (
      <main className="flex-1 p-6 overflow-y-auto w-full relative z-10 flex flex-col items-center">
        <div className="w-full max-w-6xl flex flex-col items-start gap-4">
          <button 
            onClick={() => setActiveTab('command_center')} 
            className="px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/20 font-mono text-xs font-bold transition-all"
          >
            ← Return to Chat Command Center
          </button>
          <div className="w-full">
            <LeadScraperPanel />
          </div>
        </div>
      </main>
    );
  }

  if (activeTab === 'memory') {
    return (
      <main className="flex-1 p-6 overflow-y-auto w-full relative z-10 flex flex-col items-center">
        <div className="w-full max-w-6xl flex flex-col items-start gap-4">
          <button 
            onClick={() => setActiveTab('command_center')} 
            className="px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/20 font-mono text-xs font-bold transition-all"
          >
            ← Return to Chat Command Center
          </button>
          <div className="w-full">
            <MemoryVisualizer
              memories={agentMemories}
              onAddMemory={handleAddMemoryNode}
              onDeleteMemory={handleDeleteMemoryNode}
              onAccessMemory={handleAccessMemoryNode}
              theme={theme}
            />
          </div>
        </div>
      </main>
    );
  }

  if (activeTab === 'sandbox') {
    return (
      <main className="flex-1 p-6 overflow-y-auto w-full relative z-10 flex flex-col items-center">
        <div className="w-full max-w-6xl flex flex-col items-start gap-4">
          <button 
            onClick={() => setActiveTab('command_center')} 
            className="px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/20 font-mono text-xs font-bold transition-all"
          >
            ← Return to Chat Command Center
          </button>
          <div className="w-full">
            <ExperimentSandbox theme={theme} />
          </div>
        </div>
      </main>
    );
  }

  // DEFAULT / TELEMETRY COCKPIT TAB
  return (
    <main className="relative z-10 flex-1 px-4 sm:px-8 pt-10 pb-16 flex flex-col items-center w-full overflow-y-auto">
      {/* Action Buttons Overlay */}
      <div className="absolute top-4 right-8 z-50 flex items-center gap-2">
        <button 
          onClick={() => setActiveTab('leads')} 
          className="px-4 py-2 border border-cyan-500/30 text-cyan-400 bg-cyan-500/10 rounded-lg text-xs font-mono font-bold hover:bg-cyan-500/20 transition-all flex items-center gap-2 shadow-lg"
        >
          <Search className="w-4 h-4" />
          LEAD PIPELINE
        </button>
        <button 
          onClick={() => setActiveTab('memory')} 
          className="px-4 py-2 border border-indigo-500/30 text-indigo-400 bg-indigo-500/10 rounded-lg text-xs font-mono font-bold hover:bg-indigo-500/20 transition-all flex items-center gap-2 shadow-lg"
        >
          <Database className="w-4 h-4" />
          AGENT MEMORY
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 items-center w-full max-w-6xl mb-12">
        {/* Holographic Canvas */}
        <div className={`h-[400px] w-full rounded-2xl overflow-hidden border relative shadow-2xl flex items-center justify-center ${isLight ? 'bg-slate-100 border-slate-300' : 'bg-[#0a0c13]/60 border-indigo-500/20'}`}>
          <HolographicCanvas 
            coherence={coherence} 
            isTuningActive={false}
            activeTab={activeTab}
            isSpeaking={false}
            isProcessing={isRunning}
            isListening={isListening}
            mode="full"
            theme={theme}
          />
        </div>
        
        {/* Node Pulse Map */}
        <div className="w-full flex flex-col gap-4">
          <h3 className={`font-mono text-sm font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>LangGraph Routing Matrix</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              "arcanaDirectorNode",
              "egoModelNode",
              "phenotypeNode",
              "doctrineNode",
              "memoryNode",
              "sandboxNode",
              "selfRepairNode",
              "supabaseTraceNode",
              "automotiveObdNode",
              "safetyGateNode",
              "tripleConsensusNode"
            ].map((node) => {
              const nodeLabel = node.replace('Node', '');
              const isActive = isRunning ? (Math.random() > 0.7) : (node === 'arcanaDirectorNode');
              
              return (
                <div key={node} className={`p-3 rounded-xl text-[10px] sm:text-xs text-center border font-mono transition-all duration-300 ${
                  isActive
                    ? (isLight ? 'border-indigo-500 shadow-lg bg-indigo-50 text-indigo-700 font-bold scale-[1.02]' : 'border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)] bg-indigo-900/40 text-indigo-100 font-bold scale-[1.02]')
                    : (isLight ? 'border-slate-200 bg-white text-slate-500' : 'border-indigo-900/40 bg-black/20 text-gray-400')
                }`}>
                  {nodeLabel}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Arcana Chat Panel */}
      <div className={`w-full max-w-4xl p-6 rounded-2xl border shadow-2xl flex flex-col gap-4 ${isLight ? 'bg-white border-slate-200' : 'bg-[#0b0c13]/80 border-indigo-500/30 backdrop-blur-md'}`}>
        <h3 className={`font-mono text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>Arcana Terminal</h3>
        
        <div className={`flex flex-col gap-4 overflow-y-auto h-56 p-4 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-gray-800'}`}>
          {messages.slice(-20).map((m, idx) => (
            <div key={idx} className={`flex flex-col ${m.role === 'user' ? 'items-end text-right' : 'items-start text-left'}`}>
              <span className={`text-[10px] mb-1 ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>
                {m.role === 'user' ? 'Operator' : 'Arcana'}
              </span>
              <div className={`px-4 py-2.5 rounded-xl max-w-[85%] text-xs font-mono leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/30' 
                  : (isLight ? 'bg-white text-slate-800 border border-slate-200 shadow-sm' : 'bg-gray-900/60 text-gray-300 border border-gray-800')
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          {isRunning && (
            <div className="flex flex-col items-start text-left">
              <span className={`text-[10px] mb-1 ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>Arcana</span>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono bg-indigo-600/10 text-indigo-300 border border-indigo-500/20">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing cognitive nodes...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setIsListening(!isListening)}
            className={`p-3 rounded-xl border flex items-center justify-center transition-all ${isListening ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse' : (isLight ? 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200' : 'bg-gray-900 border-gray-800 text-gray-500 hover:bg-gray-800')}`}
          >
            {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
          <input 
            type="text" 
            disabled={isRunning}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && prompt.trim() && !isRunning) {
                runLangGraphFlow(prompt);
                setPrompt('');
              }
            }}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-mono outline-none border transition-all ${
              isLight 
                ? 'bg-slate-50 border-slate-200 focus:border-indigo-400 text-slate-900 placeholder-slate-400' 
                : 'bg-[#05060a] border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 text-white placeholder-gray-600'
            }`}
            placeholder="Input command to Arcana Director Node..."
          />
          <button 
            disabled={isRunning || !prompt.trim()}
            onClick={() => {
              runLangGraphFlow(prompt);
              setPrompt('');
            }}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)]"
          >
            {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            SEND TO ARCANA
          </button>
        </div>
      </div>
    </main>
  );
};
