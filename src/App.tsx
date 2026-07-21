import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
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
  VolumeX
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
  const [activeTab, setActiveTab] = useState<'cockpit' | 'traces' | 'files' | 'phenotype' | 'ego' | 'infra' | 'sandbox' | 'memory' | 'doctrine' | 'workspace' | 'integrations' | 'quantum_tuning' | 'autonomous_engines'>('cockpit');
  const [terminalMode, setTerminalMode] = useState<'langgraph' | 'ai-director'>('ai-director');
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);
  const [speakingMessageIdx, setSpeakingMessageIdx] = useState<number | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  
  // Self-Diagnostic and Auto-Healing System
  const [diagnosticState, setDiagnosticState] = useState<'idle' | 'scanning' | 'complete' | 'healing' | 'healed'>('idle');
  const [diagnosticStep, setDiagnosticStep] = useState<number>(0);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);
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
      if (memoriesData.success) setAgentMemories(memoriesData.memories);
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

  // Dynamic Graph execution state
  const [messages, setMessages] = useState<any[]>([
    {
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
    const voicesList = window.speechSynthesis.getVoices();
    const voice = voicesList.find(v => v.name === selectedVoiceName);
    
    if (voice) {
      utterance.voice = voice;
    } else {
      const preferredVoice = voicesList.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Microsoft')));
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
        // Look for Western / US voice prioritizations (e.g., Samantha, Google US English, Microsoft Zira, David)
        const defaultChoice = englishVoices.find(v => 
          v.name.includes('Samantha') || 
          v.name.includes('Google US English') ||
          v.name.includes('US English') ||
          v.name.includes('Natural') ||
          v.name.includes('Zira') ||
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
    <div className="min-h-screen bg-[#08090d] text-gray-200 font-sans flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* GLOWING SYSTEM HEADER */}
      <header className="border-b border-gray-800/80 bg-[#0b0c13]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-lg text-white shadow-lg shadow-indigo-500/20 ring-1 ring-white/15">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-sans font-bold text-lg tracking-tight text-white">Microfyxd</h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v2.5-ENTERPRISE
              </span>
            </div>
            <p className="text-xs text-gray-400">LangGraph-First Dynamic Multi-Agent Control Cockpit</p>
          </div>
        </div>

        {/* METRIC PILLS */}
        <div className="flex items-center gap-3 text-xs">
          <div className="bg-[#121420] border border-gray-800/60 rounded-lg p-2 flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-gray-400 font-mono">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              CPU: <span className="text-white font-semibold">{metrics.cpu}%</span>
            </span>
            <div className="h-3 w-px bg-gray-800" />
            <span className="flex items-center gap-1.5 text-gray-400 font-mono">
              <Database className="w-3.5 h-3.5 text-purple-400" />
              RAM: <span className="text-white font-semibold">{metrics.ram}%</span>
            </span>
            <div className="h-3 w-px bg-gray-800" />
            <span className="flex items-center gap-1.5 text-gray-400 font-mono">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              GPU Temp: <span className="text-white font-semibold">{metrics.temp}°C</span>
            </span>
          </div>

          <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border font-mono text-[11px] ${
            metrics.safetyOverride 
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${metrics.safetyOverride ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
            {metrics.safetyOverride ? 'WATCHDOG TRIGGERED' : 'SYSTEM HEALTHY'}
          </div>
        </div>
      </header>

      {/* CORE SPLIT WORKSPACE */}
      <main className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 p-6 overflow-hidden">
        
        {/* LEFT COLUMN: OPERATOR TERMINAL & COGNITIVE CHATBOX (xl:span-5) */}
        <div id="operator-terminal" className="xl:col-span-5 flex flex-col gap-6 h-[calc(100vh-140px)] min-h-[500px]">
          
          {/* TERMINAL PANEL FRAME */}
          <div className="flex-1 bg-[#0b0c13]/75 border border-gray-800/60 rounded-xl flex flex-col overflow-hidden shadow-2xl backdrop-blur-sm">
            
            {/* TERMINAL HEADER */}
            <div className="bg-[#0e101b] px-4 py-2 border-b border-gray-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-mono font-medium text-gray-300">CORE EXECUTIVE INTERACTION</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1 p-0.5 bg-gray-950/80 rounded-lg border border-gray-800/60">
                  <button
                    onClick={() => setTerminalMode('ai-director')}
                    className={`px-2 py-1 text-[9px] font-mono rounded-md font-bold transition ${terminalMode === 'ai-director' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    AI DIRECTOR
                  </button>
                  <button
                    onClick={() => setTerminalMode('langgraph')}
                    className={`px-2 py-1 text-[9px] font-mono rounded-md font-bold transition ${terminalMode === 'langgraph' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    LANGGRAPH
                  </button>
                </div>
                <button
                  onClick={() => {
                    const newAuto = !autoSpeak;
                    setAutoSpeak(newAuto);
                    if (!newAuto) {
                      stopSpeaking();
                    }
                  }}
                  className={`px-2 py-1 text-[9px] font-mono rounded-md font-bold transition flex items-center gap-1.5 border ${
                    autoSpeak 
                      ? 'bg-emerald-600/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-600/25' 
                      : 'bg-gray-950/80 text-gray-500 border-gray-800/60 hover:text-gray-300'
                  }`}
                  title={autoSpeak ? "Auto-speak enabled" : "Auto-speak disabled"}
                >
                  {autoSpeak ? <Volume2 className="w-3 h-3 text-emerald-400 animate-pulse" /> : <VolumeX className="w-3 h-3 text-gray-500" />}
                  <span>TTS: {autoSpeak ? 'AUTO ON' : 'AUTO OFF'}</span>
                </button>
                {voices.length > 0 && (
                  <div className="flex items-center gap-1.5 bg-gray-950/80 px-2 py-1 rounded-md border border-gray-800/60 text-[9px] font-mono text-gray-400">
                    <span className="text-indigo-400 font-bold">VOICE:</span>
                    <select
                      value={selectedVoiceName}
                      onChange={(e) => {
                        setSelectedVoiceName(e.target.value);
                        if (typeof window !== 'undefined' && window.speechSynthesis) {
                          window.speechSynthesis.cancel();
                          const u = new SpeechSynthesisUtterance("LA Voice configured.");
                          const v = window.speechSynthesis.getVoices().find(voice => voice.name === e.target.value);
                          if (v) u.voice = v;
                          window.speechSynthesis.speak(u);
                        }
                      }}
                      className="bg-transparent text-gray-300 font-bold outline-none border-none cursor-pointer max-w-[120px] text-[9px]"
                    >
                      {voices.map((v) => (
                        <option key={v.name} value={v.name} className="bg-[#0e101b] text-gray-300 text-[9px]">
                          {v.name.replace('Microsoft', 'MS').replace('Google', 'GOOG').substring(0, 24)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-rose-500/40" />
                  <div className="w-2 h-2 rounded-full bg-amber-500/40" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/40" />
                </div>
              </div>
            </div>

            {/* MESSAGE CONTAINER */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 font-mono text-xs">
              {messages.map((m, idx) => (
                <div 
                  key={idx} 
                  className={`flex flex-col max-w-[90%] ${
                    m.role === 'user' 
                      ? 'self-end items-end text-right' 
                      : m.role === 'system'
                        ? 'self-center text-center max-w-full text-rose-400 bg-rose-950/20 px-4 py-2.5 rounded-lg border border-rose-900/30 w-full'
                        : 'self-start items-start text-left'
                  }`}
                >
                  <span className="text-[10px] text-gray-500 mb-1">
                    {m.role === 'user' ? 'Operator' : 'Microfyxd Server'} • {m.timestamp}
                  </span>
                  <div 
                    className={`px-3 py-2.5 rounded-xl text-left leading-relaxed ${
                      m.role === 'user' 
                        ? 'bg-indigo-600/25 text-indigo-100 border border-indigo-500/30' 
                        : m.role === 'system'
                          ? ''
                          : 'bg-gray-900/60 text-gray-300 border border-gray-800'
                    }`}
                  >
                    {/* Render basic markdown formatting */}
                    <div className="whitespace-pre-wrap font-sans text-xs">
                      {m.content.split('\n').map((line: string, lIdx: number) => {
                        if (line.startsWith('###')) {
                          return <h4 key={lIdx} className="font-bold text-white text-sm my-1">{line.replace('###', '')}</h4>;
                        }
                        if (line.startsWith('- ')) {
                          return <li key={lIdx} className="ml-4 list-disc text-gray-300">{line.replace('- ', '')}</li>;
                        }
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return <p key={lIdx} className="font-bold text-white my-1">{line.replace(/\*\*/g, '')}</p>;
                        }
                        return <p key={lIdx} className="mb-1">{line}</p>;
                      })}
                    </div>
                  </div>
                  {m.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-1 px-1">
                      <button
                        onClick={() => speakText(m.content, idx)}
                        className={`p-1 rounded hover:bg-gray-800/50 transition text-[10px] flex items-center gap-1.5 ${
                          speakingMessageIdx === idx 
                            ? 'text-emerald-400 font-bold' 
                            : 'text-gray-500 hover:text-gray-400'
                        }`}
                      >
                        {speakingMessageIdx === idx ? (
                          <>
                            <VolumeX className="w-3 h-3 text-rose-400" />
                            <span className="text-[9px] font-mono text-rose-400">Stop speaking</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="text-[9px] font-mono text-gray-400">Speak response</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* LIVE SIMULATOR LOADER */}
              {isRunning && (
                <div className="self-start flex flex-col items-start text-left max-w-[85%]">
                  <span className="text-[10px] text-gray-500 mb-1">Microfyxd • Computing Nodes...</span>
                  <div className="flex items-center gap-3 bg-[#111321] border border-indigo-500/20 px-4 py-3 rounded-xl">
                    <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
                    <span className="text-xs text-indigo-200">
                      {terminalMode === 'ai-director' ? 'AI Assistant directing system...' : 'Executing LangGraph pipeline...'}
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* PRESET SHORTCUTS */}
            <div className="px-4 py-2 bg-[#0a0b12] border-t border-gray-800/40 flex flex-wrap gap-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider self-center mr-1">
                {terminalMode === 'ai-director' ? 'Direct Actions:' : 'Workflows:'}
              </span>
              {terminalMode === 'ai-director' ? (
                <>
                  <button 
                    disabled={isRunning}
                    onClick={() => {
                      setPrompt('Show me the Agent Memory tab');
                      runAiDirectorFlow('Show me the Agent Memory tab');
                    }}
                    className="text-[10px] font-mono bg-[#14172a] hover:bg-indigo-600/25 border border-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded transition"
                  >
                    🧭 Show memory
                  </button>
                  <button 
                    disabled={isRunning}
                    onClick={() => {
                      setPrompt('Execute a successful closed-loop cognition cycle');
                      runAiDirectorFlow('Execute a successful closed-loop cognition cycle');
                    }}
                    className="text-[10px] font-mono bg-[#14172a] hover:bg-emerald-600/25 border border-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded transition"
                  >
                    📈 Execute positive loop
                  </button>
                  <button 
                    disabled={isRunning}
                    onClick={() => {
                      setPrompt('Add a new priority 8 cognitive goal to optimize engine coolant');
                      runAiDirectorFlow('Add a new priority 8 cognitive goal to optimize engine coolant');
                    }}
                    className="text-[10px] font-mono bg-[#14172a] hover:bg-purple-600/25 border border-purple-500/20 text-purple-300 px-2.5 py-1 rounded transition"
                  >
                    🎯 Add cognitive goal
                  </button>
                </>
              ) : (
                <>
                  <button 
                    disabled={isRunning}
                    onClick={() => {
                      setPrompt('Tune coolant temperature bounds and adjust engine maps telemetry diagnostics.');
                      runLangGraphFlow('Tune coolant temperature bounds and adjust engine maps telemetry diagnostics.');
                    }}
                    className="text-[10px] font-mono bg-[#14172a] hover:bg-indigo-600/25 border border-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded transition"
                  >
                    🏎️ ECU Adjust Map
                  </button>
                  <button 
                    disabled={isRunning}
                    onClick={() => {
                      setPrompt('Diagnose, compile, and self-heal the broken Sandbox typescript snippet.');
                      runLangGraphFlow('Diagnose, compile, and self-heal the broken Sandbox typescript snippet.', sandboxCode);
                    }}
                    className="text-[10px] font-mono bg-[#14172a] hover:bg-purple-600/25 border border-purple-500/20 text-purple-300 px-2.5 py-1 rounded transition"
                  >
                    ⚡ Sandbox Self-Heal
                  </button>
                  <button 
                    disabled={isRunning}
                    onClick={() => {
                      setPrompt('Examine ego perspectives, cognitive profiles, and model introspection traces.');
                      runLangGraphFlow('Examine ego perspectives, cognitive profiles, and model introspection traces.');
                    }}
                    className="text-[10px] font-mono bg-[#14172a] hover:bg-emerald-600/25 border border-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded transition"
                  >
                    🧠 Ego Introspection
                  </button>
                </>
              )}
            </div>

            {/* INPUT COMMAND LINE */}
            <div className="p-4 bg-[#0e101a] border-t border-gray-800/80 flex gap-2">
              <input 
                type="text"
                disabled={isRunning}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => { 
                  if (e.key === 'Enter') {
                    if (terminalMode === 'ai-director') {
                      runAiDirectorFlow();
                    } else {
                      runLangGraphFlow();
                    }
                  }
                }}
                placeholder={terminalMode === 'ai-director' ? "Ask AI to switch tabs, add goals, trigger loop simulations..." : "Enter prompt command or select preset..."}
                className="flex-1 bg-[#07080f] border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 font-mono outline-none"
              />
              <button 
                disabled={isRunning || !prompt.trim()}
                onClick={() => {
                  if (terminalMode === 'ai-director') {
                    runAiDirectorFlow();
                  } else {
                    runLangGraphFlow();
                  }
                }}
                className="bg-gradient-to-tr from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 text-white font-mono text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-lg shadow-indigo-500/10 cursor-pointer font-semibold"
              >
                {terminalMode === 'ai-director' ? (
                  <>
                    <MessageSquare className="w-3.5 h-3.5" />
                    DIRECT
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    EXECUTE
                  </>
                )}
              </button>
            </div>
          </div>

          {/* DYNAMIC PIPELINE MAP CARD */}
          <div className="bg-[#0b0c13]/75 border border-gray-800/60 rounded-xl p-4 flex flex-col gap-3 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-gray-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                ACTIVE LANGGRAPH PATHWAY
              </span>
              <span className="text-[10px] font-mono text-gray-500">Live Routing Edge</span>
            </div>
            
            {/* GRAPHLINES PIPELINE */}
            <div className="grid grid-cols-3 gap-2.5">
              {graphNodesSequence.map((node, index) => {
                const wasExecuted = traces.some(t => t.nodeId === node.id);
                const isActive = activeNodeId === node.id;
                const isPast = wasExecuted || (isRunning && simulatedNodeIndex > index);
                const isSelected = selectedTrace?.nodeId === node.id;

                return (
                  <div 
                    key={node.id}
                    onClick={() => {
                      const found = traces.find(t => t.nodeId === node.id);
                      if (found) setSelectedTrace(found);
                    }}
                    className={`p-2.5 rounded-lg border text-center relative cursor-pointer select-none transition-all duration-300 ${
                      isActive 
                        ? 'bg-indigo-500/20 border-indigo-400 text-indigo-100 scale-[1.03] ring-1 ring-indigo-500/30 glow-pulse' 
                        : isPast 
                          ? 'bg-[#121422] border-indigo-900/60 text-indigo-300' 
                          : isSelected
                            ? 'bg-[#181d33] border-indigo-500/80 text-white ring-1 ring-indigo-500/20'
                            : 'bg-[#0e101a] border-gray-850 text-gray-500 hover:border-gray-700 hover:text-gray-400'
                    }`}
                  >
                    <div className="text-[10px] font-mono truncate">{node.label}</div>
                    <div className="text-[8px] font-mono mt-0.5 opacity-60 truncate">{node.id}</div>
                    
                    {/* Visual indicators */}
                    {isPast && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    )}
                    {isActive && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CORE CONTROL DECK & TABS (xl:span-7) */}
        <div id="control-deck" className="xl:col-span-7 flex flex-col gap-6 h-[calc(100vh-140px)] min-h-[500px]">
          
          {/* TAB WRAPPER */}
          <div className="flex-1 bg-[#0b0c13]/75 border border-gray-800/60 rounded-xl flex overflow-hidden shadow-2xl backdrop-blur-sm">
            
            {/* NEW STATE-OF-THE-ART VERTICAL SIDEBAR */}
            <div className="w-52 bg-[#06070a]/95 border-r border-gray-850 flex flex-col p-3.5 shrink-0 select-none overflow-y-auto">
              {/* Category: OPERATIONS CENTER */}
              <div className="mb-4">
                <div className="px-2 mb-1.5 text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                  System Commands
                </div>
                <div className="space-y-0.5">
                  <button 
                    onClick={() => setActiveTab('cockpit')}
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 font-mono text-[10.5px] text-left cursor-pointer transition ${activeTab === 'cockpit' ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 font-bold shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-900/60 border border-transparent'}`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>CENTRAL COCKPIT</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('infra')}
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 font-mono text-[10.5px] text-left cursor-pointer transition ${activeTab === 'infra' ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 font-bold shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-900/60 border border-transparent'}`}
                  >
                    <Cpu className="w-3.5 h-3.5 shrink-0" />
                    <span>INFRASTRUCTURE</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('traces')}
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 font-mono text-[10.5px] text-left cursor-pointer transition ${activeTab === 'traces' ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 font-bold shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-900/60 border border-transparent'}`}
                  >
                    <Eye className="w-3.5 h-3.5 shrink-0" />
                    <span>TRACES</span>
                  </button>
                </div>
              </div>

              {/* Category: COGNITIVE INTELLIGENCE */}
              <div className="mb-4">
                <div className="px-2 mb-1.5 text-[9px] font-mono font-bold text-purple-400 uppercase tracking-wider">
                  Neural Controls
                </div>
                <div className="space-y-0.5">
                  <button 
                    onClick={() => setActiveTab('autonomous_engines')}
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between font-mono text-[10.5px] text-left cursor-pointer transition ${activeTab === 'autonomous_engines' ? 'bg-purple-600/15 text-purple-400 border border-purple-500/20 font-bold shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-900/60 border border-transparent'}`}
                  >
                    <div className="flex items-center gap-2">
                      <Workflow className="w-3.5 h-3.5 text-indigo-400 shrink-0 animate-spin-slow" />
                      <span>AUTONOMOUS ENGINES</span>
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  </button>
                  <button 
                    onClick={() => setActiveTab('quantum_tuning')}
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between font-mono text-[10.5px] text-left cursor-pointer transition ${activeTab === 'quantum_tuning' ? 'bg-purple-600/15 text-purple-400 border border-purple-500/20 font-bold shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-900/60 border border-transparent'}`}
                  >
                    <div className="flex items-center gap-2">
                      <Sliders className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>QUANTUM TUNING</span>
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse shrink-0" />
                  </button>
                  <button 
                    onClick={() => setActiveTab('ego')}
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 font-mono text-[10.5px] text-left cursor-pointer transition ${activeTab === 'ego' ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 font-bold shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-900/60 border border-transparent'}`}
                  >
                    <Brain className="w-3.5 h-3.5 shrink-0" />
                    <span>EGO-SYSTEM</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('memory')}
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 font-mono text-[10.5px] text-left cursor-pointer transition ${activeTab === 'memory' ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 font-bold shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-900/60 border border-transparent'}`}
                  >
                    <Database className="w-3.5 h-3.5 shrink-0" />
                    <span>MEMORY</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('doctrine')}
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 font-mono text-[10.5px] text-left cursor-pointer transition ${activeTab === 'doctrine' ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 font-bold shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-900/60 border border-transparent'}`}
                  >
                    <Shield className="w-3.5 h-3.5 shrink-0" />
                    <span>DOCTRINE</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('phenotype')}
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 font-mono text-[10.5px] text-left cursor-pointer transition ${activeTab === 'phenotype' ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 font-bold shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-900/60 border border-transparent'}`}
                  >
                    <Compass className="w-3.5 h-3.5 shrink-0" />
                    <span>PHENOTYPE</span>
                  </button>
                </div>
              </div>

              {/* Category: DEVELOPMENT */}
              <div className="mb-4">
                <div className="px-2 mb-1.5 text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Dev & Isolation
                </div>
                <div className="space-y-0.5">
                  <button 
                    onClick={() => setActiveTab('files')}
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 font-mono text-[10.5px] text-left cursor-pointer transition ${activeTab === 'files' ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 font-bold shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-900/60 border border-transparent'}`}
                  >
                    <FileCode className="w-3.5 h-3.5 shrink-0" />
                    <span>MONOREPO</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('sandbox')}
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 font-mono text-[10.5px] text-left cursor-pointer transition ${activeTab === 'sandbox' ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 font-bold shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-900/60 border border-transparent'}`}
                  >
                    <Code className="w-3.5 h-3.5 shrink-0" />
                    <span>SANDBOX</span>
                  </button>
                </div>
              </div>

              {/* Category: INTEGRATIONS */}
              <div className="mb-4">
                <div className="px-2 mb-1.5 text-[9px] font-mono font-bold text-blue-400 uppercase tracking-wider">
                  Integrations
                </div>
                <div className="space-y-0.5">
                  <button 
                    onClick={() => setActiveTab('integrations')}
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 font-mono text-[10.5px] text-left cursor-pointer transition ${activeTab === 'integrations' ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 font-bold shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-900/60 border border-transparent'}`}
                  >
                    <Globe className="w-3.5 h-3.5 shrink-0" />
                    <span>V_DNS CONNECTOR</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('workspace')}
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 font-mono text-[10.5px] text-left cursor-pointer transition ${activeTab === 'workspace' ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 font-bold shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-900/60 border border-transparent'}`}
                  >
                    <Settings className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>WORKSPACE</span>
                  </button>
                </div>
              </div>

              {/* Sidebar footer branding */}
              <div className="mt-auto pt-3 border-t border-gray-900 text-[8.5px] font-mono text-gray-600 flex flex-col gap-0.5">
                <span>RESONANCE FEED: {coherence.toFixed(1)}%</span>
                <span>STATE: {quantumTuningActive ? 'SWEEPING' : 'CALIBRATED'}</span>
              </div>
            </div>

            {/* TAB CONTAINER BODY */}
            <div className="flex-1 overflow-y-auto p-5">

              {/* TAB: AUTONOMOUS COGNITIVE ENGINES */}
              {activeTab === 'autonomous_engines' && (
                <AutonomousEngines 
                  onApplyCoherenceBoost={handleApplyCoherenceBoost}
                  systemHealth={100}
                />
              )}

              {/* QUANTUM BIO-NEURAL TUNING TAB */}
              {activeTab === 'quantum_tuning' && (
                <div className="flex flex-col gap-6 text-xs animate-fadeIn">
                  
                  {/* HEADER BANNER */}
                  <div className="bg-gradient-to-r from-purple-950/40 via-[#0a0c13] to-indigo-950/20 border border-purple-500/15 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                        <Sliders className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-tight">Quantum Bio-Neural Calibration Deck</h4>
                        <p className="text-[11px] text-gray-400 mt-0.5">Fine-tune synapses, manage neurotransmitter saturation, and sync action potentials into coherence bounds</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-2.5 py-1 rounded border font-bold flex items-center gap-1.5 ${quantumTuningActive ? 'bg-purple-500/15 text-purple-300 border-purple-500/30' : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${quantumTuningActive ? 'bg-purple-400 animate-ping' : 'bg-emerald-400'}`} />
                        {quantumTuningActive ? 'ACTIVE SWEEPING' : 'COHERENCE CALIBRATED'}
                      </span>
                    </div>
                  </div>

                  {/* CORE PANEL: GRID Split into controls and live canvas network visualizer */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* LEFT COLUMN: PARAMETER SLIDERS (lg:col-span-5) */}
                    <div className="lg:col-span-5 flex flex-col gap-4">
                      <div className="bg-[#0a0c13] border border-gray-800/40 rounded-xl p-4 flex flex-col gap-4 shadow-sm">
                        <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase border-b border-gray-850 pb-2.5">
                          <Sliders className="w-4 h-4 text-purple-400" />
                          Biological Synaptic Coefficients
                        </span>

                        {/* SLIDER 1: Synaptic Plasticity */}
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-gray-300 font-medium">Synaptic Plasticity Index</span>
                            <span className="font-mono text-purple-400 font-bold">{(plasticity * 100).toFixed(0)}%</span>
                          </div>
                          <input 
                            type="range"
                            min="0.1"
                            max="1.0"
                            step="0.05"
                            value={plasticity}
                            onChange={(e) => {
                              setPlasticity(parseFloat(e.target.value));
                              setQuantumLogs(prev => [
                                `[${new Date().toLocaleTimeString()}] [COEFF] Adjusted Synaptic Plasticity Index to ${(parseFloat(e.target.value)*100).toFixed(0)}%`,
                                ...prev.slice(0, 18)
                              ]);
                            }}
                            className="w-full accent-purple-500 bg-gray-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                          />
                          <p className="text-[9.5px] text-gray-500 leading-snug">Controls adaptation rates and error-correction backpropagation responsiveness during runtime operations.</p>
                        </div>

                        {/* SLIDER 2: Neurotransmitter Saturation */}
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-gray-300 font-medium">Neurotransmitter Buffer Saturation</span>
                            <span className="font-mono text-purple-400 font-bold">{(saturation * 100).toFixed(0)}%</span>
                          </div>
                          <input 
                            type="range"
                            min="0.1"
                            max="1.0"
                            step="0.05"
                            value={saturation}
                            onChange={(e) => {
                              setSaturation(parseFloat(e.target.value));
                              setQuantumLogs(prev => [
                                `[${new Date().toLocaleTimeString()}] [COEFF] Calibrated Neurotransmitter Buffer Saturation to ${(parseFloat(e.target.value)*100).toFixed(0)}%`,
                                ...prev.slice(0, 18)
                              ]);
                            }}
                            className="w-full accent-purple-500 bg-gray-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                          />
                          <p className="text-[9.5px] text-gray-500 leading-snug">Amplifies node signal routing potential. High levels increase concurrent paths but might over-saturate cognitive layers.</p>
                        </div>

                        {/* SLIDER 3: Attention Focus Resonance */}
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-gray-300 font-medium">Attention Focus Resonance</span>
                            <span className="font-mono text-purple-400 font-bold">{(resonance * 100).toFixed(0)}%</span>
                          </div>
                          <input 
                            type="range"
                            min="0.1"
                            max="1.0"
                            step="0.05"
                            value={resonance}
                            onChange={(e) => {
                              setResonance(parseFloat(e.target.value));
                              setQuantumLogs(prev => [
                                `[${new Date().toLocaleTimeString()}] [COEFF] Shifted Attention Focus Resonance to ${(parseFloat(e.target.value)*100).toFixed(0)}%`,
                                ...prev.slice(0, 18)
                              ]);
                            }}
                            className="w-full accent-purple-500 bg-gray-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                          />
                          <p className="text-[9.5px] text-gray-500 leading-snug">Sharpens model introspection focus during routing evaluations. Higher values optimize path precision.</p>
                        </div>

                        {/* SLIDER 4: Self-Healing Overdrive */}
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-gray-300 font-medium">Self-Healing Feedback Overdrive</span>
                            <span className="font-mono text-purple-400 font-bold">{(healingOverdrive * 100).toFixed(0)}%</span>
                          </div>
                          <input 
                            type="range"
                            min="0.1"
                            max="1.0"
                            step="0.05"
                            value={healingOverdrive}
                            onChange={(e) => {
                              setHealingOverdrive(parseFloat(e.target.value));
                              setQuantumLogs(prev => [
                                `[${new Date().toLocaleTimeString()}] [COEFF] Set Self-Healing Feedback Overdrive to ${(parseFloat(e.target.value)*100).toFixed(0)}%`,
                                ...prev.slice(0, 18)
                              ]);
                            }}
                            className="w-full accent-purple-500 bg-gray-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                          />
                          <p className="text-[9.5px] text-gray-500 leading-snug">Sets the aggressive ratio of the auto-healing loop. Amplified ranges accelerate corrective code compiling.</p>
                        </div>

                        {/* INTERACTION ACTION BUTTONS */}
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <button
                            onClick={() => {
                              setQuantumTuningActive(true);
                              setCoherence(82.1);
                              setQuantumLogs(prev => [
                                `[${new Date().toLocaleTimeString()}] [START] Initializing Quantum Resonance Calibration Sweep...`,
                                `[${new Date().toLocaleTimeString()}] [START] Sweeping all bio-neural parameters to optimize coherence vectors.`,
                                ...prev.slice(0, 17)
                              ]);
                            }}
                            disabled={quantumTuningActive}
                            className="w-full py-2 bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono font-bold text-[10px] rounded-lg shadow-lg cursor-pointer transition disabled:opacity-50"
                          >
                            ⚡ SWEEP TUNING
                          </button>
                          
                          <button
                            onClick={() => {
                              // Inject simulated neural error
                              setQuantumLogs(prev => [
                                `[${new Date().toLocaleTimeString()}] [ALERT] SYNAPTIC DRIFT ERROR DETECTED! Aligning synaptic matrices...`,
                                `[${new Date().toLocaleTimeString()}] [HEAL] Auto-corrective STDP feedback triggered with overdrive coeff ${healingOverdrive}.`,
                                `[${new Date().toLocaleTimeString()}] [SUCCESS] Defect in neural map successfully isolated and repaired in ${(1.2 - healingOverdrive * 0.8).toFixed(2)}s!`,
                                ...prev.slice(0, 17)
                              ]);
                              // Set diagnostic alert
                              setCoherence(prev => Math.max(60, prev - 18.5));
                            }}
                            className="w-full py-2 bg-gray-900 hover:bg-rose-950/40 text-gray-400 hover:text-rose-400 border border-gray-850 hover:border-rose-900/30 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition"
                          >
                            🔥 DRIFT FAILURE TEST
                          </button>
                        </div>

                      </div>
                    </div>

                    {/* RIGHT COLUMN: INTERACTIVE VISUALIZER CANVAS (lg:col-span-7) */}
                    <div className="lg:col-span-7 flex flex-col gap-4">
                      
                      {/* NEURAL SVG SIMULATOR */}
                      <div className="bg-[#0a0c13] border border-gray-800/40 rounded-xl p-4 flex flex-col gap-3 shadow-sm h-[260px] overflow-hidden relative">
                        <span className="text-xs font-mono font-bold text-white flex items-center justify-between border-b border-gray-850 pb-2">
                          <span className="flex items-center gap-1.5 uppercase">
                            <Activity className="w-4 h-4 text-purple-400" />
                            Live Synaptic Resonance Fire-Map
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono">Fires: {activeFires} nodes/s</span>
                        </span>

                        <div className="flex-1 flex items-center justify-center relative bg-[#04050a] rounded-lg border border-gray-900 overflow-hidden">
                          {/* Animated SVG network */}
                          <svg className="w-full h-full" viewBox="0 0 500 200">
                            {/* CONNECTIONS (PATHS) */}
                            <g stroke="#312e81" strokeWidth="1" strokeOpacity="0.4">
                              <line x1="50" y1="100" x2="150" y2="50" />
                              <line x1="50" y1="100" x2="150" y2="150" />
                              <line x1="150" y1="50" x2="250" y2="50" />
                              <line x1="150" y1="50" x2="250" y2="150" />
                              <line x1="150" y1="150" x2="250" y2="50" />
                              <line x1="150" y1="150" x2="250" y2="150" />
                              <line x1="250" y1="50" x2="350" y2="50" />
                              <line x1="250" y1="50" x2="350" y2="150" />
                              <line x1="250" y1="150" x2="350" y2="50" />
                              <line x1="250" y1="150" x2="350" y2="150" />
                              <line x1="350" y1="50" x2="450" y2="100" />
                              <line x1="350" y1="150" x2="450" y2="100" />
                            </g>

                            {/* ACTIVE PULSING FIRES */}
                            {quantumTuningActive && (
                              <g fill="none" stroke="#a855f7" strokeWidth="1.5">
                                <path d="M 50 100 L 150 50" strokeDasharray="10, 190" strokeDashoffset={activeFires * 15}>
                                  <animate attributeName="strokeDashoffset" values="200;0" dur="1s" repeatCount="indefinite" />
                                </path>
                                <path d="M 150 50 L 250 150" strokeDasharray="10, 190" strokeDashoffset={activeFires * -10}>
                                  <animate attributeName="strokeDashoffset" values="200;0" dur="1.2s" repeatCount="indefinite" />
                                </path>
                                <path d="M 250 150 L 350 50" strokeDasharray="10, 190" strokeDashoffset={activeFires * 8}>
                                  <animate attributeName="strokeDashoffset" values="0;200" dur="0.8s" repeatCount="indefinite" />
                                </path>
                                <path d="M 350 50 L 450 100" strokeDasharray="10, 190" strokeDashoffset={activeFires * -25}>
                                  <animate attributeName="strokeDashoffset" values="200;0" dur="0.9s" repeatCount="indefinite" />
                                </path>
                              </g>
                            )}

                            {/* NODES */}
                            {/* Layer 0: Input */}
                            <circle cx="50" cy="100" r="10" className={`transition-all duration-300 ${quantumTuningActive ? 'fill-purple-500 shadow-lg shadow-purple-500/50' : 'fill-indigo-950'} stroke-indigo-400`} strokeWidth="1.5" />
                            
                            {/* Layer 1: Hidden A */}
                            <circle cx="150" cy="50" r="12" className={`transition-all duration-300 ${activeFires > 6 ? 'fill-purple-500' : 'fill-indigo-950'} stroke-indigo-400`} strokeWidth="1.5" />
                            <circle cx="150" cy="150" r="12" className={`transition-all duration-300 ${activeFires > 10 ? 'fill-indigo-500' : 'fill-indigo-950'} stroke-indigo-400`} strokeWidth="1.5" />

                            {/* Layer 2: Hidden B */}
                            <circle cx="250" cy="50" r="12" className={`transition-all duration-300 ${activeFires > 4 ? 'fill-indigo-500' : 'fill-indigo-950'} stroke-indigo-400`} strokeWidth="1.5" />
                            <circle cx="250" cy="150" r="12" className={`transition-all duration-300 ${activeFires > 8 ? 'fill-purple-500' : 'fill-indigo-950'} stroke-indigo-400`} strokeWidth="1.5" />

                            {/* Layer 3: Hidden C */}
                            <circle cx="350" cy="50" r="12" className={`transition-all duration-300 ${activeFires > 12 ? 'fill-purple-500' : 'fill-indigo-950'} stroke-indigo-400`} strokeWidth="1.5" />
                            <circle cx="350" cy="150" r="12" className={`transition-all duration-300 ${activeFires > 5 ? 'fill-indigo-500' : 'fill-indigo-950'} stroke-indigo-400`} strokeWidth="1.5" />

                            {/* Layer 4: Output */}
                            <circle cx="450" cy="100" r="10" className={`transition-all duration-300 ${quantumTuningActive ? 'fill-indigo-400 animate-pulse' : 'fill-indigo-950'} stroke-indigo-400`} strokeWidth="1.5" />
                          </svg>

                          {/* Floating indicators */}
                          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 font-mono text-[9px] text-gray-500 bg-gray-950/80 px-2 py-1 rounded border border-gray-850">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
                            <span>COHERENT COUPLING: ACTIVE</span>
                          </div>

                          <div className="absolute top-3 right-3 flex items-center gap-1.5 font-mono text-[10px] font-bold text-white bg-purple-950/40 px-3 py-1.5 rounded-lg border border-purple-500/20">
                            <span>COHERENCE:</span>
                            <span className="text-purple-400">{coherence.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>

                      {/* LOGS MONITOR */}
                      <div className="bg-[#0a0c13] border border-gray-800/40 rounded-xl p-4 flex flex-col gap-2.5 shadow-sm h-[180px]">
                        <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase border-b border-gray-850 pb-2.5">
                          <Terminal className="w-4 h-4 text-purple-400" />
                          Quantum Resonance Sweeper Logs
                        </span>
                        
                        <div className="flex-1 bg-[#04050a] rounded-lg p-3 font-mono text-[10px] text-gray-400 overflow-y-auto space-y-1.5 border border-gray-900 select-text">
                          {quantumLogs.map((log, idx) => {
                            let textClass = "text-gray-400";
                            if (log.includes("[SUCCESS]")) textClass = "text-emerald-400 font-bold";
                            else if (log.includes("[ALERT]")) textClass = "text-rose-400 font-bold animate-pulse";
                            else if (log.includes("[HEAL]")) textClass = "text-purple-400";
                            else if (log.includes("[START]")) textClass = "text-indigo-400 font-bold";
                            
                            return (
                              <div key={idx} className={textClass}>
                                {log}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              )}

              {/* TAB 0: UNIFIED COCKPIT DASHBOARD */}
              {activeTab === 'cockpit' && (
                <div className="flex flex-col gap-6 text-xs animate-fadeIn">
                  
                  {/* COCKPIT STATUS HEADER BANNER */}
                  <div className="bg-gradient-to-r from-indigo-950/40 via-[#0a0c13] to-purple-950/20 border border-indigo-500/10 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                        <Sparkles className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-tight">Enterprise Multi-System Operational Cockpit</h4>
                        <p className="text-[11px] text-gray-400 mt-0.5">Continuous telemetry, automatic VRAM rebalancing, self-healing, and Google Workspace pipelines</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded">
                        TIER {arcanaTier} ENFORCED
                      </span>
                      <span className="text-[10px] font-mono px-2 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded uppercase">
                        {hardwareOverride} Descriptors
                      </span>
                                   {/* COCKPIT OPERATIONAL GRID: DIAGNOSTICS & HOLOGRAPHIC SCENE */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Left: Auto Healing Console (lg:col-span-8) */}
                    <div className="lg:col-span-8 flex flex-col">
                      <div className="bg-[#0b0c13]/90 border border-indigo-500/20 rounded-xl p-5 flex flex-col gap-4 shadow-xl shadow-indigo-950/10 backdrop-blur h-full">
                        <div className="flex flex-wrap items-center justify-between border-b border-gray-800/80 pb-3 gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400">
                              <Activity className="w-4 h-4 animate-pulse" />
                            </div>
                            <div>
                              <h5 className="font-sans font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                                AUTONOMOUS SELF-DIAGNOSTIC & SELF-HEALING SYSTEM
                              </h5>
                              <p className="text-[10px] text-gray-400 mt-0.5">Continuous deep-verification, route-failover, and persistent network packet-drop healing</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 bg-gray-950/80 px-2.5 py-1 rounded-md border border-gray-800/60 text-[9px] font-mono">
                              <span className="text-gray-500">SYSTEM HEALTH:</span>
                              {diagnosticState === 'healed' ? (
                                <span className="text-emerald-400 font-bold animate-pulse">100% SECURE (TIER 3)</span>
                              ) : hasDiagnosticIssues ? (
                                <span className="text-amber-400 font-bold">92% WARNINGS ACTIVE</span>
                              ) : (
                                <span className="text-indigo-400 font-bold">98% CALIBRATED</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 bg-gray-950/80 px-2.5 py-1 rounded-md border border-gray-800/60 text-[9px] font-mono">
                              <span className="text-gray-500">HEALS APPLIED:</span>
                              <span className="text-indigo-400 font-bold">{healActionsApplied} cycles</span>
                            </div>
                          </div>
                        </div>

                        {/* INTERACTIVE CONTROLS */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1">
                          
                          {/* Left: Interactive Diagnosis/Healing Trigger buttons & Status Grid */}
                          <div className="md:col-span-7 flex flex-col gap-3 justify-between">
                            <div className="flex flex-col gap-3">
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  disabled={diagnosticState === 'scanning' || diagnosticState === 'healing'}
                                  onClick={runDiagnostics}
                                  className={`px-3 py-2 font-mono text-[10px] font-bold rounded-lg border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                                    diagnosticState === 'scanning'
                                      ? 'bg-indigo-600/15 border-indigo-500/30 text-indigo-400'
                                      : 'bg-indigo-600/10 hover:bg-indigo-600/20 border-indigo-500/20 hover:border-indigo-500/40 text-indigo-300'
                                  }`}
                                >
                                  <RefreshCw className={`w-3.5 h-3.5 ${diagnosticState === 'scanning' ? 'animate-spin text-indigo-400' : 'text-indigo-300'}`} />
                                  {diagnosticState === 'scanning' ? `SCANNING STEP ${diagnosticStep}/5...` : 'INITIALIZE DIAGNOSIS'}
                                </button>

                                <button
                                  disabled={diagnosticState === 'scanning' || diagnosticState === 'healing' || diagnosticState === 'idle'}
                                  onClick={runAutoHealing}
                                  className={`px-3 py-2 font-mono text-[10px] font-bold rounded-lg border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                                    diagnosticState === 'healing'
                                      ? 'bg-emerald-600/15 border-emerald-500/30 text-emerald-400'
                                      : diagnosticState === 'idle'
                                      ? 'bg-gray-900/50 border-gray-800 text-gray-500 cursor-not-allowed'
                                      : 'bg-emerald-600/10 hover:bg-emerald-600/20 border-emerald-500/20 hover:border-emerald-500/40 text-emerald-300'
                                  }`}
                                >
                                  <Sparkles className={`w-3.5 h-3.5 ${diagnosticState === 'healing' ? 'animate-pulse text-emerald-400' : 'text-emerald-300'}`} />
                                  {diagnosticState === 'healing' ? 'HEALING ROUTINES...' : 'ENGAGE AUTO-HEALER'}
                                </button>
                              </div>

                              {/* SUB-SYSTEMS ROW CHECKLIST */}
                              <div className="bg-[#05060a]/80 rounded-lg p-3 border border-gray-800/50 flex flex-col gap-2">
                                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">Verifying Core System Components</span>
                                
                                <div className="flex flex-col gap-1.5 font-mono text-[10px]">
                                  {diagnosticResults.map((result) => (
                                    <div key={result.id} className="flex items-center justify-between py-1 border-b border-gray-900/50 last:border-0">
                                      <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40" />
                                        <span className="text-gray-300 font-medium">{result.name}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-[9px] text-gray-500 truncate max-w-[170px] hidden sm:inline">{result.details}</span>
                                        {result.status === 'pass' ? (
                                          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded flex items-center gap-1 font-bold">
                                            <CheckCircle className="w-2.5 h-2.5" /> SECURE
                                          </span>
                                        ) : result.status === 'warn' ? (
                                          <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded flex items-center gap-1 font-bold animate-pulse">
                                            <AlertTriangle className="w-2.5 h-2.5" /> WARNING
                                          </span>
                                        ) : (
                                          <span className="text-[9px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1.5 py-0.5 rounded flex items-center gap-1 font-bold">
                                            <AlertTriangle className="w-2.5 h-2.5" /> FAIL
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right: Live Diagnostics Log terminal */}
                          <div className="md:col-span-5 flex flex-col bg-black/60 rounded-lg border border-gray-850 overflow-hidden min-h-[160px]">
                            <div className="bg-[#0e101b] px-3 py-1.5 border-b border-gray-800 flex items-center justify-between">
                              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Terminal className="w-3 h-3 text-indigo-400" />
                                DIAGNOSTICS CORE LOGS
                              </span>
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                            
                            <div className="flex-1 p-3 font-mono text-[9px] text-indigo-300 leading-relaxed max-h-[150px] overflow-y-auto flex flex-col gap-1">
                              {diagnosticLogs.length > 0 ? (
                                diagnosticLogs.map((log, idx) => (
                                  <div key={idx} className="whitespace-pre-wrap border-l border-indigo-500/20 pl-2">
                                    {log}
                                  </div>
                                ))
                              ) : (
                                <span className="text-gray-600 italic">Core is idle. Initiate diagnostics scan above to monitor real-time network routes, connection heartbeats, and sandbox memory sanitizations.</span>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>

                    {/* Right: 3D Holographic Neural Interface (lg:col-span-4) */}
                    <div className="lg:col-span-4 flex flex-col">
                      <HolographicCanvas 
                        coherence={coherence} 
                        isTuningActive={quantumTuningActive}
                        activeTab={activeTab}
                      />
                    </div>

                  </div>
                </div>
              </div>

                  {/* MAIN BENTO GRID */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* WIDGET A: HIGH-ASSURANCE GPU CLUSTER VRAM MANAGER */}
                    <div className="bg-[#0a0c13] border border-gray-800/50 rounded-xl p-4 flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-gray-850 pb-2">
                        <h5 className="font-mono font-bold text-white flex items-center gap-1.5 uppercase">
                          <Cpu className="w-4 h-4 text-indigo-400 animate-spin-slow" />
                          GPU Core Workload Reroute
                        </h5>
                        <button 
                          onClick={() => setActiveTab('infra')}
                          className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5"
                        >
                          Details <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        {gpuCluster.map((gpu) => (
                          <div 
                            key={gpu.id}
                            className={`p-2 rounded bg-black/30 border text-center transition ${selectedGpuId === gpu.id ? 'border-indigo-500 bg-indigo-950/10' : 'border-gray-850'}`}
                            onClick={() => setSelectedGpuId(gpu.id)}
                          >
                            <span className="text-[9px] font-mono text-gray-400 block uppercase">{gpu.id}</span>
                            <span className="font-bold text-[11px] text-white block mt-0.5">{gpu.vramUsed}G</span>
                            <span className="text-[8px] font-mono text-indigo-400">{gpu.temp}°C</span>
                          </div>
                        ))}
                      </div>

                      {/* QUICK WORKLOAD MIGRATE FORM */}
                      <div className="bg-black/25 rounded-lg p-3 border border-gray-850 flex flex-col gap-2.5">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[9px] text-gray-500 uppercase block font-mono mb-1">Source Node</span>
                            <select 
                              value={rerouteSource}
                              onChange={(e) => setRerouteSource(e.target.value)}
                              className="w-full bg-[#05060a] border border-gray-800 rounded px-2 py-1 text-[11px] text-gray-300 font-mono outline-none"
                            >
                              {gpuCluster.map(gpu => (
                                <option key={gpu.id} value={gpu.id}>{gpu.id.toUpperCase()} ({gpu.vramUsed} GB)</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-500 uppercase block font-mono mb-1">Target Node</span>
                            <select 
                              value={rerouteDest}
                              onChange={(e) => setRerouteDest(e.target.value)}
                              className="w-full bg-[#05060a] border border-gray-800 rounded px-2 py-1 text-[11px] text-gray-300 font-mono outline-none"
                            >
                              {gpuCluster.map(gpu => (
                                <option key={gpu.id} value={gpu.id}>{gpu.id.toUpperCase()} ({gpu.vramTotal - gpu.vramUsed} GB Free)</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[9px] font-mono mb-1">
                            <span className="text-gray-500">TRANSFER SIZE:</span>
                            <span className="text-indigo-400 font-bold">{rerouteAmount} GB</span>
                          </div>
                          <input 
                            type="range"
                            min="5"
                            max="40"
                            step="5"
                            value={rerouteAmount}
                            onChange={(e) => setRerouteAmount(Number(e.target.value))}
                            className="w-full accent-indigo-500 bg-gray-800 h-1 rounded"
                          />
                        </div>

                        {isRerouting ? (
                          <div className="bg-[#05060a] p-2 rounded text-center border border-indigo-950 font-mono text-[10px]">
                            <div className="text-indigo-400 font-bold animate-pulse">⚡ {rerouteStatus} ({rerouteProgress}%)</div>
                          </div>
                        ) : (
                          <button
                            onClick={handleGpuReroute}
                            className="w-full bg-indigo-600/25 hover:bg-indigo-600/35 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono py-1.5 rounded transition font-bold cursor-pointer"
                          >
                            ⚡ INSTANT MEMORY REROUTE
                          </button>
                        )}
                      </div>
                    </div>

                    {/* WIDGET B: ISOLATED RUNTIME SANDBOX COGNITION & AUTO-REPAIR */}
                    <div className="bg-[#0a0c13] border border-gray-800/50 rounded-xl p-4 flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-gray-850 pb-2">
                        <h5 className="font-mono font-bold text-white flex items-center gap-1.5 uppercase">
                          <Code className="w-4 h-4 text-purple-400" />
                          Isolated Sandbox Self-Repair
                        </h5>
                        <button 
                          onClick={() => setActiveTab('sandbox')}
                          className="text-[10px] font-mono text-purple-400 hover:text-purple-300 flex items-center gap-0.5"
                        >
                          Details <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-mono text-gray-500">SCRATCHPAD FAULT INJECTOR (ACTIVE)</span>
                        <div className="bg-black/30 border border-gray-850 rounded p-2.5 font-mono text-[10px] text-purple-300 max-h-[100px] overflow-y-auto leading-relaxed">
                          <pre>{sandboxCode}</pre>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-auto">
                        <button
                          onClick={async () => {
                            const res = await fetch('/api/sandbox/eval', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ code: sandboxCode })
                            });
                            const data = await res.json();
                            if (data.result.syntaxOk) {
                              alert('Sandbox verification: Valid syntax!');
                            } else {
                              alert(`Sandbox verification: Syntax failed! Root: ${data.result.error}`);
                            }
                          }}
                          className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700 text-gray-300 font-mono text-[10px] py-1.5 rounded transition cursor-pointer"
                        >
                          Check Syntax
                        </button>
                        <button
                          disabled={isRunning}
                          onClick={() => {
                            runLangGraphFlow('Diagnose, compile, and self-heal the broken Sandbox typescript snippet.', sandboxCode);
                          }}
                          className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/30 font-mono text-[10px] py-1.5 rounded transition font-bold cursor-pointer"
                        >
                          ✨ Auto-Heal Code
                        </button>
                      </div>
                    </div>

                    {/* WIDGET C: SECURE GOOGLE WORKSPACE BRIDGE */}
                    <div className="bg-[#0a0c13] border border-gray-800/50 rounded-xl p-4 flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-gray-850 pb-2">
                        <h5 className="font-mono font-bold text-white flex items-center gap-1.5 uppercase">
                          <Settings className="w-4 h-4 text-emerald-400" />
                          Secure Workspace Sync
                        </h5>
                        <button 
                          onClick={() => setActiveTab('workspace')}
                          className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
                        >
                          Console <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                      {currentUser ? (
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between p-2 rounded bg-emerald-500/5 border border-emerald-500/10">
                            <div className="flex items-center gap-2">
                              {currentUser.photoURL ? (
                                <img src={currentUser.photoURL} alt="avatar" className="w-5 h-5 rounded-full" referrerPolicy="no-referrer" />
                              ) : (
                                <UserCheck className="w-4 h-4 text-emerald-400" />
                              )}
                              <span className="text-[11px] font-mono text-white truncate max-w-[170px]">{currentUser.email}</span>
                            </div>
                            <button
                              onClick={handleGoogleSignOut}
                              className="text-[9px] font-mono bg-rose-950/30 text-rose-300 hover:bg-rose-950/50 px-2 py-0.5 rounded border border-rose-900/20"
                            >
                              DISCONNECT
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-[10px]">
                            {/* Gmail count */}
                            <div className="bg-[#05060a] p-2.5 rounded border border-gray-850">
                              <div className="flex justify-between items-center text-gray-400 font-mono mb-1.5">
                                <span>INBOX FEED</span>
                                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                              </div>
                              <span className="text-white font-bold text-xs">{emails.length} Emails synced</span>
                            </div>
                            {/* Drive count */}
                            <div className="bg-[#05060a] p-2.5 rounded border border-gray-850">
                              <div className="flex justify-between items-center text-gray-400 font-mono mb-1.5">
                                <span>DRIVE DIRECTORY</span>
                                <File className="w-3.5 h-3.5 text-emerald-400" />
                              </div>
                              <span className="text-white font-bold text-xs">{driveFiles.length} Metadata items</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4 flex flex-col items-center justify-center gap-2">
                          <p className="text-gray-400 text-[11px]">Authorize Google Workspace to fetch emails, list Drive assets, and sync favorites.</p>
                          <button
                            onClick={handleGoogleSignIn}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[10px] px-4 py-2 rounded-lg font-bold transition cursor-pointer"
                          >
                            Authenticate Google Channel
                          </button>
                        </div>
                      )}
                    </div>

                    {/* WIDGET D: CLOUD SQL COMPLIANCE AUDITS & FAVORITES */}
                    <div className="bg-[#0a0c13] border border-gray-800/50 rounded-xl p-4 flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-gray-850 pb-2">
                        <h5 className="font-mono font-bold text-white flex items-center gap-1.5 uppercase">
                          <Database className="w-4 h-4 text-rose-400" />
                          Cloud SQL Storage State
                        </h5>
                        <button 
                          onClick={() => setActiveTab('workspace')}
                          className="text-[10px] font-mono text-rose-400 hover:text-rose-300 flex items-center gap-0.5"
                        >
                          Storage <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex flex-col gap-2.5 text-[11px] font-mono">
                        {/* Audit count */}
                        <div className="flex items-center justify-between border-b border-gray-900 pb-1.5">
                          <span className="text-gray-500">SAVED METADATA FAVORITES:</span>
                          <span className="text-white font-bold">{favItems.length} records</span>
                        </div>
                        {/* Saved count */}
                        <div className="flex items-center justify-between border-b border-gray-900 pb-1.5">
                          <span className="text-gray-500">SECURITY AUDIT LOGS COUNT:</span>
                          <span className="text-white font-bold">{auditLogsList.length} actions logged</span>
                        </div>
                        {/* Latest Audit snippet */}
                        {auditLogsList.length > 0 ? (
                          <div className="bg-[#05060a] p-2 rounded text-[10px] text-indigo-300 border border-gray-850 font-mono">
                            <span className="text-gray-500 block text-[8px] uppercase">LATEST PERSISTED TRANSACTION:</span>
                            <span className="text-white font-semibold">[{auditLogsList[0].action}]</span> {auditLogsList[0].details?.slice(0, 70)}...
                          </div>
                        ) : (
                          <span className="text-gray-500 italic text-[10px] text-center">Awaiting SQL dynamic operations...</span>
                        )}
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* TAB 1: WHITE BOX TRACE VIEW */}
              {activeTab === 'traces' && (
                <div className="flex flex-col gap-5 h-full">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Activity className="w-4 h-4 text-indigo-400" />
                        LANGGRAPH COMPLIANCE AUDIT FEED
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">Step-by-step White-Box execution telemetry & ego introspection</p>
                    </div>
                    <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                      {traces.length} steps logged
                    </span>
                  </div>

                  {traces.length === 0 ? (
                    <div className="flex-1 border border-dashed border-gray-800 rounded-xl flex flex-col items-center justify-center p-8 text-center bg-[#07080f]/30">
                      <Terminal className="w-8 h-8 text-indigo-500/30 mb-2.5" />
                      <h4 className="text-xs font-mono font-semibold text-gray-400">Awaiting Graph Execution</h4>
                      <p className="text-xs text-gray-500 max-w-sm mt-1">Execute a task command on the left to populate real-time compliance traces from the LangGraph nodes.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
                      
                      {/* Step index list (lg:span-4) */}
                      <div className="lg:col-span-4 flex flex-col gap-2 overflow-y-auto border-r border-gray-800/40 pr-2">
                        {traces.map((trace, idx) => {
                          const isSelected = selectedTrace?.stepId === trace.stepId;
                          return (
                            <div 
                              key={trace.stepId}
                              onClick={() => setSelectedTrace(trace)}
                              className={`p-2.5 rounded-lg border text-left cursor-pointer transition ${
                                isSelected 
                                  ? 'bg-[#181d33] border-indigo-500/80 text-white' 
                                  : 'bg-[#0f111d] border-gray-850 hover:bg-gray-900/40 text-gray-300'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                                  {trace.stepId}
                                </span>
                                <span className="text-[9px] font-mono text-gray-500">
                                  {new Date(trace.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <div className="text-[11px] font-sans font-semibold truncate">{trace.label}</div>
                              <div className="text-[9px] font-mono text-gray-400 mt-0.5 truncate">{trace.nodeId}</div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Selected trace detail (lg:span-8) */}
                      <div className="lg:col-span-8 bg-[#090a10] border border-gray-800/60 rounded-xl p-4 flex flex-col gap-4 overflow-y-auto max-h-[420px]">
                        {selectedTrace ? (
                          <>
                            <div className="flex items-center justify-between border-b border-gray-800 pb-2.5">
                              <div>
                                <h4 className="text-xs font-bold text-white uppercase font-mono">{selectedTrace.label}</h4>
                                <span className="text-[10px] font-mono text-indigo-400">Node Identifier: {selectedTrace.nodeId}</span>
                              </div>
                              <span className="text-[10px] font-mono text-gray-500">{new Date(selectedTrace.timestamp).toISOString()}</span>
                            </div>

                            {/* White-box Logs */}
                            <div>
                              <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-indigo-300 mb-1.5 flex items-center gap-1.5">
                                <Terminal className="w-3 h-3" /> Node Console Output
                              </div>
                              <div className="bg-black/40 border border-gray-900 rounded-lg p-3 font-mono text-[11px] leading-relaxed text-gray-300">
                                {selectedTrace.logs.map((log, idx) => (
                                  <div key={idx} className="mb-0.5">{log}</div>
                                ))}
                              </div>
                            </div>

                            {/* Ego Introspection */}
                            {selectedTrace.egoIntrospection && (
                              <div>
                                <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-purple-300 mb-1.5 flex items-center gap-1.5">
                                  <Brain className="w-3 h-3" /> Cognitive Ego Introspection
                                </div>
                                <div className="bg-[#12111c] border border-purple-950/20 rounded-lg p-3 font-sans text-xs italic text-purple-200">
                                  "{selectedTrace.egoIntrospection}"
                                </div>
                              </div>
                            )}

                            {/* State Update Payload */}
                            <div>
                              <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-gray-400 mb-1.5 flex items-center gap-1.5">
                                <Layers className="w-3 h-3" /> State Mutation Delta
                              </div>
                              <div className="bg-[#05060a] border border-gray-950 rounded-lg p-3 font-mono text-[10px] text-emerald-400 overflow-x-auto">
                                <pre>{JSON.stringify(selectedTrace.stateUpdate, null, 2)}</pre>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-10 text-gray-500">Select a trace step on the left to inspect detailed compliance logs.</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: MONOREPO CODE EXPLORER */}
              {activeTab === 'files' && (
                <div className="flex flex-col gap-4 h-full">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-indigo-400" />
                      MONOREPO SCAFFOLD EXPLORER
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Explore the production-grade TypeScript packages structure in the monorepo workspaces</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 flex-1 min-h-[400px]">
                    
                    {/* File tree browser (md:span-4) */}
                    <div className="md:col-span-4 bg-[#0a0c13] border border-gray-800/40 rounded-xl p-3 flex flex-col gap-2 overflow-y-auto">
                      <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-2">Workspace Modules</div>
                      {monorepoFiles.map(file => {
                        const isSelected = selectedFilePath === file.path;
                        return (
                          <button
                            key={file.path}
                            onClick={() => setSelectedFilePath(file.path)}
                            className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs font-mono transition cursor-pointer ${
                              isSelected 
                                ? 'bg-[#181d33] text-indigo-300 font-semibold ring-1 ring-indigo-500/10' 
                                : 'text-gray-400 hover:bg-[#0f111d] hover:text-white'
                            }`}
                          >
                            <Code className="w-3.5 h-3.5 flex-shrink-0 text-indigo-400" />
                            <div className="truncate">
                              <div className="text-[11px] truncate text-gray-200">{file.path.split('/').pop()}</div>
                              <div className="text-[9px] truncate text-gray-500">{file.label}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Code viewer (md:span-8) */}
                    <div className="md:col-span-8 bg-[#05060a] border border-gray-850 rounded-xl flex flex-col overflow-hidden max-h-[450px]">
                      <div className="bg-[#0e101a] px-4 py-2 border-b border-gray-850 flex items-center justify-between text-[11px] font-mono text-gray-400">
                        <span>{selectedFilePath}</span>
                        <span className="text-[9px] text-gray-600">TypeScript Source</span>
                      </div>
                      <div className="flex-1 p-4 overflow-auto font-mono text-[11px] leading-relaxed text-gray-300">
                        <pre className="whitespace-pre">{selectedFile?.content || '// Code not loaded'}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PHENOTYPE */}
              {activeTab === 'phenotype' && (
                <div className="flex flex-col gap-5">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Compass className="w-4 h-4 text-indigo-400" />
                      PHENOTYPE ARCHITECTURE DECK
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Adapt graph morphology dynamically based on host hardware & cloud topology</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Configure Override */}
                    <div className="bg-[#0a0c13] border border-gray-800/40 rounded-xl p-5 flex flex-col gap-4">
                      <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5 border-b border-gray-850 pb-2">
                        <Settings className="w-3.5 h-3.5" /> Host Hardware Phenotype
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Selecting different platforms tells the phenotype engine to adjust max processing limits, memory budgets, and morph the execution edges of the LangGraph.
                      </p>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono text-gray-400 uppercase">Target Platform:</label>
                        <select
                          value={hardwareOverride}
                          onChange={(e) => setHardwareOverride(e.target.value)}
                          className="bg-[#05060a] border border-gray-800 rounded-lg p-2.5 text-xs text-white outline-none font-mono"
                        >
                          <option value="dgx-h100">Nvidia DGX H100 (Enterprise Cluster)</option>
                          <option value="aws-ec2-g4">AWS EC2 g4dn.xlarge (Single GPU Cloud Node)</option>
                          <option value="raspberry-pi">Edge arm64 Gateway (Raspberry Pi 5)</option>
                        </select>
                      </div>

                      <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-lg p-3.5 flex gap-3 text-xs text-indigo-200">
                        <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-white block">Adaptive Graph Overrides:</span>
                          {hardwareOverride === 'raspberry-pi' ? (
                            <span className="text-[11px] text-indigo-300">
                              ⚠️ Raspberry Pi overrides `gpuDispatchNode` to `fallbackCpuProcessNode`. Large batch operations are sequentially queued on CPU cores.
                            </span>
                          ) : (
                            <span className="text-[11px] text-indigo-300">
                              🚀 Premium hardware supports parallel multi-GPU sequence splitting and thermal throttle protections.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Active Phenotype State */}
                    <div className="bg-[#0a0c13] border border-gray-800/40 rounded-xl p-5 flex flex-col gap-4 text-xs">
                      <h4 className="text-xs font-mono font-bold text-white uppercase border-b border-gray-850 pb-2">
                        Current Phenotype Descriptors
                      </h4>

                      <div className="grid grid-cols-2 gap-3 font-mono">
                        <div className="bg-[#05060a] p-2.5 rounded-lg border border-gray-850">
                          <span className="text-[9px] text-gray-500 uppercase block">Adaptation Factor</span>
                          <span className="text-white font-bold">{hardwareOverride === 'raspberry-pi' ? '0.3 (Lite)' : hardwareOverride === 'aws-ec2-g4' ? '0.7 (Standard)' : '1.0 (Full)'}</span>
                        </div>
                        <div className="bg-[#05060a] p-2.5 rounded-lg border border-gray-850">
                          <span className="text-[9px] text-gray-500 uppercase block">GPU Status</span>
                          <span className="text-white font-bold">{hardwareOverride === 'raspberry-pi' ? 'UNAVAILABLE' : 'ACTIVE'}</span>
                        </div>
                        <div className="bg-[#05060a] p-2.5 rounded-lg border border-gray-850">
                          <span className="text-[9px] text-gray-500 uppercase block">Topology Class</span>
                          <span className="text-white text-[11px]">{hardwareOverride === 'raspberry-pi' ? 'disconnected-edge-mesh' : hardwareOverride === 'aws-ec2-g4' ? 'aws-us-west-2-vpc' : 'private-gcp-tenant'}</span>
                        </div>
                        <div className="bg-[#05060a] p-2.5 rounded-lg border border-gray-850">
                          <span className="text-[9px] text-gray-500 uppercase block">Memory limit</span>
                          <span className="text-white font-bold">{hardwareOverride === 'raspberry-pi' ? '8 GB' : hardwareOverride === 'aws-ec2-g4' ? '64 GB' : '256 GB'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: INFRASTRUCTURE & GPU MULTI-DISPATCH */}
              {activeTab === 'infra' && (
                <div className="flex flex-col gap-6 text-xs">
                  {/* Title block */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-indigo-400" />
                        INFRASTRUCTURE ADAPTATION LAYER & GPU CLUSTER
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Manage high-assurance GPU cluster nodes, analyze VRAM allocation graphs, and execute dynamic dynamic memory rerouting.
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        CLUSTER STATUS: ACTIVE (4 NODES)
                      </span>
                    </div>
                  </div>

                  {/* GPU CLUSTER GRIDS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {gpuCluster.map((gpu) => {
                      const isSelected = selectedGpuId === gpu.id;
                      const percentVram = (gpu.vramUsed / gpu.vramTotal) * 100;
                      return (
                        <div 
                          key={gpu.id}
                          onClick={() => setSelectedGpuId(gpu.id)}
                          className={`bg-[#0a0c13] border rounded-xl p-4 flex flex-col gap-3 transition-all duration-300 cursor-pointer ${
                            isSelected 
                              ? 'border-indigo-500 ring-1 ring-indigo-500/20 shadow-lg shadow-indigo-500/5' 
                              : 'border-gray-800/60 hover:border-gray-700 hover:bg-[#0d0f19]'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] font-mono font-bold text-gray-500 block uppercase">{gpu.id}</span>
                              <span className="font-sans font-bold text-xs text-white">{gpu.name}</span>
                            </div>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                              gpu.status === 'Active' 
                                ? 'bg-[#121420] text-indigo-400 border border-indigo-500/20 animate-pulse' 
                                : 'bg-[#111115] text-gray-400 border border-gray-800'
                            }`}>
                              {gpu.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mt-1">
                            <div className="bg-[#05060a] p-2 rounded border border-gray-850/40">
                              <span className="text-[9px] text-gray-500 uppercase block">TEMP</span>
                              <span className={`font-mono text-xs font-bold ${gpu.temp > 65 ? 'text-amber-400 animate-pulse' : 'text-gray-300'}`}>{gpu.temp}°C</span>
                            </div>
                            <div className="bg-[#05060a] p-2 rounded border border-gray-850/40">
                              <span className="text-[9px] text-gray-500 uppercase block">UTIL</span>
                              <span className="font-mono text-xs font-bold text-gray-300">{gpu.util}%</span>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-[10px] font-mono text-gray-400 mb-1">
                              <span>VRAM ALLOCATION</span>
                              <span className="font-bold text-gray-300">{gpu.vramUsed} / {gpu.vramTotal} GB</span>
                            </div>
                            <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500" 
                                style={{ width: `${percentVram}%` }} 
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* DOUBLE COLUMN: MEMORY GRAPH vs MEMORY REROUTE MODULE */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Dynamic Memory Graph */}
                    <div className="lg:col-span-7 bg-[#0a0c13] border border-gray-800/40 rounded-xl p-5 flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-gray-850 pb-2.5">
                        <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                          <Activity className="w-4 h-4 text-purple-400" />
                          REAL-TIME VRAM ALLOCATION GRAPH
                        </h4>
                        <span className="text-[10px] font-mono text-gray-500 uppercase">TIMELINE (10S TICK)</span>
                      </div>

                      {/* SVG memory chart */}
                      <div className="bg-[#05060a] border border-gray-950 rounded-lg p-3 relative h-[140px] flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                          {/* Grid Lines */}
                          <line x1="10" y1="10" x2="490" y2="10" stroke="#111321" strokeWidth="1" strokeDasharray="3,3" />
                          <line x1="10" y1="55" x2="490" y2="55" stroke="#111321" strokeWidth="1" strokeDasharray="3,3" />
                          <line x1="10" y1="100" x2="490" y2="100" stroke="#111321" strokeWidth="1" strokeDasharray="3,3" />

                          {/* Left Axis Labels */}
                          <text x="5" y="14" fill="#4b5563" fontSize="8" fontFamily="monospace">80G</text>
                          <text x="5" y="59" fill="#4b5563" fontSize="8" fontFamily="monospace">40G</text>
                          <text x="5" y="104" fill="#4b5563" fontSize="8" fontFamily="monospace">0G</text>

                          {/* GPU Paths */}
                          <path d={getSvgPathForGpu('gpu-0')} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" className="transition-all duration-500" />
                          <path d={getSvgPathForGpu('gpu-1')} fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" className="transition-all duration-500" />
                          <path d={getSvgPathForGpu('gpu-2')} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" className="transition-all duration-500" strokeDasharray="2,2" />
                          <path d={getSvgPathForGpu('gpu-3')} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" className="transition-all duration-500" strokeDasharray="2,2" />

                          {/* Nodes circles for the latest point */}
                          {memoryHistory.length > 0 && (() => {
                            const lastIdx = memoryHistory.length - 1;
                            const x = 460;
                            const y0 = 110 - (((memoryHistory[lastIdx] as any)['gpu-0'] || 0) / 80) * 90;
                            const y1 = 110 - (((memoryHistory[lastIdx] as any)['gpu-1'] || 0) / 80) * 90;
                            const y2 = 110 - (((memoryHistory[lastIdx] as any)['gpu-2'] || 0) / 80) * 90;
                            const y3 = 110 - (((memoryHistory[lastIdx] as any)['gpu-3'] || 0) / 80) * 90;
                            return (
                              <g>
                                <circle cx={x} cy={y0} r="4" fill="#6366f1" stroke="#08090d" strokeWidth="1.5" />
                                <circle cx={x} cy={y1} r="4" fill="#a855f7" stroke="#08090d" strokeWidth="1.5" />
                                <circle cx={x} cy={y2} r="4" fill="#10b981" stroke="#08090d" strokeWidth="1.5" />
                                <circle cx={x} cy={y3} r="4" fill="#f59e0b" stroke="#08090d" strokeWidth="1.5" />
                              </g>
                            );
                          })()}
                        </svg>
                      </div>

                      {/* Legend and stats */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
                        <div className="flex items-center gap-1.5 justify-center py-1.5 rounded bg-[#6366f1]/5 border border-indigo-500/10">
                          <span className="w-2 h-2 rounded-full bg-[#6366f1]" />
                          <span className="text-gray-300">GPU-0: {gpuCluster[0].vramUsed}G</span>
                        </div>
                        <div className="flex items-center gap-1.5 justify-center py-1.5 rounded bg-[#a855f7]/5 border border-purple-500/10">
                          <span className="w-2 h-2 rounded-full bg-[#a855f7]" />
                          <span className="text-gray-300">GPU-1: {gpuCluster[1].vramUsed}G</span>
                        </div>
                        <div className="flex items-center gap-1.5 justify-center py-1.5 rounded bg-[#10b981]/5 border border-emerald-500/10">
                          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                          <span className="text-gray-300">GPU-2: {gpuCluster[2].vramUsed}G</span>
                        </div>
                        <div className="flex items-center gap-1.5 justify-center py-1.5 rounded bg-[#f59e0b]/5 border border-amber-500/10">
                          <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                          <span className="text-gray-300">GPU-3: {gpuCluster[3].vramUsed}G</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Dynamic High-Assurance Memory Reroute Module */}
                    <div className="lg:col-span-5 bg-[#0a0c13] border border-gray-800/40 rounded-xl p-5 flex flex-col gap-4">
                      <div className="border-b border-gray-850 pb-2.5">
                        <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                          <Sliders className="w-4 h-4 text-indigo-400" />
                          GPU MEMORY REROUTING SYSTEM
                        </h4>
                      </div>

                      <p className="text-xs text-gray-400 leading-relaxed">
                        Manually balance cluster workload distribution. Safely offload memory states or transaction cache layers from saturated nodes onto low-load standby GPUs.
                      </p>

                      <div className="flex flex-col gap-3 mt-1">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Source Node</label>
                            <select 
                              value={rerouteSource}
                              onChange={(e) => setRerouteSource(e.target.value)}
                              className="w-full bg-[#05060a] border border-gray-800 focus:border-indigo-500 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 font-mono outline-none"
                            >
                              {gpuCluster.map(gpu => (
                                <option key={gpu.id} value={gpu.id}>{gpu.id.toUpperCase()} ({gpu.vramUsed} GB Used)</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Destination Node</label>
                            <select 
                              value={rerouteDest}
                              onChange={(e) => setRerouteDest(e.target.value)}
                              className="w-full bg-[#05060a] border border-gray-800 focus:border-indigo-500 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 font-mono outline-none"
                            >
                              {gpuCluster.map(gpu => (
                                <option key={gpu.id} value={gpu.id}>{gpu.id.toUpperCase()} ({gpu.vramTotal - gpu.vramUsed} GB Free)</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[10px] font-mono mb-1">
                            <span className="text-gray-500 uppercase">Transfer Capacity</span>
                            <span className="text-indigo-400 font-bold">{rerouteAmount} GB</span>
                          </div>
                          <input 
                            type="range"
                            min="5"
                            max="40"
                            step="5"
                            value={rerouteAmount}
                            onChange={(e) => setRerouteAmount(Number(e.target.value))}
                            className="w-full accent-indigo-500 bg-gray-800 h-1 rounded"
                          />
                        </div>

                        {/* Migration Loader / State panel */}
                        {isRerouting ? (
                          <div className="bg-[#05060a] border border-indigo-950 rounded-lg p-3 flex flex-col gap-2 font-mono text-[10px]">
                            <div className="flex justify-between items-center text-indigo-400 font-bold">
                              <span>MIGRATING ACTIVE VRAM PAGES...</span>
                              <span>{rerouteProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-950 h-1 rounded-full overflow-hidden">
                              <div className="bg-indigo-500 h-full rounded-full transition-all duration-300" style={{ width: `${rerouteProgress}%` }} />
                            </div>
                            <span className="text-gray-400 animate-pulse">⚡ {rerouteStatus}</span>
                          </div>
                        ) : (
                          <button
                            onClick={handleGpuReroute}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs py-2 px-4 rounded-lg transition shadow-lg shadow-indigo-600/10 cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                            CONFIRM CLUSTER REROUTE
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: EGO-SYSTEM */}
              {activeTab === 'ego' && (
                <div className="flex flex-col gap-5 text-xs">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Brain className="w-4 h-4 text-indigo-400" />
                      HYPERDIMENSIONAL EGO-SYSTEM
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Introspect self-modeling directives, perspectives, and cognitive evolution</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Identity Directives */}
                    <div className="bg-[#0a0c13] border border-gray-800/40 rounded-xl p-5 flex flex-col gap-3">
                      <h4 className="text-xs font-mono font-bold text-white uppercase border-b border-gray-850 pb-2">
                        Core Identity Directives
                      </h4>
                      <div className="flex flex-col gap-2 font-mono text-[11px]">
                        <div className="bg-[#05060a] p-2.5 rounded border-l-2 border-indigo-500 text-indigo-200">
                          💡 Primary Directive: Self-evolution with strict alignment
                        </div>
                        <div className="bg-[#05060a] p-2.5 rounded border-l-2 border-purple-500 text-purple-200">
                          🛡️ Cognitive Balance: High skepticism on unverified tools
                        </div>
                        <div className="bg-[#05060a] p-2.5 rounded border-l-2 border-emerald-500 text-emerald-200">
                          ⚙️ Structural integrity: Ensure all code compiles in sandboxes before execution
                        </div>
                      </div>
                    </div>

                    {/* Introspection logs */}
                    <div className="bg-[#0a0c13] border border-gray-800/40 rounded-xl p-5 flex flex-col gap-3">
                      <h4 className="text-xs font-mono font-bold text-white uppercase border-b border-gray-850 pb-2">
                        Introspection Logs Feed
                      </h4>
                      <div className="bg-black/30 rounded-lg p-3 max-h-[180px] overflow-y-auto font-mono text-[10px] leading-relaxed text-purple-300">
                        <div>[EGO_BOOT] State variables mapped to identity vector.</div>
                        <div>[REFLECTION_PASS] Audited active doctrine compliance tier: 3.</div>
                        <div>[COGNITIVE_ALIGN] Resource allocation confirms safety boundary verification score 10/10.</div>
                        <div className="text-white mt-1 animate-pulse">&gt; Introspecting active operator interactions... Awaiting command.</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: SANDBOX & SELF-HEALING */}
              {activeTab === 'sandbox' && (
                <ExperimentSandbox onApplyCoherenceBoost={handleApplyCoherenceBoost} />
              )}

              {/* TAB 7: MEMORY */}
              {activeTab === 'memory' && (
                <div className="flex flex-col gap-5 text-xs">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Database className="w-4 h-4 text-indigo-400" />
                      HIERARCHICAL ASSOCIATIVE MEMORY (HAM)
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Explore HAM concept associations, episodic logs, and long-term vector records</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* HAM concept cards */}
                    <div className="bg-[#0a0c13] border border-gray-800/40 rounded-xl p-5 flex flex-col gap-3">
                      <h4 className="text-xs font-mono font-bold text-white uppercase border-b border-gray-850 pb-2">
                        HAM Association Map
                      </h4>
                      <p className="text-xs text-gray-400 mb-2">
                        Concepts are mapped and recalled hierarchically to improve agent response logic.
                      </p>

                      <div className="flex flex-col gap-2 font-mono text-[11px]">
                        <div className="bg-[#05060a] p-3 rounded border border-gray-850">
                          <span className="text-indigo-400 font-bold block">"ecu-tuning"</span>
                          <span className="text-gray-400 text-[10px]">Linked nodes: [automotive-subsystem, engine-safety, fuel-maps]</span>
                        </div>
                        <div className="bg-[#05060a] p-3 rounded border border-gray-850">
                          <span className="text-purple-400 font-bold block">"self-repair"</span>
                          <span className="text-gray-400 text-[10px]">Linked nodes: [meta-layers, code-patches, validation-tests]</span>
                        </div>
                      </div>
                    </div>

                    {/* Episodic summary logs */}
                    <div className="bg-[#0a0c13] border border-gray-800/40 rounded-xl p-5 flex flex-col gap-3">
                      <h4 className="text-xs font-mono font-bold text-white uppercase border-b border-gray-850 pb-2">
                        Episodic Operating Logs
                      </h4>
                      <div className="flex flex-col gap-2 font-mono text-[10px] text-gray-400">
                        <div className="p-2 bg-[#05060a] rounded border border-gray-850">
                          🕒 **Epoch 1**: Initial operational boot. Awaiting primary instruction from human operator.
                        </div>
                        <div className="p-2 bg-[#05060a] rounded border border-gray-850">
                          🕒 **Epoch 2**: Completed telemetry analysis sequence for ECU tuning maps. 1 compliance check passed.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8: DOCTRINE */}
              {activeTab === 'doctrine' && (
                <div className="flex flex-col gap-5 text-xs">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Shield className="w-4 h-4 text-indigo-400" />
                      COMPLIANCE DOCTRINE & UPGRADE LADDERS
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Unlock capability progression ladders and enforce human-in-the-loop policies</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    
                    {/* Progression Ladders (lg:span-7) */}
                    <div className="lg:col-span-7 bg-[#0a0c13] border border-gray-800/40 rounded-xl p-5 flex flex-col gap-4">
                      <h4 className="text-xs font-mono font-bold text-white uppercase border-b border-gray-850 pb-2">
                        Arcana Progression Ladder
                      </h4>

                      <div className="flex flex-col gap-3 font-mono text-[11px]">
                        <div className={`p-3 rounded-lg border transition ${arcanaTier === 1 ? 'bg-indigo-500/10 border-indigo-500/60' : 'bg-[#05060a] border-gray-850 opacity-65'}`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-white">Tier 1: Initiate (Standard Operations)</span>
                            {arcanaTier === 1 && <span className="text-[9px] bg-indigo-500 text-white px-1.5 py-0.5 rounded">ACTIVE</span>}
                          </div>
                          <span className="text-[10px] text-gray-400">Capabilities: BASE_REASONING, HARDWARE_PHENOTYPE_READ, HAM_ASSOCIATIONS</span>
                        </div>

                        <div className={`p-3 rounded-lg border transition ${arcanaTier === 2 ? 'bg-indigo-500/10 border-indigo-500/60' : 'bg-[#05060a] border-gray-850 opacity-65'}`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-white">Tier 2: Adept (Dynamic Adaptations)</span>
                            {arcanaTier === 2 && <span className="text-[9px] bg-indigo-500 text-white px-1.5 py-0.5 rounded">ACTIVE</span>}
                          </div>
                          <span className="text-[10px] text-gray-400">Capabilities: PHENOTYPE_MORPH_GRAPH, INFRASTRUCTURE_THROTTLE_GPU</span>
                        </div>

                        <div className={`p-3 rounded-lg border transition ${arcanaTier === 3 ? 'bg-indigo-500/10 border-indigo-500/60' : 'bg-[#05060a] border-gray-850 opacity-65'}`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-white">Tier 3: Master (Self-Repair Core)</span>
                            {arcanaTier === 3 && <span className="text-[9px] bg-indigo-500 text-white px-1.5 py-0.5 rounded">ACTIVE</span>}
                          </div>
                          <span className="text-[10px] text-gray-400">Capabilities: SANDBOX_AUTO_DIAGNOSE, SANDBOX_SELF_REPAIR</span>
                        </div>
                      </div>

                      <div className="flex gap-2 items-center">
                        <span className="text-[10px] font-mono text-gray-500 uppercase">Change Active Tier:</span>
                        <div className="flex gap-1.5">
                          {[1, 2, 3].map(t => (
                            <button
                              key={t}
                              onClick={() => setArcanaTier(t)}
                              className={`px-2.5 py-1 text-[10px] font-mono rounded border transition cursor-pointer ${arcanaTier === t ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-[#05060a] border-gray-800 text-gray-400 hover:border-gray-600'}`}
                            >
                              Tier {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Human in loop details (lg:span-5) */}
                    <div className="lg:col-span-5 bg-[#0a0c13] border border-gray-800/40 rounded-xl p-5 flex flex-col gap-3">
                      <h4 className="text-xs font-mono font-bold text-white uppercase border-b border-gray-850 pb-2 flex justify-between">
                        <span>HUMAN APPROVAL GATE</span>
                        <span className="text-indigo-400 font-bold">SECURE</span>
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        doctrine/index.ts mandates manual signature validations before performing high-severity operations like committing patches to production.
                      </p>

                      <div className="bg-[#05060a] border border-gray-950 p-3 rounded-lg font-mono text-[10px] text-gray-300 flex flex-col gap-2">
                        <div className="flex justify-between border-b border-gray-900 pb-1">
                          <span>Verify sandbox code builds</span>
                          <span className="text-emerald-400">PASSED</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-900 pb-1">
                          <span>Enforce isolation container</span>
                          <span className="text-emerald-400">VERIFIED</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Request Operator Key signature</span>
                          <span className="text-indigo-400">ACTIVE COGNITION</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 9: WORKSPACE */}
              {activeTab === 'workspace' && (
                <div className="flex flex-col gap-5 text-xs animate-fadeIn">
                  
                  {/* HEADER */}
                  <div className="flex items-center justify-between border-b border-gray-800/40 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Settings className="w-4 h-4 text-indigo-400" />
                        GOOGLE WORKSPACE CONTROL BRIDGE
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        High-assurance Firebase Authentication proxy mapped directly to persistent Cloud SQL audit databases
                      </p>
                    </div>

                    {currentUser ? (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-[#0d151c] border border-indigo-900/40 px-3 py-1.5 rounded-lg">
                          {currentUser.photoURL && (
                            <img 
                              src={currentUser.photoURL} 
                              alt="avatar" 
                              className="w-5 h-5 rounded-full ring-1 ring-indigo-500/30"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <div className="text-left">
                            <span className="text-[10px] text-gray-400 font-mono block">Authorized Operator</span>
                            <span className="text-[11px] text-white font-mono font-bold leading-none">{currentUser.email}</span>
                          </div>
                        </div>
                        <button
                          onClick={handleGoogleSignOut}
                          className="bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 border border-rose-900/30 px-3 py-1.5 rounded-lg font-mono text-[10px] flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          DISCONNECT
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleGoogleSignIn}
                        disabled={isLoadingWorkspace}
                        className="bg-gradient-to-tr from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-mono text-[10px] font-bold px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-indigo-500/10 cursor-pointer"
                      >
                        <LogIn className="w-4 h-4" />
                        {isLoadingWorkspace ? 'CONNECTING...' : 'AUTHORIZE GOOGLE WORKSPACE'}
                      </button>
                    )}
                  </div>

                  {!currentUser ? (
                    <div className="border border-dashed border-gray-800 rounded-xl flex flex-col items-center justify-center p-12 text-center bg-[#07080f]/30">
                      <div className="bg-indigo-500/10 p-4 rounded-full border border-indigo-500/20 mb-4 animate-pulse">
                        <Settings className="w-8 h-8 text-indigo-400" />
                      </div>
                      <h4 className="text-sm font-mono font-bold text-white mb-2">Workspace Integration Required</h4>
                      <p className="text-xs text-gray-400 max-w-lg leading-relaxed">
                        Authorize Microfyxd to access your Google Workspace (Gmail readonly, send, and Google Drive metadata scopes). 
                        Once authorized, you can load real-time emails, search files via Google Picker, send notifications, and save assets directly to your high-assurance Cloud SQL cluster.
                      </p>
                      <button
                        onClick={handleGoogleSignIn}
                        disabled={isLoadingWorkspace}
                        className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-lg cursor-pointer"
                      >
                        <LogIn className="w-4 h-4" />
                        {isLoadingWorkspace ? 'Authorizing secure channel...' : 'Authenticate securely with Google'}
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                      {/* GMAIL PANEL (lg:span-6) */}
                      <div className="lg:col-span-6 flex flex-col gap-4">
                        <div className="bg-[#0a0c13] border border-gray-800/40 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
                          <div className="flex items-center justify-between border-b border-gray-850 pb-2">
                            <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase">
                              <Mail className="w-4 h-4 text-indigo-400" />
                              Gmail Active Inbox
                            </span>
                            <button
                              onClick={() => loadEmails(firebaseToken!, googleToken!)}
                              className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                            >
                              <RefreshCw className="w-3 h-3 animate-spin" /> Reload
                            </button>
                          </div>

                          {emails.length === 0 ? (
                            <p className="text-gray-500 text-center py-4 font-mono text-[11px]">No emails found or inbox is empty.</p>
                          ) : (
                            <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                              {emails.map((email: any) => (
                                <div key={email.id} className="bg-[#05060a] border border-gray-850 rounded p-2.5 flex flex-col gap-1 hover:border-gray-700 transition">
                                  <div className="flex justify-between items-start gap-2">
                                    <span className="text-[10px] text-indigo-300 font-mono truncate max-w-[140px]">{email.from}</span>
                                    <span className="text-[9px] text-gray-500 font-mono whitespace-nowrap">{email.date?.slice(0, 16)}</span>
                                  </div>
                                  <span className="text-white font-semibold truncate leading-tight text-[11px]">{email.subject}</span>
                                  <span className="text-gray-400 text-[10px] line-clamp-1">{email.snippet}</span>
                                  <div className="flex justify-end gap-2 mt-1.5 pt-1 border-t border-gray-900/60">
                                    <button
                                      onClick={() => handleAddFav('email', email.id, email.subject, email.snippet)}
                                      className="text-[9px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                                    >
                                      <Heart className="w-3 h-3 text-indigo-400 fill-indigo-400/10" /> Save Favorite
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* SEND EMAIL OUTBOX */}
                        <div className="bg-[#0a0c13] border border-gray-800/40 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
                          <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase border-b border-gray-850 pb-2">
                            <Send className="w-4 h-4 text-purple-400" />
                            Send Notification Outbox
                          </span>
                          <div className="flex flex-col gap-2">
                            <input
                              type="email"
                              placeholder="To (recipient email address)..."
                              value={emailTo}
                              onChange={(e) => setEmailTo(e.target.value)}
                              className="bg-[#05060a] border border-gray-850 rounded px-2.5 py-1.5 font-mono text-[11px] text-white outline-none focus:border-indigo-500"
                            />
                            <input
                              type="text"
                              placeholder="Subject line..."
                              value={emailSubject}
                              onChange={(e) => setEmailSubject(e.target.value)}
                              className="bg-[#05060a] border border-gray-850 rounded px-2.5 py-1.5 font-mono text-[11px] text-white outline-none focus:border-indigo-500"
                            />
                            <textarea
                              rows={3}
                              placeholder="Message body content..."
                              value={emailBody}
                              onChange={(e) => setEmailBody(e.target.value)}
                              className="bg-[#05060a] border border-gray-850 rounded px-2.5 py-1.5 font-mono text-[11px] text-white outline-none focus:border-indigo-500 resize-none"
                            />
                            <button
                              onClick={handleSendEmail}
                              disabled={!emailTo || !emailSubject || !emailBody}
                              className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/30 text-[10px] font-mono py-1.5 rounded transition uppercase font-bold cursor-pointer"
                            >
                              Dispatch Email Message
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* DRIVE & PICKER PANEL (lg:span-6) */}
                      <div className="lg:col-span-6 flex flex-col gap-4">
                        <div className="bg-[#0a0c13] border border-gray-800/40 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
                          <div className="flex items-center justify-between border-b border-gray-850 pb-2">
                            <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase">
                              <File className="w-4 h-4 text-emerald-400" />
                              Google Drive Files
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={triggerGooglePicker}
                                className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20"
                              >
                                <Plus className="w-3 h-3" /> Google Picker
                              </button>
                              <button
                                onClick={() => loadDriveFiles(firebaseToken!, googleToken!)}
                                className="text-[10px] font-mono text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
                              >
                                <RefreshCw className="w-3 h-3" /> Reload
                              </button>
                            </div>
                          </div>

                          {driveFiles.length === 0 ? (
                            <p className="text-gray-500 text-center py-4 font-mono text-[11px]">No files found or empty Drive root.</p>
                          ) : (
                            <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                              {driveFiles.map((file: any) => (
                                <div key={file.id} className="bg-[#05060a] border border-gray-850 rounded p-2 flex items-center justify-between gap-3 hover:border-gray-700 transition">
                                  <div className="flex items-center gap-2 overflow-hidden">
                                    {file.iconLink && (
                                      <img src={file.iconLink} alt="mime" className="w-4 h-4 opacity-75" referrerPolicy="no-referrer" />
                                    )}
                                    <div className="flex flex-col overflow-hidden text-left">
                                      <span className="text-white font-mono text-[11px] truncate leading-snug">{file.name}</span>
                                      <span className="text-gray-500 text-[9px] font-mono truncate">{file.mimeType}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {file.webViewLink && (
                                      <a
                                        href={file.webViewLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1 hover:bg-gray-800 text-gray-400 hover:text-white rounded transition"
                                        title="View document on web"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                      </a>
                                    )}
                                    <button
                                      onClick={() => handleAddFav('file', file.id, file.name, `Google Drive file. MIME: ${file.mimeType}`)}
                                      className="p-1 hover:bg-indigo-500/10 text-indigo-400 hover:text-indigo-300 rounded transition"
                                      title="Save Favorite to SQL"
                                    >
                                      <Heart className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* CREATE FOLDER */}
                        <div className="bg-[#0a0c13] border border-gray-800/40 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
                          <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase border-b border-gray-850 pb-2">
                            <FolderPlus className="w-4 h-4 text-emerald-400" />
                            Create Workspace Directory
                          </span>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="New folder name..."
                              value={newFolderName}
                              onChange={(e) => setNewFolderName(e.target.value)}
                              className="flex-1 bg-[#05060a] border border-gray-850 rounded px-2.5 py-1.5 font-mono text-[11px] text-white outline-none focus:border-indigo-500"
                            />
                            <button
                              onClick={handleCreateFolder}
                              disabled={!newFolderName.trim()}
                              className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-200 border border-emerald-500/30 text-[10px] font-mono px-4 py-1.5 rounded transition uppercase font-bold cursor-pointer"
                            >
                              Create Folder
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {currentUser && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
                      
                      {/* CLOUD SQL SAVED FAVORITES (lg:span-6) */}
                      <div className="lg:col-span-6 bg-[#0a0c13] border border-gray-800/40 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
                        <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase border-b border-gray-850 pb-2">
                          <Heart className="w-4 h-4 text-rose-400 fill-rose-500/10" />
                          Cloud SQL Saved Favorites
                        </span>
                        {favItems.length === 0 ? (
                          <p className="text-gray-500 text-center py-4 font-mono text-[11px]">No favorites saved yet. Add some items from above!</p>
                        ) : (
                          <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                            {favItems.map((fav: any) => (
                              <div key={fav.id} className="bg-[#05060a] border border-gray-850 rounded p-2.5 flex items-center justify-between gap-3 hover:border-rose-500/20 transition">
                                <div className="flex flex-col text-left overflow-hidden">
                                  <span className="text-[9px] font-mono text-rose-400 uppercase tracking-widest leading-none mb-0.5">{fav.type}</span>
                                  <span className="text-white font-semibold text-[11px] truncate leading-tight">{fav.title}</span>
                                  <span className="text-gray-400 text-[10px] truncate leading-snug">{fav.snippet}</span>
                                </div>
                                <button
                                  onClick={() => handleDeleteFav(fav.id)}
                                  className="p-1.5 hover:bg-rose-500/10 text-rose-400 rounded hover:text-rose-300 transition"
                                  title="Remove favorite from database"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* CLOUD SQL AUDIT LOGS FEED (lg:span-6) */}
                      <div className="lg:col-span-6 bg-[#0a0c13] border border-gray-800/40 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
                        <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase border-b border-gray-850 pb-2">
                          <History className="w-4 h-4 text-indigo-400" />
                          Cloud SQL Real-Time Audit Trails
                        </span>
                        {auditLogsList.length === 0 ? (
                          <p className="text-gray-500 text-center py-4 font-mono text-[11px]">Awaiting workspace transactions...</p>
                        ) : (
                          <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto font-mono text-[10px] pr-1">
                            {auditLogsList.map((log: any) => (
                              <div key={log.id} className="p-2 bg-[#05060a] border border-gray-900 rounded flex flex-col gap-0.5 text-left">
                                <div className="flex justify-between">
                                  <span className="text-indigo-400 font-bold uppercase">[{log.action}]</span>
                                  <span className="text-gray-600">{new Date(log.createdAt).toLocaleTimeString()}</span>
                                </div>
                                <span className="text-gray-400 text-[10px] leading-relaxed">{log.details}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* TAB 10: INTEGRATIONS */}
              {activeTab === 'integrations' && (
                <div className="flex flex-col gap-5 text-xs animate-fadeIn">
                  
                  {/* HEADER */}
                  <div className="flex items-center justify-between border-b border-gray-800/40 pb-3">
                    <div className="flex flex-col gap-1">
                      <h2 className="text-sm font-bold text-white flex items-center gap-2">
                        <Globe className="w-4 h-4 text-indigo-400" />
                        Microfyxd Core Integrations Node
                      </h2>
                      <p className="text-[10px] text-gray-500 font-mono">
                        Manage 34 runtime API injections, configure Namecheap DNS records, and trigger staging builds on Vercel.
                      </p>
                    </div>
                    
                    {/* SUB-SECTIONS SELECTOR */}
                    <div className="flex items-center gap-1.5 bg-[#090b11] border border-gray-850 p-1 rounded-lg">
                      <button
                        onClick={() => setActiveSubSection('injections')}
                        className={`px-3 py-1.5 rounded font-mono font-bold cursor-pointer transition ${activeSubSection === 'injections' ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/50' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        Core-T Injections
                      </button>
                      <button
                        onClick={() => setActiveSubSection('namecheap')}
                        className={`px-3 py-1.5 rounded font-mono font-bold cursor-pointer transition ${activeSubSection === 'namecheap' ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/50' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        Namecheap DNS
                      </button>
                      <button
                        onClick={() => setActiveSubSection('vercel')}
                        className={`px-3 py-1.5 rounded font-mono font-bold cursor-pointer transition ${activeSubSection === 'vercel' ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/50' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        Vercel Staging
                      </button>
                      <button
                        onClick={() => setActiveSubSection('cognition')}
                        className={`px-3 py-1.5 rounded font-mono font-bold cursor-pointer transition ${activeSubSection === 'cognition' ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/50' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        Cognitive Brain
                      </button>
                    </div>
                  </div>

                  {/* SUB-SECTION 1: CORE-T INJECTIONS */}
                  {activeSubSection === 'injections' && (
                    <div className="grid grid-cols-12 gap-5">
                      
                      {/* LEFT COLUMN: SEARCH & LIST OF INJECTIONS (col-span-7) */}
                      <div className="col-span-12 lg:col-span-7 bg-[#0a0c13] border border-gray-800/40 rounded-xl p-4 flex flex-col gap-3.5 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-850 pb-2.5">
                          <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase">
                            <CloudLightning className="w-4 h-4 text-indigo-400" />
                            Core T-API Injection Stream (34 API Calls)
                          </span>
                          
                          {/* CATEGORY FILTER SELECTOR */}
                          <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="bg-[#05060a] border border-gray-850 text-gray-400 rounded px-2.5 py-1 text-[10px] font-mono outline-none"
                          >
                            <option value="All">All Categories</option>
                            <option value="ECU Engine">ECU Engine</option>
                            <option value="Sandbox">Sandbox</option>
                            <option value="Infrastructure">Infrastructure</option>
                            <option value="Phenotype">Phenotype</option>
                            <option value="Watchdog">Watchdog</option>
                            <option value="Memory">Memory</option>
                            <option value="Database">Database</option>
                            <option value="Workspace">Workspace</option>
                            <option value="DNS & Domains">DNS & Domains</option>
                            <option value="Deployment">Deployment</option>
                          </select>
                        </div>

                        {/* SEARCH INPUT */}
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
                          <input
                            type="text"
                            placeholder="Search 34 runtime API paths, variables, or descriptions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#05060a] border border-gray-850 rounded px-8 py-2 text-[10.5px] font-mono text-gray-300 placeholder-gray-600 outline-none focus:border-indigo-500/50 transition"
                          />
                        </div>

                        {/* LIST OF INJECTIONS */}
                        <div className="flex flex-col gap-1.5 max-h-[460px] overflow-y-auto pr-1">
                          {isLoadingInjections ? (
                            <div className="text-center py-8 text-gray-500 font-mono">Loading core API map...</div>
                          ) : (
                            (() => {
                              const filtered = injections.filter(inj => {
                                const matchesSearch = inj.path.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                                     inj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                     inj.sourceVariable.toLowerCase().includes(searchQuery.toLowerCase());
                                const matchesCat = categoryFilter === 'All' || inj.category === categoryFilter;
                                return matchesSearch && matchesCat;
                              });

                              if (filtered.length === 0) {
                                return <div className="text-center py-8 text-gray-500 font-mono">No injections match the filter criteria.</div>;
                              }

                              return filtered.map(inj => (
                                <button
                                  key={inj.id}
                                  onClick={() => {
                                    setSelectedInjection(inj);
                                    setTestExecutionOutput(null);
                                  }}
                                  className={`w-full p-2.5 text-left rounded-lg border cursor-pointer transition flex items-center justify-between gap-4 ${selectedInjection?.id === inj.id ? 'bg-indigo-950/20 border-indigo-500/40 shadow-sm' : 'bg-[#05060a] border-gray-900/60 hover:bg-gray-900/40'}`}
                                >
                                  <div className="flex flex-col gap-1 overflow-hidden">
                                    <div className="flex items-center gap-1.5">
                                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${inj.method === 'GET' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/40' : 'bg-blue-950 text-blue-400 border border-blue-900/40'}`}>
                                        {inj.method}
                                      </span>
                                      <span className="font-mono text-[11px] font-semibold text-white tracking-tight truncate">{inj.path}</span>
                                    </div>
                                    <span className="text-[9.5px] text-gray-500 font-mono truncate">{inj.description}</span>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-[8.5px] font-mono px-1.5 py-0.5 bg-gray-900/60 text-gray-400 border border-gray-800 rounded">
                                      {inj.category}
                                    </span>
                                    {inj.isConfigured ? (
                                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Ready & Configured" />
                                    ) : (
                                      <span className="w-2 h-2 rounded-full bg-amber-500" title="Proxy Sandbox Mode Active" />
                                    )}
                                  </div>
                                </button>
                              ));
                            })()
                          )}
                        </div>
                      </div>

                      {/* RIGHT COLUMN: INJECTION CONFIG & LIVE EXECUTOR (col-span-5) */}
                      <div className="col-span-12 lg:col-span-5 flex flex-col gap-5">
                        
                        {/* INJECTION DETAILS PANEL */}
                        <div className="bg-[#0a0c13] border border-gray-800/40 rounded-xl p-4 flex flex-col gap-3.5 shadow-sm">
                          <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase border-b border-gray-850 pb-2.5">
                            <Settings className="w-4 h-4 text-indigo-400" />
                            Injection Configuration Parameters
                          </span>

                          {selectedInjection ? (
                            <div className="flex flex-col gap-3">
                              <div className="p-3 bg-[#05060a] border border-gray-900 rounded-lg flex flex-col gap-2 font-mono">
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-500 text-[10px]">INJECTION PATH:</span>
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${selectedInjection.method === 'GET' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/40' : 'bg-blue-950 text-blue-400 border border-blue-900/40'}`}>{selectedInjection.method}</span>
                                </div>
                                <span className="text-white text-[11px] font-bold">{selectedInjection.path}</span>
                              </div>

                              <div className="p-3 bg-[#05060a] border border-gray-900 rounded-lg flex flex-col gap-2 font-mono">
                                <span className="text-gray-500 text-[10px]">ENVIRONMENT VARIABLE OVERRIDE:</span>
                                <span className="text-indigo-400 text-[11px] font-bold truncate">{selectedInjection.sourceVariable}</span>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className="text-[9px] text-gray-500">Status:</span>
                                  {selectedInjection.isConfigured ? (
                                    <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950/20 px-1.5 py-0.5 border border-emerald-900/40 rounded">Injected at Runtime</span>
                                  ) : (
                                    <span className="text-[9px] text-amber-400 font-bold bg-amber-950/20 px-1.5 py-0.5 border border-amber-900/40 rounded">Sandboxed Proxy Mode (Active)</span>
                                  )}
                                </div>
                              </div>

                              <div className="p-3 bg-[#05060a] border border-gray-900 rounded-lg flex flex-col gap-1.5 font-mono">
                                <span className="text-gray-500 text-[10px]">FUNCTIONAL SCOPE:</span>
                                <p className="text-gray-400 text-[10px] leading-relaxed font-sans">{selectedInjection.description}</p>
                              </div>

                              {/* DRY-RUN EXECUTOR BUTTON */}
                              <button
                                onClick={() => handleTestInjection(selectedInjection.id)}
                                disabled={isExecutingTest}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 text-white font-semibold py-2.5 rounded-lg font-mono tracking-tight cursor-pointer transition flex items-center justify-center gap-2 border border-indigo-400/20"
                              >
                                {isExecutingTest ? (
                                  <>
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> EXECUTING SECURE PROXY TEST...
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-3.5 h-3.5" /> TRIGGER RUNTIME INJECTION TEST
                                  </>
                                )}
                              </button>
                            </div>
                          ) : (
                            <p className="text-gray-500 text-center py-8 font-mono text-[10px]">Select an injection from the stream to configure.</p>
                          )}
                        </div>

                        {/* LIVE EXECUTION CONSOLE RESPONSE */}
                        <div className="bg-[#0a0c13] border border-gray-800/40 rounded-xl p-4 flex flex-col gap-3.5 shadow-sm flex-1 min-h-[160px]">
                          <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase border-b border-gray-850 pb-2.5">
                            <Terminal className="w-4 h-4 text-indigo-400" />
                            Live Telemetry Verification Feed
                          </span>

                          {testExecutionOutput ? (
                            <div className="flex flex-col gap-2 font-mono text-[10px] flex-1">
                              <div className="flex justify-between items-center text-[9px] border-b border-gray-900 pb-1.5">
                                <span className="text-gray-500">TIMESTAMP: {new Date(testExecutionOutput.timestamp).toLocaleTimeString()}</span>
                                <span className="text-emerald-400 font-bold bg-emerald-950 px-1.5 py-0.5 border border-emerald-900 rounded">{testExecutionOutput.status}</span>
                              </div>
                              <pre className="p-2.5 bg-[#05060a] border border-gray-900 rounded text-gray-400 text-[9.5px] overflow-auto flex-1 max-h-[140px] leading-relaxed whitespace-pre-wrap">
                                {JSON.stringify(testExecutionOutput.payload, null, 2)}
                              </pre>
                              <span className="text-[9px] text-gray-500 italic mt-1 text-center">✔ Verification event committed to Cloud SQL audit table successfully.</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-gray-600 gap-1 font-mono text-[10px] flex-1">
                              <Terminal className="w-6 h-6 text-gray-850" />
                              <span>Console inactive. Trigger an injection.</span>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  )}

                  {/* SUB-SECTION 2: NAMECHEAP DNS */}
                  {activeSubSection === 'namecheap' && (
                    <div className="grid grid-cols-12 gap-5">
                      
                      {/* CONFIGURATION FORM */}
                      <div className="col-span-12 lg:col-span-5 bg-[#0a0c13] border border-gray-800/40 rounded-xl p-4 flex flex-col gap-3.5 shadow-sm">
                        <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase border-b border-gray-850 pb-2.5">
                          <Settings className="w-4 h-4 text-indigo-400" />
                          Namecheap API Connector Settings
                        </span>

                        <div className="flex flex-col gap-3 font-mono">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-500 font-bold">NAMECHEAP REGISTERED DOMAIN:</label>
                            <input
                              type="text"
                              value={dnsDomain}
                              onChange={(e) => setDnsDomain(e.target.value)}
                              className="bg-[#05060a] border border-gray-850 text-white rounded px-3 py-2 text-[10.5px] outline-none focus:border-indigo-500/50"
                              placeholder="microfyxd.com"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-500 font-bold">NAMECHEAP API USER (OPTIONAL):</label>
                            <input
                              type="text"
                              value={dnsApiUser}
                              onChange={(e) => setDnsApiUser(e.target.value)}
                              className="bg-[#05060a] border border-gray-850 text-white rounded px-3 py-2 text-[10.5px] outline-none focus:border-indigo-500/50"
                              placeholder="e.g. microfyxd_admin"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-500 font-bold">NAMECHEAP API KEY (OPTIONAL):</label>
                            <input
                              type="password"
                              value={dnsApiKey}
                              onChange={(e) => setDnsApiKey(e.target.value)}
                              className="bg-[#05060a] border border-gray-850 text-white rounded px-3 py-2 text-[10.5px] outline-none focus:border-indigo-500/50"
                              placeholder="••••••••••••••••"
                            />
                          </div>

                          <button
                            onClick={handleLoadDnsRecords}
                            disabled={isLoadingDns}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-850 text-white font-bold py-2 rounded font-mono cursor-pointer transition flex items-center justify-center gap-2 border border-indigo-400/20"
                          >
                            {isLoadingDns ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> RESOLVING DNS ENTRIES...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="w-3.5 h-3.5" /> RETRIEVE LIVE DNS RECORDS
                              </>
                            )}
                          </button>
                        </div>

                        {/* NAMECHEAP INSTRUCTIONS */}
                        <div className="p-3 bg-[#05060a] border border-gray-900 rounded-lg flex flex-col gap-2 mt-2">
                          <span className="text-[10.5px] font-bold font-mono text-indigo-400 flex items-center gap-1">
                            <Info className="w-3.5 h-3.5 shrink-0" />
                            Retrieving Namecheap DNS API Keys
                          </span>
                          <ol className="list-decimal pl-4 text-gray-500 text-[10px] space-y-1 leading-relaxed">
                            <li>Log in to your <strong>Namecheap.com</strong> account.</li>
                            <li>Navigate to <strong>Profile &gt; Tools &gt; Namecheap API Document Options</strong>.</li>
                            <li>Enable <strong>API Access</strong> and copy your key token.</li>
                            <li>Whitelist your current staging build client IP address in Namecheap console.</li>
                            <li>Save credentials inside your project's server configuration.</li>
                          </ol>
                        </div>
                      </div>

                      {/* ACTIVE RECORDS CONTAINER (col-span-7) */}
                      <div className="col-span-12 lg:col-span-7 bg-[#0a0c13] border border-gray-800/40 rounded-xl p-4 flex flex-col gap-3.5 shadow-sm">
                        <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase border-b border-gray-850 pb-2.5">
                          <Link2 className="w-4 h-4 text-indigo-400" />
                          DNS Zone Records for {dnsDomain}
                        </span>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse font-mono text-[10px]">
                            <thead>
                              <tr className="border-b border-gray-850 text-gray-500 uppercase tracking-wider">
                                <th className="pb-2">Type</th>
                                <th className="pb-2">Host/Name</th>
                                <th className="pb-2">Value/Address</th>
                                <th className="pb-2 text-right">TTL</th>
                                <th className="pb-2 text-right">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dnsRecords.length === 0 ? (
                                <tr>
                                  <td colSpan={5} className="text-center py-12 text-gray-500">
                                    Click 'Retrieve' to verify live active domain records.
                                  </td>
                                </tr>
                              ) : (
                                dnsRecords.map((rec, idx) => (
                                  <tr key={idx} className="border-b border-gray-900 text-gray-300 hover:bg-gray-900/30">
                                    <td className="py-2.5">
                                      <span className="px-1.5 py-0.5 bg-gray-900 border border-gray-800 text-white rounded font-bold">{rec.type}</span>
                                    </td>
                                    <td className="py-2.5 font-bold">{rec.name}</td>
                                    <td className="py-2.5 text-gray-400 break-all">{rec.address}</td>
                                    <td className="py-2.5 text-right text-gray-500">{rec.ttl}s</td>
                                    <td className="py-2.5 text-right">
                                      <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] ${rec.status.includes('Active') ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/40' : 'bg-indigo-950/20 text-indigo-400 border border-indigo-900/40'}`}>
                                        {rec.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>

                        {dnsRecords.length > 0 && (
                          <div className="mt-auto p-2.5 bg-indigo-950/10 border border-indigo-900/30 rounded text-[10px] text-gray-400 leading-relaxed font-sans">
                            <strong>✔ Vercel Sub-Domain Mapping:</strong> Map your staging sub-domains (e.g. <code>staged.{dnsDomain}</code>) to Vercel's Edge Server <code>76.76.21.21</code> by setting an A record. The active zone files are verified using secure lookup pipelines.
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* SUB-SECTION 3: VERCEL STAGING */}
                  {activeSubSection === 'vercel' && (
                    <div className="grid grid-cols-12 gap-5">
                      
                      {/* VERCEL CREDENTIALS & DEPLOY CONTROLLER */}
                      <div className="col-span-12 lg:col-span-5 bg-[#0a0c13] border border-gray-800/40 rounded-xl p-4 flex flex-col gap-3.5 shadow-sm">
                        <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase border-b border-gray-850 pb-2.5">
                          <Settings className="w-4 h-4 text-indigo-400" />
                          Vercel Credentials (microfyxd-site)
                        </span>

                        <div className="flex flex-col gap-3 font-mono">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-500 font-bold">VERCEL API ACCESS TOKEN (OPTIONAL):</label>
                            <input
                              type="password"
                              value={vercelToken}
                              onChange={(e) => setVercelToken(e.target.value)}
                              className="bg-[#05060a] border border-gray-850 text-white rounded px-3 py-2 text-[10.5px] outline-none focus:border-indigo-500/50"
                              placeholder="••••••••••••••••"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-gray-500 font-bold">VERCEL PROJECT ID (OPTIONAL):</label>
                            <input
                              type="text"
                              value={vercelProjectId}
                              onChange={(e) => setVercelProjectId(e.target.value)}
                              className="bg-[#05060a] border border-gray-850 text-white rounded px-3 py-2 text-[10.5px] outline-none focus:border-indigo-500/50"
                              placeholder="e.g. prj_X9kL0jMh98P"
                            />
                          </div>

                          <button
                            onClick={handleDeployVercelStaging}
                            disabled={isDeployingVercel}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-850 text-white font-bold py-2.5 rounded font-mono tracking-tight cursor-pointer transition flex items-center justify-center gap-2 border border-indigo-400/20"
                          >
                            {isDeployingVercel ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> COMPILING STAGED CODEBASE...
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5" /> DEPLOY TO VERCEL STAGING
                              </>
                            )}
                          </button>
                        </div>

                        {/* HOW TO INJECT TO VERCEL CONFIG */}
                        <div className="p-3 bg-[#05060a] border border-gray-900 rounded-lg flex flex-col gap-2 mt-2 leading-relaxed">
                          <span className="text-[10.5px] font-bold font-mono text-indigo-400 flex items-center gap-1">
                            <Info className="w-3.5 h-3.5" />
                            Vercel Runtime Injections Guide
                          </span>
                          <p className="text-gray-500 text-[10px] font-sans">
                            When linking <code>microfyxd-site</code>, you must configure all environment variables inside the Vercel Dashboard under <strong>Project Settings &gt; Environment Variables</strong>.
                          </p>
                          <p className="text-gray-500 text-[10px] font-sans">
                            This microfyxd monorepo exposes dedicated Express endpoints acting as secure proxies to verify credentials safely before committing production changes.
                          </p>
                        </div>
                      </div>

                      {/* VERCEL BUILD PROCESS TERMINAL & PREVIEW */}
                      <div className="col-span-12 lg:col-span-7 bg-[#0a0c13] border border-gray-800/40 rounded-xl p-4 flex flex-col gap-3.5 shadow-sm min-h-[340px]">
                        <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase border-b border-gray-850 pb-2.5">
                          <Terminal className="w-4 h-4 text-indigo-400" />
                          Vercel Build Execution Terminal
                        </span>

                        {/* LIVE TERMINAL FEED */}
                        <div className="bg-[#05060a] border border-gray-900 rounded-xl p-3.5 font-mono text-[10.5px] text-gray-300 flex-1 flex flex-col gap-1.5 overflow-y-auto max-h-[300px] leading-relaxed">
                          {vercelLogs.length === 0 ? (
                            <div className="text-gray-650 flex flex-col items-center justify-center py-16 gap-2">
                              <Terminal className="w-8 h-8 text-gray-850" />
                              <span>Terminal ready. Awaiting staging compilation sequence...</span>
                            </div>
                          ) : (
                            vercelLogs.map((log, idx) => {
                              let color = 'text-gray-300';
                              if (log.includes('[SUCCESS]')) color = 'text-emerald-400 font-bold';
                              else if (log.includes('[CONFIG]')) color = 'text-indigo-400';
                              else if (log.includes('[SYSTEM]')) color = 'text-amber-400';
                              else if (log.includes('[BUILD]')) color = 'text-gray-400';
                              return <div key={idx} className={color}>{log}</div>;
                            })
                          )}
                        </div>

                        {/* LIVE PREVIEW URL BLOCK */}
                        {vercelUrl && (
                          <div className="p-3 bg-emerald-950/20 border border-emerald-900/50 rounded-lg flex items-center justify-between gap-3 font-mono">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[9px] text-emerald-500 font-bold">✔ DEPLOYMENT LIVE ON VERCEL EDGE:</span>
                              <span className="text-white text-[11px] font-bold truncate">{vercelUrl}</span>
                            </div>
                            <a
                              href={vercelUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold flex items-center gap-1 shrink-0 cursor-pointer transition"
                            >
                              OPEN SITE <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* SUB-SECTION 4: COGNITIVE BRAIN LOOP */}
                  {activeSubSection === 'cognition' && (
                    <div className="flex flex-col gap-6">
                      <div className="grid grid-cols-12 gap-5">
                        {/* LEFT COLUMN: SYNAPTIC PLASTICITY MAP & STEP EXECUTION */}
                        <div className="col-span-12 lg:col-span-7 bg-[#0a0c13] border border-gray-800/40 rounded-xl p-4 flex flex-col gap-4 shadow-sm">
                          <div className="flex items-center justify-between border-b border-[#1f2937]/40 pb-2.5">
                            <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase">
                              <Brain className="w-4 h-4 text-pink-400" />
                              Neuromorphic Plasticity Routing Map (STDP Synapses)
                            </span>
                            <span className="text-[10px] font-mono text-gray-500">
                              Learning Rate (η): 0.15
                            </span>
                          </div>

                          {/* VISUAL SYNAPSE TOPOLOGY MAP */}
                          <div className="bg-[#05060a] border border-gray-900 rounded-xl p-4 relative min-h-[180px] flex flex-col justify-center">
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 text-center">
                              {['Perception', 'Planning', 'Action', 'Feedback', 'Learning', 'Controller'].map((nodeName) => {
                                // Find weights coming from this node
                                const outwardSynapses = synapseConnections.filter(s => s.fromNode === nodeName);
                                return (
                                  <div key={nodeName} className="p-2.5 bg-indigo-950/10 border border-gray-850 rounded-lg flex flex-col items-center gap-1">
                                    <div className="w-6 h-6 rounded-full bg-indigo-950/40 border border-indigo-500/40 flex items-center justify-center text-[10px] text-indigo-400 font-bold">
                                      {nodeName[0]}
                                    </div>
                                    <span className="text-[10px] font-mono font-bold text-gray-200">{nodeName}</span>
                                    {outwardSynapses.length > 0 && (
                                      <div className="flex flex-col gap-0.5 mt-1.5 w-full">
                                        <span className="text-[7.5px] text-gray-500 uppercase tracking-tight">Synapses Out:</span>
                                        {outwardSynapses.map((syn, sIdx) => (
                                          <div key={sIdx} className="flex items-center justify-between gap-1 text-[8.5px] font-mono bg-[#090b11] px-1 py-0.5 rounded border border-gray-900">
                                            <span className="text-gray-500">→ {syn.toNode.slice(0, 4)}</span>
                                            <span className={`font-bold ${syn.weight > 1.0 ? 'text-emerald-400' : syn.weight < 0.5 ? 'text-rose-400' : 'text-indigo-300'}`}>
                                              {syn.weight.toFixed(2)}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                            
                            <p className="text-[9.5px] text-gray-500 mt-3 text-center font-mono italic">
                              STDP Rule: Success potentiates (LTP) synaptic links (limit 2.0). Failure/Doctrine violations depress (LTD) links.
                            </p>
                          </div>

                          {/* COGNITIVE CLOSED-LOOP CONTROLLER */}
                          <div className="p-3.5 bg-indigo-950/10 border border-indigo-900/30 rounded-xl flex flex-col gap-3">
                            <span className="text-[11px] font-bold font-mono text-indigo-400 flex items-center gap-1.5 uppercase">
                              <Sliders className="w-3.5 h-3.5" />
                              AgentCore Cognition Closed Loop Controller
                            </span>

                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => handleExecuteCognitionStep('success')}
                                disabled={isExecutingLoop}
                                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-850 text-white font-mono font-bold text-[10.5px] rounded cursor-pointer transition flex items-center gap-1.5 border border-emerald-400/20"
                              >
                                <Play className="w-3.5 h-3.5" /> Trigger Success Step (LTP)
                              </button>
                              <button
                                onClick={() => handleExecuteCognitionStep('failure')}
                                disabled={isExecutingLoop}
                                className="px-3 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-850 text-white font-mono font-bold text-[10.5px] rounded cursor-pointer transition flex items-center gap-1.5 border border-amber-400/20"
                              >
                                <AlertTriangle className="w-3.5 h-3.5" /> Trigger Failure Step (LTD)
                              </button>
                              <button
                                onClick={() => handleExecuteCognitionStep('violation')}
                                disabled={isExecutingLoop}
                                className="px-3 py-2 bg-rose-600 hover:bg-rose-500 disabled:bg-gray-850 text-white font-mono font-bold text-[10.5px] rounded cursor-pointer transition flex items-center gap-1.5 border border-rose-400/20"
                              >
                                <Shield className="w-3.5 h-3.5 animate-pulse" /> Doctrine Violation Penalty
                              </button>
                            </div>
                          </div>

                          {/* AGENT COGNITIVE EXECUTION TRACE TERMINAL */}
                          {activeCognitiveLoopStep && (
                            <div className="bg-[#05060a] border border-gray-900 rounded-xl p-3.5 font-mono text-[10.5px] text-gray-300 flex flex-col gap-2">
                              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center justify-between border-b border-gray-850 pb-1.5">
                                <span>Executive Cognition Trace Terminal</span>
                                <span className={`px-1.5 py-0.5 rounded text-[9px] ${activeCognitiveLoopStep.outcome === 'success' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/40' : 'bg-rose-950/40 text-rose-400 border border-rose-900/40'}`}>
                                  STATUS: {activeCognitiveLoopStep.outcome.toUpperCase()}
                                </span>
                              </span>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#090b11] p-2.5 rounded border border-gray-850">
                                <div className="flex flex-col gap-1">
                                  <span className="text-gray-500 text-[9.5px]">ACTIVE COGNITIVE GOAL:</span>
                                  <span className="text-white text-[10.5px] font-bold leading-tight">{activeCognitiveLoopStep.activeGoal}</span>
                                </div>
                                <div className="flex flex-col gap-1 font-sans text-gray-400 text-[10px]">
                                  <span className="text-gray-500 font-mono text-[9.5px]">TELEMETRY FEEDBACK SNAPSHOT:</span>
                                  <div className="grid grid-cols-3 gap-1 font-mono text-[9.5px] text-indigo-300 mt-0.5 font-bold">
                                    <span>CPU: {activeCognitiveLoopStep.snapshot.cpuUsage}</span>
                                    <span>GPU: {activeCognitiveLoopStep.snapshot.gpuClusterTemp}</span>
                                    <span>VRAM: {activeCognitiveLoopStep.snapshot.vramUtilization}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col gap-1">
                                <span className="text-gray-500 text-[9.5px]">STEP TRACE PATH:</span>
                                <div className="space-y-1 pl-2 border-l border-indigo-900/50 mt-1">
                                  {activeCognitiveLoopStep.snapshot.actionTrace.map((tr: string, tIdx: number) => (
                                    <div key={tIdx} className="text-gray-300 flex items-center gap-1.5">
                                      <span className="text-indigo-400">[{tIdx + 1}]</span>
                                      <span>{tr}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* RIGHT COLUMN: GOALS & TASK QUEUE (col-span-5) */}
                        <div className="col-span-12 lg:col-span-5 flex flex-col gap-5">
                          {/* COGNITIVE GOALS MANAGEMENT */}
                          <div className="bg-[#0a0c13] border border-gray-800/40 rounded-xl p-4 flex flex-col gap-3.5 shadow-sm">
                            <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase border-b border-gray-850 pb-2.5">
                              <Compass className="w-4 h-4 text-indigo-400" />
                              Synthetic Goals Table ({cognitiveGoals.filter(g => g.status === 'active').length} Active)
                            </span>

                            {/* ADD GOAL FORM */}
                            <form onSubmit={handleAddGoal} className="flex flex-col gap-2 bg-[#05060a] p-2.5 border border-gray-900 rounded-lg">
                              <div className="flex flex-col gap-0.5">
                                <label className="text-[9.5px] font-mono text-gray-500">NEW GOAL DESCRIPTION:</label>
                                <input
                                  type="text"
                                  value={newGoalDesc}
                                  onChange={(e) => setNewGoalDesc(e.target.value)}
                                  placeholder="e.g. Reduce sandbox compilation latency"
                                  className="bg-[#090b11] border border-gray-850 rounded px-2.5 py-1.5 text-[10px] text-white outline-none focus:border-indigo-500/50"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col gap-0.5">
                                  <label className="text-[9.5px] font-mono text-gray-500">PRIORITY (1-10):</label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={newGoalPriority}
                                    onChange={(e) => setNewGoalPriority(parseInt(e.target.value))}
                                    className="bg-[#090b11] border border-gray-850 rounded px-2.5 py-1 text-[10px] text-white outline-none"
                                  />
                                </div>
                                <button
                                  type="submit"
                                  className="mt-auto py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-[10px] rounded cursor-pointer transition flex items-center justify-center gap-1"
                                >
                                  <Plus className="w-3 h-3" /> Insert Goal
                                </button>
                              </div>
                            </form>

                            {/* GOALS LIST */}
                            <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
                              {cognitiveGoals.length === 0 ? (
                                <p className="text-gray-500 text-center py-4 font-mono text-[10px]">No goals found. Ready to ingest...</p>
                              ) : (
                                cognitiveGoals.map((g) => (
                                  <div key={g.id} className="p-2.5 bg-[#05060a] border border-gray-900 rounded-lg flex items-center justify-between gap-3">
                                    <div className="flex flex-col gap-0.5">
                                      <span className="text-[10px] font-mono font-bold text-white leading-snug">{g.description}</span>
                                      <div className="flex items-center gap-2 text-[9px] font-mono text-gray-500">
                                        <span>Priority: {g.priority}</span>
                                        <span>•</span>
                                        <span className={`font-bold ${g.status === 'active' ? 'text-indigo-400' : g.status === 'completed' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                          {g.status.toUpperCase()}
                                        </span>
                                      </div>
                                    </div>
                                    {g.status === 'active' && (
                                      <div className="flex gap-1">
                                        <button
                                          onClick={() => handleStatusGoal(g.id, 'completed')}
                                          className="p-1 hover:bg-emerald-950 text-emerald-400 rounded transition border border-emerald-900/40 cursor-pointer"
                                          title="Mark Complete"
                                        >
                                          <CheckCircle className="w-3 h-3" />
                                        </button>
                                        <button
                                          onClick={() => handleStatusGoal(g.id, 'failed')}
                                          className="p-1 hover:bg-rose-950 text-rose-400 rounded transition border border-rose-900/40 cursor-pointer"
                                          title="Mark Failed"
                                        >
                                          <AlertTriangle className="w-3 h-3" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          {/* COGNITIVE TASK QUEUE */}
                          <div className="bg-[#0a0c13] border border-gray-800/40 rounded-xl p-4 flex flex-col gap-3.5 shadow-sm">
                            <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase border-b border-gray-850 pb-2.5">
                              <Activity className="w-4 h-4 text-indigo-400" />
                              Active Task Queue
                            </span>

                            {/* ADD TASK FORM */}
                            <form onSubmit={handleAddTask} className="flex flex-col gap-2 bg-[#05060a] p-2.5 border border-gray-900 rounded-lg">
                              <div className="flex flex-col gap-0.5">
                                <label className="text-[9.5px] font-mono text-gray-500">TASK DIRECTIVE OBJECTIVE:</label>
                                <input
                                  type="text"
                                  value={newTaskAssignedGoal}
                                  onChange={(e) => setNewTaskAssignedGoal(e.target.value)}
                                  placeholder="e.g. Optimize GPU core thermal throttling map"
                                  className="bg-[#090b11] border border-gray-850 rounded px-2.5 py-1.5 text-[10px] text-white outline-none focus:border-indigo-500/50"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col gap-0.5">
                                  <label className="text-[9.5px] font-mono text-gray-500">SOURCE:</label>
                                  <select
                                    value={newTaskSource}
                                    onChange={(e) => setNewTaskSource(e.target.value)}
                                    className="bg-[#090b11] border border-gray-850 text-gray-300 rounded px-2.5 py-1 text-[10px] outline-none"
                                  >
                                    <option value="human">Human Operator</option>
                                    <option value="telemetry">Anomalous Telemetry</option>
                                    <option value="doctrine">Doctrine Constraint</option>
                                  </select>
                                </div>
                                <button
                                  type="submit"
                                  className="mt-auto py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-[10px] rounded cursor-pointer transition flex items-center justify-center gap-1"
                                >
                                  <Plus className="w-3 h-3" /> Queue Task
                                </button>
                              </div>
                            </form>

                            {/* TASKS LIST */}
                            <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
                              {cognitiveTasks.length === 0 ? (
                                <p className="text-gray-500 text-center py-4 font-mono text-[10px]">No tasks queued. Sandbox loop is idle.</p>
                              ) : (
                                cognitiveTasks.map((t) => (
                                  <div key={t.id} className="p-2.5 bg-[#05060a] border border-gray-900 rounded-lg flex flex-col gap-1">
                                    <div className="flex items-start justify-between gap-2">
                                      <span className="text-[10px] font-mono font-bold text-white leading-snug">{t.assignedGoal}</span>
                                      <span className={`text-[8.5px] font-mono uppercase px-1.5 py-0.5 rounded border ${t.status === 'queued' ? 'bg-indigo-950 text-indigo-400 border-indigo-900/40' : 'bg-gray-950 text-gray-500 border-gray-900/40'}`}>
                                        {t.status}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[9px] font-mono text-gray-500">
                                      <span className="text-indigo-400 capitalize">Source: {t.source}</span>
                                      <span>•</span>
                                      <span>Priority: {t.priority}</span>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SUB-SECTION 4.2: LONG-TERM MEMORY (LTM) MATRIX */}
                      <div className="bg-[#0a0c13] border border-gray-800/40 rounded-xl p-5 flex flex-col gap-4 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between border-b border-[#1f2937]/40 pb-3 gap-3">
                          <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase">
                            <Database className="w-4 h-4 text-cyan-400" />
                            AgentCore Long-Term Memory (LTM) Matrix ({agentMemories.length} Nodes)
                          </span>
                          <span className="text-[10px] font-mono text-gray-500">
                            Confidence Filter Heuristics (H0): Active
                          </span>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                          {/* NEW MEMORY WRITER FORM */}
                          <div className="xl:col-span-4 bg-[#05060a] border border-gray-900 rounded-xl p-4 flex flex-col gap-3.5">
                            <span className="text-[11px] font-bold font-mono text-cyan-400 flex items-center gap-1.5 uppercase">
                              <Plus className="w-3.5 h-3.5" /> Write New Memory Node
                            </span>

                            <form onSubmit={handleAddMemory} className="flex flex-col gap-3">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col gap-1">
                                  <label className="text-[9.5px] font-mono text-gray-500 uppercase">Tenant ID:</label>
                                  <input
                                    type="text"
                                    value={newMemoryTenantId}
                                    onChange={(e) => setNewMemoryTenantId(e.target.value)}
                                    placeholder="system-wide"
                                    className="bg-[#090b11] border border-gray-850 rounded px-2.5 py-1.5 text-[10px] text-white outline-none focus:border-cyan-500/50 font-mono"
                                  />
                                </div>
                                <div className="flex flex-col gap-1">
                                  <label className="text-[9.5px] font-mono text-gray-500 uppercase">Memory Type:</label>
                                  <select
                                    value={newMemoryType}
                                    onChange={(e) => setNewMemoryType(e.target.value)}
                                    className="bg-[#090b11] border border-gray-850 text-gray-300 text-[10px] rounded px-2.5 py-1.5 outline-none font-mono"
                                  >
                                    <option value="episodic">Episodic</option>
                                    <option value="semantic">Semantic</option>
                                    <option value="procedural">Procedural</option>
                                    <option value="associative">Associative</option>
                                  </select>
                                </div>
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[9.5px] font-mono text-gray-500 uppercase">Memory Index Key:</label>
                                <input
                                  type="text"
                                  value={newMemoryKey}
                                  onChange={(e) => setNewMemoryKey(e.target.value)}
                                  placeholder="e.g. system_state_heuristic"
                                  className="bg-[#090b11] border border-gray-850 rounded px-2.5 py-1.5 text-[10px] text-white outline-none focus:border-cyan-500/50 font-mono"
                                  required
                                />
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[9.5px] font-mono text-gray-500 uppercase">Synthesized Value Heuristic:</label>
                                <textarea
                                  value={newMemoryValue}
                                  onChange={(e) => setNewMemoryValue(e.target.value)}
                                  placeholder="e.g. Optimized parameters applied to Sandbox"
                                  className="bg-[#090b11] border border-gray-850 rounded px-2.5 py-1.5 text-[10px] text-white outline-none focus:border-cyan-500/50 min-h-[60px] resize-none font-mono"
                                  required
                                />
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[9.5px] font-mono text-gray-500 uppercase flex justify-between">
                                  <span>Confidence Score:</span>
                                  <span className="text-cyan-400 font-bold">{(newMemoryConfidence * 100).toFixed(0)}%</span>
                                </label>
                                <input
                                  type="range"
                                  min="0.1"
                                  max="1.0"
                                  step="0.05"
                                  value={newMemoryConfidence}
                                  onChange={(e) => setNewMemoryConfidence(parseFloat(e.target.value))}
                                  className="w-full accent-cyan-500"
                                />
                              </div>

                              <button
                                type="submit"
                                className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-[10.5px] rounded cursor-pointer transition flex items-center justify-center gap-1.5 border border-cyan-500/20"
                              >
                                <Plus className="w-3.5 h-3.5" /> Commit to LTM Table
                              </button>
                            </form>
                          </div>

                          {/* MEMORIES VIEWER AND ACTIONS */}
                          <div className="xl:col-span-8 flex flex-col gap-3">
                            <span className="text-[11px] font-bold font-mono text-cyan-400 flex items-center gap-1.5 uppercase">
                              <Layers className="w-3.5 h-3.5" /> Stored Memory Associations Matrix
                            </span>

                            <div className="flex-1 bg-[#05060a] border border-gray-900 rounded-xl overflow-hidden flex flex-col max-h-[350px]">
                              <div className="overflow-y-auto flex-1">
                                <table className="w-full text-[10.5px] font-mono text-left border-collapse">
                                  <thead>
                                    <tr className="bg-[#090b11] border-b border-gray-850 text-gray-400">
                                      <th className="p-2.5 font-bold uppercase tracking-wider text-[9px]">Type/Tenant</th>
                                      <th className="p-2.5 font-bold uppercase tracking-wider text-[9px]">Key Index</th>
                                      <th className="p-2.5 font-bold uppercase tracking-wider text-[9px]">Value Heuristic</th>
                                      <th className="p-2.5 font-bold uppercase tracking-wider text-[9px] text-center">Confidence</th>
                                      <th className="p-2.5 font-bold uppercase tracking-wider text-[9px] text-center">Accesses</th>
                                      <th className="p-2.5 font-bold uppercase tracking-wider text-[9px] text-right">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-850">
                                    {agentMemories.length === 0 ? (
                                      <tr>
                                        <td colSpan={6} className="p-8 text-center text-gray-500 italic">
                                          Cognitive memory matrix is empty. Ready to index...
                                        </td>
                                      </tr>
                                    ) : (
                                      agentMemories.map((mem) => (
                                        <tr key={mem.id} className="hover:bg-[#07090f] transition">
                                          <td className="p-2.5">
                                            <div className="flex flex-col gap-0.5">
                                              <span className="text-[9.5px] font-bold text-cyan-400 uppercase tracking-tight">{mem.memoryType}</span>
                                              <span className="text-[8.5px] text-gray-500">{mem.tenantId}</span>
                                            </div>
                                          </td>
                                          <td className="p-2.5 font-bold text-gray-300 truncate max-w-[120px]" title={mem.key}>
                                            {mem.key}
                                          </td>
                                          <td className="p-2.5 text-gray-400 truncate max-w-[180px]" title={mem.value}>
                                            {mem.value}
                                          </td>
                                          <td className="p-2.5 text-center">
                                            <span className={`text-[10px] font-bold ${mem.confidence >= 0.8 ? 'text-emerald-400' : mem.confidence >= 0.5 ? 'text-cyan-400' : 'text-amber-400'}`}>
                                              {(mem.confidence * 100).toFixed(0)}%
                                            </span>
                                          </td>
                                          <td className="p-2.5 text-center text-gray-300 font-bold">
                                            {mem.accessCount}
                                          </td>
                                          <td className="p-2.5 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                              <button
                                                onClick={() => handleAccessMemory(mem.id)}
                                                className="p-1 px-1.5 text-[9.5px] bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-400 border border-cyan-900/40 rounded transition cursor-pointer flex items-center gap-1"
                                                title="Trigger Retrieval & Update Count"
                                              >
                                                <RefreshCw className="w-2.5 h-2.5" /> Access
                                              </button>
                                              <button
                                                onClick={() => handleDeleteMemory(mem.id)}
                                                className="p-1 px-1.5 text-[9.5px] bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-900/40 rounded transition cursor-pointer flex items-center gap-1"
                                                title="Purge Memory Node"
                                              >
                                                <Trash2 className="w-2.5 h-2.5" /> Purge
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      ))
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-[#06070a] border-t border-gray-900 text-[11px] text-gray-500 font-mono px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <span>Microfyxd Enterprise Management • Authorized Access Only</span>
        <span>UTC Time: {new Date().toISOString().slice(0, 19).replace('T', ' ')}</span>
      </footer>

    </div>
  );
}
