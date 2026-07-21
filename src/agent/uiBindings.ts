// This file acts as the UI binding bridge for the LangGraph agent.
import { microfyxdApp } from "./graph";

export async function invokeGraphFromUI(input: any) {
  // Invokes the compiled LangGraph application
  // Input could be a string or an object with audioChunk/speechInputAudio
  const payload = typeof input === 'string' ? { input } : input;
  const result = await microfyxdApp.invoke(payload);

  // Exposes the LangGraph state back to the React UI components
  return {
    activeNode: result.next,
    arcanaThought: result.arcanaThought,
    ego: result.ego,
    // --- Phenotype Interface for UI Bindings ---
    // The UI consumes this to render behavioral traits, resonance metrics, and expressions
    phenotype: result.phenotype || {
      activeTraits: [],
      expression: "Awaiting behavioral synthesis...",
      biologicalResonance: 0,
      adaptationIndex: 0
    },
    doctrine: result.doctrine,
    memory: result.memory,
    sandboxStatus: result.sandboxStatus,
    automotiveStatus: result.automotiveStatus,
    supabaseTraceId: result.supabaseTraceId,
    error: result.error,
    result: result.result,
    
    // Audio/Speech specific states
    speechAudio: result.speechAudio,
    partialSpeechAudio: result.partialSpeechAudio,
    finalSpeechAudio: result.finalSpeechAudio,
    partialInput: result.partialInput,
    speechInputText: result.speechInputText
  };
}
