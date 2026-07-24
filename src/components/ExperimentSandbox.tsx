import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCw, 
  GitBranch, 
  Plus, 
  Trash2, 
  FileCode, 
  Terminal, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb, 
  Layers 
} from 'lucide-react';

interface ExperimentSandboxProps {
  onApplyCoherenceBoost: (boost: number) => void;
}

interface SandboxBranch {
  name: string;
  code: string;
  logs: string[];
  visualData: number[];
  visualLabel: string;
  metrics: { coherenceBoost: number; latencyMs: number };
  lastExecuted?: string;
}

const TEMPLATES = {
  quantum: `// Quantum Sine-Resonance Wave Generator
const wavePoints = [];
const frequency = 2.4;
const noiseAmplitude = 8;

console.log("Initializing digital signal processor on active channel...");

for (let i = 0; i < 50; i++) {
  // Synthesize multi-harmonic sine waves + randomized noise
  const sine1 = Math.sin(i * 0.25 * frequency) * 45;
  const sine2 = Math.cos(i * 0.12) * 18;
  const jitter = (Math.random() - 0.5) * noiseAmplitude;
  
  wavePoints.push(Math.round(sine1 + sine2 + jitter));
}

console.log("Successfully synthesized 50 neural phase vectors.");
console.log("Frequencies calibrated: 2.4Hz Primary | 1.15Hz Sub-resonance.");
console.log("Voltage range bound: -63mV to +63mV.");

return {
  label: "Quantum Resonance Bio-Signal",
  data: wavePoints,
  metrics: { coherenceBoost: 5.4, latencyMs: 14.8 }
};`,

  stdp: `// Spike-Timing-Dependent Plasticity (STDP) Weight Delta Simulator
const deltas = [];
let totalWeightChange = 0;

console.log("Emulating post-synaptic STDP adaptation weights...");

for (let t = -25; t <= 25; t += 1) {
  // STDP standard exponential learning rule
  let dw = 0;
  if (t > 0) {
    dw = 0.85 * Math.exp(-t / 12); // Potentiation (LTP)
  } else if (t < 0) {
    dw = -0.65 * Math.exp(t / 9);  // Depression (LTD)
  } else {
    dw = 0.05;
  }
  
  totalWeightChange += dw;
  deltas.push(Math.round(dw * 120));
}

console.log("STDP backpropagation epoch completed successfully.");
console.log("Net synaptic strength adjustment is positive: +" + totalWeightChange.toFixed(3));
console.log("Synaptic connectivity upgraded in cortical partition B.");

return {
  label: "STDP Weight Potentiation (LTP/LTD) Map",
  data: deltas,
  metrics: { coherenceBoost: 8.5, latencyMs: 22.1 }
};`,

  stochastic: `// Stochastic Neural Thermal Noise Simulator
const points = [];
const baseVoltage = -70;

console.log("Simulating stochastic neural background noise...");

for (let i = 0; i < 50; i++) {
  // Generate random gaussian-like noise centered around a resting potential
  const thermalNoise = (Math.random() - 0.5) * 32;
  const baselineDrift = Math.sin(i * 0.4) * 8;
  
  points.push(Math.round(baseVoltage + thermalNoise + baselineDrift));
}

console.log("Resting neural potential calibrated at -70mV.");
console.log("Calculated statistical standard deviation is ±16mV.");
console.log("Watchdog feedback loop verifies zero leakage on channel 4.");

return {
  label: "Stochastic Neural Noise Waveform (mV)",
  data: points,
  metrics: { coherenceBoost: -1.2, latencyMs: 5.6 }
};`
};

