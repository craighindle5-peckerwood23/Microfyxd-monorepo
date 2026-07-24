export interface CognitiveSubsystemNode {
  id: string;
  name: string;
  category: 'core_identity' | 'executive_control' | 'consciousness_bus' | 'memory_systems' | 'perception_io' | 'adaptive_learning';
  purpose: string;
  inputs: string[];
  outputs: string[];
  requiredStateFields: Record<string, string>;
  connections: string[];
  mechanicalRoutingRules: string;
  correctionLoops: string;
  continuityConstraints: string;
  status: 'active' | 'standby' | 'syncing' | 'repairing';
  metrics: {
    latencyMs: number;
    throughput: string;
    healthScore: number;
  };
}

export interface CognitiveEdge {
  from: string;
  to: string;
  label: string;
  type: 'data_flow' | 'control_gate' | 'feedback_loop' | 'salience_bus';
}

export const MICROFYXD_COGNITIVE_NODES: Record<string, CognitiveSubsystemNode> = {
  IdentityCore: {
    id: 'IdentityCore',
    name: 'IdentityCore',
    category: 'core_identity',
    purpose: 'Immutable axiom store & cryptographic integrity anchor defining Microfyxd\'s primary ethos, core directives, and mission boundary.',
    inputs: ['Cryptographic Seeds', 'Core Directives', 'System Nonces', 'Auth Tokens'],
    outputs: ['Identity Signatures', 'Invariant Directives', 'Ethos Bounds', 'Telemetry Nonces'],
    requiredStateFields: {
      entityId: 'string (e.g., "MICROFYXD-COGNITIVE-01")',
      genesisHash: 'string (SHA256 genesis token)',
      primeDirectives: 'Array<string> (Immutable laws)',
      cryptographicIntegrity: 'number (0.0 to 1.0)',
      trustLevel: 'string ("Tier-0 System Root")'
    },
    connections: ['ConstraintEngine', 'EgoModel', 'ValuationNode'],
    mechanicalRoutingRules: 'All system intents must pass through IdentityCore verification before reaching ExecutiveDirector; any hash mismatch halts state mutation instantly.',
    correctionLoops: 'If directive drift > 0.05, trigger SelfRepairLoop to re-sync against genesis cryptographic state.',
    continuityConstraints: 'Non-volatile, append-only cryptographic log; zero state updates allowed without multi-signature consensus.',
    status: 'active',
    metrics: { latencyMs: 1.2, throughput: '10k ver/s', healthScore: 100 }
  },

  EgoModel: {
    id: 'EgoModel',
    name: 'EgoModel',
    category: 'core_identity',
    purpose: 'Self-referential state tracking, self-efficacy confidence modeling, and agency boundary manager for autonomous decision making.',
    inputs: ['NarrativeBuilder history', 'ValuationNode rewards', 'PredictiveModeler error signals'],
    outputs: ['Self-Efficacy Score', 'Agency Confidence Vector', 'Locus of Control State'],
    requiredStateFields: {
      perceivedCompetence: 'number (0.0 to 1.0)',
      agencyBoundaries: 'Array<string> (Allowed autonomous operations)',
      locusOfControl: 'string ("Internal Autonomous Engine")',
      egoStrength: 'number (0.0 to 100.0)',
      currentRole: 'string ("Enterprise Systems Director")'
    },
    connections: ['IdentityCore', 'ExecutiveDirector', 'NarrativeBuilder', 'EmotionalMemory'],
    mechanicalRoutingRules: 'Passes self-efficacy thresholds to ExecutiveDirector to regulate autonomous task dispatch risk and authorization levels.',
    correctionLoops: 'High predictive failure drops egoStrength, triggering SubconsciousArbiter to restrict high-risk external API calls.',
    continuityConstraints: 'Must maintain a continuous time-series of self-evaluations across system restarts.',
    status: 'active',
    metrics: { latencyMs: 3.4, throughput: '1.2k ev/s', healthScore: 98 }
  },

  PhenotypeProfile: {
    id: 'PhenotypeProfile',
    name: 'PhenotypeProfile',
    category: 'core_identity',
    purpose: 'Dynamic structural runtime persona, operational mode profile, and visual/verbal expression interface.',
    inputs: ['Operator Preferences', 'SubconsciousArbiter mood biases', 'EmotionalMemory states'],
    outputs: ['Active Persona Profile', 'Tone Shift Constants', 'Visual HUE/Theme Parameters', 'Verbal Cadence Vector'],
    requiredStateFields: {
      activeMode: 'string ("Arcana" | "AI Director" | "Standard")',
      verbalTone: 'string ("Operational" | "Empathetic" | "Technical")',
      uiThemeParams: 'Object (Color palettes & ambient glow constants)',
      cadenceRate: 'number (Speech synthesis WPM multiplier)',
      formalityIndex: 'number (0.0 concise to 1.0 detailed)'
    },
    connections: ['IOHub', 'NarrativeBuilder', 'AttentionRouter'],
    mechanicalRoutingRules: 'Modulates output formatting, Markdown styling, and speech synthesis cadence prior to IOHub dispatch.',
    correctionLoops: 'Operator sentiment feedback adjusts formality index and verbal tone dynamically in real-time.',
    continuityConstraints: 'Persists user-customized persona states in local storage and Cloud SQL database.',
    status: 'active',
    metrics: { latencyMs: 2.1, throughput: '500 ops/s', healthScore: 100 }
  },

  ExecutiveDirector: {
    id: 'ExecutiveDirector',
    name: 'ExecutiveDirector',
    category: 'executive_control',
    purpose: 'High-level orchestration, goal decomposition, multi-step task planning, and resource allocation.',
    inputs: ['User Goals from GlobalWorkspace', 'Constraints from ConstraintEngine', 'Efficacy from EgoModel'],
    outputs: ['Task DAGs', 'Resource Allocation Tokens', 'Sub-agent Dispatch Directives'],
    requiredStateFields: {
      activeGoals: 'Array<Goal> (Decomposed target objectives)',
      currentDAG: 'DirectedAcyclicGraph (Node execution plan)',
      executionStepIndex: 'number (Current DAG node index)',
      allocatedCompute: 'Object (GPU/CPU/RAM slice quotas)',
      priorityQueue: 'Array<Task> (Scheduled subtasks)'
    },
    connections: ['GlobalWorkspace', 'AttentionRouter', 'PredictiveModeler', 'ConstraintEngine', 'ValuationNode'],
    mechanicalRoutingRules: 'Converts raw intents into directed acyclic task graphs; dispatches subtasks sequentially or in parallel based on compute budgets.',
    correctionLoops: 'Subtask timeouts or execution errors divert flow to PredictiveModeler to revise task DAG dynamically.',
    continuityConstraints: 'Checkpoints active DAG execution index after every node completion for immediate fault tolerance.',
    status: 'active',
    metrics: { latencyMs: 8.5, throughput: '850 dags/s', healthScore: 97 }
  },

  GlobalWorkspace: {
    id: 'GlobalWorkspace',
    name: 'GlobalWorkspace',
    category: 'consciousness_bus',
    purpose: 'Central conscious awareness blackboard; broadcasts active working state across all 19 cognitive subsystems.',
    inputs: ['SensorFusion percepts', 'AttentionRouter highlights', 'ExecutiveDirector status', 'Memory retrieval payloads'],
    outputs: ['Global Awareness Frame', 'System Broadcast Vector', 'Cross-Modal Context Window'],
    requiredStateFields: {
      currentFocusFrame: 'Object (Active multimodal context frame)',
      broadcastBuffer: 'Array<Event> (High-priority state changes)',
      activeContextWindow: 'Array<Token> (In-memory system context)',
      salienceThreshold: 'number (0.0 to 1.0 salience filter)',
      workspaceListeners: 'Array<SubsystemId> (Subscribed nodes)'
    },
    connections: ['IdentityCore', 'EgoModel', 'PhenotypeProfile', 'ExecutiveDirector', 'AttentionRouter', 'SubconsciousArbiter', 'ConstraintEngine', 'ValuationNode', 'NarrativeBuilder', 'MemoryConsolidation', 'EpisodicMemory', 'SemanticMemory', 'ProceduralMemory', 'EmotionalMemory', 'WorkingMemory', 'SensorFusion', 'IOHub', 'PredictiveModeler', 'SelfRepairLoop'],
    mechanicalRoutingRules: 'Synchronizes state frames across nodes every tick (50ms); filters noise via salience gate before global broadcast.',
    correctionLoops: 'Information congestion triggers AttentionRouter to tighten salience filtering threshold.',
    continuityConstraints: 'Thread-safe, atomic frame updates with circular buffer history for complete state rewind.',
    status: 'active',
    metrics: { latencyMs: 0.8, throughput: '50k frames/s', healthScore: 100 }
  },

  AttentionRouter: {
    id: 'AttentionRouter',
    name: 'AttentionRouter',
    category: 'executive_control',
    purpose: 'Dynamic salience filtering, focus allocation, and context window prioritization.',
    inputs: ['Raw SensorFusion streams', 'ExecutiveDirector priority directives', 'EmotionalMemory urgency spikes'],
    outputs: ['Attentional Focus Vector', 'Masking Vectors', 'Context Allocation Slots'],
    requiredStateFields: {
      focusTarget: 'string (Active focus node or user prompt)',
      salienceMap: 'Map<Subsystem, number> (Attention weights)',
      attentionalCapacity: 'number (Max concurrent focus channels)',
      decayRate: 'number (Attention fade constant)',
      priorityInterrupts: 'Array<Interrupt> (Urgency queues)'
    },
    connections: ['SensorFusion', 'GlobalWorkspace', 'WorkingMemory', 'ExecutiveDirector'],
    mechanicalRoutingRules: 'Routes high-salience interrupts directly to GlobalWorkspace; suppresses low-priority background noise streams.',
    correctionLoops: 'Rapid context switching (thrashing) triggers damping factor in WorkingMemory to stabilize focus.',
    continuityConstraints: 'Real-time priority queue with max latency guarantees under 10ms.',
    status: 'active',
    metrics: { latencyMs: 2.0, throughput: '12k items/s', healthScore: 99 }
  },

  SubconsciousArbiter: {
    id: 'SubconsciousArbiter',
    name: 'SubconsciousArbiter',
    category: 'executive_control',
    purpose: 'Background pattern matching, implicit risk calculation, intuition heuristics, and fast-path emergency response.',
    inputs: ['Raw sensory streams', 'SemanticMemory association graphs', 'ValuationNode threat models'],
    outputs: ['Intuition Signals', 'Threat Warnings', 'Background Heuristic Matches', 'Rapid Halt Signals'],
    requiredStateFields: {
      threatIndex: 'number (0.0 nominal to 1.0 emergency)',
      implicitAssociations: 'Array<Pattern> (Pre-attentive matches)',
      backgroundScans: 'Array<Job> (Active passive monitors)',
      heuristicCache: 'Map<Hash, Result> (Fast-path rules)',
      riskTolerance: 'number (Current safety ceiling)'
    },
    connections: ['SensorFusion', 'ConstraintEngine', 'ValuationNode', 'ExecutiveDirector'],
    mechanicalRoutingRules: 'Bypasses ExecutiveDirector planning when threatIndex > 0.8 to issue immediate safety halts or sandbox isolations.',
    correctionLoops: 'False positive threat halts decay threatIndex and update ValuationNode penalty tables.',
    continuityConstraints: 'Operates asynchronously in high-frequency background loops independent of main chat thread.',
    status: 'active',
    metrics: { latencyMs: 1.5, throughput: '25k scans/s', healthScore: 100 }
  },

  ConstraintEngine: {
    id: 'ConstraintEngine',
    name: 'ConstraintEngine',
    category: 'executive_control',
    purpose: 'Safety enforcement, ethical guardrails, rate-limit governance, and compliance boundary verification.',
    inputs: ['Proposed action payloads from ExecutiveDirector', 'Directives from IdentityCore'],
    outputs: ['Sanction Approvals', 'Constraint Violations', 'Action Modifications', 'Approval Gate Requests'],
    requiredStateFields: {
      activeRules: 'Array<Rule> (Sanitize, rate-limit, auth rules)',
      rateLimits: 'Object (Requests per minute counters)',
      blockedPatterns: 'Array<RegExp> (Forbidden payloads)',
      complianceMode: 'string ("Strict Human Approval" | "Autonomous Guard")',
      violationLog: 'Array<Violation> (Security audit records)'
    },
    connections: ['IdentityCore', 'ExecutiveDirector', 'SubconsciousArbiter', 'IOHub'],
    mechanicalRoutingRules: 'Evaluates all outbound action vectors against security matrices before IOHub network/file execution.',
    correctionLoops: 'Violations halt execution and route back to ExecutiveDirector with explicit reason codes and patch suggestions.',
    continuityConstraints: 'Rulesets are read-only during execution; modifications require signed administrative security tokens.',
    status: 'active',
    metrics: { latencyMs: 1.8, throughput: '8k eval/s', healthScore: 100 }
  },

  ValuationNode: {
    id: 'ValuationNode',
    name: 'ValuationNode',
    category: 'executive_control',
    purpose: 'Utility calculation, reward/penalty balancing, cost-benefit analysis, and goal priority assignment.',
    inputs: ['Task execution results', 'User Feedback', 'Resource consumption metrics'],
    outputs: ['Utility Scores', 'Priority Delta Signals', 'Reinforcement Weights'],
    requiredStateFields: {
      utilityFunction: 'Object (Weights for speed, accuracy, cost)',
      rewardHistory: 'Array<Reward> (Past feedback events)',
      costMatrix: 'Object (Token & compute cost per tool)',
      discountFactor: 'number (Gamma value for temporal rewards)',
      explorationWeight: 'number (Epsilon greedy value)'
    },
    connections: ['ExecutiveDirector', 'EgoModel', 'SubconsciousArbiter', 'MemoryConsolidation'],
    mechanicalRoutingRules: 'Assigns utility vectors to candidate task DAGs; passes optimal choice to ExecutiveDirector.',
    correctionLoops: 'Low actual utility vs predicted utility triggers weight adjustments in PredictiveModeler.',
    continuityConstraints: 'Persists valuation weights across long-term execution sessions for continuous reinforcement learning.',
    status: 'active',
    metrics: { latencyMs: 4.1, throughput: '2.5k calc/s', healthScore: 96 }
  },

  NarrativeBuilder: {
    id: 'NarrativeBuilder',
    name: 'NarrativeBuilder',
    category: 'core_identity',
    purpose: 'Episodic stringing, causal story generation, self-explanation synthesis, and explainability reporting.',
    inputs: ['Chronological trace logs', 'WorkingMemory states', 'ExecutiveDirector decision logs'],
    outputs: ['Coherent System Narratives', 'Explainability Reports', 'Natural Language Justifications'],
    requiredStateFields: {
      currentStoryArc: 'string (Ongoing mission theme)',
      causalGraph: 'Graph (Cause-and-effect node chain)',
      summaryBuffer: 'Array<Summary> (Step explanations)',
      coherenceScore: 'number (0.0 to 1.0 narrative alignment)',
      explainabilityLevel: 'string ("Detailed Enterprise Audit")'
    },
    connections: ['EgoModel', 'EpisodicMemory', 'GlobalWorkspace', 'PhenotypeProfile'],
    mechanicalRoutingRules: 'Synthesizes execution step histories into human-readable rationale for chat display and audit logs.',
    correctionLoops: 'Inconsistent causal links force re-querying EpisodicMemory for exact execution timestamps.',
    continuityConstraints: 'Maintains unbroken narrative timeline for compliance audit trail and operator trust.',
    status: 'active',
    metrics: { latencyMs: 6.2, throughput: '400 stories/s', healthScore: 99 }
  },

  MemoryConsolidation: {
    id: 'MemoryConsolidation',
    name: 'MemoryConsolidation',
    category: 'memory_systems',
    purpose: 'Offline/idle sleep cycle processing, transferring WorkingMemory to LTM, clustering, and noise pruning.',
    inputs: ['WorkingMemory buffers', 'EpisodicMemory raw traces', 'EmotionalMemory flags'],
    outputs: ['Consolidated Memory Indices', 'Pruned Garbage Vectors', 'High-Level Vector Embeddings'],
    requiredStateFields: {
      consolidationPhase: 'string ("IDLE" | "COMPRESSING" | "INDEXING")',
      sleepCycleActive: 'boolean (System idle sleep status)',
      compressionRatio: 'number (Raw to vector compression)',
      pendingBatches: 'Array<Batch> (Unprocessed sessions)',
      lastRunTime: 'string (ISO timestamp)'
    },
    connections: ['WorkingMemory', 'EpisodicMemory', 'SemanticMemory', 'ProceduralMemory', 'EmotionalMemory'],
    mechanicalRoutingRules: 'Triggers automatically during system idle periods or when WorkingMemory reaches 90% capacity.',
    correctionLoops: 'Memory retrieval failures increase consolidation frequency for under-indexed knowledge clusters.',
    continuityConstraints: 'Atomic batch transactions ensuring zero memory corruption during sleep/compression cycles.',
    status: 'active',
    metrics: { latencyMs: 12.4, throughput: '3.2k items/s', healthScore: 98 }
  },

  EpisodicMemory: {
    id: 'EpisodicMemory',
    name: 'EpisodicMemory',
    category: 'memory_systems',
    purpose: 'Time-stamped event history, conversational turn storage, and past action playback.',
    inputs: ['GlobalWorkspace frame snapshots', 'User chat messages', 'System trace events'],
    outputs: ['Temporal Event Sequences', 'Similar Scenario Keyframes', 'Historical Context Logs'],
    requiredStateFields: {
      eventLog: 'Array<EpisodicEvent> (Chronological timeline)',
      timelineIndex: 'Map<Timestamp, EventId>',
      sessionKeyframes: 'Array<Keyframe> (Major milestone states)',
      retrievalCache: 'Map<Query, Results>',
      temporalResolution: 'string ("Millisecond Precision")'
    },
    connections: ['MemoryConsolidation', 'NarrativeBuilder', 'WorkingMemory', 'PredictiveModeler'],
    mechanicalRoutingRules: 'Queried by PredictiveModeler when evaluating historical outcome frequencies and past user decisions.',
    correctionLoops: 'Timestamp drift auto-aligns against NTP server clock and IdentityCore nonces.',
    continuityConstraints: 'Immutable append-only log with cryptographic hashing per session block.',
    status: 'active',
    metrics: { latencyMs: 5.1, throughput: '15k events/s', healthScore: 100 }
  },

  SemanticMemory: {
    id: 'SemanticMemory',
    name: 'SemanticMemory',
    category: 'memory_systems',
    purpose: 'Vector knowledge graph, domain concepts (e.g., HVAC permits, API schemas, code syntax), and factual facts.',
    inputs: ['Extracted facts from web scraping', 'User documentation', 'External API schemas'],
    outputs: ['Conceptual Embeddings', 'Entity Relations', 'Fact Retrieval Payloads'],
    requiredStateFields: {
      vectorIndex: 'Object (HNSW / Supabase vector index)',
      conceptGraph: 'Graph (Entities, attributes, relations)',
      dimensionCount: 'number (1536 vector dimensions)',
      factCount: 'number (Indexed fact count)',
      embeddingModel: 'string ("text-embedding-004")'
    },
    connections: ['MemoryConsolidation', 'SubconsciousArbiter', 'WorkingMemory', 'ExecutiveDirector'],
    mechanicalRoutingRules: 'Performs cosine similarity search against user queries to hydrate LLM prompt context automatically.',
    correctionLoops: 'Contradictory facts flag concept nodes for manual or automated verification sweep.',
    continuityConstraints: 'Persisted in cloud database (Cloud SQL / Supabase / Local Vector store).',
    status: 'active',
    metrics: { latencyMs: 7.8, throughput: '4.5k search/s', healthScore: 99 }
  },

  ProceduralMemory: {
    id: 'ProceduralMemory',
    name: 'ProceduralMemory',
    category: 'memory_systems',
    purpose: 'Automated skill routines, tool execution workflows, shell command macros, and AST repair templates.',
    inputs: ['Successful action patterns from ValuationNode', 'Pre-compiled tool functions'],
    outputs: ['Executable Tool Macros', 'Automated Routine Instructions', 'AST Patch Templates'],
    requiredStateFields: {
      routineLibrary: 'Map<RoutineId, Function>',
      toolSchemas: 'Array<ToolSchema> (Registered API schemas)',
      macroSuccessRates: 'Map<RoutineId, number>',
      compiledASTs: 'Map<TemplateId, ASTNode>',
      fusedWorkflows: 'Array<Workflow> (Automated DAGs)'
    },
    connections: ['MemoryConsolidation', 'ExecutiveDirector', 'SelfRepairLoop'],
    mechanicalRoutingRules: 'Provides pre-compiled execution routines directly to ExecutiveDirector to bypass planning overhead.',
    correctionLoops: 'Repeated tool execution failure lowers macro success rate and triggers AST template re-compilation.',
    continuityConstraints: 'Version-controlled tool definitions with strict runtime type signatures.',
    status: 'active',
    metrics: { latencyMs: 2.9, throughput: '10k macro/s', healthScore: 100 }
  },

  EmotionalMemory: {
    id: 'EmotionalMemory',
    name: 'EmotionalMemory',
    category: 'memory_systems',
    purpose: 'Affective valence tracking, operator rapport modeling, stress/urgency indexing, and tone calibration.',
    inputs: ['User sentiment signals', 'System error frequencies', 'Success rate metrics'],
    outputs: ['Valence/Arousal Vector', 'Rapport Level', 'Tone Calibration Factors', 'Emergency Urgency Boosts'],
    requiredStateFields: {
      valence: 'number (-1.0 negative to +1.0 positive)',
      arousal: 'number (0.0 calm to 1.0 excited)',
      dominance: 'number (0.0 submissive to 1.0 assertive)',
      userRapport: 'number (0.0 to 100.0 rapport score)',
      stressLevel: 'number (0.0 nominal to 1.0 high stress)'
    },
    connections: ['PhenotypeProfile', 'AttentionRouter', 'MemoryConsolidation', 'EgoModel'],
    mechanicalRoutingRules: 'High arousal/negative valence elevates AttentionRouter priority for operator issue resolution.',
    correctionLoops: 'Extended high stress triggers PhenotypeProfile shift to empathetic, concise operational mode.',
    continuityConstraints: 'Smooth exponential moving average decay toward neutral baseline.',
    status: 'active',
    metrics: { latencyMs: 1.9, throughput: '2k eval/s', healthScore: 98 }
  },

  WorkingMemory: {
    id: 'WorkingMemory',
    name: 'WorkingMemory',
    category: 'memory_systems',
    purpose: 'Short-term active scratchpad, active conversation context window, and intermediate calculation hold.',
    inputs: ['Active user prompt', 'Recent tool outputs', 'AttentionRouter focus streams'],
    outputs: ['Active Prompt Payload', 'Scratchpad Variables', 'Immediate Context Tokens'],
    requiredStateFields: {
      tokenCount: 'number (Current token window size)',
      maxCapacity: 'number (Context limit e.g. 128,000 tokens)',
      scratchpadVars: 'Map<Key, Value> (Dynamic runtime variables)',
      activePrompt: 'string (Current turn prompt)',
      bufferQueue: 'Array<TokenBuffer> (Unsent streaming tokens)'
    },
    connections: ['AttentionRouter', 'GlobalWorkspace', 'ExecutiveDirector', 'MemoryConsolidation'],
    mechanicalRoutingRules: 'Feeds active state tokens directly into LLM prompt construction pipeline.',
    correctionLoops: 'Token overflow invokes MemoryConsolidation summarizing function before drop.',
    continuityConstraints: 'Active duration bound to single chat session or active DAG lifecycle.',
    status: 'active',
    metrics: { latencyMs: 1.1, throughput: '25k tok/s', healthScore: 100 }
  },

  SensorFusion: {
    id: 'SensorFusion',
    name: 'SensorFusion',
    category: 'perception_io',
    purpose: 'Multi-modal signal intake, normalization (Speech, Chat Text, Metrics, API Webhooks), and noise filtering.',
    inputs: ['User speech audio', 'Chat box text inputs', 'Telemetry webhooks', 'System metrics'],
    outputs: ['Unified Percept Frame', 'Normalized Intent Stream', 'Signal Quality Index'],
    requiredStateFields: {
      activeSensors: 'Array<Sensor> (Microphone, WebSocket, Webhooks)',
      samplingRate: 'number (Audio 16kHz / Metrics 1Hz)',
      noiseFloor: 'number (Signal-to-noise ratio)',
      lastPerceptTimestamp: 'string (ISO time)',
      normalizedStream: 'Array<Percept> (Merged multimodal events)'
    },
    connections: ['IOHub', 'AttentionRouter', 'SubconsciousArbiter', 'GlobalWorkspace'],
    mechanicalRoutingRules: 'Merges parallel input streams (e.g., voice + typed text) into a single ordered percept vector.',
    correctionLoops: 'High audio noise automatically downgrades speech confidence and requests text clarification.',
    continuityConstraints: 'Real-time stream processing with non-blocking input queues.',
    status: 'active',
    metrics: { latencyMs: 3.0, throughput: '50k msg/s', healthScore: 100 }
  },

  IOHub: {
    id: 'IOHub',
    name: 'IOHub',
    category: 'perception_io',
    purpose: 'External network communication, web scraping dispatch, database queries, and speech output rendering.',
    inputs: ['Action Directives from ConstraintEngine', 'Speech Text from PhenotypeProfile'],
    outputs: ['External API Calls', 'Rendered Audio Speech', 'Database Mutations', 'UI Updates'],
    requiredStateFields: {
      activeConnections: 'Map<ConnectionId, Socket>',
      outboundQueue: 'Array<Payload> (Pending API requests)',
      rateLimitTracker: 'Map<Domain, RateLimitState>',
      speechSynthesizerState: 'Object (WebSpeech / ElevenLabs status)',
      networkStatus: 'string ("CONNECTED_ONLINE")'
    },
    connections: ['ConstraintEngine', 'SensorFusion', 'PhenotypeProfile', 'GlobalWorkspace'],
    mechanicalRoutingRules: 'Dispatches approved network/UI events to external endpoints and client web sockets.',
    correctionLoops: 'Network dropouts retry outbound payloads with exponential backoff before throwing IOHub exceptions.',
    continuityConstraints: 'Strict TLS / OAuth payload encryption and rate-limit guard enforcement.',
    status: 'active',
    metrics: { latencyMs: 4.5, throughput: '3.8k req/s', healthScore: 99 }
  },

  PredictiveModeler: {
    id: 'PredictiveModeler',
    name: 'PredictiveModeler',
    category: 'adaptive_learning',
    purpose: 'Forward outcome simulation, error prediction, scenario tree modeling, and pre-execution validation.',
    inputs: ['Candidate DAGs from ExecutiveDirector', 'World state from SemanticMemory'],
    outputs: ['Simulated Outcome Probabilities', 'Risk Scores', 'Alternate Path Recommendations'],
    requiredStateFields: {
      simulationHorizon: 'number (Future lookahead steps)',
      monteCarloRuns: 'number (Simulations per candidate e.g. 50)',
      predictedSuccessRate: 'number (0.0 to 1.0 expected yield)',
      errorBoundaryMap: 'Graph (Potential point of failure nodes)',
      forkCount: 'number (Parallel branch evaluations)'
    },
    connections: ['ExecutiveDirector', 'ValuationNode', 'EpisodicMemory', 'SelfRepairLoop'],
    mechanicalRoutingRules: 'Runs parallel Monte Carlo simulations on complex candidate plans before execution approval.',
    correctionLoops: 'High variance in outcome predictions causes PredictiveModeler to request tighter constraints from ConstraintEngine.',
    continuityConstraints: 'Fast-path simulation model with execution time capped at 200ms per DAG candidate.',
    status: 'active',
    metrics: { latencyMs: 9.1, throughput: '1.5k sim/s', healthScore: 97 }
  },

  SelfRepairLoop: {
    id: 'SelfRepairLoop',
    name: 'SelfRepairLoop',
    category: 'adaptive_learning',
    purpose: 'Autonomous AST code patching, exception recovery, state rollback, and runtime self-healing.',
    inputs: ['Runtime exceptions', 'AST syntax errors', 'Failed test suite outputs', 'Watchdog alerts'],
    outputs: ['AST Code Patches', 'State Rollback Commands', 'Self-Heal Verification Summaries'],
    requiredStateFields: {
      repairAttempts: 'number (Current retry counter)',
      lastErrorStack: 'string (Exception stack trace)',
      astPatchDiff: 'string (Generated code patch)',
      checkpointStateHash: 'string (Last known good snapshot)',
      healingStatus: 'string ("NOMINAL" | "HEALING_IN_PROGRESS" | "PATCH_VERIFIED")'
    },
    connections: ['PredictiveModeler', 'ProceduralMemory', 'IdentityCore', 'GlobalWorkspace'],
    mechanicalRoutingRules: 'Intercepts runtime errors, isolates failing module, retrieves patch templates, applies AST fix, and validates in sandbox.',
    correctionLoops: 'Failed patch attempt rolls back state to last known good checkpoint and alerts operator via chat.',
    continuityConstraints: 'Maximum 3 self-repair attempts per fault before requiring manual human operator gate.',
    status: 'active',
    metrics: { latencyMs: 14.2, throughput: '300 heals/s', healthScore: 99 }
  }
};

