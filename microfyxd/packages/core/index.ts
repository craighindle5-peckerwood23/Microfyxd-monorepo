export interface Message {
  role: 'user' | 'assistant' | 'system' | 'agent';
  content: string;
  sender?: string;
  timestamp: string;
}

export interface PhenotypeState {
  hardware: string; // e.g. "Apple M3 Max", "Nvidia RTX 4090", "AWS EC2 g4dn.xlarge"
  gpuAvailability: boolean;
  cloudTopology: string; // e.g. "multicloud-edge", "kubernetes-on-prem"
  resourceLimits: {
    cpuMax: number;
    ramLimitGb: number;
    storageLimitGb: number;
  };
  adaptationFactor: number; // 0.1 to 1.0 depending on load
  graphEdgesOverride?: Record<string, string>;
}

export interface InfraState {
  availableGpus: {
    id: string;
    model: string;
    vramGb: number;
    temperatureC: number;
    utilizationPercent: number;
  }[];
  multiGpuDispatchActive: boolean;
  tasksSequenceSplit: {
    taskId: string;
    subTasksCount: number;
    gpuAssignments: string[];
    completedCount: number;
  }[];
  throttleFactor: number; // 1.0 is no throttle, lower is higher throttle
  loadThrottled: boolean;
}

export interface EgoState {
  identityVector: string[]; // Core beliefs / directives
  selfCheckRating: number; // Self-evaluation of reasoning quality (1-10)
  perspectives: string[]; // Multi-perspective thoughts (e.g. "Objective", "Skeptical", "Creative")
  introspectionLogs: string[];
  evolutionTier: number; // Evolutionary step index
}

export interface SandboxState {
  currentSnippetId?: string;
  sourceCode?: string;
  syntaxOk?: boolean;
  executionOutput?: string;
  diagnostics?: {
    hasBug: boolean;
    errorType?: string;
    errorMessage?: string;
    lineIndex?: number;
    suggestedFix?: string;
  };
  patchesApplied?: {
    patchId: string;
    patchCode: string;
    timestamp: string;
    successful: boolean;
  }[];
}

export interface MemoryState {
  hierarchicalAssociativeMemory: Record<string, string[]>; // HAM node association graph
  episodicSummaries: string[];
  vectorKeysSaved: string[];
}

export interface DoctrineState {
  activeChecklists: string[];
  complianceVerified: boolean;
  currentArcanaTier: number; // 1 to 5 capability upgrade tier
  unlockedCapabilities: string[];
  humanApprovalRequired: boolean;
  humanApprovalGiven?: boolean;
}

export interface WatchdogState {
  activeAlerts: string[];
  cpuUsagePercent: number;
  ramUsagePercent: number;
  tokenConsumption: number;
  safetyOverrideEngaged: boolean;
}

export interface TraceLog {
  stepId: string;
  nodeId: string;
  timestamp: string;
  logs: string[];
  stateUpdate: Partial<MicrofyxdState>;
  egoIntrospection?: string;
  label: string; // White-box compliance label
}

export interface MetaGoal {
  id: string;
  title: string;
  description: string;
  priority: number; // 1 to 10
  status: 'active' | 'in_progress' | 'completed' | 'failed' | 'fallback_active';
  assignedNode?: string;
  subgoals?: { id: string; title: string; completed: boolean }[];
  fallbackZone?: string;
  retryCount: number;
}

export interface MetaFailurePattern {
  id: string;
  timestamp: string;
  nodeId: string;
  errorSignature: string;
  contextSnippet?: string;
  appliedResolution?: string;
  resolutionSuccess: boolean;
}

export interface MetaCognitiveState {
  driftScore: number; // 0.0 to 1.0 (0 = stable, 1 = high cognitive drift)
  confidenceRating: number; // 0.0 to 10.0
  activeGoals: MetaGoal[];
  failurePatterns: MetaFailurePattern[];
  successSignatures: string[];
  heuristicRules: Record<string, string>;
  fallbackZones: Record<string, string>;
  selfEvolutionEpoch: number;
  lastMetaAuditTimestamp?: string;
  autoHealingActive: boolean;
}

export interface MicrofyxdState {
  messages: Message[];
  phenotype: PhenotypeState;
  infrastructure: InfraState;
  ego: EgoState;
  sandbox: SandboxState;
  memory: MemoryState;
  doctrine: DoctrineState;
  watchdog: WatchdogState;
  metaCognition: MetaCognitiveState;
  traces: TraceLog[];
}

