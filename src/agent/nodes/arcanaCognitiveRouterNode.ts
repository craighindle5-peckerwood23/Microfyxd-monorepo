import { llm } from "../llm"; // your ChatOpenAI / LLM wrapper

/**
 * Arcana Cognitive Router Node
 * ----------------------------
 * This node:
 * - Reads state.input + current state
 * - Classifies intent into a subsystem
 * - Optionally adds a safety gate
 * - Writes arcanaThought + next
 */

const ROUTABLE_NODES = [
  "egoModelNode",
  "phenotypeNode",
  "doctrineNode",
  "memoryNode",
  "sandboxNode",
  "selfRepairNode",
  "supabaseTraceNode",
  "automotiveObdNode",
  "safetyGateNode",
  "tripleConsensusNode",
];

export async function arcanaCognitiveRouterNode(state: any) {
  const userInput = state.input || "";

  // 1. Classify intent → subsystem
  const intentRes = await llm.invoke([
    {
      role: "system",
      content: `
You are Arcana, the cognitive router for Microfyxd's LangGraph system.
Classify the user's request into ONE of these subsystems:

- egoModelNode          (identity, personality, self-model)
- phenotypeNode         (behavior, style, outward expression)
- doctrineNode          (rules, safety, constraints, ethics)
- memoryNode            (long-term memory, recall, storage)
- sandboxNode           (code generation, execution, testing)
- selfRepairNode        (diagnostics, repair, refactor, fix)
- supabaseTraceNode     (logging, telemetry, traces)
- automotiveObdNode     (vehicle diagnostics, OBD, ECM)
- safetyGateNode        (pre-execution safety checks)
- tripleConsensusNode   (multi-check validation, consensus)

Return ONLY the subsystem name. No explanation.
      `,
    },
    { role: "user", content: userInput },
  ]);

  let route = (intentRes.content || "").trim();

  if (!ROUTABLE_NODES.includes(route)) {
    // fallback: sandbox for unknown intents
    route = "sandboxNode";
  }

  // 2. Generate Arcana's reasoning (for UI + introspection)
  const thoughtRes = await llm.invoke([
    {
      role: "system",
      content: `
You are Arcana, explaining your routing decision inside Microfyxd.
In 1–2 sentences, explain WHY you chose this subsystem,
referencing the user's request and system goals.
      `,
    },
    {
      role: "user",
      content: `User input: "${userInput}"\nChosen subsystem: ${route}`,
    },
  ]);

  const arcanaThought = thoughtRes.content || "";

  // 3. Optional safety: if route is automotive or sandbox, prepend safetyGate
  let nextNode = route;
  let safetyChain = null;

  if (route === "automotiveObdNode" || route === "sandboxNode") {
    // we want: safetyGateNode → route
    safetyChain = route;
    nextNode = "safetyGateNode";
  }

  return {
    ...state,
    arcanaThought,
    next: nextNode,
    // optional hint for downstream nodes
    arcanaTargetNode: safetyChain || route,
  };
}