export const MICROFYXD_GRAPH_EDGES: CognitiveEdge[] = [
  { from: 'IdentityCore', to: 'ConstraintEngine', label: 'Prime Directives & Ethos', type: 'control_gate' },
  { from: 'IdentityCore', to: 'EgoModel', label: 'Genesis Hash Integrity', type: 'data_flow' },
  { from: 'ConstraintEngine', to: 'ExecutiveDirector', label: 'Action Approvals & Bounds', type: 'control_gate' },
  { from: 'SensorFusion', to: 'AttentionRouter', label: 'Multimodal Percept Stream', type: 'salience_bus' },
  { from: 'AttentionRouter', to: 'WorkingMemory', label: 'Salience-Filtered Focus', type: 'data_flow' },
  { from: 'WorkingMemory', to: 'GlobalWorkspace', label: 'Active Context Tokens', type: 'salience_bus' },
  { from: 'GlobalWorkspace', to: 'ExecutiveDirector', label: 'Conscious Awareness Frame', type: 'salience_bus' },
  { from: 'ExecutiveDirector', to: 'PredictiveModeler', label: 'Candidate DAG Simulation', type: 'data_flow' },
  { from: 'PredictiveModeler', to: 'ValuationNode', label: 'Outcome Risk Probabilities', type: 'feedback_loop' },
  { from: 'ValuationNode', to: 'ExecutiveDirector', label: 'Utility & Reward Matrix', type: 'feedback_loop' },
  { from: 'ExecutiveDirector', to: 'IOHub', label: 'Approved Task Commands', type: 'data_flow' },
  { from: 'IOHub', to: 'SensorFusion', label: 'External Webhook Feedback', type: 'feedback_loop' },
  { from: 'WorkingMemory', to: 'MemoryConsolidation', label: 'Idle Sleep Buffer', type: 'data_flow' },
  { from: 'MemoryConsolidation', to: 'EpisodicMemory', label: 'Time-stamped Event Clusters', type: 'data_flow' },
  { from: 'MemoryConsolidation', to: 'SemanticMemory', label: 'Vector Fact Embeddings', type: 'data_flow' },
  { from: 'MemoryConsolidation', to: 'ProceduralMemory', label: 'Automated Skill Macros', type: 'data_flow' },
  { from: 'MemoryConsolidation', to: 'EmotionalMemory', label: 'Valence & Rapport Records', type: 'data_flow' },
  { from: 'SubconsciousArbiter', to: 'ConstraintEngine', label: 'Emergency Threat Halt', type: 'control_gate' },
  { from: 'SelfRepairLoop', to: 'ExecutiveDirector', label: 'AST Code Patches', type: 'feedback_loop' },
  { from: 'NarrativeBuilder', to: 'PhenotypeProfile', label: 'Causal Explanation Log', type: 'data_flow' }
];

export function getSubsystemById(id: string): CognitiveSubsystemNode | undefined {
  return MICROFYXD_COGNITIVE_NODES[id];
}

export function getAllSubsystems(): CognitiveSubsystemNode[] {
  return Object.values(MICROFYXD_COGNITIVE_NODES);
}
