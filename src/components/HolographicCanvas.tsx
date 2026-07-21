import React from 'react';
import { QuantumLatticeHead } from './hologram/QuantumLatticeHead';
import { ArcanaSpeechResonance } from './hologram/ArcanaSpeechResonance';
import { GraphReactiveHead } from './hologram/GraphReactiveHead';
import { VolumetricHologramLayer } from './hologram/VolumetricHologramLayer';

interface HolographicCanvasProps {
  coherence: number;
  isTuningActive?: boolean;
  activeTab?: string;
  isSpeaking?: boolean;
  isListening?: boolean;
  isProcessing?: boolean;
  mode?: 'head' | 'sphere' | 'full';
  theme?: 'dark' | 'light';
}

export const HolographicCanvas: React.FC<HolographicCanvasProps> = ({
  coherence,
  isTuningActive = false,
  activeTab = 'cockpit',
  isSpeaking = false,
  isListening = false,
  isProcessing = false,
  mode = 'head',
  theme = 'dark'
}) => {
  const isLight = theme === 'light';

  // Map our UI state to the simulated graphState for the 2D visualizers
  const graphState = {
    activeNode: isProcessing 
        ? 'arcanaDirectorNode' 
        : (activeTab === 'quantum_tuning' ? 'phenotypeNode' : (activeTab === 'memory' ? 'memoryNode' : 'default')),
    arcanaThought: isSpeaking ? 'Synthesizing...' : '',
    speechAudio: isSpeaking ? new ArrayBuffer(0) : null,
  };

  const currentTheme: 'dark' | 'light' = theme as 'dark' | 'light';

  return (
    <div 
      className={`w-full h-full min-h-[320px] rounded-2xl relative overflow-hidden group select-none flex flex-col justify-center items-center transition-colors duration-300 ${
        isLight 
          ? 'bg-gradient-to-b from-slate-100 to-indigo-50/40 border border-slate-200/80 shadow-lg shadow-indigo-100/40' 
          : 'bg-[#05060b] border border-gray-850/80 shadow-2xl shadow-cyan-950/20'
      }`}
      id="2d-hologram-visualizer"
    >
      {/* 2D Layered Holographic Canvas */}
      <div className="relative w-full h-full min-h-[350px]">
        <VolumetricHologramLayer graphState={graphState} theme={currentTheme} />
        <QuantumLatticeHead graphState={graphState} theme={currentTheme} />
        <GraphReactiveHead graphState={graphState} theme={currentTheme} listening={isListening} />
        <ArcanaSpeechResonance graphState={graphState} theme={currentTheme} />
      </div>

      {/* Holographic Controls overlay HUD Top Left */}
      <div className="absolute top-3.5 left-4 z-10 flex flex-col gap-0.5 pointer-events-none">
        <span className={`text-[11px] font-mono font-bold flex items-center gap-1.5 ${isLight ? 'text-indigo-600' : 'text-cyan-400'}`}>
          <span className={`w-2 h-2 rounded-full animate-ping ${isSpeaking ? 'bg-purple-500' : isLight ? 'bg-indigo-600' : 'bg-cyan-400'}`} />
          {isSpeaking ? 'ARCANA SYNTHESIZER [SPEAKING]' : 'ARCANA QUANTUM LATTICE CORE'}
        </span>
        <span className={`text-[9px] font-mono ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>
          INTERACTIVE 2D FACIAL MESH | ACTIVE NODE: {graphState.activeNode.toUpperCase()}
        </span>
      </div>

      {/* HUD Bottom Status */}
      <div className={`absolute bottom-3.5 left-4 right-4 z-10 flex items-center justify-between pointer-events-none border-t pt-2 ${
        isLight ? 'border-slate-200/80' : 'border-gray-900/60'
      }`}>
        <div className="flex items-center gap-3">
          <span className={`text-[9.5px] font-mono flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
            <span>COHERENCE RESONANCE:</span>
            <span className={`font-bold ${isLight ? 'text-indigo-600' : 'text-cyan-400'}`}>{coherence.toFixed(1)}%</span>
          </span>
        </div>
        <span className={`text-[9.5px] font-mono font-bold ${
          isSpeaking 
            ? 'text-purple-500 animate-pulse' 
            : isProcessing 
              ? 'text-amber-500 animate-pulse' 
              : isLight 
                ? 'text-emerald-600' 
                : 'text-emerald-400'
        }`}>
          {isSpeaking ? 'VOCAL SYNTHESIS ACTIVE' : isProcessing ? 'PROCESSING AGENT INFERENCE' : 'NEURAL SHIELD READY'}
        </span>
      </div>
    </div>
  );
};