export const ExperimentSandbox: React.FC<ExperimentSandboxProps> = ({
  onApplyCoherenceBoost
}) => {
  // Manage branches state
  const [branches, setBranches] = useState<SandboxBranch[]>([
    {
      name: "trunk/master-cognitive",
      code: TEMPLATES.quantum,
      logs: ["Branch trunk/master-cognitive initialized with quantum template."],
      visualData: [10, 20, 32, 45, 38, 20, -5, -24, -45, -35, -12, 12, 34, 48, 41, 22, -2, -28, -48, -32, -8, 18, 38, 49, 39, 18, -10, -32, -49, -30, -5, 24, 42, 47, 34, 12, -15, -36, -46, -24, 2, 28, 45, 43, 26, 2, -22, -41, -43, -20],
      visualLabel: "Quantum Resonance Bio-Signal",
      metrics: { coherenceBoost: 5.4, latencyMs: 14.8 }
    },
    {
      name: "experiment/stdp-adaptation",
      code: TEMPLATES.stdp,
      logs: ["Branch experiment/stdp-adaptation branched off from templates."],
      visualData: Array.from({ length: 51 }, (_, i) => {
        const t = i - 25;
        if (t > 0) return Math.round(0.85 * Math.exp(-t / 12) * 120);
        if (t < 0) return Math.round(-0.65 * Math.exp(t / 9) * 120);
        return 6;
      }),
      visualLabel: "STDP Weight Potentiation (LTP/LTD) Map",
      metrics: { coherenceBoost: 8.5, latencyMs: 22.1 }
    }
  ]);

  const [activeBranchIdx, setActiveBranchIdx] = useState<number>(0);
  const [newBranchName, setNewBranchName] = useState<string>("");
  const [isCreatingBranch, setIsCreatingBranch] = useState<boolean>(false);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeBranch = branches[activeBranchIdx] || branches[0];

  // Plotted oscilloscope draw logic
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas with dark grid background
    ctx.fillStyle = '#030408';
    ctx.fillRect(0, 0, width, height);

    // Draw Grid Lines
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    const gridSpacing = 30;
    for (let x = 0; x < width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    // Horizontal grid lines
    for (let y = 0; y < height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw Center Baseline
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    const data = activeBranch.visualData || [];
    if (data.length === 0) return;

    // Find min and max to auto-scale data visually
    const maxVal = Math.max(...data, 1);
    const minVal = Math.min(...data, -1);
    const absoluteMax = Math.max(Math.abs(maxVal), Math.abs(minVal));

    // Plot values
    ctx.strokeStyle = '#10b981'; // Neon emerald green
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#059669';
    ctx.shadowBlur = 8;
    ctx.beginPath();

    const paddingX = 20;
    const plotWidth = width - paddingX * 2;
    const stepX = plotWidth / (data.length - 1);

    data.forEach((val, index) => {
      const x = paddingX + index * stepX;
      // Map value relative to baseline (absoluteMax represents 80% height headroom)
      const ratio = val / absoluteMax;
      const y = height / 2 - (ratio * (height / 2) * 0.75);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Reset shadow for drawing circles
    ctx.shadowBlur = 0;

    // Draw individual node points on hover style
    ctx.fillStyle = '#6ee7b7';
    data.forEach((val, index) => {
      const x = paddingX + index * stepX;
      const ratio = val / absoluteMax;
      const y = height / 2 - (ratio * (height / 2) * 0.75);
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

  }, [activeBranch.visualData, activeBranchIdx]);

  // Execute Code safely client-side
  const runExperimentCode = () => {
    setExecutionError(null);
    setSuccessBanner(null);

    const capturedLogs: string[] = [];
    const customConsole = {
      log: (...args: any[]) => {
        capturedLogs.push(`[INFO] ${args.join(' ')}`);
      },
      error: (...args: any[]) => {
        capturedLogs.push(`[ERROR] ${args.join(' ')}`);
      },
      warn: (...args: any[]) => {
        capturedLogs.push(`[WARN] ${args.join(' ')}`);
      }
    };

    try {
      // Create executable sandbox function wrapping context and capturing scope returns
      const userCodeWrapper = new Function('console', 'Math', `
        try {
          ${activeBranch.code}
        } catch (err) {
          throw err;
        }
      `);

      const result = userCodeWrapper(customConsole, Math);

      if (!result || typeof result !== 'object') {
        throw new Error("Experiment code must return an object: { label: string, data: number[], metrics: { coherenceBoost: number, latencyMs: number } }");
      }

      if (!result.label || !Array.isArray(result.data)) {
        throw new Error("Sandbox return object mismatch. Expected 'label' (string) and 'data' (number[]) variables.");
      }

      const verifiedMetrics = {
        coherenceBoost: typeof result.metrics?.coherenceBoost === 'number' ? result.metrics.coherenceBoost : 3.5,
        latencyMs: typeof result.metrics?.latencyMs === 'number' ? result.metrics.latencyMs : 12.0
      };

      // Successfully ran. Save results to branch state
      const updatedLogs = [
        `[${new Date().toLocaleTimeString()}] [EXEC] Deploying compiled scratchpad execution layer...`,
        ...capturedLogs,
        `[${new Date().toLocaleTimeString()}] [SUCCESS] Compiled experiment returns verified output dataset [${result.data.length} floats].`,
        `[${new Date().toLocaleTimeString()}] [METRICS] Synthesized boost factor: ${verifiedMetrics.coherenceBoost}% | Latency: ${verifiedMetrics.latencyMs}ms`
      ];

      setBranches(prev => {
        const copy = [...prev];
        copy[activeBranchIdx] = {
          ...copy[activeBranchIdx],
          logs: updatedLogs,
          visualData: result.data,
          visualLabel: result.label,
          metrics: verifiedMetrics,
          lastExecuted: new Date().toLocaleTimeString()
        };
        return copy;
      });

      setSuccessBanner(`Experiment ran successfully! Synthesized Coherence Factor: +${verifiedMetrics.coherenceBoost}%`);

    } catch (err: any) {
      const errorMsg = err.message || String(err);
      setExecutionError(errorMsg);
      
      const failedLogs = [
        `[${new Date().toLocaleTimeString()}] [CRITICAL] COMPILER CRASH! Sandboxed execution layer aborted.`,
        `[${new Date().toLocaleTimeString()}] [CRITICAL] Exception Trace: ${errorMsg}`,
        `[${new Date().toLocaleTimeString()}] [HEAL] Suggestion: Verify syntax, balance brackets, and return compliant output schema.`
      ];

      setBranches(prev => {
        const copy = [...prev];
        copy[activeBranchIdx] = {
          ...copy[activeBranchIdx],
          logs: failedLogs
        };
        return copy;
      });
    }
  };

  // Self-correcting AST auto-repair for sandbox scratchpad
  const autoHealCode = () => {
    let code = activeBranch.code;
    
    // Heuristic 1: If missing return statement with required schema
    if (!code.includes('return {') && !code.includes('return (')) {
      code += `\n\n// [MICROFYXD SELF-REPAIR LOOP: AUTO-GENERATED COMPLIANT RETURN SCHEMA]\nreturn {\n  label: "Auto-Healed Neural Stream",\n  data: Array.from({length: 50}, (_, i) => Math.round(Math.sin(i * 0.25) * 40 + (Math.random() - 0.5) * 6)),\n  metrics: { coherenceBoost: 5.0, latencyMs: 12.5 }\n};`;
    } else {
      // Heuristic 2: Wrap unsafe calls or add safety guard
      code = `try {\n${code}\n} catch(e) {\n  console.log("Self-repair caught exception: " + e.message);\n  return { label: "Healed Stream", data: [10, 20, 30, 20, 10], metrics: { coherenceBoost: 3.0, latencyMs: 8.0 } };\n}`;
    }

    setBranches(prev => {
      const copy = [...prev];
      copy[activeBranchIdx] = {
        ...copy[activeBranchIdx],
        code: code,
        logs: [
          ...copy[activeBranchIdx].logs,
          `[${new Date().toLocaleTimeString()}] [AUTO-HEAL] AST self-repair patch applied to code. Rerunning simulation...`
        ]
      };
      return copy;
    });

    setExecutionError(null);
    setSuccessBanner("AST Patch applied cleanly! Rerunning simulation...");
    setTimeout(() => {
      runExperimentCode();
    }, 150);
  };

  // Create custom branch
  const createBranch = () => {
    if (!newBranchName.trim()) return;
    const name = newBranchName.trim().toLowerCase().replace(/\s+/g, '-');
    
    // Fork code from active branch
    const forkedBranch: SandboxBranch = {
      name: `experiment/${name}`,
      code: activeBranch.code,
      logs: [`Forked branch experiment/${name} from ${activeBranch.name} successfully.`],
      visualData: [...activeBranch.visualData],
      visualLabel: `${activeBranch.visualLabel} (Forked)`,
      metrics: { ...activeBranch.metrics }
    };

    setBranches(prev => [...prev, forkedBranch]);
    setActiveBranchIdx(branches.length); // Switch to newly created branch
    setNewBranchName("");
    setIsCreatingBranch(false);
  };

  // Delete current branch (if not trunk/master-cognitive)
  const deleteActiveBranch = () => {
    if (activeBranch.name === "trunk/master-cognitive") return;
    setBranches(prev => prev.filter((_, idx) => idx !== activeBranchIdx));
    setActiveBranchIdx(0);
  };

  // Inject template
  const injectTemplate = (type: 'quantum' | 'stdp' | 'stochastic') => {
    const code = TEMPLATES[type];
    setBranches(prev => {
      const copy = [...prev];
      copy[activeBranchIdx] = {
        ...copy[activeBranchIdx],
        code,
        logs: [
          `[${new Date().toLocaleTimeString()}] [SYSTEM] Injected preset template: ${type.toUpperCase()}`,
          ...copy[activeBranchIdx].logs
        ]
      };
      return copy;
    });
    setExecutionError(null);
    setSuccessBanner(null);
  };

  return (
    <div className="flex flex-col gap-5 text-xs animate-fadeIn">
      
      {/* HEADER ROW */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-emerald-950/20 to-indigo-950/15 border border-emerald-500/10 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
            <Layers className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-tight">Experiment Sandbox & Multi-Branch Execution Layer</h4>
            <p className="text-[11px] text-gray-400 mt-0.5">Fork code branches, deploy custom mathematical micro-functions, and pipe synthetic data into the core pipeline</p>
          </div>
        </div>

        {/* Branch Selector & Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-gray-950 border border-gray-800 px-2.5 py-1.5 rounded-lg">
            <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={activeBranchIdx}
              onChange={(e) => {
                setActiveBranchIdx(parseInt(e.target.value));
                setExecutionError(null);
                setSuccessBanner(null);
              }}
              className="bg-transparent border-none outline-none font-mono text-[10.5px] text-gray-300 pr-1 select-none"
            >
              {branches.map((b, idx) => (
                <option key={idx} value={idx} className="bg-gray-950 text-gray-300 font-mono">
                  {b.name} {b.name === "trunk/master-cognitive" ? "(Active trunk)" : ""}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsCreatingBranch(true)}
            className="p-2 bg-gray-900 hover:bg-gray-800 border border-gray-850 text-gray-300 rounded-lg cursor-pointer transition flex items-center gap-1"
            title="Create New Experiment Branch"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          {activeBranch.name !== "trunk/master-cognitive" && (
            <button
              onClick={deleteActiveBranch}
              className="p-2 bg-gray-900 hover:bg-rose-950/40 hover:border-rose-900/40 text-gray-400 hover:text-rose-400 border border-gray-850 rounded-lg cursor-pointer transition"
              title="Delete Active Branch"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* CREATE BRANCH INPUT MODAL IF ACTIVE */}
      {isCreatingBranch && (
        <div className="p-3 bg-[#0a0c14] border border-indigo-500/20 rounded-xl flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2 flex-1">
            <GitBranch className="w-4 h-4 text-indigo-400" />
            <span className="font-mono text-gray-400">Fork as: experiment/</span>
            <input 
              type="text"
              placeholder="e.g. quantum-overdrive-multiplier"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              className="bg-gray-950 border border-gray-850 outline-none p-1.5 rounded text-white font-mono text-xs flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') createBranch();
              }}
            />
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={createBranch}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[10px] px-3 py-1.5 rounded cursor-pointer transition"
            >
              FORK BRANCH
            </button>
            <button
              onClick={() => setIsCreatingBranch(false)}
              className="bg-gray-900 text-gray-400 font-mono text-[10px] px-3 py-1.5 rounded cursor-pointer transition border border-gray-850"
            >
              CANCEL
            </button>
          </div>
        </div>
      )}

      {/* ERROR & SUCCESS BANNER OVERLAYS */}
      {executionError && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold uppercase font-mono text-xs text-rose-300">Simulation Evaluation Fault</span>
              <p className="text-[11px] text-gray-300 mt-0.5">{executionError}</p>
            </div>
          </div>
          <button
            onClick={autoHealCode}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black font-mono text-xs rounded-lg shadow-lg flex items-center gap-1.5 shrink-0 cursor-pointer transition-all"
          >
            <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
            AUTO-HEAL & RERUN CODE
          </button>
        </div>
      )}

      {successBanner && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-3 rounded-lg flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="font-bold uppercase font-mono text-[10.5px]">Simulation Deployed successfully</span>
              <p className="text-[10px] text-gray-400 mt-0.5">Experimental signal metrics synced to central telemetry telemetry pipelines.</p>
            </div>
          </div>
          <button
            onClick={() => {
              onApplyCoherenceBoost(activeBranch.metrics.coherenceBoost);
              setSuccessBanner(null);
            }}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[9px] font-bold rounded cursor-pointer transition"
          >
            PIPE +{activeBranch.metrics.coherenceBoost.toFixed(1)}% COHERENCE
          </button>
        </div>
      )}

      {/* CORE WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT COMPILER PANEL: Editor & Templates */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-[#05060a] border border-gray-850 rounded-xl flex flex-col overflow-hidden shadow-md">
            
            {/* Editor Header */}
            <div className="bg-[#0e101a] px-4 py-2.5 border-b border-gray-850 flex items-center justify-between font-mono text-[11px] text-gray-400">
              <span className="flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-emerald-400" /> 
                <span>active_scratchpad_simulation.js</span>
              </span>
              <span className="text-gray-500 text-[10px]">BRANCH: {activeBranch.name}</span>
            </div>

            {/* Quick Presets row */}
            <div className="bg-[#08090f] border-b border-gray-900 px-4 py-1.5 flex items-center gap-2 overflow-x-auto text-[10px] font-mono">
              <span className="text-gray-500 mr-1 uppercase text-[9px] font-bold">Presets:</span>
              <button
                onClick={() => injectTemplate('quantum')}
                className="px-2 py-0.5 bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/30 border border-indigo-900/20 rounded transition cursor-pointer"
              >
                Quantum Wave
              </button>
              <button
                onClick={() => injectTemplate('stdp')}
                className="px-2 py-0.5 bg-purple-950/40 text-purple-300 hover:bg-purple-900/30 border border-purple-900/20 rounded transition cursor-pointer"
              >
                STDP Weights
              </button>
              <button
                onClick={() => injectTemplate('stochastic')}
                className="px-2 py-0.5 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/30 border border-emerald-900/20 rounded transition cursor-pointer"
              >
                Stochastic Drift
              </button>
            </div>

            {/* Main Interactive Code Textarea */}
            <div className="relative flex-1 bg-[#040509]">
              <textarea
                value={activeBranch.code}
                onChange={(e) => {
                  const val = e.target.value;
                  setBranches(prev => {
                    const copy = [...prev];
                    copy[activeBranchIdx] = {
                      ...copy[activeBranchIdx],
                      code: val
                    };
                    return copy;
                  });
                }}
                rows={16}
                spellCheck={false}
                className="w-full p-4 bg-transparent outline-none border-none font-mono text-[11px] leading-relaxed text-gray-200 resize-none h-[320px] focus:ring-0"
                placeholder="Write standard sandboxed javascript here..."
              />
              
              {/* Floating execution metrics */}
              {activeBranch.lastExecuted && (
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-gray-950/85 border border-gray-850 rounded font-mono text-[8.5px] text-gray-500">
                  Last Executed: {activeBranch.lastExecuted}
                </div>
              )}
            </div>

            {/* Sandbox footer actions */}
            <div className="bg-[#0a0b12] px-4 py-3 border-t border-gray-850 flex items-center justify-between">
              <div className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-indigo-400" />
                <span>Code runs inside a client-side JS evaluation sandbox.</span>
              </div>

              <button
                onClick={runExperimentCode}
                className="bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/20 text-[10px] font-mono font-bold px-4 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/20"
              >
                <Play className="w-3.5 h-3.5" />
                <span>DEPLOY SIMULATION</span>
              </button>
            </div>

          </div>
        </div>

        {/* RIGHT ANALYZER PANEL: Oscilloscope & Output Stream Logs */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Oscilloscope Waveform Plotted Canvas */}
          <div className="bg-[#05060a] border border-gray-850 rounded-xl p-4 flex flex-col gap-2 shadow-md">
            <span className="text-xs font-mono font-bold text-white flex items-center justify-between border-b border-gray-850 pb-2">
              <span className="flex items-center gap-1.5">
                <RotateCw className="w-4 h-4 text-emerald-400 animate-spin-slow" />
                EXPERIMENT OSCILLOSCOPE MONITOR
              </span>
              <span className="text-[10px] text-gray-500 font-mono">Points: {activeBranch.visualData.length}</span>
            </span>

            {/* Simulated Plotted Wave Graph */}
            <div className="relative rounded-lg border border-gray-900 overflow-hidden">
              <canvas 
                ref={canvasRef} 
                width={340} 
                height={170} 
                className="w-full h-[170px]"
              />
              <div className="absolute top-2.5 right-2.5 bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-[9.5px] font-mono px-2 py-1 rounded-lg">
                {activeBranch.visualLabel}
              </div>
            </div>

            {/* Quick Metrics display inside analyzer */}
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="bg-[#08090f] border border-gray-900 p-2 rounded-lg flex flex-col gap-0.5">
                <span className="text-[9px] text-gray-500 font-mono">LATENCY PERFORMANCE</span>
                <span className="font-mono text-xs text-indigo-400 font-bold">{activeBranch.metrics.latencyMs} ms</span>
              </div>
              <div className="bg-[#08090f] border border-gray-900 p-2 rounded-lg flex flex-col gap-0.5">
                <span className="text-[9px] text-gray-500 font-mono">ESTIMATED COHERENCE GAIN</span>
                <span className="font-mono text-xs text-emerald-400 font-bold">+{activeBranch.metrics.coherenceBoost}%</span>
              </div>
            </div>
          </div>

          {/* Sandbox console output */}
          <div className="bg-[#05060a] border border-gray-850 rounded-xl p-4 flex flex-col gap-2.5 shadow-md flex-1 min-h-[180px]">
            <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 border-b border-gray-850 pb-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              SANDBOX RUNTIME LOGGER
            </span>

            <div className="flex-1 bg-[#030408] rounded-lg p-3 font-mono text-[10px] text-gray-400 overflow-y-auto space-y-1.5 border border-gray-900 max-h-[220px]">
              {activeBranch.logs.map((log, idx) => {
                let textClass = "text-gray-400";
                if (log.includes("[SUCCESS]")) textClass = "text-emerald-400 font-bold";
                else if (log.includes("[ERROR]")) textClass = "text-rose-400 font-bold animate-pulse";
                else if (log.includes("[CRITICAL]")) textClass = "text-rose-400 font-bold";
                else if (log.includes("[EXEC]")) textClass = "text-indigo-400 font-bold";
                else if (log.includes("[METRICS]")) textClass = "text-cyan-400";
                
                return (
                  <div key={idx} className={textClass}>
                    {log}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
