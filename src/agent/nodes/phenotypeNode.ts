import { llm } from "../llm";

/**
 * Phenotype Node
 * ---------------------
 * This node handles the biological and behavioral trait processing for Microfyxd.
 * It observes the current state, doctrine, and arcana thoughts to generate
 * observable behavioral traits (the "phenotype") that dictate how the agent
 * expresses itself in the current operating epoch.
 */

export async function phenotypeNode(state: any) {
  // 1. Analyze the current state to determine behavioral phenotype
  const phenotypeRes = await llm.invoke([
    {
      role: "system",
      content: `
You are the Phenotype Engine for Microfyxd.
Your purpose is to translate the current cognitive state into observable behavioral traits.
Based on the active subsystem and Arcana's intent, generate 3-4 specific behavioral modifiers.
Examples: "High-alert diagnostic posture", "Aggressive memory pruning", "Cautious system probing".
Return ONLY a comma-separated list of these behavioral traits.
      `
    },
    { 
      role: "user", 
      content: `Current subsystem intent: ${state.next || 'Unknown'}\nArcana thought context: ${state.arcanaThought || 'None'}` 
    }
  ]);

  const traits = phenotypeRes.content.split(',').map(t => t.trim());

  // 2. Formulate the explicit phenotype expression for the UI binding
  const expressionRes = await llm.invoke([
    {
      role: "system",
      content: "Briefly explain how these behavioral traits will manifest in the agent's immediate actions."
    },
    { role: "user", content: `Behavioral traits: ${traits.join(', ')}` }
  ]);

  const phenotypeExpression = expressionRes.content;

  // 3. Define the Phenotype state update interface for UI bindings
  // The state updates are structured to match the expectations of invokeGraphFromUI
  return {
    ...state,
    phenotype: {
      activeTraits: traits,
      expression: phenotypeExpression,
      biologicalResonance: Math.floor(Math.random() * 40) + 60, // e.g. 60-100 scale for UI
      adaptationIndex: Math.random().toFixed(2) // 0.00 to 1.00 index
    },
    // Phenotype typically routes to Doctrine or Memory as the next step in the cycle
    // In a dynamic LangGraph, we can route it back to Arcana or a specific node.
    // For this flow, we'll route it back to Arcana or default to Sandbox if unspecified.
    next: "doctrineNode" 
  };
}
