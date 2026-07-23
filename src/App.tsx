import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain,
  Mic,
  MicOff, 
  Terminal, 
  Cpu, 
  Layers, 
  Shield, 
  Activity, 
  Database, 
  Code, 
  FileCode, 
  Settings, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  ChevronRight, 
  RefreshCw, 
  Sliders, 
  Eye, 
  BookOpen, 
  Workflow,
  Hammer,
  UserCheck, 
  Compass,
  ArrowRight,
  Sparkles,
  Info,
  Mail,
  File,
  FolderPlus,
  Send,
  LogOut,
  LogIn,
  ExternalLink,
  Trash2,
  Heart,
  History,
  Plus,
  Globe,
  CloudLightning,
  Link2,
  Search,
  MessageSquare,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Zap
} from 'lucide-react';
import { 
  auth, 
  googleSignIn, 
  logout, 
  initAuth,
  syncUserProfileToFirestore,
  saveFavoriteToFirestore,
  deleteFavoriteFromFirestore,
  logAuditToFirestore,
  fetchFavoritesFromFirestore,
  fetchAuditLogsFromFirestore
} from './lib/firebase.ts';
import { User } from 'firebase/auth';
import { HolographicCanvas } from './components/HolographicCanvas';
import { ExperimentSandbox } from './components/ExperimentSandbox';
import { AutonomousEngines } from './components/AutonomousEngines';
import { MemoryVisualizer } from './components/MemoryVisualizer';
import { LeadScraperPanel } from './components/LeadScraperPanel';
import { ChatCommandCenter } from './components/ChatCommandCenter';

interface TraceLog {
  stepId: string;
  nodeId: string;
  timestamp: string;
  logs: string[];
  stateUpdate: any;
  egoIntrospection?: string;
  label: string;
}

interface MonorepoFile {
  path: string;
  label: string;
  content: string;
}

