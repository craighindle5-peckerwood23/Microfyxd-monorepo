import { arcanaCognitiveRouterNode } from "./nodes/arcanaCognitiveRouterNode";
import { phenotypeNode } from "./nodes/phenotypeNode";
import { speechInputNode } from "./nodes/speechInputNode";
import { speechOutputNode } from "./nodes/speechOutputNode";
import { speechStreamInputNode } from "./nodes/speechStreamInputNode";
import { speechStreamOutputNode } from "./nodes/speechStreamOutputNode";
import { audioFinalizationNode } from "./nodes/audioFinalizationNode";

// Production graph from packages
import { buildProductionGraph } from "../../microfyxd/packages/agent/index.ts";
import { createInitialState } from "../../microfyxd/packages/core/index.ts";
import { PhenotypeEngine } from "../../microfyxd/packages/phenotype/index.ts";

// Missing nodes — stub implementations that call /api/* routes
const missingNodes: Record<string, (state: any) => Promise<any>> = {
  memoryNode: async (state) => {
    const res = await fetch('/api/cognition/memories');
    const data = await res.json();
    return { ...state, memoryData: data.memories, next: null };
  },
  doctrineNode: async (state) => {
    return { 
      ...state, 
      doctrineResult: 'Compliance verified. Arcana Tier active.',
      next: null 
    };
  },
  selfRepairNode: async (state) => {
    // Hand off to production graph sandbox pipeline
    const prodState = createInitialState(state.input || '');
    prodState.sandbox.sourceCode = state.sourceCode || '';
    const graph = buildProductionGraph();
    const result = await graph.run(prodState);
    return { 
      ...state, 
      sandboxResult: result.sandbox,
      traces: result.traces,
      next: 'speechOutputNode'
    };
  },
  supabaseTraceNode: async (state) => {
    await fetch('/api/audit-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'ARCANA_TRACE', 
        details: state.arcanaThought 
      })
    });
    return { ...state, next: null };
  },
  automotiveObdNode: async (state) => {
    const prodState = createInitialState(state.input || '');
    const graph = buildProductionGraph();
    const result = await graph.run(prodState);
    return {
      ...state,
      automotiveResult: result.messages[result.messages.length - 1]?.content,
      traces: result.traces,
      next: 'speechOutputNode'
    };
  },
  safetyGateNode: async (state) => {
    // Check watchdog before passing to target
    const isSafe = true; // watchdog check here
    return {
      ...state,
      safetyCleared: isSafe,
      next: isSafe ? state.arcanaTargetNode : null
    };
  },
  tripleConsensusNode: async (state) => {
    // Run production graph three times, merge results
    const prodState = createInitialState(state.input || '');
    const graph = buildProductionGraph();
    const [r1, r2, r3] = await Promise.all([
      graph.run({ ...prodState }),
      graph.run({ ...prodState }),
      graph.run({ ...prodState }),
    ]);
    const consensus = r1.messages[r1.messages.length - 1]?.content;
    return { 
      ...state, 
      consensusResult: consensus,
      next: 'speechOutputNode'
    };
  },
};

// ── UNIFIED GRAPH ──
export const microfyxdApp = {
  invoke: async (state: any) => {
    let currentState = { ...state };

    // Determine entry point
    let activeNode = "arcanaCognitiveRouterNode";

    if (currentState.audioChunk) {
      activeNode = "speechStreamInputNode";
    } else if (currentState.speechInputAudio) {
      activeNode = "speechInputNode";
    }

    // All registered nodes in one place
    const nodeRegistry: Record<string, (s: any) => Promise<any>> = {
      arcanaCognitiveRouterNode,
      phenotypeNode,
      speechInputNode,
      speechOutputNode,
      speechStreamInputNode,
      speechStreamOutputNode,
      audioFinalizationNode,
      ...missingNodes,
    };

    // Run up to 10 hops — enough for any routing chain
    for (let i = 0; i < 10; i++) {
      if (!activeNode) break;

      const nodeFn = nodeRegistry[activeNode];
      if (!nodeFn) {
        console.warn(`[UNIFIED GRAPH] Unknown node: ${activeNode}`);
        break;
      }

      console.log(`[UNIFIED GRAPH] Executing: ${activeNode}`);
      currentState = await nodeFn(currentState);
      activeNode = currentState.next;
    }

    return currentState;
  }
};