// Initial state builder
export function createInitialState(userPrompt: string): MicrofyxdState {
  return {
    messages: [
      {
        role: 'user',
        content: userPrompt,
        timestamp: new Date().toISOString(),
      },
    ],
    phenotype: {
      hardware: "Nvidia DGX H100 (Host Container)",
      gpuAvailability: true,
      cloudTopology: "private-gcp-tenant",
      resourceLimits: {
        cpuMax: 64,
        ramLimitGb: 256,
        storageLimitGb: 1000,
      },
      adaptationFactor: 1.0,
    },
    infrastructure: {
      availableGpus: [
        { id: "gpu-0", model: "Nvidia H100 SXM5", vramGb: 80, temperatureC: 52, utilizationPercent: 12 },
        { id: "gpu-1", model: "Nvidia H100 SXM5", vramGb: 80, temperatureC: 48, utilizationPercent: 8 },
      ],
      multiGpuDispatchActive: true,
      tasksSequenceSplit: [],
      throttleFactor: 1.0,
      loadThrottled: false,
    },
    ego: {
      identityVector: [
        "Primary Directive: Self-evolution with strict alignment",
        "Cognitive Balance: High skepticism on unverified tools",
        "Structural integrity: Ensure all code compiles in sandboxes before execution",
        "Meta-Cognitive Autonomy: Continuous self-monitoring and adaptive goal generation"
      ],
      selfCheckRating: 10,
      perspectives: ["Objective Analytic", "Defensive Watchdog", "Meta-Cognitive Auditor"],
      introspectionLogs: ["Ego & Meta-Cognitive System Boot sequence completed successfully."],
      evolutionTier: 1,
    },
    sandbox: {
      patchesApplied: [],
    },
    memory: {
      hierarchicalAssociativeMemory: {
        "ecu-tuning": ["automotive-subsystem", "engine-safety", "fuel-maps"],
        "self-repair": ["meta-layers", "code-patches", "validation-tests"],
        "meta-cognition": ["self-healing", "drift-monitoring", "goal-expansion", "fallback-zones"]
      },
      episodicSummaries: ["Initial operational boot. Meta-cognitive monitoring active. Awaiting instruction."],
      vectorKeysSaved: ["doc_ecu_safety_reg_102", "code_patch_library_v3.2", "meta_cognitive_heuristics_v1.0"],
    },
    doctrine: {
      activeChecklists: ["SECURE_ISOLATION_VERIFICATION", "TRIPLE_CHECK_ACCURACY_MATRIX", "META_COGNITIVE_DRIFT_AUDIT"],
      complianceVerified: true,
      currentArcanaTier: 1,
      unlockedCapabilities: ["BASE_REASONING", "HARDWARE_PHENOTYPE_READ", "HAM_ASSOCIATIONS", "META_COGNITIVE_EVALUATION"],
      humanApprovalRequired: false,
    },
    watchdog: {
      activeAlerts: [],
      cpuUsagePercent: 14,
      ramUsagePercent: 28,
      tokenConsumption: 0,
      safetyOverrideEngaged: false,
    },
    metaCognition: {
      driftScore: 0.05,
      confidenceRating: 9.8,
      activeGoals: [
        {
          id: 'goal-root-1',
          title: 'System Operational Stability & Self-Healing Maintenance',
          description: 'Continuously verify subsystem execution, detect syntax/runtime anomalies, and generate sandbox patches.',
          priority: 9,
          status: 'active',
          assignedNode: 'metaCognitiveAuditNode',
          subgoals: [
            { id: 'sub-1', title: 'Verify LangGraph state integrity across execution hops', completed: true },
            { id: 'sub-2', title: 'Monitor sandbox compilation & repair pipelines', completed: true },
            { id: 'sub-3', title: 'Index success signatures into HAM memory store', completed: false },
          ],
          fallbackZone: 'rule_based_fallback_zone',
          retryCount: 0,
        }
      ],
      failurePatterns: [],
      successSignatures: ['SANBOX_COMPILE_SUCCESS', 'HAM_MEMORY_SYNC_OK', 'LLM_ROUTER_CONSENSUS_VERIFIED'],
      heuristicRules: {
        'SANDBOX_FAIL_POLICY': 'Route to self-repair node with multi-candidate patch generation',
        'TOKEN_SPIKE_POLICY': 'Engage LLM fallback router and throttle token consumption',
        'HARDWARE_THERMAL_POLICY': 'Reduce multi-GPU dispatch ratio to cool down local nodes'
      },
      fallbackZones: {
        'llm_failure': 'Multi-provider router failover (Gemini -> Groq -> DeepSeek -> Local Heuristics)',
        'sandbox_failure': 'Isolated sandbox patch synthesis and AST linting',
        'automotive_telemetry_failure': 'Safe-mode ECU map defaults and warning flag trigger'
      },
      selfEvolutionEpoch: 1,
      lastMetaAuditTimestamp: new Date().toISOString(),
      autoHealingActive: true,
    },
    traces: [],
  };
}