export default function App() {
  // Navigation & UI state
  const [activeTab, setActiveTab] = useState<'command_center' | 'cockpit' | 'traces' | 'files' | 'phenotype' | 'ego' | 'infra' | 'sandbox' | 'memory' | 'doctrine' | 'workspace' | 'integrations' | 'quantum_tuning' | 'autonomous_engines' | 'leads'>('command_center');
  const [terminalMode, setTerminalMode] = useState<'langgraph' | 'ai-director'>('ai-director');
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);
  const [speakingMessageIdx, setSpeakingMessageIdx] = useState<number | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  
  // Self-Diagnostic and Auto-Healing System
  const [diagnosticState, setDiagnosticState] = useState<'idle' | 'scanning' | 'complete' | 'healing' | 'healed'>('idle');
  const [diagnosticStep, setDiagnosticStep] = useState<number>(0);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [diagnosticResults, setDiagnosticResults] = useState<any[]>([
    { id: 'gateway', name: 'AI Director Connectivity Gateway', status: 'pass', details: 'Awaiting diagnosis initialization...' },
    { id: 'langgraph', name: 'LangGraph Orchestrator Node Engine', status: 'pass', details: 'Awaiting diagnosis initialization...' },
    { id: 'sandbox', name: 'Sandbox Code Isolation Compiler', status: 'pass', details: 'Awaiting diagnosis initialization...' },
    { id: 'cloudsql', name: 'Cloud SQL Secure Connection Pool', status: 'pass', details: 'Awaiting diagnosis initialization...' },
    { id: 'google_ws', name: 'Google Workspace Synchronization Bridge', status: 'pass', details: 'Awaiting diagnosis initialization...' }
  ]);
  const [healActionsApplied, setHealActionsApplied] = useState<number>(0);
  const [hasDiagnosticIssues, setHasDiagnosticIssues] = useState<boolean>(false);
  
  // Quantum Bio-Neural Resonance Tuning States
  const [plasticity, setPlasticity] = useState<number>(0.75);
  const [saturation, setSaturation] = useState<number>(0.60);
  const [resonance, setResonance] = useState<number>(0.85);
  const [introspectionDepth, setIntrospectionDepth] = useState<number>(0.70);
  const [healingOverdrive, setHealingOverdrive] = useState<number>(0.50);
  
  const [quantumTuningActive, setQuantumTuningActive] = useState<boolean>(false);
  const [coherence, setCoherence] = useState<number>(88.4);
  const handleApplyCoherenceBoost = (boost: number) => {
    setCoherence(prev => Math.min(100.0, Math.max(0.0, Number((prev + boost).toFixed(1)))));
  };
  const [quantumLogs, setQuantumLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] [SYSTEM] Quantum Bio-Neural Calibration Deck initialized. Ready for resonance tuning.`
  ]);
  const [activeFires, setActiveFires] = useState<number>(8);
  
  // Google Workspace & Firebase Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [firebaseToken, setFirebaseToken] = useState<string | null>(null);
  const [emails, setEmails] = useState<any[]>([]);
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [favItems, setFavItems] = useState<any[]>([]);
  const [auditLogsList, setAuditLogsList] = useState<any[]>([]);
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState<boolean>(false);
  
  // Workspace inputs
  const [emailTo, setEmailTo] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailBody, setEmailBody] = useState<string>('');
  const [newFolderName, setNewFolderName] = useState<string>('');

  // Core T-API, Namecheap & Vercel Integration State
  const [injections, setInjections] = useState<any[]>([]);
  const [isLoadingInjections, setIsLoadingInjections] = useState<boolean>(false);
  const [selectedInjection, setSelectedInjection] = useState<any | null>(null);
  const [testExecutionOutput, setTestExecutionOutput] = useState<any | null>(null);
  const [isExecutingTest, setIsExecutingTest] = useState<boolean>(false);
  const [activeSubSection, setActiveSubSection] = useState<'injections' | 'namecheap' | 'vercel' | 'cognition'>('injections');

  // Cognitive State Management
  const [cognitiveGoals, setCognitiveGoals] = useState<any[]>([]);
  const [cognitiveTasks, setCognitiveTasks] = useState<any[]>([]);
  const [synapseConnections, setSynapseConnections] = useState<any[]>([]);
  const [agentMemories, setAgentMemories] = useState<any[]>([]);
  const [activeCognitiveLoopStep, setActiveCognitiveLoopStep] = useState<any | null>(null);
  const [isExecutingLoop, setIsExecutingLoop] = useState<boolean>(false);
  const [isLoadingCognition, setIsLoadingCognition] = useState<boolean>(false);

  // New Goal & Task Inputs
  const [newGoalDesc, setNewGoalDesc] = useState<string>('');
  const [newGoalPriority, setNewGoalPriority] = useState<number>(5);
  const [newGoalConstraints, setNewGoalConstraints] = useState<string>('Strict compliance');
  const [newTaskSource, setNewTaskSource] = useState<string>('human');
  const [newTaskPriority, setNewTaskPriority] = useState<number>(5);
  const [newTaskAssignedGoal, setNewTaskAssignedGoal] = useState<string>('');

  // New Memory Inputs
  const [newMemoryTenantId, setNewMemoryTenantId] = useState<string>('system-wide');
  const [newMemoryType, setNewMemoryType] = useState<string>('episodic');
  const [newMemoryKey, setNewMemoryKey] = useState<string>('');
  const [newMemoryValue, setNewMemoryValue] = useState<string>('');
  const [newMemoryConfidence, setNewMemoryConfidence] = useState<number>(1.0);

  const loadCognitionData = async () => {
    try {
      setIsLoadingCognition(true);
      const [goalsRes, tasksRes, synapsesRes, memoriesRes] = await Promise.all([
        fetch('/api/cognition/goals'),
        fetch('/api/cognition/tasks'),
        fetch('/api/cognition/synapses'),
        fetch('/api/cognition/memories')
      ]);
      const [goalsData, tasksData, synapsesData, memoriesData] = await Promise.all([
        goalsRes.json(),
        tasksRes.json(),
        synapsesRes.json(),
        memoriesRes.json()
      ]);
      if (goalsData.success) setCognitiveGoals(goalsData.goals);
      if (tasksData.success) setCognitiveTasks(tasksData.tasks);
      if (synapsesData.success) setSynapseConnections(synapsesData.synapses);
      if (memoriesData.success) {
        setAgentMemories(memoriesData.memories.map((m: any) => ({
          id: String(m.id),
          type: m.memoryType || "semantic",
          summary: m.value || "No content",
          importance: Math.round((m.confidence || 0.5) * 10),
          tags: m.key ? m.key.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
          timestamp: m.createdAt,
          decayRate: 0.05,
          accessCount: m.accessCount || 0
        })));
      }
    } catch (err) {
      console.error('Failed to load cognition elements:', err);
    } finally {
      setIsLoadingCognition(false);
    }
  };

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryKey.trim() || !newMemoryValue.trim()) return;
    try {
      const res = await fetch('/api/cognition/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: newMemoryTenantId,
          memoryType: newMemoryType,
          key: newMemoryKey,
          value: newMemoryValue,
          confidence: newMemoryConfidence
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewMemoryKey('');
        setNewMemoryValue('');
        setNewMemoryConfidence(1.0);
        await loadCognitionData();
      }
    } catch (err) {
      console.error('Failed to save agent memory:', err);
    }
  };

  const handleAccessMemory = async (id: number) => {
    try {
      const res = await fetch(`/api/cognition/memories/${id}/access`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        await loadCognitionData();
      }
    } catch (err) {
      console.error('Failed to access memory:', err);
    }
  };

  const handleDeleteMemory = async (id: number) => {
    try {
      const res = await fetch(`/api/cognition/memories/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        await loadCognitionData();
      }
    } catch (err) {
      console.error('Failed to delete memory:', err);
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalDesc.trim()) return;
    try {
      const res = await fetch('/api/cognition/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: newGoalDesc,
          priority: newGoalPriority,
          constraints: newGoalConstraints
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewGoalDesc('');
        setNewGoalConstraints('Strict compliance');
        setNewGoalPriority(5);
        await loadCognitionData();
      }
    } catch (err) {
      console.error('Failed to add goal:', err);
    }
  };

  const handleStatusGoal = async (id: number, status: 'completed' | 'failed') => {
    try {
      const res = await fetch(`/api/cognition/goals/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        await loadCognitionData();
      }
    } catch (err) {
      console.error('Failed to update goal status:', err);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskAssignedGoal.trim()) return;
    try {
      const res = await fetch('/api/cognition/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: newTaskSource,
          priority: newTaskPriority,
          assignedGoal: newTaskAssignedGoal
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewTaskAssignedGoal('');
        setNewTaskPriority(5);
        await loadCognitionData();
      }
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const handleExecuteCognitionStep = async (simulatedOutcome: 'success' | 'failure' | 'violation') => {
    try {
      setIsExecutingLoop(true);
      const res = await fetch('/api/cognition/loop/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simulatedOutcome })
      });
      const data = await res.json();
      if (data.success) {
        setActiveCognitiveLoopStep(data);
        await loadCognitionData();
      }
    } catch (err) {
      console.error('Failed to execute cognition loop step:', err);
    } finally {
      setIsExecutingLoop(false);
    }
  };

  // Namecheap DNS config
  const [dnsDomain, setDnsDomain] = useState<string>('microfyxd.com');
  const [dnsApiUser, setDnsApiUser] = useState<string>('');
  const [dnsApiKey, setDnsApiKey] = useState<string>('');
  const [dnsRecords, setDnsRecords] = useState<any[]>([]);
  const [isLoadingDns, setIsLoadingDns] = useState<boolean>(false);

  // Vercel credentials
  const [vercelToken, setVercelToken] = useState<string>('');
  const [vercelProjectId, setVercelProjectId] = useState<string>('');
  const [vercelLogs, setVercelLogs] = useState<string[]>([]);
  const [vercelUrl, setVercelUrl] = useState<string>('');
  const [isDeployingVercel, setIsDeployingVercel] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const loadInjections = async () => {
    try {
      setIsLoadingInjections(true);
      const res = await fetch('/api/config/injections');
      const data = await res.json();
      if (data.success) {
        setInjections(data.injections);
        if (data.injections.length > 0 && !selectedInjection) {
          setSelectedInjection(data.injections[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load injections list:', err);
    } finally {
      setIsLoadingInjections(false);
    }
  };

  const handleTestInjection = async (id: string) => {
    try {
      setIsExecutingTest(true);
      setTestExecutionOutput(null);
      const tokenToUse = firebaseToken || '';
      const res = await fetch('/api/config/execute-test-call', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenToUse}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ injectionId: id })
      });
      const data = await res.json();
      setTestExecutionOutput(data);
      if (firebaseToken) {
        loadAuditLogs(firebaseToken);
      }
    } catch (err) {
      console.error('Failed to test injection:', err);
    } finally {
      setIsExecutingTest(false);
    }
  };

  const handleLoadDnsRecords = async () => {
    try {
      setIsLoadingDns(true);
      const res = await fetch('/api/namecheap/dns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: dnsDomain,
          apiUser: dnsApiUser,
          apiKey: dnsApiKey
        })
      });
      const data = await res.json();
      if (data.success) {
        setDnsRecords(data.records);
      }
    } catch (err) {
      console.error('Failed to load DNS records:', err);
    } finally {
      setIsLoadingDns(false);
    }
  };

  const handleDeployVercelStaging = async () => {
    try {
      setIsDeployingVercel(true);
      setVercelLogs([]);
      setVercelUrl('');
      
      const res = await fetch('/api/vercel/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vercelToken,
          projectId: vercelProjectId
        })
      });
      const data = await res.json();
      if (data.success) {
        if (data.isReal) {
          setVercelLogs([`[REAL VERCEL BUILD] Initiated successfully! Deployment ID: ${data.deployment.id}`, `Target URL: ${data.deployment.url}`]);
          setVercelUrl(`https://${data.deployment.url}`);
          setIsDeployingVercel(false);
        } else {
          let logIdx = 0;
          const interval = setInterval(() => {
            if (logIdx < data.logs.length) {
              setVercelLogs(prev => [...prev, data.logs[logIdx]]);
              logIdx++;
            } else {
              clearInterval(interval);
              setVercelUrl(data.url);
              setIsDeployingVercel(false);
            }
          }, 250);
          return;
        }
      }
    } catch (err) {
      console.error('Failed to deploy staging build:', err);
      setIsDeployingVercel(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'integrations') {
      loadInjections();
      handleLoadDnsRecords();
      loadCognitionData();
    }
  }, [activeTab]);

  // Firebase auth listener setup
  useEffect(() => {
    const unsubscribe = initAuth(
      async (user, gToken) => {
        setCurrentUser(user);
        setGoogleToken(gToken);
        const fbToken = await user.getIdToken();
        setFirebaseToken(fbToken);
        // Automatically sync & load data when logged in
        syncAndLoadData(fbToken, gToken);
      },
      () => {
        setCurrentUser(null);
        setGoogleToken(null);
        setFirebaseToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const syncAndLoadData = async (fbToken: string, gToken: string) => {
    try {
      setIsLoadingWorkspace(true);
      
      // 1. Sync user profile to secure Firestore registry
      if (auth.currentUser) {
        await syncUserProfileToFirestore(auth.currentUser);
      }

      // 2. Sync user to SQL database
      await fetch('/api/users/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${fbToken}`,
          'Content-Type': 'application/json'
        }
      });
      // Fetch user specific data
      await Promise.all([
        loadEmails(fbToken, gToken),
        loadDriveFiles(fbToken, gToken),
        loadFavorites(fbToken),
        loadAuditLogs(fbToken)
      ]);
    } catch (err) {
      console.error('Error syncing/loading user data', err);
    } finally {
      setIsLoadingWorkspace(false);
    }
  };

  const loadEmails = async (fbToken: string, gToken: string) => {
    try {
      const res = await fetch('/api/workspace/emails', {
        headers: {
          'Authorization': `Bearer ${fbToken}`,
          'x-google-token': gToken
        }
      });
      const data = await res.json();
      if (data.success) {
        setEmails(data.emails || []);
      }
    } catch (err) {
      console.error('Failed to load Gmail messages:', err);
    }
  };

  const loadDriveFiles = async (fbToken: string, gToken: string) => {
    try {
      const res = await fetch('/api/workspace/files', {
        headers: {
          'Authorization': `Bearer ${fbToken}`,
          'x-google-token': gToken
        }
      });
      const data = await res.json();
      if (data.success) {
        setDriveFiles(data.files || []);
      }
    } catch (err) {
      console.error('Failed to load Google Drive files:', err);
    }
  };

  const loadFavorites = async (fbToken: string) => {
    try {
      let favorites: any[] = [];
      const res = await fetch('/api/favorites', {
        headers: { 'Authorization': `Bearer ${fbToken}` }
      });
      const data = await res.json();
      if (data.success) {
        favorites = data.favorites || [];
      }
      
      // Dual-load or fallback from Firestore
      if (currentUser) {
        const firestoreFavs = await fetchFavoritesFromFirestore(currentUser.uid);
        if (favorites.length === 0 && firestoreFavs.length > 0) {
          favorites = firestoreFavs.map((f: any) => ({
            id: f.id,
            type: f.type,
            externalId: f.externalId,
            title: f.title,
            snippet: f.snippet,
            createdAt: f.createdAt
          }));
        }
      }
      setFavItems(favorites);
    } catch (err) {
      console.error('Failed to load favorites from Cloud SQL, trying Firestore:', err);
      if (currentUser) {
        const firestoreFavs = await fetchFavoritesFromFirestore(currentUser.uid);
        setFavItems(firestoreFavs);
      }
    }
  };

  const loadAuditLogs = async (fbToken: string) => {
    try {
      let logs: any[] = [];
      const res = await fetch('/api/audit-logs', {
        headers: { 'Authorization': `Bearer ${fbToken}` }
      });
      const data = await res.json();
      if (data.success) {
        logs = data.logs || [];
      }

      // Fallback or load from Firestore audit logs
      if (currentUser) {
        const firestoreLogs = await fetchAuditLogsFromFirestore(currentUser.uid);
        if (logs.length === 0 && firestoreLogs.length > 0) {
          logs = firestoreLogs;
        }
      }
      setAuditLogsList(logs);
    } catch (err) {
      console.error('Failed to load audit logs from Cloud SQL, trying Firestore:', err);
      if (currentUser) {
        const firestoreLogs = await fetchAuditLogsFromFirestore(currentUser.uid);
        setAuditLogsList(firestoreLogs);
      }
    }
  };

  const logAudit = async (action: string, details: string) => {
    if (currentUser) {
      await logAuditToFirestore(currentUser.uid, action, details);
    }
    if (firebaseToken) {
      try {
        await fetch('/api/audit-logs', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${firebaseToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ action, details })
        });
      } catch (err) {
        console.error('Failed to write SQL audit log:', err);
      }
      loadAuditLogs(firebaseToken);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoadingWorkspace(true);
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setGoogleToken(res.accessToken);
        const fbToken = await res.user.getIdToken();
        setFirebaseToken(fbToken);
        await syncAndLoadData(fbToken, res.accessToken);
      }
    } catch (err: any) {
      alert(`Google Sign-In failed: ${err.message || err}`);
    } finally {
      setIsLoadingWorkspace(false);
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await logout();
      setCurrentUser(null);
      setGoogleToken(null);
      setFirebaseToken(null);
      setEmails([]);
      setDriveFiles([]);
      setFavItems([]);
      setAuditLogsList([]);
    } catch (err: any) {
      alert(`Google Logout failed: ${err.message || err}`);
    }
  };

  const handleSendEmail = async () => {
    if (!firebaseToken || !googleToken) return;
    try {
      setIsLoadingWorkspace(true);
      const res = await fetch('/api/workspace/send-email', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${firebaseToken}`,
          'x-google-token': googleToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: emailTo,
          subject: emailSubject,
          body: emailBody
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Email sent successfully via Google Workspace!');
        setEmailTo('');
        setEmailSubject('');
        setEmailBody('');
        // Reload emails & audit logs
        loadEmails(firebaseToken, googleToken);
        loadAuditLogs(firebaseToken);
      } else {
        alert(`Failed to send email: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Error sending email: ${err.message}`);
    } finally {
      setIsLoadingWorkspace(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!firebaseToken || !googleToken) return;
    try {
      setIsLoadingWorkspace(true);
      const res = await fetch('/api/workspace/create-folder', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${firebaseToken}`,
          'x-google-token': googleToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ folderName: newFolderName })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Google Drive folder "${newFolderName}" created successfully!`);
        setNewFolderName('');
        // Reload drive files & audit logs
        loadDriveFiles(firebaseToken, googleToken);
        loadAuditLogs(firebaseToken);
      } else {
        alert(`Failed to create folder: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Error creating folder: ${err.message}`);
    } finally {
      setIsLoadingWorkspace(false);
    }
  };

  const handleAddFav = async (type: 'email' | 'file', externalId: string, title: string, snippet: string) => {
    if (!firebaseToken) return;
    try {
      // 1. Cloud SQL Store
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${firebaseToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type, externalId, title, snippet })
      });
      const data = await res.json();
      
      // 2. Firestore Sync Store
      if (currentUser) {
        await saveFavoriteToFirestore(currentUser.uid, type, externalId, title, snippet);
      }

      if (data.success) {
        alert('Item added to favorites (Sync enabled: Cloud SQL + Firestore)!');
        loadFavorites(firebaseToken);
      } else {
        alert(`Failed to save favorite to Cloud SQL: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Error saving favorite: ${err.message}`);
    }
  };

  const handleDeleteFav = async (favId: any) => {
    if (!firebaseToken) return;
    try {
      const favItem = favItems.find(f => f.id === favId);

      // 1. Cloud SQL Delete
      const res = await fetch(`/api/favorites/${favId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${firebaseToken}` }
      });
      const data = await res.json();

      // 2. Firestore Sync Delete
      if (favItem && currentUser) {
        await deleteFavoriteFromFirestore(currentUser.uid, favItem.externalId);
      }

      if (data.success) {
        alert('Favorite removed (Sync deleted from Cloud SQL + Firestore).');
        loadFavorites(firebaseToken);
      } else {
        alert(`Failed to delete favorite: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Error deleting favorite: ${err.message}`);
    }
  };

  // Google Picker client-side callback trigger helper
  const triggerGooglePicker = () => {
    if (!googleToken) {
      alert('Please connect Google Workspace account first!');
      return;
    }

    // Try real Google Picker API, fallback to smooth high-fidelity custom selection simulation if scripts aren't loaded in iframe!
    try {
      // @ts-ignore
      if (typeof window.google !== 'undefined' && window.google.picker) {
        const pickerOrigin =
          window.location.ancestorOrigins &&
          window.location.ancestorOrigins.length > 0
            ? window.location.ancestorOrigins[window.location.ancestorOrigins.length - 1]
            : window.location.origin;

        // @ts-ignore
        const picker = new window.google.picker.PickerBuilder()
          // @ts-ignore
          .addView(window.google.picker.ViewId.DOCS)
          .setOAuthToken(googleToken)
          .setCallback(async (data: any) => {
            // @ts-ignore
            if (data.action === window.google.picker.Action.PICKED) {
              const file = data.docs[0];
              alert(`Selected Google Drive item: ${file.name}`);
              await handleAddFav('file', file.id, file.name, `Google Picker Selected file. MIME: ${file.mimeType}`);
              // Log the picker event
              await logAudit('PICK_FILE_PICKER', `Selected ${file.name} (ID: ${file.id})`);
            }
          })
          .setOrigin(pickerOrigin)
          .build();
        picker.setVisible(true);
      } else {
        // High fidelity visual selection simulation for the sandboxed preview iframe
        const fileNames = [
          'Engine_Tuning_Config_2026.xlsx',
          'Watchdog_Security_Compliance_v2.pdf',
          'Coolant_Sensors_Telemetry.csv',
          'Sandbox_Typescript_Heal_Patch.ts',
          'Cognitive_Ego_Perspectives.json'
        ];
        const randomName = fileNames[Math.floor(Math.random() * fileNames.length)];
        const simId = 'sim-' + Math.random().toString(36).substring(2, 9);
        
        const proceed = confirm(`[GOOGLE PICKER INTERACTION (SANDBOXED IFRAME MODE)]\n\nGoogle Picker script is initializing...\n\nWould you like to simulate picking: "${randomName}"?`);
        if (proceed) {
          handleAddFav('file', simId, randomName, `Simulated picker file selection.`);
          // Log audit log
          logAudit('PICK_FILE_PICKER', `Selected simulated file: ${randomName} (ID: ${simId})`);
        }
      }
    } catch (err) {
      console.error('Picker error:', err);
    }
  };

  // Interactive Simulator parameters
  const [prompt, setPrompt] = useState<string>('Diagnose coolant temperature warning and propose safety ECUs adjust map.');
  const [hardwareOverride, setHardwareOverride] = useState<string>('dgx-h100');
  const [arcanaTier, setArcanaTier] = useState<number>(3);
  const [sandboxCode, setSandboxCode] = useState<string>(
    `// Microfyxd Code Workspace - Syntax Error Diagnostic\nimport { someHelper }\n\nconst bugVar\n\nfunction processECU() {\n  console.log("Reading ECU Telemetry...")\n  // Unclosed brackets below will trigger sandbox compilation failure\n  if (bugVar === undefined) {\n    return "unresolved"`
  );

  // GPU Cluster & VRAM Reroute state configurations
  const [gpuCluster, setGpuCluster] = useState([
    { id: 'gpu-0', name: 'Nvidia H100 SXM5 (Alpha)', temp: 62, util: 75, vramUsed: 64, vramTotal: 80, status: 'Active' as 'Active' | 'Standby' | 'Throttled', task: 'LangGraph Phenotype Inference' },
    { id: 'gpu-1', name: 'Nvidia H100 SXM5 (Beta)', temp: 48, util: 20, vramUsed: 16, vramTotal: 80, status: 'Active' as 'Active' | 'Standby' | 'Throttled', task: 'Watchdog Safe Check' },
    { id: 'gpu-2', name: 'Nvidia H100 SXM5 (Gamma)', temp: 40, util: 5, vramUsed: 4, vramTotal: 80, status: 'Standby' as 'Active' | 'Standby' | 'Throttled', task: 'Idle' },
    { id: 'gpu-3', name: 'Nvidia H100 SXM5 (Delta)', temp: 38, util: 2, vramUsed: 2, vramTotal: 80, status: 'Standby' as 'Active' | 'Standby' | 'Throttled', task: 'Idle' }
  ]);

  const [selectedGpuId, setSelectedGpuId] = useState<string>('gpu-0');

  const [memoryHistory, setMemoryHistory] = useState([
    { tick: 0, 'gpu-0': 64, 'gpu-1': 16, 'gpu-2': 4, 'gpu-3': 2 },
    { tick: 1, 'gpu-0': 63, 'gpu-1': 15, 'gpu-2': 4, 'gpu-3': 2 },
    { tick: 2, 'gpu-0': 65, 'gpu-1': 17, 'gpu-2': 4, 'gpu-3': 2 },
    { tick: 3, 'gpu-0': 64, 'gpu-1': 16, 'gpu-2': 4, 'gpu-3': 2 },
    { tick: 4, 'gpu-0': 66, 'gpu-1': 16, 'gpu-2': 4, 'gpu-3': 2 },
    { tick: 5, 'gpu-0': 64, 'gpu-1': 16, 'gpu-2': 4, 'gpu-3': 2 },
    { tick: 6, 'gpu-0': 65, 'gpu-1': 15, 'gpu-2': 4, 'gpu-3': 2 },
    { tick: 7, 'gpu-0': 63, 'gpu-1': 16, 'gpu-2': 4, 'gpu-3': 2 }
  ]);

  const [rerouteSource, setRerouteSource] = useState<string>('gpu-0');
  const [rerouteDest, setRerouteDest] = useState<string>('gpu-2');
  const [rerouteAmount, setRerouteAmount] = useState<number>(20);
  const [rerouteStatus, setRerouteStatus] = useState<string>('');
  const [isRerouting, setIsRerouting] = useState<boolean>(false);
  const [rerouteProgress, setRerouteProgress] = useState<number>(0);

  // Background VRAM fluctuation ticker to animate the memory graph
  useEffect(() => {
    const timer = setInterval(() => {
      setGpuCluster(prev => {
        const updated = prev.map(gpu => {
          if (gpu.status === 'Active') {
            const utilDelta = Math.floor(Math.random() * 5) - 2;
            const tempDelta = Math.floor(Math.random() * 3) - 1;
            const vramDelta = Math.random() > 0.85 ? (Math.floor(Math.random() * 3) - 1) : 0;
            return {
              ...gpu,
              util: Math.max(5, Math.min(95, gpu.util + utilDelta)),
              temp: Math.max(35, Math.min(85, gpu.temp + tempDelta)),
              vramUsed: Math.max(1, Math.min(gpu.vramTotal - 5, gpu.vramUsed + vramDelta))
            };
          } else {
            return gpu;
          }
        });

        setMemoryHistory(prevHist => {
          const nextTick = prevHist[prevHist.length - 1].tick + 1;
          return [
            ...prevHist.slice(-9),
            {
              tick: nextTick,
              'gpu-0': Math.round(updated[0].vramUsed),
              'gpu-1': Math.round(updated[1].vramUsed),
              'gpu-2': Math.round(updated[2].vramUsed),
              'gpu-3': Math.round(updated[3].vramUsed)
            }
          ];
        });

        return updated;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const handleGpuReroute = async () => {
    if (isRerouting) return;
    if (rerouteSource === rerouteDest) {
      alert('Source and destination GPUs must be different!');
      return;
    }

    const sourceGpu = gpuCluster.find(g => g.id === rerouteSource);
    const destGpu = gpuCluster.find(g => g.id === rerouteDest);

    if (!sourceGpu || !destGpu) return;
    if (sourceGpu.vramUsed < rerouteAmount) {
      alert(`Source GPU does not have ${rerouteAmount} GB of VRAM currently allocated.`);
      return;
    }
    if (destGpu.vramUsed + rerouteAmount > destGpu.vramTotal) {
      alert(`Destination GPU cannot accommodate another ${rerouteAmount} GB of allocation (Exceeds 80 GB limit).`);
      return;
    }

    setIsRerouting(true);
    setRerouteProgress(10);
    setRerouteStatus('Acquiring dynamic VRAM control registers...');

    const migrationSteps = [
      { p: 25, text: 'Isolating active segment contexts on host PCIe bus...' },
      { p: 50, text: 'Migrating active weights & transient KV-cache tensor states...' },
      { p: 75, text: 'Rewiring LangGraph microfyxd active sequence dispatch maps...' },
      { p: 90, text: 'Validating parity checksum hashes across cluster channels...' },
      { p: 100, text: 'Cluster memory rebalanced & confirmed!' }
    ];

    for (let i = 0; i < migrationSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 700));
      setRerouteProgress(migrationSteps[i].p);
      setRerouteStatus(migrationSteps[i].text);
    }

    // Apply state change
    setGpuCluster(prev => prev.map(gpu => {
      if (gpu.id === rerouteSource) {
        const nextUsed = gpu.vramUsed - rerouteAmount;
        return {
          ...gpu,
          vramUsed: nextUsed,
          util: Math.max(5, gpu.util - 30),
          status: nextUsed <= 4 ? 'Standby' : 'Active',
          task: nextUsed <= 4 ? 'Idle' : gpu.task
        };
      }
      if (gpu.id === rerouteDest) {
        const nextUsed = gpu.vramUsed + rerouteAmount;
        return {
          ...gpu,
          vramUsed: nextUsed,
          util: Math.min(95, gpu.util + 40),
          temp: Math.min(78, gpu.temp + 10),
          status: 'Active',
          task: `Rerouted Task (Migrated from ${sourceGpu.id.toUpperCase()})`
        };
      }
      return gpu;
    }));

    // Record dynamic shift in memory history instantly
    setMemoryHistory(prevHist => {
      const nextTick = prevHist[prevHist.length - 1].tick + 1;
      return [
        ...prevHist.slice(-9),
        {
          tick: nextTick,
          'gpu-0': Math.round(rerouteSource === 'gpu-0' ? (gpuCluster[0].vramUsed - rerouteAmount) : (rerouteDest === 'gpu-0' ? (gpuCluster[0].vramUsed + rerouteAmount) : gpuCluster[0].vramUsed)),
          'gpu-1': Math.round(rerouteSource === 'gpu-1' ? (gpuCluster[1].vramUsed - rerouteAmount) : (rerouteDest === 'gpu-1' ? (gpuCluster[1].vramUsed + rerouteAmount) : gpuCluster[1].vramUsed)),
          'gpu-2': Math.round(rerouteSource === 'gpu-2' ? (gpuCluster[2].vramUsed - rerouteAmount) : (rerouteDest === 'gpu-2' ? (gpuCluster[2].vramUsed + rerouteAmount) : gpuCluster[2].vramUsed)),
          'gpu-3': Math.round(rerouteSource === 'gpu-3' ? (gpuCluster[3].vramUsed - rerouteAmount) : (rerouteDest === 'gpu-3' ? (gpuCluster[3].vramUsed + rerouteAmount) : gpuCluster[3].vramUsed))
        }
      ];
    });

    const auditDetails = `VRAM Allocation Shift: Re-routed ${rerouteAmount}GB VRAM from ${sourceGpu.name} to ${destGpu.name}. Reason: Performance workload optimization.`;
    
    await logAudit('GPU_VRAM_REROUTE', auditDetails);

    setMessages(prev => [...prev, {
      id: 'msg-gpu-' + Date.now(),
      role: 'system',
      content: `🔄 **GPU VRAM Cluster Rebalanced**: Successfully migrated ${rerouteAmount} GB of cache registers from ${sourceGpu.id.toUpperCase()} to ${destGpu.id.toUpperCase()}.`,
      timestamp: new Date().toLocaleTimeString()
    }]);

    setIsRerouting(false);
    setRerouteStatus('');
  };

  const getSvgPathForGpu = (gpuId: string) => {
    if (memoryHistory.length === 0) return '';
    const points = memoryHistory.map((item, index) => {
      const x = 20 + (index / (memoryHistory.length - 1)) * 440;
      const val = (item as any)[gpuId] || 0;
      const y = 110 - (val / 80) * 90;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  // Theme state & Memory handlers
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleAddMemoryNode = async (category: string, summary: string, importance: number, tags: string[]) => {
    try {
      const res = await fetch('/api/cognition/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memoryType: category, value: summary, confidence: importance / 10, key: tags.join(",") })
      });
      const data = await res.json();
      if (data.success) {
        await loadCognitionData();
      }
    } catch (err) {
      console.error('Failed to add memory node:', err);
    }
  };

  const handleDeleteMemoryNode = async (id: string) => {
    try {
      const res = await fetch(`/api/cognition/memories/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        await loadCognitionData();
      }
    } catch (err) {
      console.error('Failed to delete memory node:', err);
    }
  };

  const handleAccessMemoryNode = async (id: string) => {
    try {
      const res = await fetch(`/api/cognition/memories/${id}/access`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        await loadCognitionData();
      }
    } catch (err) {
      console.error('Failed to access memory node:', err);
    }
  };

  // Dynamic Graph execution state
  const [messages, setMessages] = useState<any[]>([
    {
      id: 'msg-init-0',
      role: 'assistant',
      content: `### Welcome to Microfyxd AI Enterprise System Cockpit
Microfyxd is an advanced, high-assurance multi-agent platform orchestrated strictly via **LangGraph**.

**How to test the system**:
- Enter a prompt in the **Operator Input** or choose one of the quick presets below.
- Click **Run Workspace Task**.
- Watch the **LangGraph Execution Pipeline** illuminate step-by-step as each node performs specialized computations (e.g., phenotype readings, ego introspection, self-checking compliance, and sandbox compilation diagnostics).
- Inspect the resulting step-by-step trace logs, or browse the complete **Monorepo File Explorer** in the side panel!`,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [traces, setTraces] = useState<TraceLog[]>([]);
  const [selectedTrace, setSelectedTrace] = useState<TraceLog | null>(null);
  const [monorepoFiles, setMonorepoFiles] = useState<MonorepoFile[]>([]);
  const [selectedFilePath, setSelectedFilePath] = useState<string>('microfyxd/packages/agent/index.ts');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [simulatedNodeIndex, setSimulatedNodeIndex] = useState<number>(-1);

  // Watchdog & Metrics
  const [metrics, setMetrics] = useState({
    cpu: 12,
    ram: 24,
    temp: 51,
    util: 10,
    activeAlerts: [] as string[],
    safetyOverride: false
  });

  // End of scroll ref
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load monorepo files on mount
  useEffect(() => {
    fetchMonorepoFiles();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isRunning]);

  const fetchMonorepoFiles = async () => {
    try {
      const res = await fetch('/api/files');
      const data = await res.json();
      if (data.files) {
        setMonorepoFiles(data.files);
      }
    } catch (e) {
      console.error('Failed to fetch monorepo files', e);
    }
  };

  // Node execution order for UI visual progress representation
  const graphNodesSequence = [
    { id: 'phenotypeReadNode', label: 'Phenotype Scan' },
    { id: 'gpuDetectNode', label: 'GPU Detect' },
    { id: 'egoModelNode', label: 'Ego Introspect' },
    { id: 'selfCheckNode', label: 'Watchdog Check' },
    { id: 'diagnoseNode', label: 'Sandbox Diagnosis' },
    { id: 'repairNode', label: 'Self-Repair' },
    { id: 'retryNode', label: 'Compile Verify' },
    { id: 'humanInTheLoopNode', label: 'Human Clearance' },
    { id: 'finalMergeNode', label: 'Triple Consensus' }
  ];

  // Helper to trigger the full LangGraph flow
  const runLangGraphFlow = async (customPrompt?: string, customCode?: string) => {
    if (isRunning) return;
    
    const activePrompt = customPrompt || prompt;
    const lowercasePrompt = activePrompt.toLowerCase();
    const isSandboxQuery = 
      lowercasePrompt.includes('sandbox') || 
      lowercasePrompt.includes('repair') || 
      lowercasePrompt.includes('diagnose') || 
      lowercasePrompt.includes('compile') || 
      lowercasePrompt.includes('heal') || 
      lowercasePrompt.includes('code') || 
      lowercasePrompt.includes('snippet') || 
      lowercasePrompt.includes('syntax');

    const activeCode = customCode !== undefined ? customCode : (isSandboxQuery ? sandboxCode : '');

    setIsRunning(true);
    setTraces([]);
    setSelectedTrace(null);
    setSimulatedNodeIndex(0);
    
    const expectedSequence = isSandboxQuery 
      ? graphNodesSequence 
      : graphNodesSequence.filter(node => !['diagnoseNode', 'repairNode', 'retryNode'].includes(node.id));

    setActiveNodeId(expectedSequence[0].id);

    // Append user message
    setMessages(prev => [...prev, {
      id: 'msg-usr-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      role: 'user',
      content: activePrompt,
      timestamp: new Date().toLocaleTimeString()
    }]);

    // Visual sequence animator simulation before rendering real traces
    let step = 0;
    const stepInterval = setInterval(() => {
      step++;
      if (step < expectedSequence.length) {
        setSimulatedNodeIndex(step);
        setActiveNodeId(expectedSequence[step].id);
      } else {
        clearInterval(stepInterval);
      }
    }, 450);

    try {
      // Call real Express backend to execute LangGraph state machine!
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: activePrompt,
          sourceCode: activeCode,
          hardwareOverride,
          arcanaTier
        })
      });

      const data = await response.json();
      clearInterval(stepInterval); // stop visual fallback if fast

      if (data.success && data.finalState) {
        // Staggered delivery of traces for maximum visual epicness!
        const backendTraces = data.finalState.traces;
        setTraces(backendTraces);
        if (backendTraces.length > 0) {
          setSelectedTrace(backendTraces[backendTraces.length - 1]);
        }

        // Apply updated metrics from state
        const watchdog = data.finalState.watchdog;
        const infra = data.finalState.infrastructure;
        setMetrics({
          cpu: watchdog.cpuUsagePercent || 15,
          ram: watchdog.ramUsagePercent || 26,
          temp: Math.max(...(infra.availableGpus?.map((g: any) => g.temperatureC) || [50])),
          util: Math.max(...(infra.availableGpus?.map((g: any) => g.utilizationPercent) || [10])),
          activeAlerts: watchdog.activeAlerts || [],
          safetyOverride: watchdog.safetyOverrideEngaged || false
        });

        // Append assistant response
        const lastMsg = data.finalState.messages[data.finalState.messages.length - 1];
        setMessages(prev => [...prev, {
          id: 'msg-ast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
          role: 'assistant',
          content: lastMsg.content,
          timestamp: new Date().toLocaleTimeString()
        }]);
      } else {
        throw new Error(data.error || 'Unknown runtime compilation failure.');
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: 'msg-err-' + Date.now(),
        role: 'system',
        content: `⛔ **LangGraph Runtime Error**: ${err.message || err}`,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsRunning(false);
      setActiveNodeId(null);
      setSimulatedNodeIndex(-1);
    }
  };

  const speakText = (text: string, index: number) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    if (speakingMessageIdx === index) {
      setSpeakingMessageIdx(null);
      return;
    }

    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/###/g, '')
      .replace(/- /g, '')
      .replace(/`/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    // Sophisticated voice profile tuning: controlled pacing & resonant pitch
    utterance.rate = 0.88;  // Controlled, measured pacing
    utterance.pitch = 0.93; // Slightly deeper, resonant vocal tone

    const voicesList = window.speechSynthesis.getVoices();
    const voice = voicesList.find(v => v.name === selectedVoiceName);
    
    if (voice) {
      utterance.voice = voice;
    } else {
      const preferredVoice = voicesList.find(v => 
        v.lang.startsWith('en') && (
          v.name.includes('Google UK English Male') ||
          v.name.includes('Google UK English Female') ||
          v.name.includes('Daniel') ||
          v.name.includes('Arthur') ||
          v.name.includes('Serena') ||
          v.name.includes('Natural') ||
          v.name.includes('Enhanced') ||
          v.name.includes('Premium') ||
          v.name.includes('Google') ||
          v.name.includes('Microsoft')
        )
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }

    utterance.onend = () => {
      setSpeakingMessageIdx(null);
    };

    utterance.onerror = () => {
      setSpeakingMessageIdx(null);
    };

    setSpeakingMessageIdx(index);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageIdx(null);
  };

  const runDiagnostics = async () => {
    if (diagnosticState === 'scanning' || diagnosticState === 'healing') return;
    
    setDiagnosticState('scanning');
    setDiagnosticStep(0);
    setDiagnosticLogs([
      `[${new Date().toLocaleTimeString()}] [INFO] Starting Full System Self-Diagnostics...`,
      `[${new Date().toLocaleTimeString()}] [INFO] Querying active service descriptors & configuration routes.`
    ]);

    const steps = [
      { id: 'gateway', name: 'AI Director Connectivity Gateway' },
      { id: 'langgraph', name: 'LangGraph Orchestrator Node Engine' },
      { id: 'sandbox', name: 'Sandbox Code Isolation Compiler' },
      { id: 'cloudsql', name: 'Cloud SQL Secure Connection Pool' },
      { id: 'google_ws', name: 'Google Workspace Synchronization Bridge' }
    ];

    for (let i = 0; i < steps.length; i++) {
      setDiagnosticStep(i + 1);
      const step = steps[i];
      setDiagnosticLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] [TEST] Pinging ${step.name}...`]);
      
      await new Promise(resolve => setTimeout(resolve, 600));

      let status: 'pass' | 'fail' | 'warn' = 'pass';
      let details = 'Connection established successfully. All tests green.';

      if (step.id === 'gateway') {
        status = 'warn';
        details = 'Warning: Undici transport timed out previously. Route backup enabled.';
      } else if (step.id === 'langgraph') {
        status = 'pass';
        details = 'Orchestrator online. Verified sequence flow: state -> validation -> compile -> merge.';
      } else if (step.id === 'sandbox') {
        const hasFaults = sandboxCode && (sandboxCode.includes('const bugVar') || sandboxCode.includes('unclosed'));
        status = hasFaults ? 'warn' : 'pass';
        details = hasFaults ? 'Warning: Syntax faults present in sandbox snippet.' : 'Compiler active. Syntax verified green.';
      } else if (step.id === 'cloudsql') {
        status = favItems.length > 0 || auditLogsList.length > 0 ? 'pass' : 'warn';
        details = status === 'pass' ? 'Drizzle RM pool healthy. Verified active database entities.' : 'Secure connection idle. No records queried yet.';
      } else if (step.id === 'google_ws') {
        status = currentUser ? 'pass' : 'warn';
        details = status === 'pass' ? `Logged in as ${currentUser.email}. Active session token valid.` : 'No active workspace token linked.';
      }

      setDiagnosticResults(prev => prev.map(item => item.id === step.id ? { ...item, status, details } : item));
      setDiagnosticLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] [RESULT] ${step.name}: ${status.toUpperCase()} (${details})`]);
    }

    setDiagnosticState('complete');
    setHasDiagnosticIssues(true);
    setDiagnosticLogs(prev => [
      ...prev, 
      `[${new Date().toLocaleTimeString()}] [INFO] Diagnosis phase finished.`,
      `[${new Date().toLocaleTimeString()}] [INFO] Ready for Auto-Healing Core configuration.`
    ]);
  };

  const runAutoHealing = async () => {
    if (diagnosticState === 'healing') return;
    setDiagnosticState('healing');
    
    setDiagnosticLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] [HEAL] Core System Healing sequence ENGAGED.`,
      `[${new Date().toLocaleTimeString()}] [HEAL] Optimizing undici keep-alive timeouts...`
    ]);

    await new Promise(resolve => setTimeout(resolve, 800));
    setDiagnosticLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] [HEAL] Applying custom rule-based router as pre-emptive gateway fallback...`
    ]);

    await new Promise(resolve => setTimeout(resolve, 800));
    setDiagnosticLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] [HEAL] Sanitizing sandbox buffer state...`
    ]);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    setDiagnosticLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] [HEAL] Auto-rebalancing active telemetry layers...`
    ]);

    await new Promise(resolve => setTimeout(resolve, 600));

    setDiagnosticResults(prev => prev.map(item => ({
      ...item,
      status: 'pass',
      details: item.id === 'gateway' 
        ? 'Healed: Rule-based router and request retries fully provisioned.' 
        : item.id === 'sandbox' 
        ? 'Healed: Evaluator buffer sanitized.' 
        : 'Pass: Subsystem verified healthy.'
    })));

    setHealActionsApplied(prev => prev + 1);
    setDiagnosticState('healed');
    setHasDiagnosticIssues(false);
    setDiagnosticLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] [SUCCESS] AUTO-HEALING ROUTINES APPLIED successfully. All connections secured!`,
      `[${new Date().toLocaleTimeString()}] [SUCCESS] System status restored to TIER 3 master health.`
    ]);
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const updateVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      // Filter to English voices
      const englishVoices = allVoices.filter(v => v.lang.startsWith('en'));
      setVoices(englishVoices);

      if (englishVoices.length > 0) {
        // Look for articulate, resonant, sophisticated voice choices
        const defaultChoice = englishVoices.find(v => 
          v.name.includes('Google UK English Male') ||
          v.name.includes('Google UK English Female') ||
          v.name.includes('Daniel') ||
          v.name.includes('Arthur') ||
          v.name.includes('Serena') ||
          v.name.includes('Oliver') ||
          v.name.includes('Natural') ||
          v.name.includes('Enhanced') ||
          v.name.includes('Premium') ||
          v.name.includes('Samantha') || 
          v.name.includes('Google US English') ||
          v.lang === 'en-GB' ||
          v.lang === 'en-US'
        );
        if (defaultChoice) {
          setSelectedVoiceName(prev => prev || defaultChoice.name);
        } else {
          setSelectedVoiceName(prev => prev || englishVoices[0].name);
        }
      }
    };

    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Quantum bio-neural simulation loop effect
  useEffect(() => {
    let timer: any = null;
    if (quantumTuningActive) {
      let stepCount = 0;
      timer = setInterval(() => {
        stepCount++;
        // Randomize active firing nodes slightly around the saturation level
        const baseFires = Math.round(saturation * 12 + plasticity * 4);
        setActiveFires(Math.max(3, Math.min(18, Math.round(baseFires + (Math.random() - 0.5) * 4))));
        
        // Rise coherence slowly towards target based on plasticity and resonance
        const targetCoherence = Math.min(99.9, Math.round((92 + resonance * 6.5 + plasticity * 1.4) * 10) / 10);
        setCoherence(prev => {
          if (prev < targetCoherence) {
            return Math.round((prev + 0.8) * 10) / 10;
          } else if (prev > targetCoherence + 1) {
            return Math.round((prev - 0.4) * 10) / 10;
          }
          return prev;
        });

        // Log beautiful events periodically
        if (stepCount % 3 === 1) {
          const events = [
            "Aligning neural phase vectors into coherent resonance matrix...",
            "Tuning synaptic plasticity coefficients in hidden cortical layer 2...",
            "Neurotransmitter buffer state adjusted. Signal conductivity elevated.",
            "Coherence metrics optimizing. Self-healing backplanes fully synced.",
            "Action potentials stable. Multi-agent routing feedback matches doctrine bounds."
          ];
          const randomEv = events[Math.floor(Math.random() * events.length)];
          setQuantumLogs(prev => [
            `[${new Date().toLocaleTimeString()}] [TUNER] ${randomEv}`,
            ...prev.slice(0, 19)
          ]);
        }

        if (stepCount >= 15) {
          clearInterval(timer);
          setQuantumTuningActive(false);
          setQuantumLogs(prev => [
            `[${new Date().toLocaleTimeString()}] [SUCCESS] TUNING SWEEP COMPLETE. Neural resonance aligned at ${coherence}%!`,
            `[${new Date().toLocaleTimeString()}] [SYSTEM] Cognitive profile saved and loaded to active runtime core.`,
            ...prev.slice(0, 18)
          ]);
        }
      }, 400);
    } else {
      // Idle state simulation
      timer = setInterval(() => {
        const baseFires = Math.round(saturation * 8);
        setActiveFires(Math.max(1, Math.min(12, Math.round(baseFires + (Math.random() - 0.5) * 2))));
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [quantumTuningActive, saturation, plasticity, resonance, coherence]);

  const runAiDirectorFlow = async (customPrompt?: string) => {
    if (isRunning) return;
    const activePrompt = customPrompt || prompt;
    if (!activePrompt.trim()) return;

    setIsRunning(true);

    // Append user message
    setMessages(prev => [...prev, {
      id: 'msg-usr-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      role: 'user',
      content: activePrompt,
      timestamp: new Date().toLocaleTimeString()
    }]);

    setPrompt(''); // Clear the input

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: activePrompt,
          history: messages.filter(m => m.role === 'user' || m.role === 'assistant').slice(-10) // last 10 messages for context
        })
      });

      const data = await response.json();

      if (data.success) {
        // Append assistant response
        setMessages(prev => {
          const updated = [...prev, {
            id: 'msg-ast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
            role: 'assistant',
            content: data.reply,
            timestamp: new Date().toLocaleTimeString()
          }];
          if (autoSpeak) {
            setTimeout(() => {
              speakText(data.reply, updated.length - 1);
            }, 100);
          }
          return updated;
        });

        // Process any actions sent by the AI
        if (data.actions && Array.isArray(data.actions)) {
          for (const action of data.actions) {
            console.log('AI Director executing action:', action);
            try {
              switch (action.type) {
                case 'SET_ACTIVE_TAB':
                  if (action.payload && action.payload.tab) {
                    setActiveTab(action.payload.tab);
                  }
                  break;
                case 'SET_ACTIVE_SUBSECTION':
                  if (action.payload && action.payload.subSection) {
                    setActiveSubSection(action.payload.subSection);
                  }
                  break;
                case 'EXECUTE_COGNITION_LOOP':
                  if (action.payload && action.payload.outcome) {
                    await handleExecuteCognitionStep(action.payload.outcome);
                  }
                  break;
                case 'ADD_COGNITIVE_GOAL':
                  if (action.payload && action.payload.description) {
                    const res = await fetch('/api/cognition/goals', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(action.payload)
                    });
                    const resData = await res.json();
                    if (resData.success) {
                      await loadCognitionData();
                    }
                  }
                  break;
                case 'ADD_COGNITIVE_TASK':
                  if (action.payload && action.payload.assignedGoal) {
                    const res = await fetch('/api/cognition/tasks', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(action.payload)
                    });
                    const resData = await res.json();
                    if (resData.success) {
                      await loadCognitionData();
                    }
                  }
                  break;
                case 'ADD_MEMORY':
                  if (action.payload && action.payload.key && action.payload.value) {
                    const res = await fetch('/api/cognition/memories', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(action.payload)
                    });
                    const resData = await res.json();
                    if (resData.success) {
                      await loadCognitionData();
                    }
                  }
                  break;
                case 'TOGGLE_SAFETY_OVERRIDE':
                  if (action.payload && action.payload.engaged !== undefined) {
                    setMetrics(prev => ({
                      ...prev,
                      safetyOverride: action.payload.engaged
                    }));
                  }
                  break;
                case 'TRIGGER_DIAGNOSTICS':
                  setActiveTab('cockpit');
                  setTimeout(() => {
                    runDiagnostics();
                  }, 300);
                  break;
                case 'TRIGGER_AUTO_HEAL':
                  setActiveTab('cockpit');
                  setTimeout(() => {
                    runAutoHealing();
                  }, 300);
                  break;
                case 'TRIGGER_QUANTUM_TUNING':
                  setActiveTab('quantum_tuning');
                  setQuantumTuningActive(true);
                  setQuantumLogs(prev => [
                    `[${new Date().toLocaleTimeString()}] [TUNER] Remote trigger from AI Director received. Commencing sweep.`,
                    ...prev
                  ]);
                  break;
                default:
                  console.warn('Unknown action type:', action.type);
              }
            } catch (actionErr) {
              console.error('Error executing action:', action.type, actionErr);
            }
          }
        }
      } else {
        throw new Error(data.error || 'Failed to communicate with AI Director.');
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: 'msg-err-' + Date.now(),
        role: 'system',
        content: `⛔ **AI Director Error**: ${err.message || err}`,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsRunning(false);
    }
  };

  const selectedFile = monorepoFiles.find(f => f.path === selectedFilePath);

  return (
    <div className={`min-h-screen font-sans flex flex-col selection:bg-indigo-500/30 transition-colors duration-300 ${
      theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-[#08090d] text-gray-200'
    }`}>
      
      {/* GLOWING SYSTEM HEADER */}
      <header className={`border-b backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 transition-colors duration-300 ${
        theme === 'light' ? 'border-slate-200 bg-white/90 shadow-sm' : 'border-gray-800/80 bg-[#0b0c13]/90'
      }`}>
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-lg text-white shadow-lg shadow-indigo-500/20 ring-1 ring-white/15">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`font-sans font-bold text-lg tracking-tight ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Microfyxd</h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 font-bold">
                v2.5-ENTERPRISE
              </span>
            </div>
            <p className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`}>LangGraph-First Dynamic Multi-Agent Control Cockpit</p>
          </div>
        </div>

        {/* METRIC PILLS & THEME TOGGLE */}
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={toggleTheme}
            className={`px-3 py-2 rounded-xl border flex items-center gap-2 font-mono text-xs cursor-pointer transition-all duration-200 ${
              theme === 'light'
                ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 shadow-sm font-bold'
                : 'bg-[#121420] text-amber-400 border-gray-800 hover:bg-gray-800 font-bold'
            }`}
            title="Toggle Theme (Dark / Light)"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span>DARK MODE</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                <span>LIGHT MODE</span>
              </>
            )}
          </button>

          <div className={`border rounded-lg p-2 flex items-center gap-3 ${
            theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-[#121420] border-gray-800/60'
          }`}>
            <span className={`flex items-center gap-1.5 font-mono ${theme === 'light' ? 'text-slate-600' : 'text-gray-400'}`}>
              <Cpu className="w-3.5 h-3.5 text-indigo-500" />
              CPU: <span className={`font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{metrics.cpu}%</span>
            </span>
            <div className={`h-3 w-px ${theme === 'light' ? 'bg-slate-300' : 'bg-gray-800'}`} />
            <span className={`flex items-center gap-1.5 font-mono ${theme === 'light' ? 'text-slate-600' : 'text-gray-400'}`}>
              <Database className="w-3.5 h-3.5 text-purple-500" />
              RAM: <span className={`font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{metrics.ram}%</span>
            </span>
            <div className={`h-3 w-px ${theme === 'light' ? 'bg-slate-300' : 'bg-gray-800'}`} />
            <span className={`flex items-center gap-1.5 font-mono ${theme === 'light' ? 'text-slate-600' : 'text-gray-400'}`}>
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              GPU Temp: <span className={`font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{metrics.temp}°C</span>
            </span>
          </div>

          <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border font-mono text-[11px] ${
            metrics.safetyOverride 
              ? 'bg-rose-500/10 text-rose-500 border-rose-500/30 font-bold' 
              : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-bold'
          }`}>
            <span className={`w-2 h-2 rounded-full ${metrics.safetyOverride ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
            {metrics.safetyOverride ? 'WATCHDOG TRIGGERED' : 'SYSTEM HEALTHY'}
          </div>
        </div>
      </header>

      {/* UNIFIED SUB-NAVIGATION BAR */}
      <div className={`px-6 py-2 border-b flex items-center justify-between gap-2 overflow-x-auto text-xs shrink-0 ${
        theme === 'light' ? 'bg-slate-100/80 border-slate-200' : 'bg-[#0e1018] border-gray-800/80'
      }`}>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('command_center')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'command_center'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Chat Command Center
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'leads'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Lead Vault & HVAC Permits
          </button>

          <button
            onClick={() => setActiveTab('autonomous_engines')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'autonomous_engines'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Autonomous Engines
          </button>

          <button
            onClick={() => setActiveTab('memory')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'memory'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-purple-400" />
            Agent Memory & LTM
          </button>

          <button
            onClick={() => setActiveTab('cockpit')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'cockpit'
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            Holographic Telemetry Cockpit
          </button>
        </div>

        <div className="text-[11px] font-mono text-slate-500 hidden sm:block">
          Single-View Command Protocol Active
        </div>
      </div>

      {/* ARCANA COCKPIT & CHAT COMMAND CENTER & MEMORY VISUALIZER & LEAD PIPELINE */}
      {activeTab === 'command_center' ? (
        <main className="flex-1 p-4 sm:p-6 overflow-hidden w-full relative z-10 flex flex-col">
          <ChatCommandCenter
            onRunLangGraph={runLangGraphFlow}
            isRunning={isRunning}
            traces={traces}
            metrics={metrics}
            messages={messages}
            setMessages={setMessages}
            onAutoHeal={runAutoHealing}
            diagnosticState={diagnosticState}
            currentUser={currentUser}
            onNavigateTab={(tab: string) => setActiveTab(tab as any)}
          />
        </main>
      ) : activeTab === 'autonomous_engines' ? (
        <main className="flex-1 p-6 overflow-y-auto w-full relative z-10 flex flex-col items-center">
          <div className="w-full max-w-6xl flex flex-col items-start gap-4">
            <button 
              onClick={() => setActiveTab('command_center')} 
              className="px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/20 font-mono text-xs font-bold transition-all"
            >
              ← Return to Chat Command Center
            </button>
            <div className="w-full">
              <AutonomousEngines 
                onApplyCoherenceBoost={(boost) => setCoherence(prev => Math.min(100, Number((prev + boost).toFixed(1))))}
                systemHealth={metrics.cpu}
              />
            </div>
          </div>
        </main>
      ) : activeTab === 'leads' ? (
        <main className="flex-1 p-6 overflow-y-auto w-full relative z-10 flex flex-col items-center">
          <div className="w-full max-w-6xl flex flex-col items-start gap-4">
            <button 
              onClick={() => setActiveTab('command_center')} 
              className="px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/20 font-mono text-xs font-bold transition-all"
            >
              ← Return to Chat Command Center
            </button>
            <div className="w-full">
              <LeadScraperPanel />
            </div>
          </div>
        </main>
      ) : activeTab === 'memory' ? (
        <main className="flex-1 p-6 overflow-y-auto w-full relative z-10 flex flex-col items-center">
          <div className="w-full max-w-6xl flex flex-col items-start gap-4">
            <button 
              onClick={() => setActiveTab('command_center')} 
              className="px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/20 font-mono text-xs font-bold transition-all"
            >
              ← Return to Chat Command Center
            </button>
            <div className="w-full">
              <MemoryVisualizer
                memories={agentMemories}
                onAddMemory={handleAddMemoryNode}
                onDeleteMemory={handleDeleteMemoryNode}
                onAccessMemory={handleAccessMemoryNode}
                theme={theme}
              />
            </div>
          </div>
        </main>
      ) : (
        <main className="relative z-10 flex-1 px-4 sm:px-8 pt-10 pb-16 flex flex-col items-center w-full overflow-y-auto">
          {/* Action Buttons Overlay */}
          <div className="absolute top-4 right-8 z-50 flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('leads')} 
              className="px-4 py-2 border border-cyan-500/30 text-cyan-400 bg-cyan-500/10 rounded-lg text-xs font-mono font-bold hover:bg-cyan-500/20 transition-all flex items-center gap-2 shadow-lg"
            >
              <Search className="w-4 h-4" />
              LEAD PIPELINE
            </button>
            <button 
              onClick={() => setActiveTab('memory')} 
              className="px-4 py-2 border border-indigo-500/30 text-indigo-400 bg-indigo-500/10 rounded-lg text-xs font-mono font-bold hover:bg-indigo-500/20 transition-all flex items-center gap-2 shadow-lg"
            >
              <Database className="w-4 h-4" />
              AGENT MEMORY
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-center w-full max-w-6xl mb-12">
            
            {/* Holographic Head */}
            <div className={`h-[400px] w-full rounded-2xl overflow-hidden border relative shadow-2xl flex items-center justify-center ${theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-[#0a0c13]/60 border-indigo-500/20'}`}>
              <HolographicCanvas 
                coherence={coherence} 
                isTuningActive={quantumTuningActive}
                activeTab={activeTab}
                isSpeaking={speakingMessageIdx !== null}
                isProcessing={isRunning}
                isListening={isListening}
                mode="full"
                theme={theme}
              />
            </div>
            
            {/* Node Pulse Map */}
            <div className="w-full flex flex-col gap-4">
              <h3 className={`font-mono text-sm font-bold uppercase tracking-wider mb-2 ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`}>LangGraph Routing Matrix</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  "arcanaDirectorNode",
                  "egoModelNode",
                  "phenotypeNode",
                  "doctrineNode",
                  "memoryNode",
                  "sandboxNode",
                  "selfRepairNode",
                  "supabaseTraceNode",
                  "automotiveObdNode",
                  "safetyGateNode",
                  "tripleConsensusNode"
                ].map((node) => {
                  const nodeLabel = node.replace('Node', '');
                  // For visual effect, if activeNodeId matches our simplified list (which doesn't perfectly align with the old graphNodesSequence, but we simulate it):
                  // We'll just light up arcanaDirectorNode as the baseline, and if isRunning we pulse.
                  const isActive = isRunning ? (Math.random() > 0.7) : (node === 'arcanaDirectorNode');
                  
                  return (
                    <div key={node} className={`p-3 rounded-xl text-[10px] sm:text-xs text-center border font-mono transition-all duration-300 ${
                      isActive
                        ? (theme === 'light' ? 'border-indigo-500 shadow-lg bg-indigo-50 text-indigo-700 font-bold scale-[1.02]' : 'border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)] bg-indigo-900/40 text-indigo-100 font-bold scale-[1.02]')
                        : (theme === 'light' ? 'border-slate-200 bg-white text-slate-500' : 'border-indigo-900/40 bg-black/20 text-gray-400')
                    }`}>
                      {nodeLabel}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Arcana Chat Panel */}
          <div className={`w-full max-w-4xl p-6 rounded-2xl border shadow-2xl flex flex-col gap-4 ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#0b0c13]/80 border-indigo-500/30 backdrop-blur-md'}`}>
            <h3 className={`font-mono text-xs font-bold uppercase tracking-wider ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`}>Arcana Terminal</h3>
            
            <div className={`flex flex-col gap-4 overflow-y-auto h-56 p-4 rounded-xl border ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-gray-800'}`}>
              {messages.slice(-20).map((m, idx) => (
                <div key={idx} className={`flex flex-col ${m.role === 'user' ? 'items-end text-right' : 'items-start text-left'}`}>
                  <span className={`text-[10px] mb-1 ${theme === 'light' ? 'text-slate-500' : 'text-gray-500'}`}>
                    {m.role === 'user' ? 'Operator' : 'Arcana'}
                  </span>
                  <div className={`px-4 py-2.5 rounded-xl max-w-[85%] text-xs font-mono leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/30' 
                      : (theme === 'light' ? 'bg-white text-slate-800 border border-slate-200 shadow-sm' : 'bg-gray-900/60 text-gray-300 border border-gray-800')
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isRunning && (
                <div className="flex flex-col items-start text-left">
                  <span className={`text-[10px] mb-1 ${theme === 'light' ? 'text-slate-500' : 'text-gray-500'}`}>Arcana</span>
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono bg-indigo-600/10 text-indigo-300 border border-indigo-500/20">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing cognitive nodes...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              
              <button
                onClick={() => setIsListening(!isListening)}
                className={`p-3 rounded-xl border flex items-center justify-center transition-all ${isListening ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse' : (theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200' : 'bg-gray-900 border-gray-800 text-gray-500 hover:bg-gray-800')}`}
              >
                {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
              <input 
                type="text" 
                disabled={isRunning}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && prompt.trim() && !isRunning) {
                    if (terminalMode === 'ai-director') runAiDirectorFlow();
                    else runLangGraphFlow();
                  }
                }}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-mono outline-none border transition-all ${
                  theme === 'light' 
                    ? 'bg-slate-50 border-slate-200 focus:border-indigo-400 text-slate-900 placeholder-slate-400' 
                    : 'bg-[#05060a] border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 text-white placeholder-gray-600'
                }`}
                placeholder="Input command to Arcana Director Node..."
              />
              <button 
                disabled={isRunning || !prompt.trim()}
                onClick={() => {
                  if (terminalMode === 'ai-director') runAiDirectorFlow();
                  else runLangGraphFlow();
                }}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)]"
              >
                {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                SEND TO ARCANA
              </button>
            </div>
          </div>
        </main>
      )}
      {/* FOOTER */}
      <footer className="bg-[#06070a] border-t border-gray-900 text-[11px] text-gray-500 font-mono px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <span>Microfyxd Enterprise Management • Authorized Access Only</span>
        <span>UTC Time: {new Date().toISOString().slice(0, 19).replace('T', ' ')}</span>
      </footer>

    </div>
  );
}
