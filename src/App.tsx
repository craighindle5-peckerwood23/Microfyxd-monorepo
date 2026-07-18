import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  Terminal, 
  Cpu, 
  Layers, 
  Shield, 
  Activity, 
  Database, 
  Code, 
  FileCode, 
  Settings, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  ChevronRight, 
  RefreshCw, 
  Sliders, 
  Eye, 
  BookOpen, 
  UserCheck, 
  Compass,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

interface TraceLog {
  stepId: string;
  nodeId: string;
  timestamp: string;
  logs: string[];
  stateUpdate: any;
  egoIntrospection?: string;
  label: string;
}

interface MonorepoFile {
  path: string;
  label: string;
  content: string;
}

export default function App() {
  // Navigation & UI state
  const [activeTab, setActiveTab] = useState<'traces' | 'files' | 'phenotype' | 'ego' | 'infra' | 'sandbox' | 'memory' | 'doctrine'>('traces');
  
  // Interactive Simulator parameters
  const [prompt, setPrompt] = useState<string>('Diagnose coolant temperature warning and propose safety ECUs adjust map.');
  const [hardwareOverride, setHardwareOverride] = useState<string>('dgx-h100');
  const [arcanaTier, setArcanaTier] = useState<number>(3);
  const [sandboxCode, setSandboxCode] = useState<string>(
    `// Microfyxd Code Workspace - Syntax Error Diagnostic\nimport { someHelper }\n\nconst bugVar\n\nfunction processECU() {\n  console.log("Reading ECU Telemetry...")\n  // Unclosed brackets below will trigger sandbox compilation failure\n  if (bugVar === undefined) {\n    return "unresolved"`
  );

  // Dynamic Graph execution state
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'assistant',
      content: `### Welcome to Microfyxd AI Enterprise System Cockpit
Microfyxd is an advanced, high-assurance multi-agent platform orchestrated strictly via **LangGraph**.

**How to test the system**:
- Enter a prompt in the **Operator Input** or choose one of the quick presets below.
- Click **Run Workspace Task**.
- Watch the **LangGraph Execution Pipeline** illuminate step-by-step as each node performs specialized computations (e.g., phenotype readings, ego introspection, self-checking compliance, and sandbox compilation diagnostics).
- Inspect the resulting step-by-step trace logs, or browse the complete **Monorepo File Explorer** in the side panel!`,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [traces, setTraces] = useState<TraceLog[]>([]);
  const [selectedTrace, setSelectedTrace] = useState<TraceLog | null>(null);
  const [monorepoFiles, setMonorepoFiles] = useState<MonorepoFile[]>([]);
  const [selectedFilePath, setSelectedFilePath] = useState<string>('microfyxd/packages/agent/index.ts');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [simulatedNodeIndex, setSimulatedNodeIndex] = useState<number>(-1);

  // Watchdog & Metrics
  const [metrics, setMetrics] = useState({
    cpu: 12,
    ram: 24,
    temp: 51,
    util: 10,
    activeAlerts: [] as string[],
    safetyOverride: false
  });

  // End of scroll ref
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load monorepo files on mount
  useEffect(() => {
    fetchMonorepoFiles();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isRunning]);

  const fetchMonorepoFiles = async () => {
    try {
      const res = await fetch('/api/files');
      const data = await res.json();
      if (data.files) {
        setMonorepoFiles(data.files);
      }
    } catch (e) {
      console.error('Failed to fetch monorepo files', e);
    }
  };

  // Node execution order for UI visual progress representation
  const graphNodesSequence = [
    { id: 'phenotypeReadNode', label: 'Phenotype Scan' },
    { id: 'gpuDetectNode', label: 'GPU Detect' },
    { id: 'egoModelNode', label: 'Ego Introspect' },
    { id: 'selfCheckNode', label: 'Watchdog Check' },
    { id: 'diagnoseNode', label: 'Sandbox Diagnosis' },
    { id: 'repairNode', label: 'Self-Repair' },
    { id: 'retryNode', label: 'Compile Verify' },
    { id: 'humanInTheLoopNode', label: 'Human Clearance' },
    { id: 'finalMergeNode', label: 'Triple Consensus' }
  ];

  // Helper to trigger the full LangGraph flow
  const runLangGraphFlow = async (customPrompt?: string, customCode?: string) => {
    if (isRunning) return;
    
    const activePrompt = customPrompt || prompt;
    const activeCode = customCode !== undefined ? customCode : (activePrompt.toLowerCase().includes('repair') ? sandboxCode : '');

    setIsRunning(true);
    setTraces([]);
    setSelectedTrace(null);
    setSimulatedNodeIndex(0);
    setActiveNodeId(graphNodesSequence[0].id);

    // Append user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: activePrompt,
      timestamp: new Date().toLocaleTimeString()
    }]);

    // Visual sequence animator simulation before rendering real traces
    let step = 0;
    const stepInterval = setInterval(() => {
      step++;
      if (step < graphNodesSequence.length) {
        setSimulatedNodeIndex(step);
        setActiveNodeId(graphNodesSequence[step].id);
      } else {
        clearInterval(stepInterval);
      }
    }, 450);

    try {
      // Call real Express backend to execute LangGraph state machine!
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: activePrompt,
          sourceCode: activeCode,
          hardwareOverride,
          arcanaTier
        })
      });

      const data = await response.json();
      clearInterval(stepInterval); // stop visual fallback if fast

      if (data.success && data.finalState) {
        // Staggered delivery of traces for maximum visual epicness!
        const backendTraces = data.finalState.traces;
        setTraces(backendTraces);
        if (backendTraces.length > 0) {
          setSelectedTrace(backendTraces[backendTraces.length - 1]);
        }

        // Apply updated metrics from state
        const watchdog = data.finalState.watchdog;
        const infra = data.finalState.infrastructure;
        setMetrics({
          cpu: watchdog.cpuUsagePercent || 15,
          ram: watchdog.ramUsagePercent || 26,
          temp: Math.max(...(infra.availableGpus?.map((g: any) => g.temperatureC) || [50])),
          util: Math.max(...(infra.availableGpus?.map((g: any) => g.utilizationPercent) || [10])),
          activeAlerts: watchdog.activeAlerts || [],
          safetyOverride: watchdog.safetyOverrideEngaged || false
        });

        // Append assistant response
        const lastMsg = data.finalState.messages[data.finalState.messages.length - 1];
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: lastMsg.content,
          timestamp: new Date().toLocaleTimeString()
        }]);
      } else {
        throw new Error(data.error || 'Unknown runtime compilation failure.');
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: 'system',
        content: `⛔ **LangGraph Runtime Error**: ${err.message || err}`,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsRunning(false);
      setActiveNodeId(null);
      setSimulatedNodeIndex(-1);
    }
  };

  const selectedFile = monorepoFiles.find(f => f.path === selectedFilePath);

  return (
    <div className="min-h-screen bg-[#08090d] text-gray-200 font-sans flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* GLOWING SYSTEM HEADER */}
      <header className="border-b border-gray-800/80 bg-[#0b0c13]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-lg text-white shadow-lg shadow-indigo-500/20 ring-1 ring-white/15">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-sans font-bold text-lg tracking-tight text-white">Microfyxd</h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v2.5-ENTERPRISE
              </span>
            </div>
            <p className="text-xs text-gray-400">LangGraph-First Dynamic Multi-Agent Control Cockpit</p>
          </div>
        </div>

        {/* METRIC PILLS */}
        <div className="flex items-center gap-3 text-xs">
          <div className="bg-[#121420] border border-gray-800/60 rounded-lg p-2 flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-gray-400 font-mono">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              CPU: <span className="text-white font-semibold">{metrics.cpu}%</span>
            </span>
            <div className="h-3 w-px bg-gray-800" />
            <span className="flex items-center gap-1.5 text-gray-400 font-mono">
              <Database className="w-3.5 h-3.5 text-purple-400" />
              RAM: <span className="text-white font-semibold">{metrics.ram}%</span>
            </span>
            <div className="h-3 w-px bg-gray-800" />
            <span className="flex items-center gap-1.5 text-gray-400 font-mono">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              GPU Temp: <span className="text-white font-semibold">{metrics.temp}°C</span>
            </span>
          </div>

          <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border font-mono text-[11px] ${
            metrics.safetyOverride 
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${metrics.safetyOverride ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
            {metrics.safetyOverride ? 'WATCHDOG TRIGGERED' : 'SYSTEM HEALTHY'}
          </div>
        </div>
      </header>

      {/* CORE SPLIT WORKSPACE */}
      <main className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 p-6 overflow-hidden">
        
        {/* LEFT COLUMN: OPERATOR TERMINAL & COGNITIVE CHATBOX (xl:span-5) */}
        <div id="operator-terminal" className="xl:col-span-5 flex flex-col gap-6 h-[calc(100vh-140px)] min-h-[500px]">
          
          {/* TERMINAL PANEL FRAME */}
          <div className="flex-1 bg-[#0b0c13]/75 border border-gray-800/60 rounded-xl flex flex-col overflow-hidden shadow-2xl backdrop-blur-sm">
            
            {/* TERMINAL HEADER */}
            <div className="bg-[#0e101b] px-4 py-3 border-b border-gray-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-mono font-medium text-gray-300">CORE EXECUTIVE INTERACTION</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
              </div>
            </div>

            {/* MESSAGE CONTAINER */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 font-mono text-xs">
              {messages.map((m, idx) => (
                <div 
                  key={idx} 
                  className={`flex flex-col max-w-[90%] ${
                    m.role === 'user' 
                      ? 'self-end items-end text-right' 
                      : m.role === 'system'
                        ? 'self-center text-center max-w-full text-rose-400 bg-rose-950/20 px-4 py-2.5 rounded-lg border border-rose-900/30 w-full'
                        : 'self-start items-start text-left'
                  }`}
                >
                  <span className="text-[10px] text-gray-500 mb-1">
                    {m.role === 'user' ? 'Operator' : 'Microfyxd Server'} • {m.timestamp}
                  </span>
                  <div 
                    className={`px-3 py-2.5 rounded-xl text-left leading-relaxed ${
                      m.role === 'user' 
                        ? 'bg-indigo-600/25 text-indigo-100 border border-indigo-500/30' 
                        : m.role === 'system'
                          ? ''
                          : 'bg-gray-900/60 text-gray-300 border border-gray-800'
                    }`}
                  >
                    {/* Render basic markdown formatting */}
                    <div className="whitespace-pre-wrap font-sans text-xs">
                      {m.content.split('\n').map((line: string, lIdx: number) => {
                        if (line.startsWith('###')) {
                          return <h4 key={lIdx} className="font-bold text-white text-sm my-1">{line.replace('###', '')}</h4>;
                        }
                        if (line.startsWith('- ')) {
                          return <li key={lIdx} className="ml-4 list-disc text-gray-300">{line.replace('- ', '')}</li>;
                        }
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return <p key={lIdx} className="font-bold text-white my-1">{line.replace(/\*\*/g, '')}</p>;
                        }
                        return <p key={lIdx} className="mb-1">{line}</p>;
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {/* LIVE SIMULATOR LOADER */}
              {isRunning && (
                <div className="self-start flex flex-col items-start text-left max-w-[85%]">
                  <span className="text-[10px] text-gray-500 mb-1">Microfyxd • Computing Nodes...</span>
                  <div className="flex items-center gap-3 bg-[#111321] border border-indigo-500/20 px-4 py-3 rounded-xl">
                    <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
                    <span className="text-xs text-indigo-200">Executing LangGraph pipeline...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* PRESET SHORTCUTS */}
            <div className="px-4 py-2 bg-[#0a0b12] border-t border-gray-800/40 flex flex-wrap gap-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider self-center mr-1">Workflows:</span>
              <button 
                disabled={isRunning}
                onClick={() => {
                  setPrompt('Tune coolant temperature bounds and adjust engine maps telemetry diagnostics.');
                  runLangGraphFlow('Tune coolant temperature bounds and adjust engine maps telemetry diagnostics.');
                }}
                className="text-[10px] font-mono bg-[#14172a] hover:bg-indigo-600/25 border border-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded transition"
              >
                🏎️ ECU Adjust Map
              </button>
              <button 
                disabled={isRunning}
                onClick={() => {
                  setPrompt('Diagnose, compile, and self-heal the broken Sandbox typescript snippet.');
                  runLangGraphFlow('Diagnose, compile, and self-heal the broken Sandbox typescript snippet.', sandboxCode);
                }}
                className="text-[10px] font-mono bg-[#14172a] hover:bg-purple-600/25 border border-purple-500/20 text-purple-300 px-2.5 py-1 rounded transition"
              >
                ⚡ Sandbox Self-Heal
              </button>
              <button 
                disabled={isRunning}
                onClick={() => {
                  setPrompt('Examine ego perspectives, cognitive profiles, and model introspection traces.');
                  runLangGraphFlow('Examine ego perspectives, cognitive profiles, and model introspection traces.');
                }}
                className="text-[10px] font-mono bg-[#14172a] hover:bg-emerald-600/25 border border-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded transition"
              >
                🧠 Ego Introspection
              </button>
            </div>

            {/* INPUT COMMAND LINE */}
            <div className="p-4 bg-[#0e101a] border-t border-gray-800/80 flex gap-2">
              <input 
                type="text"
                disabled={isRunning}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') runLangGraphFlow(); }}
                placeholder="Enter prompt command or select preset..."
                className="flex-1 bg-[#07080f] border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 font-mono outline-none"
              />
              <button 
                disabled={isRunning || !prompt.trim()}
                onClick={() => runLangGraphFlow()}
                className="bg-gradient-to-tr from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 text-white font-mono text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-lg shadow-indigo-500/10 cursor-pointer font-semibold"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                EXECUTE
              </button>
            </div>
          </div>

          {/* DYNAMIC PIPELINE MAP CARD */}
          <div className="bg-[#0b0c13]/75 border border-gray-800/60 rounded-xl p-4 flex flex-col gap-3 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-gray-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                ACTIVE LANGGRAPH PATHWAY
              </span>
              <span className="text-[10px] font-mono text-gray-500">Live Routing Edge</span>
            </div>
            
            {/* GRAPHLINES PIPELINE */}
            <div className="grid grid-cols-3 gap-2.5">
              {graphNodesSequence.map((node, index) => {
                const isActive = activeNodeId === node.id;
                const isPast = simulatedNodeIndex > index;
                const isSelected = selectedTrace?.nodeId === node.id;

                return (
                  <div 
                    key={node.id}
                    onClick={() => {
                      const found = traces.find(t => t.nodeId === node.id);
                      if (found) setSelectedTrace(found);
                    }}
                    className={`p-2.5 rounded-lg border text-center relative cursor-pointer select-none transition-all duration-300 ${
                      isActive 
                        ? 'bg-indigo-500/20 border-indigo-400 text-indigo-100 scale-[1.03] ring-1 ring-indigo-500/30 glow-pulse' 
                        : isPast 
                          ? 'bg-[#121422] border-indigo-900/60 text-indigo-300' 
                          : isSelected
                            ? 'bg-[#181d33] border-indigo-500/80 text-white ring-1 ring-indigo-500/20'
                            : 'bg-[#0e101a] border-gray-850 text-gray-500 hover:border-gray-700 hover:text-gray-400'
                    }`}
                  >
                    <div className="text-[10px] font-mono truncate">{node.label}</div>
                    <div className="text-[8px] font-mono mt-0.5 opacity-60 truncate">{node.id}</div>
                    
                    {/* Visual indicators */}
                    {isPast && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    )}
                    {isActive && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CORE CONTROL DECK & TABS (xl:span-7) */}
        <div id="control-deck" className="xl:col-span-7 flex flex-col gap-6 h-[calc(100vh-140px)] min-h-[500px]">
          
          {/* TAB WRAPPER */}
          <div className="flex-1 bg-[#0b0c13]/75 border border-gray-800/60 rounded-xl flex flex-col overflow-hidden shadow-2xl backdrop-blur-sm">
            
            {/* TABS SELECTOR LIST */}
            <div className="bg-[#0e101b] border-b border-gray-800/80 flex flex-wrap text-xs font-mono">
              <button 
                onClick={() => setActiveTab('traces')}
                className={`px-4 py-3 flex items-center gap-1.5 border-r border-gray-800 font-semibold cursor-pointer ${activeTab === 'traces' ? 'bg-[#0b0c13] text-indigo-400 border-t-2 border-t-indigo-500' : 'text-gray-400 hover:bg-gray-900'}`}
              >
                <Eye className="w-3.5 h-3.5" /> TRACES
              </button>
              <button 
                onClick={() => setActiveTab('files')}
                className={`px-4 py-3 flex items-center gap-1.5 border-r border-gray-800 font-semibold cursor-pointer ${activeTab === 'files' ? 'bg-[#0b0c13] text-indigo-400 border-t-2 border-t-indigo-500' : 'text-gray-400 hover:bg-gray-900'}`}
              >
                <FileCode className="w-3.5 h-3.5" /> MONOREPO
              </button>
              <button 
                onClick={() => setActiveTab('phenotype')}
                className={`px-4 py-3 flex items-center gap-1.5 border-r border-gray-800 font-semibold cursor-pointer ${activeTab === 'phenotype' ? 'bg-[#0b0c13] text-indigo-400 border-t-2 border-t-indigo-500' : 'text-gray-400 hover:bg-gray-900'}`}
              >
                <Compass className="w-3.5 h-3.5" /> PHENOTYPE
              </button>
              <button 
                onClick={() => setActiveTab('infra')}
                className={`px-4 py-3 flex items-center gap-1.5 border-r border-gray-800 font-semibold cursor-pointer ${activeTab === 'infra' ? 'bg-[#0b0c13] text-indigo-400 border-t-2 border-t-indigo-500' : 'text-gray-400 hover:bg-gray-900'}`}
              >
                <Cpu className="w-3.5 h-3.5" /> INFRASTRUCTURE
              </button>
              <button 
                onClick={() => setActiveTab('ego')}
                className={`px-4 py-3 flex items-center gap-1.5 border-r border-gray-800 font-semibold cursor-pointer ${activeTab === 'ego' ? 'bg-[#0b0c13] text-indigo-400 border-t-2 border-t-indigo-500' : 'text-gray-400 hover:bg-gray-900'}`}
              >
                <Brain className="w-3.5 h-3.5" /> EGO-SYSTEM
              </button>
              <button 
                onClick={() => setActiveTab('sandbox')}
                className={`px-4 py-3 flex items-center gap-1.5 border-r border-gray-800 font-semibold cursor-pointer ${activeTab === 'sandbox' ? 'bg-[#0b0c13] text-indigo-400 border-t-2 border-t-indigo-500' : 'text-gray-400 hover:bg-gray-900'}`}
              >
                <Code className="w-3.5 h-3.5" /> SANDBOX
              </button>
              <button 
                onClick={() => setActiveTab('memory')}
                className={`px-4 py-3 flex items-center gap-1.5 border-r border-gray-800 font-semibold cursor-pointer ${activeTab === 'memory' ? 'bg-[#0b0c13] text-indigo-400 border-t-2 border-t-indigo-500' : 'text-gray-400 hover:bg-gray-900'}`}
              >
                <Database className="w-3.5 h-3.5" /> MEMORY
              </button>
              <button 
                onClick={() => setActiveTab('doctrine')}
                className={`px-4 py-3 flex items-center gap-1.5 border-r border-gray-800 font-semibold cursor-pointer ${activeTab === 'doctrine' ? 'bg-[#0b0c13] text-indigo-400 border-t-2 border-t-indigo-500' : 'text-gray-400 hover:bg-gray-900'}`}
              >
                <Shield className="w-3.5 h-3.5" /> DOCTRINE
              </button>
            </div>

            {/* TAB CONTAINER BODY */}
            <div className="flex-1 overflow-y-auto p-5">
              
              {/* TAB 1: WHITE BOX TRACE VIEW */}
              {activeTab === 'traces' && (
                <div className="flex flex-col gap-5 h-full">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Activity className="w-4 h-4 text-indigo-400" />
                        LANGGRAPH COMPLIANCE AUDIT FEED
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">Step-by-step White-Box execution telemetry & ego introspection</p>
                    </div>
                    <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                      {traces.length} steps logged
                    </span>
                  </div>

                  {traces.length === 0 ? (
                    <div className="flex-1 border border-dashed border-gray-800 rounded-xl flex flex-col items-center justify-center p-8 text-center bg-[#07080f]/30">
                      <Terminal className="w-8 h-8 text-indigo-500/30 mb-2.5" />
                      <h4 className="text-xs font-mono font-semibold text-gray-400">Awaiting Graph Execution</h4>
                      <p className="text-xs text-gray-500 max-w-sm mt-1">Execute a task command on the left to populate real-time compliance traces from the LangGraph nodes.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
                      
                      {/* Step index list (lg:span-4) */}
                      <div className="lg:col-span-4 flex flex-col gap-2 overflow-y-auto border-r border-gray-800/40 pr-2">
                        {traces.map((trace, idx) => {
                          const isSelected = selectedTrace?.stepId === trace.stepId;
                          return (
                            <div 
                              key={trace.stepId}
                              onClick={() => setSelectedTrace(trace)}
                              className={`p-2.5 rounded-lg border text-left cursor-pointer transition ${
                                isSelected 
                                  ? 'bg-[#181d33] border-indigo-500/80 text-white' 
                                  : 'bg-[#0f111d] border-gray-850 hover:bg-gray-900/40 text-gray-300'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                                  {trace.stepId}
                                </span>
                                <span className="text-[9px] font-mono text-gray-500">
                                  {new Date(trace.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <div className="text-[11px] font-sans font-semibold truncate">{trace.label}</div>
                              <div className="text-[9px] font-mono text-gray-400 mt-0.5 truncate">{trace.nodeId}</div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Selected trace detail (lg:span-8) */}
                      <div className="lg:col-span-8 bg-[#090a10] border border-gray-800/60 rounded-xl p-4 flex flex-col gap-4 overflow-y-auto max-h-[420px]">
                        {selectedTrace ? (
                          <>
                            <div className="flex items-center justify-between border-b border-gray-800 pb-2.5">
                              <div>
                                <h4 className="text-xs font-bold text-white uppercase font-mono">{selectedTrace.label}</h4>
                                <span className="text-[10px] font-mono text-indigo-400">Node Identifier: {selectedTrace.nodeId}</span>
                              </div>
                              <span className="text-[10px] font-mono text-gray-500">{new Date(selectedTrace.timestamp).toISOString()}</span>
                            </div>

                            {/* White-box Logs */}
                            <div>
                              <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-indigo-300 mb-1.5 flex items-center gap-1.5">
                                <Terminal className="w-3 h-3" /> Node Console Output
                              </div>
                              <div className="bg-black/40 border border-gray-900 rounded-lg p-3 font-mono text-[11px] leading-relaxed text-gray-300">
                                {selectedTrace.logs.map((log, idx) => (
                                  <div key={idx} className="mb-0.5">{log}</div>
                                ))}
                              </div>
                            </div>

                            {/* Ego Introspection */}
                            {selectedTrace.egoIntrospection && (
                              <div>
                                <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-purple-300 mb-1.5 flex items-center gap-1.5">
                                  <Brain className="w-3 h-3" /> Cognitive Ego Introspection
                                </div>
                                <div className="bg-[#12111c] border border-purple-950/20 rounded-lg p-3 font-sans text-xs italic text-purple-200">
                                  "{selectedTrace.egoIntrospection}"
                                </div>
                              </div>
                            )}

                            {/* State Update Payload */}
                            <div>
                              <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-gray-400 mb-1.5 flex items-center gap-1.5">
                                <Layers className="w-3 h-3" /> State Mutation Delta
                              </div>
                              <div className="bg-[#05060a] border border-gray-950 rounded-lg p-3 font-mono text-[10px] text-emerald-400 overflow-x-auto">
                                <pre>{JSON.stringify(selectedTrace.stateUpdate, null, 2)}</pre>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-10 text-gray-500">Select a trace step on the left to inspect detailed compliance logs.</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: MONOREPO CODE EXPLORER */}
              {activeTab === 'files' && (
                <div className="flex flex-col gap-4 h-full">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-indigo-400" />
                      MONOREPO SCAFFOLD EXPLORER
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Explore the production-grade TypeScript packages structure in the monorepo workspaces</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 flex-1 min-h-[400px]">
                    
                    {/* File tree browser (md:span-4) */}
                    <div className="md:col-span-4 bg-[#0a0c13] border border-gray-800/40 rounded-xl p-3 flex flex-col gap-2 overflow-y-auto">
                      <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-2">Workspace Modules</div>
                      {monorepoFiles.map(file => {
                        const isSelected = selectedFilePath === file.path;
                        return (
                          <button
                            key={file.path}
                            onClick={() => setSelectedFilePath(file.path)}
                            className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs font-mono transition cursor-pointer ${
                              isSelected 
                                ? 'bg-[#181d33] text-indigo-300 font-semibold ring-1 ring-indigo-500/10' 
                                : 'text-gray-400 hover:bg-[#0f111d] hover:text-white'
                            }`}
                          >
                            <Code className="w-3.5 h-3.5 flex-shrink-0 text-indigo-400" />
                            <div className="truncate">
                              <div className="text-[11px] truncate text-gray-200">{file.path.split('/').pop()}</div>
                              <div className="text-[9px] truncate text-gray-500">{file.label}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Code viewer (md:span-8) */}
                    <div className="md:col-span-8 bg-[#05060a] border border-gray-850 rounded-xl flex flex-col overflow-hidden max-h-[450px]">
                      <div className="bg-[#0e101a] px-4 py-2 border-b border-gray-850 flex items-center justify-between text-[11px] font-mono text-gray-400">
                        <span>{selectedFilePath}</span>
                        <span className="text-[9px] text-gray-600">TypeScript Source</span>
                      </div>
                      <div className="flex-1 p-4 overflow-auto font-mono text-[11px] leading-relaxed text-gray-300">
                        <pre className="whitespace-pre">{selectedFile?.content || '// Code not loaded'}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PHENOTYPE */}
              {activeTab === 'phenotype' && (
                <div className="flex flex-col gap-5">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Compass className="w-4 h-4 text-indigo-400" />
                      PHENOTYPE ARCHITECTURE DECK
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Adapt graph morphology dynamically based on host hardware & cloud topology</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Configure Override */}
                    <div className="bg-[#0a0c13] border border-gray-800/40 rounded-xl p-5 flex flex-col gap-4">
                      <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5 border-b border-gray-850 pb-2">
                        <Settings className="w-3.5 h-3.5" /> Host Hardware Phenotype
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Selecting different platforms tells the phenotype engine to adjust max processing limits, memory budgets, and morph the execution edges of the LangGraph.
                      </p>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono text-gray-400 uppercase">Target Platform:</label>
                        <select
                          value={hardwareOverride}
                          onChange={(e) => setHardwareOverride(e.target.value)}
                          className="bg-[#05060a] border border-gray-800 rounded-lg p-2.5 text-xs text-white outline-none font-mono"
                        >
                          <option value="dgx-h100">Nvidia DGX H100 (Enterprise Cluster)</option>
                          <option value="aws-ec2-g4">AWS EC2 g4dn.xlarge (Single GPU Cloud Node)</option>
                          <option value="raspberry-pi">Edge arm64 Gateway (Raspberry Pi 5)</option>
                        </select>
                      </div>

                      <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-lg p-3.5 flex gap-3 text-xs text-indigo-200">
                        <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-white block">Adaptive Graph Overrides:</span>
                          {hardwareOverride === 'raspberry-pi' ? (
                            <span className="text-[11px] text-indigo-300">
                              ⚠️ Raspberry Pi overrides `gpuDispatchNode` to `fallbackCpuProcessNode`. Large batch operations are sequentially queued on CPU cores.
                            </span>
                          ) : (
                            <span className="text-[11px] text-indigo-300">
                              🚀 Premium hardware supports parallel multi-GPU sequence splitting and thermal throttle protections.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Active Phenotype State */}
                    <div className="bg-[#0a0c13] border border-gray-800/40 rounded-xl p-5 flex flex-col gap-4 text-xs">
                      <h4 className="text-xs font-mono font-bold text-white uppercase border-b border-gray-850 pb-2">
                        Current Phenotype Descriptors
                      </h4>

                      <div className="grid grid-cols-2 gap-3 font-mono">
                        <div className="bg-[#05060a] p-2.5 rounded-lg border border-gray-850">
                          <span className="text-[9px] text-gray-500 uppercase block">Adaptation Factor</span>
                          <span className="text-white font-bold">{hardwareOverride === 'raspberry-pi' ? '0.3 (Lite)' : hardwareOverride === 'aws-ec2-g4' ? '0.7 (Standard)' : '1.0 (Full)'}</span>
                        </div>
                        <div className="bg-[#05060a] p-2.5 rounded-lg border border-gray-850">
                          <span className="text-[9px] text-gray-500 uppercase block">GPU Status</span>
                          <span className="text-white font-bold">{hardwareOverride === 'raspberry-pi' ? 'UNAVAILABLE' : 'ACTIVE'}</span>
                        </div>
                        <div className="bg-[#05060a] p-2.5 rounded-lg border border-gray-850">
                          <span className="text-[9px] text-gray-500 uppercase block">Topology Class</span>
                          <span className="text-white text-[11px]">{hardwareOverride === 'raspberry-pi' ? 'disconnected-edge-mesh' : hardwareOverride === 'aws-ec2-g4' ? 'aws-us-west-2-vpc' : 'private-gcp-tenant'}</span>
                        </div>
                        <div className="bg-[#05060a] p-2.5 rounded-lg border border-gray-850">
                          <span className="text-[9px] text-gray-500 uppercase block">Memory limit</span>
                          <span className="text-white font-bold">{hardwareOverride === 'raspberry-pi' ? '8 GB' : hardwareOverride === 'aws-ec2-g4' ? '64 GB' : '256 GB'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: INFRASTRUCTURE & GPU MULTI-DISPATCH */}
              {activeTab === 'infra' && (
                <div className="flex flex-col gap-5 text-xs">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-indigo-400" />
                      INFRASTRUCTURE ADAPTATION LAYER
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Detect GPUs, split sequential batches, and throttle dispatch based on thermal thresholds</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* GPU Monitors */}
                    <div className="bg-[#0a0c13] border border-gray-800/40 rounded-xl p-5 flex flex-col gap-3">
                      <h4 className="text-xs font-mono font-bold text-white uppercase border-b border-gray-850 pb-1.5 flex justify-between">
                        <span>DETECTOR METRICS</span>
                        <span className="text-emerald-400 text-[10px]">REAL-TIME SCAN</span>
                      </h4>

                      <div className="flex flex-col gap-3.5 mt-2">
                        <div>
                          <div className="flex justify-between text-[11px] font-mono text-gray-300 mb-1">
                            <span>GPU 0: Nvidia H100 SXM5</span>
                            <span>{metrics.temp}°C</span>
                          </div>
                          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-400 to-amber-400 h-full rounded-full transition-all duration-500" style={{ width: '55%' }} />
                          </div>
                          <span className="text-[9px] font-mono text-gray-500">Utilization: {metrics.util}% | VRAM: 80GB / 80GB active</span>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] font-mono text-gray-300 mb-1">
                            <span>GPU 1: Nvidia H100 SXM5</span>
                            <span>48°C</span>
                          </div>
                          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-400 to-amber-400 h-full rounded-full transition-all duration-500" style={{ width: '40%' }} />
                          </div>
                          <span className="text-[9px] font-mono text-gray-500">Utilization: 8% | VRAM: 80GB / 80GB active</span>
                        </div>
                      </div>
                    </div>

                    {/* Batch Dispatch Split logs */}
                    <div className="bg-[#0a0c13] border border-gray-800/40 rounded-xl p-5 flex flex-col gap-4">
                      <h4 className="text-xs font-mono font-bold text-white uppercase border-b border-gray-850 pb-2">
                        Multi-GPU Task Sequence Splitter
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        To run massive tasks efficiently, large workloads are segmented into sub-tasks and dispatched dynamically across multiple GPUs to reduce heat and speed up inference.
                      </p>

                      <div className="bg-[#05060a] border border-gray-950 rounded-lg p-3 font-mono text-[11px] text-gray-300 flex flex-col gap-1.5">
                        <div className="text-indigo-400 font-bold">Active Schedule Log:</div>
                        <div>• [SCHEDULER] Splitting telemetry batch into 8 sequences</div>
                        <div>• [SCHEDULER] Dispatching sequence [0-3] to GPU-0</div>
                        <div>• [SCHEDULER] Dispatching sequence [4-7] to GPU-1</div>
                        <div className="text-emerald-400 font-semibold">• [SCHEDULER] Merging sequence results... SUCCESS</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: EGO-SYSTEM */}
              {activeTab === 'ego' && (
                <div className="flex flex-col gap-5 text-xs">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Brain className="w-4 h-4 text-indigo-400" />
                      HYPERDIMENSIONAL EGO-SYSTEM
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Introspect self-modeling directives, perspectives, and cognitive evolution</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Identity Directives */}
                    <div className="bg-[#0a0c13] border border-gray-800/40 rounded-xl p-5 flex flex-col gap-3">
                      <h4 className="text-xs font-mono font-bold text-white uppercase border-b border-gray-850 pb-2">
                        Core Identity Directives
                      </h4>
                      <div className="flex flex-col gap-2 font-mono text-[11px]">
                        <div className="bg-[#05060a] p-2.5 rounded border-l-2 border-indigo-500 text-indigo-200">
                          💡 Primary Directive: Self-evolution with strict alignment
                        </div>
                        <div className="bg-[#05060a] p-2.5 rounded border-l-2 border-purple-500 text-purple-200">
                          🛡️ Cognitive Balance: High skepticism on unverified tools
                        </div>
                        <div className="bg-[#05060a] p-2.5 rounded border-l-2 border-emerald-500 text-emerald-200">
                          ⚙️ Structural integrity: Ensure all code compiles in sandboxes before execution
                        </div>
                      </div>
                    </div>

                    {/* Introspection logs */}
                    <div className="bg-[#0a0c13] border border-gray-800/40 rounded-xl p-5 flex flex-col gap-3">
                      <h4 className="text-xs font-mono font-bold text-white uppercase border-b border-gray-850 pb-2">
                        Introspection Logs Feed
                      </h4>
                      <div className="bg-black/30 rounded-lg p-3 max-h-[180px] overflow-y-auto font-mono text-[10px] leading-relaxed text-purple-300">
                        <div>[EGO_BOOT] State variables mapped to identity vector.</div>
                        <div>[REFLECTION_PASS] Audited active doctrine compliance tier: 3.</div>
                        <div>[COGNITIVE_ALIGN] Resource allocation confirms safety boundary verification score 10/10.</div>
                        <div className="text-white mt-1 animate-pulse">&gt; Introspecting active operator interactions... Awaiting command.</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: SANDBOX & SELF-HEALING */}
              {activeTab === 'sandbox' && (
                <div className="flex flex-col gap-5 text-xs">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Code className="w-4 h-4 text-indigo-400" />
                      ISOLATED SANDBOX & SELF-REPAIR ENGINE
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Write snippets, trigger syntax errors, and watch selfcheck nodes fix bugs automatically</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    
                    {/* Sandbox code editor (lg:span-7) */}
                    <div className="lg:col-span-7 bg-[#05060a] border border-gray-850 rounded-xl flex flex-col overflow-hidden">
                      <div className="bg-[#0e101a] px-4 py-2.5 border-b border-gray-850 flex items-center justify-between font-mono text-[11px] text-gray-400">
                        <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-indigo-400" /> workspace_scratchpad.ts</span>
                        <span className="text-rose-400 animate-pulse text-[10px] font-bold">CONTAINED FAULT TRIGGER</span>
                      </div>
                      <textarea
                        value={sandboxCode}
                        onChange={(e) => setSandboxCode(e.target.value)}
                        rows={10}
                        className="p-4 bg-transparent outline-none border-none font-mono text-[11px] leading-relaxed text-gray-200 resize-none h-[220px]"
                      />
                      <div className="bg-[#0a0b12] px-4 py-2.5 border-t border-gray-850 flex items-center justify-between">
                        <button
                          onClick={async () => {
                            const res = await fetch('/api/sandbox/eval', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ code: sandboxCode })
                            });
                            const data = await res.json();
                            if (data.result.syntaxOk) {
                              alert('Code compiles perfectly in the sandbox!');
                            } else {
                              alert(`Code compilation failed in the sandbox! Error: ${data.result.error}`);
                            }
                          }}
                          className="text-[10px] font-mono hover:bg-gray-800 border border-gray-800 text-gray-400 px-3 py-1.5 rounded transition cursor-pointer"
                        >
                          Check Syntax
                        </button>

                        <button
                          disabled={isRunning}
                          onClick={() => {
                            runLangGraphFlow('Diagnose, compile, and self-heal the broken Sandbox typescript snippet.', sandboxCode);
                          }}
                          className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/30 text-[10px] font-mono px-3.5 py-1.5 rounded transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                          TRIGGER AUTO-REPAIR
                        </button>
                      </div>
                    </div>

                    {/* How Self-healing works (lg:span-5) */}
                    <div className="lg:col-span-5 bg-[#0a0c13] border border-gray-800/40 rounded-xl p-4 flex flex-col gap-3">
                      <h4 className="text-xs font-mono font-bold text-white uppercase border-b border-gray-850 pb-1.5">
                        Self-Healing Blueprint
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        If a secure tool execution crashes due to a coding fault, the system initiates a LangGraph meta-repair loop:
                      </p>

                      <div className="flex flex-col gap-2 font-mono text-[11px]">
                        <div className="flex items-center gap-2 text-gray-400">
                          <span className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-[10px]">1</span>
                          <span>diagnoseNode detects compilation error</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <span className="w-5 h-5 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-[10px]">2</span>
                          <span>repairNode generates dynamic syntax patch</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-[10px]">3</span>
                          <span>retryNode compiles fixed code securely</span>
                        </div>
                      </div>

                      <div className="mt-2 bg-[#0d151c] border border-sky-900/30 rounded-lg p-3 text-[11px] text-sky-200 leading-relaxed">
                        💡 **Try it**: Click **TRIGGER AUTO-REPAIR**. The LangGraph will automatically locate the missing '=' in 'const bugVar', append the closing curly bracket to 'processECU()', and verify execution!
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: MEMORY */}
              {activeTab === 'memory' && (
                <div className="flex flex-col gap-5 text-xs">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Database className="w-4 h-4 text-indigo-400" />
                      HIERARCHICAL ASSOCIATIVE MEMORY (HAM)
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Explore HAM concept associations, episodic logs, and long-term vector records</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* HAM concept cards */}
                    <div className="bg-[#0a0c13] border border-gray-800/40 rounded-xl p-5 flex flex-col gap-3">
                      <h4 className="text-xs font-mono font-bold text-white uppercase border-b border-gray-850 pb-2">
                        HAM Association Map
                      </h4>
                      <p className="text-xs text-gray-400 mb-2">
                        Concepts are mapped and recalled hierarchically to improve agent response logic.
                      </p>

                      <div className="flex flex-col gap-2 font-mono text-[11px]">
                        <div className="bg-[#05060a] p-3 rounded border border-gray-850">
                          <span className="text-indigo-400 font-bold block">"ecu-tuning"</span>
                          <span className="text-gray-400 text-[10px]">Linked nodes: [automotive-subsystem, engine-safety, fuel-maps]</span>
                        </div>
                        <div className="bg-[#05060a] p-3 rounded border border-gray-850">
                          <span className="text-purple-400 font-bold block">"self-repair"</span>
                          <span className="text-gray-400 text-[10px]">Linked nodes: [meta-layers, code-patches, validation-tests]</span>
                        </div>
                      </div>
                    </div>

                    {/* Episodic summary logs */}
                    <div className="bg-[#0a0c13] border border-gray-800/40 rounded-xl p-5 flex flex-col gap-3">
                      <h4 className="text-xs font-mono font-bold text-white uppercase border-b border-gray-850 pb-2">
                        Episodic Operating Logs
                      </h4>
                      <div className="flex flex-col gap-2 font-mono text-[10px] text-gray-400">
                        <div className="p-2 bg-[#05060a] rounded border border-gray-850">
                          🕒 **Epoch 1**: Initial operational boot. Awaiting primary instruction from human operator.
                        </div>
                        <div className="p-2 bg-[#05060a] rounded border border-gray-850">
                          🕒 **Epoch 2**: Completed telemetry analysis sequence for ECU tuning maps. 1 compliance check passed.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8: DOCTRINE */}
              {activeTab === 'doctrine' && (
                <div className="flex flex-col gap-5 text-xs">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Shield className="w-4 h-4 text-indigo-400" />
                      COMPLIANCE DOCTRINE & UPGRADE LADDERS
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Unlock capability progression ladders and enforce human-in-the-loop policies</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    
                    {/* Progression Ladders (lg:span-7) */}
                    <div className="lg:col-span-7 bg-[#0a0c13] border border-gray-800/40 rounded-xl p-5 flex flex-col gap-4">
                      <h4 className="text-xs font-mono font-bold text-white uppercase border-b border-gray-850 pb-2">
                        Arcana Progression Ladder
                      </h4>

                      <div className="flex flex-col gap-3 font-mono text-[11px]">
                        <div className={`p-3 rounded-lg border transition ${arcanaTier === 1 ? 'bg-indigo-500/10 border-indigo-500/60' : 'bg-[#05060a] border-gray-850 opacity-65'}`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-white">Tier 1: Initiate (Standard Operations)</span>
                            {arcanaTier === 1 && <span className="text-[9px] bg-indigo-500 text-white px-1.5 py-0.5 rounded">ACTIVE</span>}
                          </div>
                          <span className="text-[10px] text-gray-400">Capabilities: BASE_REASONING, HARDWARE_PHENOTYPE_READ, HAM_ASSOCIATIONS</span>
                        </div>

                        <div className={`p-3 rounded-lg border transition ${arcanaTier === 2 ? 'bg-indigo-500/10 border-indigo-500/60' : 'bg-[#05060a] border-gray-850 opacity-65'}`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-white">Tier 2: Adept (Dynamic Adaptations)</span>
                            {arcanaTier === 2 && <span className="text-[9px] bg-indigo-500 text-white px-1.5 py-0.5 rounded">ACTIVE</span>}
                          </div>
                          <span className="text-[10px] text-gray-400">Capabilities: PHENOTYPE_MORPH_GRAPH, INFRASTRUCTURE_THROTTLE_GPU</span>
                        </div>

                        <div className={`p-3 rounded-lg border transition ${arcanaTier === 3 ? 'bg-indigo-500/10 border-indigo-500/60' : 'bg-[#05060a] border-gray-850 opacity-65'}`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-white">Tier 3: Master (Self-Repair Core)</span>
                            {arcanaTier === 3 && <span className="text-[9px] bg-indigo-500 text-white px-1.5 py-0.5 rounded">ACTIVE</span>}
                          </div>
                          <span className="text-[10px] text-gray-400">Capabilities: SANDBOX_AUTO_DIAGNOSE, SANDBOX_SELF_REPAIR</span>
                        </div>
                      </div>

                      <div className="flex gap-2 items-center">
                        <span className="text-[10px] font-mono text-gray-500 uppercase">Change Active Tier:</span>
                        <div className="flex gap-1.5">
                          {[1, 2, 3].map(t => (
                            <button
                              key={t}
                              onClick={() => setArcanaTier(t)}
                              className={`px-2.5 py-1 text-[10px] font-mono rounded border transition cursor-pointer ${arcanaTier === t ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-[#05060a] border-gray-800 text-gray-400 hover:border-gray-600'}`}
                            >
                              Tier {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Human in loop details (lg:span-5) */}
                    <div className="lg:col-span-5 bg-[#0a0c13] border border-gray-800/40 rounded-xl p-5 flex flex-col gap-3">
                      <h4 className="text-xs font-mono font-bold text-white uppercase border-b border-gray-850 pb-2 flex justify-between">
                        <span>HUMAN APPROVAL GATE</span>
                        <span className="text-indigo-400 font-bold">SECURE</span>
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        doctrine/index.ts mandates manual signature validations before performing high-severity operations like committing patches to production.
                      </p>

                      <div className="bg-[#05060a] border border-gray-950 p-3 rounded-lg font-mono text-[10px] text-gray-300 flex flex-col gap-2">
                        <div className="flex justify-between border-b border-gray-900 pb-1">
                          <span>Verify sandbox code builds</span>
                          <span className="text-emerald-400">PASSED</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-900 pb-1">
                          <span>Enforce isolation container</span>
                          <span className="text-emerald-400">VERIFIED</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Request Operator Key signature</span>
                          <span className="text-indigo-400">ACTIVE COGNITION</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-[#06070a] border-t border-gray-900 text-[11px] text-gray-500 font-mono px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <span>Microfyxd Enterprise Management • Authorized Access Only</span>
        <span>UTC Time: {new Date().toISOString().slice(0, 19).replace('T', ' ')}</span>
      </footer>

    </div>
  );
}
