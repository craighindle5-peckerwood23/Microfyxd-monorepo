import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  Settings, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  TrendingUp, 
  Cpu, 
  ShieldCheck, 
  GitBranch, 
  Workflow, 
  Clock, 
  Code, 
  Plus, 
  RotateCw, 
  Database,
  RefreshCw,
  Terminal,
  Zap,
  Hammer
} from 'lucide-react';

interface AutonomousEnginesProps {
  onApplyCoherenceBoost?: (boost: number) => void;
  systemHealth?: number;
  onDecreaseThreatLevel?: (amount: number) => void;
}

interface CognitiveSubgoal {
  id: string;
  title: string;
  description: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  progress: number;
  status: 'PENDING' | 'ANALYZING' | 'EXECUTING' | 'RESOLVED';
  rewardFactor: number;
}

interface FailurePattern {
  errorCode: string;
  subsystem: string;
  occurrenceTime: string;
  traceStack: string;
  frequency: number;
}

interface HealingRule {
  id: string;
  patternMatch: string;
  remedyCode: string;
  successRate: number;
  compiledAt: string;
}

export const AutonomousEngines: React.FC<AutonomousEnginesProps> = ({
  onApplyCoherenceBoost,
  systemHealth,
  onDecreaseThreatLevel
}) => {
  // -------------------------------------------------------------
  // STATE: GOAL GENERATOR
  // -------------------------------------------------------------
  const [selectedDirective, setSelectedDirective] = useState<string>('COHERENCE_MAXIMIZATION');
  const [customDirective, setCustomDirective] = useState<string>('');
  const [subgoals, setSubgoals] = useState<CognitiveSubgoal[]>([
    {
      id: 'sub-01',
      title: 'Synthesize Neural Phase Lock',
      description: 'Synchronize high-frequency action potentials across the B-cortical manifold to match a 4.2Hz target frequency.',
      priority: 'CRITICAL',
      progress: 65,
      status: 'EXECUTING',
      rewardFactor: 4.5
    },
    {
      id: 'sub-02',
      title: 'Harden Watchdog Memory Bounds',
      description: 'Reallocate the stack buffers on the Vector HAM allocation route to suppress transient memory leak faults.',
      priority: 'HIGH',
      progress: 100,
      status: 'RESOLVED',
      rewardFactor: 3.2
    },
    {
      id: 'sub-03',
      title: 'Verify Route-Failover Redundancy',
      description: 'Audit connection sockets on port 3000 proxies to guarantee continuous uptime during high packet density sweeps.',
      priority: 'MEDIUM',
      progress: 0,
      status: 'PENDING',
      rewardFactor: 2.1
    }
  ]);
  const [goalLogs, setGoalLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] [COGNITION] Active goal-generator module linked with Policy Directive: COHERENCE_MAXIMIZATION.`
  ]);

  // -------------------------------------------------------------
  // STATE: HEALING LOGIC GENERATOR
  // -------------------------------------------------------------
  const [failures, setFailures] = useState<FailurePattern[]>([
    {
      errorCode: 'ERR_SOCKET_TIMEOUT_CH4',
      subsystem: 'Networking Proxy Route',
      occurrenceTime: '2 mins ago',
      traceStack: 'at Socket.connect (node:net:1024) -> proxy_handler.ts:42',
      frequency: 14
    },
    {
      errorCode: 'ERR_MEM_LEAK_VECTOR_HAM',
      subsystem: 'Cognitive Memory Storage',
      occurrenceTime: '4 mins ago',
      traceStack: 'at HAMStore.push (associative_memory.ts:210) -> leak',
      frequency: 8
    },
    {
      errorCode: 'ERR_UNSUPPORTED_SYNAPSE_OP_6',
      subsystem: 'Synaptic Signal Processor',
      occurrenceTime: '12 mins ago',
      traceStack: 'at Synapse.adapt (plasticity_core.ts:89) -> channel_fault',
      frequency: 3
    }
  ]);
  
  const [selectedFailureIdx, setSelectedFailureIdx] = useState<number>(0);
  const [healingRules, setHealingRules] = useState<HealingRule[]>([
    {
      id: 'rule-01',
      patternMatch: 'ERR_SOCKET_TIMEOUT_CH4',
      remedyCode: `// Healing Rule for Channel 4 Socket timeouts\nif (error.code === 'ERR_SOCKET_TIMEOUT_CH4') {\n  console.log("Triggering auto-reconnect on Channel 4...");\n  CoreNetwork.reconnect(4);\n  CoreNetwork.setPortOverride(3000);\n  SystemTelemetry.addCoherenceBoost(1.5);\n}`,
      successRate: 94,
      compiledAt: '10:14:02 AM'
    },
    {
      id: 'rule-02',
      patternMatch: 'ERR_MEM_LEAK_VECTOR_HAM',
      remedyCode: `// Healing Rule for Memory leak on HAM route\nif (error.code === 'ERR_MEM_LEAK_VECTOR_HAM') {\n  console.log("Flushing transient buffers on associative storage...");\n  HAMStore.flushBuffers();\n  HAMStore.gcSweep();\n  SystemTelemetry.addCoherenceBoost(2.4);\n}`,
      successRate: 88,
      compiledAt: '11:32:15 AM'
    }
  ]);

  const [synthesizedHealerCode, setSynthesizedHealerCode] = useState<string>('');
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [healerLogs, setHealerLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] [HEALER_CORE] Static neural pattern matching active. 2 compiled healing heuristics deployed.`
  ]);

  // -------------------------------------------------------------
  // STATE: LANGGRAPH WORKFLOW ENGINE (DAG)
  // -------------------------------------------------------------
  const [activeDAGNode, setActiveDAGNode] = useState<string>('idle');
  const [isDAGRunning, setIsDAGRunning] = useState<boolean>(false);
  const [dagLogs, setDagLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] [DAG_CORE] Orchestration engine online. Trigger mode: MANUAL_TICK.`
  ]);
  const [dagAutomationMode, setDagAutomationMode] = useState<'manual' | 'continuous' | 'daily'>('manual');
  const [cycleCount, setCycleCount] = useState<number>(12);

  // -------------------------------------------------------------
  // EFFECTS: CONTINUOUS AUTOMATION TRIGGER LOOP
  // -------------------------------------------------------------
  useEffect(() => {
    if (dagAutomationMode !== 'continuous') return;

    const interval = setInterval(() => {
      runFullDAGCycle();
    }, 12000); // Auto-trigger a run every 12 seconds in continuous mode

    return () => clearInterval(interval);
  }, [dagAutomationMode, subgoals, healingRules]);

  // -------------------------------------------------------------
  // GOAL GENERATOR ACTION
  // -------------------------------------------------------------
  const handleGenerateSubgoals = () => {
    let directiveText = selectedDirective;
    if (directiveText === 'CUSTOM' && customDirective.trim()) {
      directiveText = customDirective.trim().toUpperCase();
    }

    setGoalLogs(prev => [
      `[${new Date().toLocaleTimeString()}] [COGNITION] Re-evaluating system policy tree against: ${directiveText}`,
      `[${new Date().toLocaleTimeString()}] [COGNITION] Scanning hardware telemetry metrics and thread pools...`,
      ...prev
    ]);

    // Create tailored subgoals based on selected policy
    let newSubgoals: CognitiveSubgoal[] = [];
    if (selectedDirective === 'COHERENCE_MAXIMIZATION') {
      newSubgoals = [
        {
          id: `sub-${Math.floor(Math.random() * 1000)}`,
          title: 'Resonance Drift Control',
          description: 'Deploy damping vectors on the high-pass brain frequency filters to limit variance to < 0.2%.',
          priority: 'CRITICAL',
          progress: 10,
          status: 'ANALYZING',
          rewardFactor: 6.2
        },
        {
          id: `sub-${Math.floor(Math.random() * 1000)}`,
          title: 'Dynamic Synaptic Lock',
          description: 'Lock synapses inside the cortex manifold to ensure parallel action potentials remain coherent.',
          priority: 'HIGH',
          progress: 40,
          status: 'EXECUTING',
          rewardFactor: 4.8
        },
        {
          id: `sub-${Math.floor(Math.random() * 1000)}`,
          title: 'Auto-Tuning Stabilization Sweep',
          description: 'Run background quantum frequency shifts continuously across active signal channels.',
          priority: 'MEDIUM',
          progress: 100,
          status: 'RESOLVED',
          rewardFactor: 3.5
        }
      ];
    } else if (selectedDirective === 'LATENCY_MINIMIZATION') {
      newSubgoals = [
        {
          id: `sub-${Math.floor(Math.random() * 1000)}`,
          title: 'Flush Socket Buffer Pipelines',
          description: 'Empty residual socket streams on port 3000 dynamically to decrease execution latencies by 8.5ms.',
          priority: 'HIGH',
          progress: 20,
          status: 'EXECUTING',
          rewardFactor: 5.0
        },
        {
          id: `sub-${Math.floor(Math.random() * 1000)}`,
          title: 'Consolidate Cognitive Nodes',
          description: 'Bypass secondary routing layers on local RAM pathways to achieve ultra-fast micro-tick responses.',
          priority: 'CRITICAL',
          progress: 0,
          status: 'PENDING',
          rewardFactor: 7.5
        }
      ];
    } else if (selectedDirective === 'SECURITY_HARDENING') {
      newSubgoals = [
        {
          id: `sub-${Math.floor(Math.random() * 1000)}`,
          title: 'Harden Sandbox Boundaries',
          description: 'Inject localized proxy controls to prevent sandbox execution slips from leaking outside scope bounds.',
          priority: 'CRITICAL',
          progress: 50,
          status: 'EXECUTING',
          rewardFactor: 5.5
        },
        {
          id: `sub-${Math.floor(Math.random() * 1000)}`,
          title: 'Sanitize Action Potential Inputs',
          description: 'Validate custom input parameters against structural types dynamically inside the neural interface.',
          priority: 'HIGH',
          progress: 100,
          status: 'RESOLVED',
          rewardFactor: 4.0
        }
      ];
    } else {
      // CUSTOM
      newSubgoals = [
        {
          id: `sub-${Math.floor(Math.random() * 1000)}`,
          title: `Evolve Custom Policy: ${directiveText.slice(0, 24)}`,
          description: `Formulate a detailed sub-graph logic schema matching Craig's custom policy requirements.`,
          priority: 'HIGH',
          progress: 15,
          status: 'EXECUTING',
          rewardFactor: 6.8
        },
        {
          id: `sub-${Math.floor(Math.random() * 1000)}`,
          title: 'Validate Policy Dependencies',
          description: 'Construct a dry-run execution graph verifying that no existing safety overrides are breached.',
          priority: 'MEDIUM',
          progress: 0,
          status: 'PENDING',
          rewardFactor: 3.0
        }
      ];
    }

    setTimeout(() => {
      setSubgoals(newSubgoals);
      setGoalLogs(prev => [
        `[${new Date().toLocaleTimeString()}] [COGNITION] SUCCESS: Successfully generated ${newSubgoals.length} high-fidelity subgoals.`,
        `[${new Date().toLocaleTimeString()}] [COGNITION] Goal hierarchy updated. System reward parameters registered.`,
        ...prev
      ]);
      if (customDirective) setCustomDirective('');
    }, 1200);
  };

  // Run progress tick on subgoals
  const handleTickSubgoals = () => {
    setSubgoals(prev => prev.map(goal => {
      if (goal.status === 'RESOLVED') return goal;
      const nextProgress = Math.min(100, goal.progress + Math.floor(Math.random() * 20) + 10);
      return {
        ...goal,
        progress: nextProgress,
        status: nextProgress === 100 ? 'RESOLVED' : 'EXECUTING' as any
      };
    }));

    setGoalLogs(prev => [
      `[${new Date().toLocaleTimeString()}] [COGNITION] Iterating active subgoal executor tick. Synthesizing results...`,
      ...prev
    ]);
  };

  // -------------------------------------------------------------
  // HEALING LOGIC GENERATOR ACTIONS
  // -------------------------------------------------------------
  const handleExtractPattern = () => {
    const activeFail = failures[selectedFailureIdx];
    if (!activeFail) return;

    setIsSynthesizing(true);
    setHealerLogs(prev => [
      `[${new Date().toLocaleTimeString()}] [HEALER_CORE] ANALYZING ERROR: Pattern match initiated for ${activeFail.errorCode}.`,
      `[${new Date().toLocaleTimeString()}] [HEALER_CORE] Parsing trace stack frames: "${activeFail.traceStack}"`,
      ...prev
    ]);

    setTimeout(() => {
      // Synthesize optimized healing code snippet matching the failure
      let code = '';
      if (activeFail.errorCode === 'ERR_SOCKET_TIMEOUT_CH4') {
        code = `// Dynamic Healer Heuristic for ${activeFail.errorCode}\nif (error.code === 'ERR_SOCKET_TIMEOUT_CH4') {\n  console.log("AUTO-HEAL: Re-routing socket pool to spare Channel 4 route...");\n  CoreNetwork.failoverChannel(4);\n  CoreNetwork.throttlePacketRate(0.85);\n  SystemTelemetry.addCoherenceBoost(2.5);\n}`;
      } else if (activeFail.errorCode === 'ERR_MEM_LEAK_VECTOR_HAM') {
        code = `// Dynamic Healer Heuristic for ${activeFail.errorCode}\nif (error.code === 'ERR_MEM_LEAK_VECTOR_HAM') {\n  console.log("AUTO-HEAL: High-density RAM leak detected. Initiating garbage sweep...");\n  HAMStore.compressVectorKeys();\n  HAMStore.gcSweep();\n  SystemTelemetry.addCoherenceBoost(3.8);\n}`;
      } else {
        code = `// Dynamic Healer Heuristic for ${activeFail.errorCode}\nif (error.code === 'ERR_UNSUPPORTED_SYNAPSE_OP_6') {\n  console.log("AUTO-HEAL: Adapting synaptic operation parameters dynamically...");\n  Synapse.resetToDefaults(6);\n  Synapse.clampVoltage(120);\n  SystemTelemetry.addCoherenceBoost(1.8);\n}`;
      }

      setSynthesizedHealerCode(code);
      setIsSynthesizing(false);
      setHealerLogs(prev => [
        `[${new Date().toLocaleTimeString()}] [HEALER_CORE] SUCCESS: Synthesized customized remedy logic with 95% predicted success.`,
        `[${new Date().toLocaleTimeString()}] [HEALER_CORE] Output compiled successfully inside dynamic evaluation module.`,
        ...prev
      ]);
    }, 1500);
  };

  const handleCompileAndStoreRule = () => {
    if (!synthesizedHealerCode.trim()) return;
    const activeFail = failures[selectedFailureIdx];
    if (!activeFail) return;

    const newRule: HealingRule = {
      id: `rule-${Math.floor(Math.random() * 1000)}`,
      patternMatch: activeFail.errorCode,
      remedyCode: synthesizedHealerCode,
      successRate: Math.floor(Math.random() * 10) + 88,
      compiledAt: new Date().toLocaleTimeString()
    };

    setHealingRules(prev => {
      // Avoid duplicates of the same patternMatch by updating or prepending
      const filtered = prev.filter(r => r.patternMatch !== activeFail.errorCode);
      return [newRule, ...filtered];
    });

    setHealerLogs(prev => [
      `[${new Date().toLocaleTimeString()}] [HEALER_CORE] DEPLOYED: healing heuristic registered in persistent rule index.`,
      `[${new Date().toLocaleTimeString()}] [HEALER_CORE] Dynamic failover database updated with matched pattern: ${activeFail.errorCode}`,
      ...prev
    ]);

    // Clear synthesized block to indicate save
    setSynthesizedHealerCode('');
  };

  // Simulate injecting a new failure
  const handleInjectFailure = () => {
    const errorCodes = ['ERR_CLOCK_DRIFT_MS', 'ERR_SECURITY_PERIMETER_SLIP_F3', 'ERR_GPU_THREAD_SHIELD_COLLIDE'];
    const subsystems = ['Hardware Core Clock', 'Security Vault', 'GPU Multi-Dispatch Unit'];
    const code = errorCodes[Math.floor(Math.random() * errorCodes.length)];
    const sub = subsystems[errorCodes.indexOf(code)];

    const newFail: FailurePattern = {
      errorCode: code,
      subsystem: sub,
      occurrenceTime: 'Just now',
      traceStack: `at system_${code.toLowerCase()}.ts:544 -> crash`,
      frequency: 1
    };

    setFailures(prev => {
      const exists = prev.find(f => f.errorCode === code);
      if (exists) {
        return prev.map(f => f.errorCode === code ? { ...f, frequency: f.frequency + 1, occurrenceTime: 'Just now' } : f);
      }
      return [newFail, ...prev];
    });

    setHealerLogs(prev => [
      `[${new Date().toLocaleTimeString()}] [ALARM] TRAPPED SYSTEM FAULT: ${code} on Subsystem "${sub}".`,
      `[${new Date().toLocaleTimeString()}] [ALARM] Auto-remedy route lookup triggered...`,
      ...prev
    ]);
  };

  // -------------------------------------------------------------
  // LANGGRAPH WORKFLOW ENGINE ACTIONS
  // -------------------------------------------------------------
  const runFullDAGCycle = async () => {
    if (isDAGRunning) return;
    setIsDAGRunning(true);
    setActiveDAGNode('idle');

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    const nodes = [
      { id: 'state_check', log: 'NODE [State Check]: Auditing active synapses and network routes...' },
      { id: 'policy_audit', log: 'NODE [Policy Audit]: Correlating current metrics with directive ' + selectedDirective + '...' },
      { id: 'priority_route', log: 'NODE [Priority Router]: Selecting highest weight subgoal and dispatching worker...' },
      { id: 'sandbox_eval', log: 'NODE [Sandbox Eval]: Launching client-side secure code isolation test...' },
      { id: 'dynamic_healer', log: 'NODE [Dynamic Healer]: Resolving active software faults via registered Healing Rules...' },
      { id: 'telemetry_sync', log: 'NODE [Telemetry Sync]: Compiling performance data and piping coherence boost...' }
    ];

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      setActiveDAGNode(node.id);
      setDagLogs(prev => [
        `[${new Date().toLocaleTimeString()}] [GRAPH_RUN] ${node.log}`,
        ...prev
      ]);
      await sleep(1500);
    }

    // Finished running entire DAG pipeline
    setActiveDAGNode('idle');
    setIsDAGRunning(false);
    setCycleCount(prev => prev + 1);

    // Calculate dynamic rewards based on subgoals and healing rules
    let coherenceBoostReward = 2.5;
    subgoals.forEach(sub => {
      if (sub.status === 'RESOLVED') coherenceBoostReward += (sub.rewardFactor * 0.4);
    });
    healingRules.forEach(rule => {
      coherenceBoostReward += (rule.successRate * 0.02);
    });

    coherenceBoostReward = Number(coherenceBoostReward.toFixed(1));

    // Pipe the rewards up to parent App.tsx state
    if (typeof onApplyCoherenceBoost === 'function') {
      onApplyCoherenceBoost(coherenceBoostReward);
    }
    if (onDecreaseThreatLevel) {
      onDecreaseThreatLevel(3.2); // Squelch threat level by completing DAG runs
    }

    setDagLogs(prev => [
      `[${new Date().toLocaleTimeString()}] [GRAPH_SUCCESS] Pipeline completed successfully. 6 nodes validated.`,
      `[${new Date().toLocaleTimeString()}] [GRAPH_SUCCESS] PIPED REWARD GAINS: +${coherenceBoostReward}% Coherence | -3.2% System Threat level.`,
      ...prev
    ]);
  };

  return (
    <div className="flex flex-col gap-6 text-xs animate-fadeIn">
      
      {/* HEADER SECTION */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-purple-950/25 to-indigo-950/25 border border-purple-500/10 p-5 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20 shadow-inner">
            <Workflow className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              Autonomous Cognitive Engines
              <span className="text-[9px] bg-indigo-500/15 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20 font-mono font-normal">TIER 1 ARCHITECTURE</span>
            </h4>
            <p className="text-[11px] text-gray-400 mt-1">Design, fork, and deploy self-adjusting goal trees, dynamic failure recovery rule compilers, and advanced LangGraph workflows</p>
          </div>
        </div>
      </div>

      {/* THREE INTERACTIVE BLOCKS IN A STUNNING GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* 1. GOAL GENERATOR MODULE (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col bg-[#05060b] border border-gray-850 rounded-2xl overflow-hidden shadow-xl" id="goal-generator-panel">
          <div className="bg-[#0e101a] px-4 py-3.5 border-b border-gray-850 flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-purple-400" />
              1. Goal Generator Module
            </span>
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
          </div>

          <div className="p-4 flex flex-col gap-4 flex-1">
            
            {/* Directive Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9.5px] font-mono text-gray-500 uppercase font-bold">Policy Directive Rule</label>
              <select
                value={selectedDirective}
                onChange={(e) => {
                  setSelectedDirective(e.target.value);
                  setGoalLogs(prev => [
                    `[${new Date().toLocaleTimeString()}] [COGNITION] Switched directive focus to: ${e.target.value}.`,
                    ...prev
                  ]);
                }}
                className="w-full bg-gray-950 border border-gray-850 outline-none p-2 rounded-lg font-mono text-[10.5px] text-gray-300 focus:border-purple-500/40"
              >
                <option value="COHERENCE_MAXIMIZATION">COHERENCE_MAXIMIZATION (Default)</option>
                <option value="LATENCY_MINIMIZATION">LATENCY_MINIMIZATION (Fast Ticks)</option>
                <option value="SECURITY_HARDENING">SECURITY_HARDENING (Isolated Sandbox)</option>
                <option value="CUSTOM">WRITE CUSTOM DIRECTIVE...</option>
              </select>
            </div>

            {/* Custom Policy input (if active) */}
            {selectedDirective === 'CUSTOM' && (
              <div className="flex flex-col gap-1.5 animate-fadeIn">
                <label className="text-[9px] font-mono text-purple-400 uppercase font-bold">Describe Custom Policy Goals</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="e.g., Optimize STDP weights dynamically..."
                    value={customDirective}
                    onChange={(e) => setCustomDirective(e.target.value)}
                    className="flex-1 bg-gray-950 border border-gray-850 outline-none p-2 rounded text-white font-mono text-[10.5px] focus:border-purple-500/40"
                  />
                </div>
              </div>
            )}

            {/* Subgoals Action Row */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleGenerateSubgoals}
                className="w-full py-2 bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/20 hover:border-purple-500/40 text-purple-300 font-mono text-[10px] font-bold rounded-lg cursor-pointer transition flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                GENERATE GOALS
              </button>
              <button
                onClick={handleTickSubgoals}
                className="w-full py-2 bg-gray-900 hover:bg-gray-800 border border-gray-850 text-gray-300 font-mono text-[10px] font-bold rounded-lg cursor-pointer transition flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                EXECUTE TICK
              </button>
            </div>

            {/* Subgoals visual progress list */}
            <div className="bg-black/40 border border-gray-900 rounded-xl p-3 flex flex-col gap-2.5 flex-1 max-h-[170px] overflow-y-auto">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block border-b border-gray-900 pb-1.5">Active Hierarchical Goals</span>
              {subgoals.map(goal => (
                <div key={goal.id} className="flex flex-col gap-1 text-[10px] border-b border-gray-900/50 pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-gray-300 font-mono truncate max-w-[170px]" title={goal.title}>{goal.title}</span>
                    <span className={`text-[8.5px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      goal.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      goal.status === 'EXECUTING' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-pulse' :
                      'bg-gray-800 text-gray-400 border border-gray-850'
                    }`}>
                      {goal.status}
                    </span>
                  </div>
                  <p className="text-[9px] text-gray-500 leading-normal line-clamp-1">{goal.description}</p>
                  
                  {/* Progress bar */}
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-900 rounded-full h-1 overflow-hidden border border-gray-850">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${goal.status === 'RESOLVED' ? 'bg-emerald-500' : 'bg-purple-500'}`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    <span className="font-mono text-[8px] text-gray-400 font-bold">{goal.progress}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Module log monitor */}
            <div className="bg-black rounded-lg border border-gray-900 p-2.5 font-mono text-[8.5px] text-purple-300/80 leading-normal h-[100px] overflow-y-auto space-y-1">
              {goalLogs.map((log, i) => (
                <div key={i} className="border-l border-purple-500/20 pl-1.5">{log}</div>
              ))}
            </div>

          </div>
        </div>

        {/* 2. HEALING LOGIC GENERATOR (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col bg-[#05060b] border border-gray-850 rounded-2xl overflow-hidden shadow-xl" id="healing-logic-panel">
          <div className="bg-[#0e101a] px-4 py-3.5 border-b border-gray-850 flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Hammer className="w-4 h-4 text-emerald-400" />
              2. Healing Logic Generator
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="p-4 flex flex-col gap-4 flex-1">
            
            {/* Failure Pattern Selector */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[9.5px] font-mono text-gray-500 uppercase font-bold">Uncaught System Faults Feed</label>
                <button
                  onClick={handleInjectFailure}
                  className="text-[8.5px] font-mono text-rose-400 hover:text-rose-300 cursor-pointer transition flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  INJECT ERROR
                </button>
              </div>

              <div className="flex flex-col gap-1.5 bg-black/40 border border-gray-900 rounded-lg p-2 max-h-[105px] overflow-y-auto">
                {failures.map((fail, idx) => (
                  <div
                    key={fail.errorCode}
                    onClick={() => {
                      setSelectedFailureIdx(idx);
                      setSynthesizedHealerCode('');
                    }}
                    className={`p-1.5 rounded cursor-pointer border flex items-center justify-between transition ${
                      selectedFailureIdx === idx 
                        ? 'bg-rose-950/20 border-rose-500/30 text-rose-300 font-bold' 
                        : 'border-transparent text-gray-400 hover:bg-gray-900/40 hover:text-gray-200'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5 truncate pr-2">
                      <span className="font-mono text-[9.5px] flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-rose-500" />
                        {fail.errorCode}
                      </span>
                      <span className="text-[8px] text-gray-500 uppercase font-mono">{fail.subsystem}</span>
                    </div>
                    <span className="font-mono text-[8.5px] bg-gray-950 px-1.5 py-0.5 rounded border border-gray-800 text-gray-400 font-bold">
                      x{fail.frequency}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Heuristics compiler actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExtractPattern}
                disabled={isSynthesizing || failures.length === 0}
                className="w-full py-2 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold rounded-lg cursor-pointer transition flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                {isSynthesizing ? 'SYNTHESIZING...' : 'EXTRACT PATTERN'}
              </button>
              <button
                onClick={handleCompileAndStoreRule}
                disabled={!synthesizedHealerCode.trim()}
                className="w-full py-2 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-300 font-mono text-[10px] font-bold rounded-lg cursor-pointer transition flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                DEPLOY REMEDY
              </button>
            </div>

            {/* Synthesized Healing Code Block */}
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-[9.5px] font-mono text-gray-500 uppercase font-bold">Synthesized Code Remedy (Editable)</label>
              <textarea
                value={synthesizedHealerCode}
                onChange={(e) => setSynthesizedHealerCode(e.target.value)}
                rows={5}
                spellCheck={false}
                placeholder="// Remedy pattern generator output goes here..."
                className="w-full p-2.5 bg-black rounded-xl border border-gray-900 text-gray-200 font-mono text-[9.5px] leading-relaxed resize-none h-[110px] focus:ring-0 focus:border-emerald-500/30 outline-none"
              />
            </div>

            {/* Compiled rules list */}
            <div className="bg-black/30 border border-gray-900 rounded-lg p-2.5 flex flex-col gap-1.5 max-h-[110px] overflow-y-auto">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block border-b border-gray-900 pb-1.5">Registered Healing Rules Index</span>
              {healingRules.map(rule => (
                <div key={rule.id} className="flex items-center justify-between text-[9.5px] font-mono text-gray-400 py-1 border-b border-gray-900/40 last:border-0 last:pb-0">
                  <span className="text-gray-300 truncate max-w-[170px]" title={rule.patternMatch}>
                    {rule.patternMatch}
                  </span>
                  <span className="text-emerald-400 font-bold">
                    {rule.successRate}% SUCCESS
                  </span>
                </div>
              ))}
            </div>

            {/* Module log monitor */}
            <div className="bg-black rounded-lg border border-gray-900 p-2.5 font-mono text-[8.5px] text-emerald-300/80 leading-normal h-[80px] overflow-y-auto space-y-1">
              {healerLogs.map((log, i) => (
                <div key={i} className="border-l border-emerald-500/20 pl-1.5">{log}</div>
              ))}
            </div>

          </div>
        </div>

        {/* 3. LANGGRAPH WORKFLOW ENGINE (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col bg-[#05060b] border border-gray-850 rounded-2xl overflow-hidden shadow-xl" id="workflow-engine-panel">
          <div className="bg-[#0e101a] px-4 py-3.5 border-b border-gray-850 flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Workflow className="w-4 h-4 text-indigo-400 animate-spin-slow" />
              3. LangGraph Workflow Engine
            </span>
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          </div>

          <div className="p-4 flex flex-col gap-4 flex-1 justify-between">
            
            {/* Automation Mode triggers */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9.5px] font-mono text-gray-500 uppercase font-bold">Autonomous Execution Policy</label>
              <div className="grid grid-cols-3 gap-1 bg-black p-1 rounded-lg border border-gray-900 text-center font-mono text-[8.5px]">
                <button
                  onClick={() => setDagAutomationMode('manual')}
                  className={`py-1 rounded-md cursor-pointer transition ${dagAutomationMode === 'manual' ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/20 font-bold' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  MANUAL
                </button>
                <button
                  onClick={() => setDagAutomationMode('continuous')}
                  className={`py-1 rounded-md cursor-pointer transition flex items-center justify-center gap-1 ${dagAutomationMode === 'continuous' ? 'bg-emerald-600/15 text-emerald-300 border border-emerald-500/20 font-bold' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                  CON-TICK
                </button>
                <button
                  onClick={() => setDagAutomationMode('daily')}
                  className={`py-1 rounded-md cursor-pointer transition ${dagAutomationMode === 'daily' ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/20 font-bold' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  DAILY LOOP
                </button>
              </div>
            </div>

            {/* Run Core DAG Button */}
            <button
              onClick={runFullDAGCycle}
              disabled={isDAGRunning}
              className={`w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-mono text-[10px] font-bold rounded-xl cursor-pointer transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/20 ${isDAGRunning ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {isDAGRunning ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>EXECUTING WORKFLOW STEPS...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>RUN COGNITIVE WORKFLOW LOOP</span>
                </>
              )}
            </button>

            {/* VISUAL DAG GRAPH REPRESENTATION */}
            <div className="bg-black/40 border border-gray-900 rounded-2xl p-4 flex flex-col justify-center items-center gap-3 py-6 my-1">
              
              {/* Row 1 Nodes: State Check -> Policy Audit */}
              <div className="flex items-center gap-6">
                <div className={`w-[85px] py-1.5 border rounded-lg text-center font-mono text-[8px] flex flex-col justify-center items-center gap-0.5 transition-all duration-300 ${
                  activeDAGNode === 'state_check' ? 'bg-indigo-500/15 border-indigo-400 text-indigo-300 scale-105 shadow-md shadow-indigo-500/20' : 'bg-[#040509] border-gray-850 text-gray-500'
                }`}>
                  <span className="font-bold">1. STATE CHECK</span>
                  <span className="text-[6.5px] opacity-75">Audit Synapses</span>
                </div>

                <div className="w-4 h-[1px] bg-gray-850 relative">
                  <div className={`absolute top-1/2 left-0 w-2 h-2 rounded-full -translate-y-1/2 bg-indigo-500/50 transition-all ${activeDAGNode === 'state_check' ? 'translate-x-3 duration-1000' : ''}`} />
                </div>

                <div className={`w-[85px] py-1.5 border rounded-lg text-center font-mono text-[8px] flex flex-col justify-center items-center gap-0.5 transition-all duration-300 ${
                  activeDAGNode === 'policy_audit' ? 'bg-indigo-500/15 border-indigo-400 text-indigo-300 scale-105 shadow-md shadow-indigo-500/20' : 'bg-[#040509] border-gray-850 text-gray-500'
                }`}>
                  <span className="font-bold">2. POLICY AUDIT</span>
                  <span className="text-[6.5px] opacity-75">Correlate Rules</span>
                </div>
              </div>

              {/* Down connecting vertical arrows */}
              <div className="h-4 w-[1px] bg-gray-850" />

              {/* Row 2 Nodes: Priority Router -> Sandbox Eval */}
              <div className="flex items-center gap-6">
                <div className={`w-[85px] py-1.5 border rounded-lg text-center font-mono text-[8px] flex flex-col justify-center items-center gap-0.5 transition-all duration-300 ${
                  activeDAGNode === 'priority_route' ? 'bg-indigo-500/15 border-indigo-400 text-indigo-300 scale-105 shadow-md shadow-indigo-500/20' : 'bg-[#040509] border-gray-850 text-gray-500'
                }`}>
                  <span className="font-bold">3. ROUTER NODE</span>
                  <span className="text-[6.5px] opacity-75">Select Priority</span>
                </div>

                <div className="w-4 h-[1px] bg-gray-850 relative">
                  <div className={`absolute top-1/2 left-0 w-2 h-2 rounded-full -translate-y-1/2 bg-indigo-500/50 transition-all ${activeDAGNode === 'priority_route' ? 'translate-x-3 duration-1000' : ''}`} />
                </div>

                <div className={`w-[85px] py-1.5 border rounded-lg text-center font-mono text-[8px] flex flex-col justify-center items-center gap-0.5 transition-all duration-300 ${
                  activeDAGNode === 'sandbox_eval' ? 'bg-indigo-500/15 border-indigo-400 text-indigo-300 scale-105 shadow-md shadow-indigo-500/20' : 'bg-[#040509] border-gray-850 text-gray-500'
                }`}>
                  <span className="font-bold">4. SANDBOX EVAL</span>
                  <span className="text-[6.5px] opacity-75">Verify Code</span>
                </div>
              </div>

              {/* Down connecting vertical arrows */}
              <div className="h-4 w-[1px] bg-gray-850" />

              {/* Row 3 Nodes: Dynamic Healer -> Telemetry Sync */}
              <div className="flex items-center gap-6">
                <div className={`w-[85px] py-1.5 border rounded-lg text-center font-mono text-[8px] flex flex-col justify-center items-center gap-0.5 transition-all duration-300 ${
                  activeDAGNode === 'dynamic_healer' ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300 scale-105 shadow-md shadow-emerald-500/20' : 'bg-[#040509] border-gray-850 text-gray-500'
                }`}>
                  <span className="font-bold">5. AUTO-HEALER</span>
                  <span className="text-[6.5px] opacity-75">Remedy Rules</span>
                </div>

                <div className="w-4 h-[1px] bg-gray-850 relative">
                  <div className={`absolute top-1/2 left-0 w-2 h-2 rounded-full -translate-y-1/2 bg-emerald-500/50 transition-all ${activeDAGNode === 'dynamic_healer' ? 'translate-x-3 duration-1000' : ''}`} />
                </div>

                <div className={`w-[85px] py-1.5 border rounded-lg text-center font-mono text-[8px] flex flex-col justify-center items-center gap-0.5 transition-all duration-300 ${
                  activeDAGNode === 'telemetry_sync' ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300 scale-105 shadow-md shadow-emerald-500/20' : 'bg-[#040509] border-gray-850 text-gray-500'
                }`}>
                  <span className="font-bold">6. TELEMETRY</span>
                  <span className="text-[6.5px] opacity-75">Sync Metrics</span>
                </div>
              </div>

            </div>

            {/* Visual statistics row inside Orchestrator */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#08090f] border border-gray-900 p-2.5 rounded-xl flex flex-col gap-0.5">
                <span className="text-[8.5px] text-gray-500 font-mono">AUTOMATED CYCLES RUN</span>
                <span className="font-mono text-xs text-indigo-400 font-bold">{cycleCount} loops</span>
              </div>
              <div className="bg-[#08090f] border border-gray-900 p-2.5 rounded-xl flex flex-col gap-0.5">
                <span className="text-[8.5px] text-gray-500 font-mono">REASONING LATENCY</span>
                <span className="font-mono text-xs text-emerald-400 font-bold">14.2 ms / step</span>
              </div>
            </div>

            {/* Module log monitor */}
            <div className="bg-black rounded-lg border border-gray-900 p-2.5 font-mono text-[8.5px] text-indigo-300/80 leading-normal h-[100px] overflow-y-auto space-y-1">
              {dagLogs.map((log, i) => (
                <div key={i} className="border-l border-indigo-500/20 pl-1.5">{log}</div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
