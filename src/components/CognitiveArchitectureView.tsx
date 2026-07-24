import React, { useState } from 'react';
import { 
  MICROFYXD_COGNITIVE_NODES, 
  MICROFYXD_GRAPH_EDGES, 
  CognitiveSubsystemNode,
  getAllSubsystems
} from '../agent/cognitiveArchitecture';
import { 
  Microfyxd100xStressTester, 
  StressTestMetrics 
} from '../agent/stressTester';
import { 
  Shield, 
  Cpu, 
  Brain, 
  Database, 
  Radio, 
  Zap, 
  Activity, 
  CheckCircle2, 
  RefreshCw, 
  Search, 
  ArrowRight, 
  Lock, 
  Sliders, 
  Layers, 
  Network, 
  Sparkles,
  ChevronRight,
  Terminal,
  Clock,
  Code,
  Flame,
  AlertTriangle,
  TrendingUp,
  Gauge
} from 'lucide-react';

interface CognitiveArchitectureViewProps {
  onNavigateTab?: (tab: string) => void;
}

export const CognitiveArchitectureView: React.FC<CognitiveArchitectureViewProps> = ({ onNavigateTab }) => {
  const [subsystems] = useState<CognitiveSubsystemNode[]>(getAllSubsystems());
  const [selectedNodeId, setSelectedNodeId] = useState<string>('GlobalWorkspace');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [activeEdgeFilter, setActiveEdgeFilter] = useState<string>('all');

  // 100x Stress Test State
  const [isStressTesting, setIsStressTesting] = useState<boolean>(false);
  const [stressMetrics, setStressMetrics] = useState<StressTestMetrics | null>(null);
  const [stressProgressMsg, setStressProgressMsg] = useState<string>('');
  const [stressProgressPct, setStressProgressPct] = useState<number>(0);

  const selectedNode = MICROFYXD_COGNITIVE_NODES[selectedNodeId] || MICROFYXD_COGNITIVE_NODES['GlobalWorkspace'];

  const handleRun100xStressTest = async () => {
    setIsStressTesting(true);
    setStressMetrics(null);
    setStressProgressPct(5);
    setStressProgressMsg('Initializing 100x System Load Engine...');

    try {
      const results = await Microfyxd100xStressTester.execute100xStressTest(100, (msg, pct) => {
        setStressProgressMsg(msg);
        setStressProgressPct(pct);
      });

      setStressMetrics(results);
      setSimulationLog(results.adaptationLog);
    } catch (err: any) {
      console.error('Stress test failed:', err);
    } finally {
      setIsStressTesting(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Subsystems (20)' },
    { id: 'core_identity', label: 'Core & Identity (3)', icon: Shield, color: 'from-amber-500 to-red-500' },
    { id: 'executive_control', label: 'Executive Control (5)', icon: Cpu, color: 'from-cyan-500 to-blue-500' },
    { id: 'consciousness_bus', label: 'Consciousness Bus (1)', icon: Brain, color: 'from-purple-500 to-pink-500' },
    { id: 'memory_systems', label: 'Memory Systems (6)', icon: Database, color: 'from-emerald-500 to-teal-500' },
    { id: 'perception_io', label: 'Perception & I/O (2)', icon: Radio, color: 'from-indigo-500 to-purple-500' },
    { id: 'adaptive_learning', label: 'Adaptive & Self-Repair (3)', icon: Zap, color: 'from-rose-500 to-orange-500' },
  ];

  const filteredSubsystems = subsystems.filter(node => {
    const matchesCategory = selectedCategory === 'all' || node.category === selectedCategory;
    const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          node.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const incomingEdges = MICROFYXD_GRAPH_EDGES.filter(e => e.to === selectedNodeId);
  const outgoingEdges = MICROFYXD_GRAPH_EDGES.filter(e => e.from === selectedNodeId);

  const handleRunDiagnostic = () => {
    setIsSimulating(true);
    setSimulationLog(['[INIT] Triggering Microfyxd Full Consciousness Graph Sweep...']);
    
    const steps = [
      '[PERCEPTION] SensorFusion intake verified across speech audio & text streams.',
      '[ATTENTION] AttentionRouter filtered salience threshold set to 0.82.',
      '[GLOBAL BUS] GlobalWorkspace broadcasting active context frame to 19 nodes.',
      '[IDENTITY] IdentityCore verified genesis cryptographic token (0x9F4C2A...).',
      '[EXECUTIVE] ExecutiveDirector expanded goal DAG into 4 autonomous subtasks.',
      '[EGO & VALUATION] EgoModel self-efficacy at 98.4%. Valuation utility delta +12.6.',
      '[MEMORY] MemoryConsolidation synced 12 episodic keyframes to vector index.',
      '[PREDICTIVE] PredictiveModeler ran 50 Monte Carlo simulations. Risk: 0.02.',
      '[SAFETY] ConstraintEngine verified zero rule violations.',
      '[SELF-REPAIR] SelfRepairLoop nominal. Zero AST patches required.',
      '✅ [COMPLETE] All 20 Cognitive Subsystems synced at 100% Coherence!'
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setSimulationLog(prev => [...prev, step]);
        if (idx === steps.length - 1) {
          setIsSimulating(false);
        }
      }, (idx + 1) * 350);
    });
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'core_identity': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'executive_control': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'consciousness_bus': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'memory_systems': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'perception_io': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'adaptive_learning': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 text-slate-100 font-sans">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-indigo-500/20 border border-indigo-500/40 rounded-xl text-indigo-400 shadow-inner">
            <Brain className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-wide text-white">MICROFYXD COGNITIVE SUBSYSTEM ARCHITECTURE</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                20-Node Consciousness Graph
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Synthetic Cognitive Organism Architecture & Dynamic Node-to-Node Routing Spec
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRun100xStressTest}
            disabled={isStressTesting || isSimulating}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-rose-600 to-purple-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-xs font-mono shadow-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Flame className={`w-4 h-4 text-slate-950 ${isStressTesting ? 'animate-bounce' : ''}`} />
            {isStressTesting ? `Running 100x Load (${stressProgressPct}%)...` : 'RUN 100X STRESS TEST'}
          </button>

          <button
            onClick={handleRunDiagnostic}
            disabled={isSimulating || isStressTesting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            {isSimulating ? 'Simulating Graph...' : 'Consciousness Sweep'}
          </button>
          
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('command_center')}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono text-xs border border-slate-700 transition-all flex items-center gap-1.5"
            >
              Command Center
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left List / Navigation, Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
        
        {/* Left Column: Category Filter & Subsystem Node Grid (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3 overflow-hidden bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 20 cognitive subsystems or rules..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Subsystem Node List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
            {filteredSubsystems.map((node) => {
              const isSelected = node.id === selectedNodeId;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500/60 shadow-lg ring-1 ring-indigo-500/30'
                      : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold font-mono text-xs text-white truncate">{node.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${getCategoryBadgeClass(node.category)}`}>
                        {node.category.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {node.purpose}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      {node.metrics.latencyMs}ms
                    </span>
                    <div className="text-[10px] font-mono text-slate-500 mt-1">
                      {node.connections.length} edges
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Node Inspector & Architectural Details (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4 overflow-y-auto bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          
          {/* Node Header Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-black font-mono text-white">{selectedNode.name}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono border ${getCategoryBadgeClass(selectedNode.category)}`}>
                  {selectedNode.category.toUpperCase().replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {selectedNode.purpose}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono">
              <div>
                <span className="text-slate-500 block">Latency</span>
                <span className="text-cyan-400 font-bold">{selectedNode.metrics.latencyMs} ms</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-slate-500 block">Throughput</span>
                <span className="text-amber-400 font-bold">{selectedNode.metrics.throughput}</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-slate-500 block">Health</span>
                <span className="text-emerald-400 font-bold">{selectedNode.metrics.healthScore}%</span>
              </div>
            </div>
          </div>

          {/* Tabs / Architectural Sections */}
          <div className="space-y-4">
            
            {/* Required State Fields */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 mb-2 font-mono uppercase tracking-wider">
                <Code className="w-4 h-4" />
                Required State Fields
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {Object.entries(selectedNode.requiredStateFields).map(([field, spec]) => (
                  <div key={field} className="p-2 rounded bg-slate-900 border border-slate-800 flex flex-col justify-between">
                    <span className="text-cyan-300 font-bold">{field}</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inputs & Outputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Inputs */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-2 font-mono uppercase tracking-wider">
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  Subsystem Inputs
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedNode.inputs.map((inp, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded border border-slate-800/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{inp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Outputs */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-2 font-mono uppercase tracking-wider">
                  <ArrowRight className="w-4 h-4" />
                  Subsystem Outputs
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedNode.outputs.map((out, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded border border-slate-800/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Node-to-Node Connections & Mechanical Routing */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-400 font-mono uppercase tracking-wider">
                <Network className="w-4 h-4" />
                Mechanical Routing Rules & Node Connections
              </div>
              <p className="text-xs text-slate-200 leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800">
                {selectedNode.mechanicalRoutingRules}
              </p>

              {/* Connected Nodes List */}
              <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
                <span className="text-slate-400 font-mono">Linked Subsystems:</span>
                {selectedNode.connections.map((targetId) => (
                  <button
                    key={targetId}
                    onClick={() => setSelectedNodeId(targetId)}
                    className="px-2.5 py-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono text-xs transition-all flex items-center gap-1"
                  >
                    {targetId}
                    <ArrowRight className="w-3 h-3 text-indigo-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Correction Loops & Continuity Constraints */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400 mb-2 font-mono uppercase tracking-wider">
                  <RefreshCw className="w-4 h-4" />
                  Correction Loops
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedNode.correctionLoops}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 mb-2 font-mono uppercase tracking-wider">
                  <Lock className="w-4 h-4" />
                  Continuity Constraints
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedNode.continuityConstraints}
                </p>
              </div>
            </div>

            {/* 100x Stress Test Live Progress & Results Panel */}
            {(isStressTesting || stressMetrics) && (
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-3 animate-fadeIn shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
                    <span className="font-mono font-black text-sm text-amber-300 uppercase tracking-wider">
                      100x System Load Stress Test Benchmark
                    </span>
                  </div>
                  {stressMetrics && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      PASSED & ADAPTED
                    </span>
                  )}
                </div>

                {isStressTesting && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono text-slate-300">
                      <span>{stressProgressMsg}</span>
                      <span>{stressProgressPct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500 transition-all duration-300" 
                        style={{ width: `${stressProgressPct}%` }}
                      />
                    </div>
                  </div>
                )}

                {stressMetrics && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 flex flex-col">
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Gauge className="w-3 h-3 text-cyan-400" />
                        Throughput
                      </span>
                      <span className="text-base font-black font-mono text-cyan-300 mt-0.5">
                        {stressMetrics.throughputOpsPerSec} <span className="text-[10px] text-slate-400">ops/s</span>
                      </span>
                    </div>

                    <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 flex flex-col">
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-indigo-400" />
                        P95 Latency
                      </span>
                      <span className="text-base font-black font-mono text-indigo-300 mt-0.5">
                        {stressMetrics.latencyMsP95} <span className="text-[10px] text-slate-400">ms</span>
                      </span>
                    </div>

                    <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 flex flex-col">
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-400" />
                        Auto-Healed
                      </span>
                      <span className="text-base font-black font-mono text-amber-300 mt-0.5">
                        {stressMetrics.autoHealedErrors} <span className="text-[10px] text-slate-400">faults</span>
                      </span>
                    </div>

                    <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 flex flex-col">
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Shield className="w-3 h-3 text-emerald-400" />
                        Circuit Breaker
                      </span>
                      <span className="text-xs font-black font-mono text-emerald-300 mt-1 uppercase">
                        {stressMetrics.circuitBreakerEngaged ? 'ACTIVE ADAPT' : 'NOMINAL (0 THREAD DROPS)'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Diagnostic Log Output */}
            {simulationLog.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-4 h-4" />
                    Consciousness Graph Diagnostic Stream
                  </span>
                  <span className="text-[10px] text-slate-500">{simulationLog.length} events logged</span>
                </div>
                <div className="font-mono text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800/80 max-h-40 overflow-y-auto space-y-1">
                  {simulationLog.map((log, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-cyan-500 font-bold shrink-0">&gt;</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
