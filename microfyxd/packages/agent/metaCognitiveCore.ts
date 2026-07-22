import { MicrofyxdState, MetaGoal, MetaFailurePattern } from '@microfyxd/core';
import { SandboxService } from '@microfyxd/sandbox';
import { HierarchicalAssociativeMemory } from '@microfyxd/memory';

export class MetaCognitiveEngine {
  /**
   * Evaluates system reasoning, measures cognitive drift, updates confidence ratings,
   * and dynamically checks policy compliance and fallback zones.
   */
  static auditState(state: MicrofyxdState): Partial<MicrofyxdState> {
    let driftPoints = 0;

    // 1. Watchdog Telemetry Drift
    if (state.watchdog.ramUsagePercent > 80) driftPoints += 0.2;
    if (state.watchdog.cpuUsagePercent > 80) driftPoints += 0.2;
    if (state.watchdog.activeAlerts.length > 0) driftPoints += 0.3;
    if (state.watchdog.safetyOverrideEngaged) driftPoints += 0.4;

    // 2. Sandbox Error Drift
    if (state.sandbox.diagnostics?.hasBug) driftPoints += 0.25;

    // 3. Repeated Failure Patterns Drift
    const recentFailures = state.metaCognition.failurePatterns.slice(-5);
    if (recentFailures.length >= 3) driftPoints += 0.3;

    // Normalize drift score between 0.00 and 1.00
    const rawDrift = Math.min(1.0, Math.max(0.0, driftPoints));
    const confidenceRating = Math.max(1.0, Math.min(10.0, Number((10 - rawDrift * 8).toFixed(1))));

    // Determine fallback triggers
    const fallbackZones = { ...state.metaCognition.fallbackZones };
    if (rawDrift > 0.6) {
      fallbackZones['active_emergency_fallback'] = 'ENGAGED: Conservative execution, triple-check consensus and rate-limiting active.';
    }

    const updatedAuditLogs = [
      ...state.ego.introspectionLogs,
      `[META_AUDIT] Epoch Tier ${state.metaCognition.selfEvolutionEpoch}: Drift Score calculated at ${rawDrift.toFixed(2)}, System Confidence Rating: ${confidenceRating}/10.`
    ];

    return {
      ego: {
        ...state.ego,
        introspectionLogs: updatedAuditLogs,
        selfCheckRating: confidenceRating,
      },
      metaCognition: {
        ...state.metaCognition,
        driftScore: rawDrift,
        confidenceRating,
        fallbackZones,
        lastMetaAuditTimestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Autonomous Goal Generation & Subgoal Expansion.
   * Breaks down high-level user prompts or system states into actionable, prioritized subgoals.
   */
  static expandGoal(state: MicrofyxdState, prompt: string): MetaGoal {
    const goalId = `goal-${Date.now().toString().slice(-6)}`;
    const lower = prompt.toLowerCase();

    let title = 'Autonomous Workspace Execution & Meta-Cognitive Routing';
    let description = 'Execute task with real-time introspection, self-repair, and HAM memory persistence.';
    let priority = 7;
    let assignedNode = 'arcanaCognitiveRouterNode';
    let fallbackZone = 'rule_based_fallback_zone';

    const subgoals = [
      { id: `${goalId}-sub-1`, title: 'Inspect hardware phenotype & GPU thermal metrics', completed: false },
      { id: `${goalId}-sub-2`, title: 'Audit doctrine compliance and watchdog safety boundaries', completed: false },
    ];

    if (lower.includes('code') || lower.includes('repair') || lower.includes('sandbox') || lower.includes('fix') || lower.includes('compile')) {
      title = 'Autonomous Code Diagnostic, AST Linting & Self-Healing Pipeline';
      description = 'Compile target workspace code, detect syntax defects, and generate verified patch candidates.';
      priority = 9;
      assignedNode = 'diagnoseNode';
      fallbackZone = 'isolated_ast_fallback';
      subgoals.push(
        { id: `${goalId}-sub-3`, title: 'Run Sandbox lintAndVerify AST check', completed: false },
        { id: `${goalId}-sub-4`, title: 'Generate & commit self-healing patch candidate', completed: false },
        { id: `${goalId}-sub-5`, title: 'Verify patch compilation within memory boundary', completed: false }
      );
    } else if (lower.includes('ecu') || lower.includes('telemetry') || lower.includes('tune') || lower.includes('automotive')) {
      title = 'Real-Time Engine Telemetry Diagnostic & ECU Map Calibration';
      description = 'Analyze engine sensors, coolant thermals, and manifold pressure; safely apply map updates.';
      priority = 10;
      assignedNode = 'automotiveObdNode';
      fallbackZone = 'ecu_safe_mode_fallback';
      subgoals.push(
        { id: `${goalId}-sub-3`, title: 'Query OBD-II sensor values & coolant temperature', completed: false },
        { id: `${goalId}-sub-4`, title: 'Verify thermal safety thresholds with Watchdog', completed: false },
        { id: `${goalId}-sub-5`, title: 'Inject thermal enrichment fuel map v4.5', completed: false }
      );
    } else {
      subgoals.push(
        { id: `${goalId}-sub-3`, title: 'Synthesize multi-agent consensus through triple-check router', completed: false },
        { id: `${goalId}-sub-4`, title: 'Consolidate execution episode into Hierarchical Associative Memory', completed: false }
      );
    }

    return {
      id: goalId,
      title,
      description,
      priority,
      status: 'active',
      assignedNode,
      subgoals,
      fallbackZone,
      retryCount: 0,
    };
  }

  /**
   * Log failure signatures and automatically update rules/heuristics for auto-healing.
   */
  static recordFailure(state: MicrofyxdState, nodeId: string, errorSignature: string, contextSnippet?: string): Partial<MicrofyxdState> {
    const patternId = `fail-${Date.now().toString().slice(-6)}`;
    const newPattern: MetaFailurePattern = {
      id: patternId,
      timestamp: new Date().toISOString(),
      nodeId,
      errorSignature,
      contextSnippet,
      resolutionSuccess: false,
    };

    const updatedPatterns = [...state.metaCognition.failurePatterns, newPattern];
    const heuristicRules = { ...state.metaCognition.heuristicRules };
    
    // Auto-evolve rule if repeated failures detected on node
    const nodeFailures = updatedPatterns.filter(p => p.nodeId === nodeId);
    if (nodeFailures.length >= 2) {
      heuristicRules[`REPEATED_FAIL_${nodeId.toUpperCase()}`] = `Engage multi-agent consensus and sandbox safe mode fallback for node ${nodeId}`;
    }

    return {
      metaCognition: {
        ...state.metaCognition,
        failurePatterns: updatedPatterns,
        heuristicRules,
        driftScore: Math.min(1.0, state.metaCognition.driftScore + 0.15),
      }
    };
  }

  /**
   * Self-Healing Code Generator:
   * Examines buggy code, applies targeted fixes, verifies via AST/Sandbox, and updates failure patterns.
   */
  static selfHealSnippet(state: MicrofyxdState, originalCode: string): { healedCode: string; patchSuccess: boolean; patchLog: string } {
    let healedCode = originalCode;
    let patchSuccess = false;
    let patchLog = '';

    const check = SandboxService.lintAndVerify(originalCode);
    if (check.syntaxOk) {
      return { healedCode: originalCode, patchSuccess: true, patchLog: 'Code passed initial syntax linting without requiring modifications.' };
    }

    // Auto-healing transformation heuristics
    if (originalCode.includes('const ') && !originalCode.includes('=')) {
      healedCode = originalCode.replace(/const\s+([a-zA-Z0-9_]+)\s*(;|\n|$)/g, 'const $1 = "healed_value";\n');
      patchLog = 'Fixed missing initializer in const declaration.';
    } else if (originalCode.includes('function') && (originalCode.match(/\{/g)?.length !== originalCode.match(/\}/g)?.length)) {
      const openCount = originalCode.match(/\{/g)?.length || 0;
      const closeCount = originalCode.match(/\}/g)?.length || 0;
      const missingCloses = Math.max(1, openCount - closeCount);
      healedCode = originalCode + '\n' + '}'.repeat(missingCloses);
      patchLog = `Appended ${missingCloses} missing closing brace(s) to restore syntax block structure.`;
    } else if (originalCode.includes('import ') && !originalCode.includes('from')) {
      healedCode = originalCode.replace(/import\s+\{([^}]+)\}/g, 'import { $1 } from "./module"');
      patchLog = 'Inserted missing "from" clause in import statement.';
    } else {
      healedCode = `// Auto-Healed Wrapper\ntry {\n${originalCode}\n} catch (err) {\n  console.error("Auto-healing error boundary triggered:", err);\n}`;
      patchLog = 'Wrapped code snippet inside safe error-boundary block.';
    }

    const recheck = SandboxService.lintAndVerify(healedCode);
    patchSuccess = recheck.syntaxOk;

    return { healedCode, patchSuccess, patchLog };
  }

  /**
   * Consolidate execution traces into Episodic & Associative Memory (HAM).
   */
  static consolidateEpisodicMemory(state: MicrofyxdState, taskSummary: string): Partial<MicrofyxdState> {
    const episodicSummaries = [
      ...state.memory.episodicSummaries,
      `[EPISODE_${new Date().toISOString().slice(0, 10)}] ${taskSummary}`
    ];

    const ham = { ...state.memory.hierarchicalAssociativeMemory };
    ham['self-healing'] = Array.from(new Set([...(ham['self-healing'] || []), 'meta-cognitive-audit', 'ast-patching', 'auto-recovery']));
    ham['evolution'] = Array.from(new Set([...(ham['evolution'] || []), 'tier-advancement', 'dynamic-heuristics', 'adaptive-routing']));

    return {
      memory: {
        ...state.memory,
        hierarchicalAssociativeMemory: ham,
        episodicSummaries,
      },
      metaCognition: {
        ...state.metaCognition,
        successSignatures: Array.from(new Set([...state.metaCognition.successSignatures, `EPISODE_COMPLETED_${Date.now()}`])),
        selfEvolutionEpoch: state.metaCognition.selfEvolutionEpoch + 1,
      }
    };
  }
}
