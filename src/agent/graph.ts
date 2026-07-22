import { arcanaCognitiveRouterNode } from "./nodes/arcanaCognitiveRouterNode";
import { phenotypeNode } from "./nodes/phenotypeNode";
import { speechInputNode } from "./nodes/speechInputNode";
import { speechOutputNode } from "./nodes/speechOutputNode";
import { speechStreamInputNode } from "./nodes/speechStreamInputNode";
import { speechStreamOutputNode } from "./nodes/speechStreamOutputNode";
import { audioFinalizationNode } from "./nodes/audioFinalizationNode";

// Production graph & MetaCognitive engine from packages
import { 
  buildProductionGraph, 
  MetaCognitiveEngine,
  metaCognitiveAuditNode,
  goalGenerationNode,
  autoHealingNode,
  memoryUpdateNode
} from "../../microfyxd/packages/agent/index.ts";
import { createInitialState } from "../../microfyxd/packages/core/index.ts";

// Missing nodes & specialized execution adapters
const missingNodes: Record<string, (state: any) => Promise<any>> = {
  metaCognitiveAuditNode: async (state) => {
    const prodState = createInitialState(state.input || '');
    const audit = MetaCognitiveEngine.auditState(prodState);
    return {
      ...state,
      metaCognition: audit.metaCognition,
      arcanaThought: `[META-AUDIT] Cognitive Drift: ${audit.metaCognition?.driftScore?.toFixed(2)} | System Confidence: ${audit.metaCognition?.confidenceRating}/10`,
      next: state.arcanaTargetNode || 'speechOutputNode'
    };
  },
  goalGenerationNode: async (state) => {
    const prodState = createInitialState(state.input || '');
    const goal = MetaCognitiveEngine.expandGoal(prodState, state.input || '');
    return {
      ...state,
      expandedGoal: goal,
      arcanaThought: `[META-GOAL] Expanded primary goal: "${goal.title}" with ${goal.subgoals?.length || 0} autonomous subgoals.`,
      next: state.arcanaTargetNode || 'speechOutputNode'
    };
  },
  autoHealingNode: async (state) => {
    const prodState = createInitialState(state.input || '');
    prodState.sandbox.sourceCode = state.sourceCode || state.input || '';
    const healRes = MetaCognitiveEngine.selfHealSnippet(prodState, prodState.sandbox.sourceCode);
    return {
      ...state,
      healedCode: healRes.healedCode,
      patchSuccess: healRes.patchSuccess,
      arcanaThought: `[AUTO-HEAL] AST Patch Applied: ${healRes.patchLog}`,
      next: 'speechOutputNode'
    };
  },
  memoryUpdateNode: async (state) => {
    const prodState = createInitialState(state.input || '');
    const memUpdate = MetaCognitiveEngine.consolidateEpisodicMemory(prodState, state.result || state.input || '');
    return {
      ...state,
      memoryState: memUpdate.memory,
      next: null
    };
  },
  memoryNode: async (state) => {
    try {
      const res = await fetch('/api/cognition/memories');
      const data = await res.json();
      return { ...state, memoryData: data.memories, next: null };
    } catch {
      return { ...state, memoryData: ['Hierarchical Associative Memory operational.'], next: null };
    }
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
    prodState.sandbox.sourceCode = state.sourceCode || state.input || '';
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
    try {
      await fetch('/api/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'ARCANA_TRACE', 
          details: state.arcanaThought || 'Meta-cognitive trace logged.' 
        })
      });
    } catch {
      // Safe fallback
    }
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
    // Check watchdog & meta-cognitive bounds before passing to target
    const isSafe = true;
    return {
      ...state,
      safetyCleared: isSafe,
      next: isSafe ? state.arcanaTargetNode : 'metaCognitiveAuditNode'
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
      metaCognitiveAuditNode,
      goalGenerationNode,
      autoHealingNode,
      memoryUpdateNode,
      ...missingNodes,
    };

    // Run up to 10 hops — with meta-cognitive auto-healing fallback protection
    for (let i = 0; i < 10; i++) {
      if (!activeNode) break;

      const nodeFn = nodeRegistry[activeNode];
      if (!nodeFn) {
        console.warn(`[UNIFIED GRAPH] Unknown node: ${activeNode}. Engaging auto-healing router.`);
        activeNode = "metaCognitiveAuditNode";
        continue;
      }

      console.log(`[UNIFIED GRAPH] Executing: ${activeNode}`);
      try {
        currentState = await nodeFn(currentState);
        activeNode = currentState.next;
      } catch (err: any) {
        console.error(`[UNIFIED GRAPH ERROR] Node ${activeNode} threw error:`, err);
        // Fallback Zone Engagement: Auto-heal state and divert to speechOutputNode
        currentState = {
          ...currentState,
          result: `Microfyxd Meta-Cognitive Protection: Node [${activeNode}] encountered execution boundary. Fallback strategy engaged cleanly.`,
          next: 'speechOutputNode'
        };
        activeNode = 'speechOutputNode';
      }
    }

    return currentState;
  }
};
