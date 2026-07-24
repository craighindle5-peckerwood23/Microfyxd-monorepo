import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Bot, 
  User as UserIcon, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle, 
  Layers, 
  Cpu, 
  Brain, 
  Terminal, 
  ChevronRight, 
  ChevronDown, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Zap, 
  Activity, 
  Check, 
  X, 
  Search,
  Lock,
  Unlock,
  Sliders,
  Sparkles
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  provider?: string;
  statusChip?: 'Planning' | 'Executing' | 'Waiting for Approval' | 'Self-Healed' | 'Done' | 'Error';
  approvalRequired?: {
    actionType: string;
    description: string;
    target: string;
    status: 'pending' | 'approved' | 'rejected';
  };
  intentPreview?: {
    goal: string;
    subtasks: string[];
    confidence: number;
  };
}

export interface ChatCommandCenterProps {
  onRunLangGraph: (prompt: string) => Promise<any>;
  isRunning: boolean;
  traces: any[];
  metrics: any;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  onAutoHeal?: () => void;
  diagnosticState?: string;
  currentUser?: any;
  onNavigateTab?: (tab: string) => void;
}

export function ChatCommandCenter({
  onRunLangGraph,
  isRunning,
  traces,
  metrics,
  messages,
  setMessages,
  onAutoHeal,
  currentUser,
  onNavigateTab
}: ChatCommandCenterProps) {
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [autonomyMode, setAutonomyMode] = useState<'autonomous' | 'approval_required'>('approval_required');
  const [showInspector, setShowInspector] = useState<boolean>(false);
  const [activeInspectorTab, setActiveInspectorTab] = useState<'plan' | 'traces' | 'metrics'>('plan');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isRunning]);

  const handleSend = async (customPrompt?: string) => {
    const promptToSubmit = customPrompt || inputPrompt;
    if (!promptToSubmit.trim() || isRunning) return;

    const userMsgId = 'msg-' + Date.now();
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: promptToSubmit,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, newUserMsg]);
    if (!customPrompt) setInputPrompt('');

    const lower = promptToSubmit.toLowerCase();
    const isRisky = lower.includes('deploy') || lower.includes('delete') || lower.includes('reroute') || lower.includes('config');

    if (autonomyMode === 'approval_required' && isRisky) {
      const approvalMsg: ChatMessage = {
        id: 'msg-app-' + Date.now(),
        role: 'assistant',
        content: `I've analyzed your request: "${promptToSubmit}". This action requires infrastructure mutation approval. Please confirm below.`,
        timestamp: new Date().toLocaleTimeString(),
        statusChip: 'Waiting for Approval',
        intentPreview: {
          goal: promptToSubmit,
          subtasks: [
            'Validate safety gates & token permissions',
            'Stage parameters in sandbox node',
            'Apply configuration change',
            'Verify node health & telemetry'
          ],
          confidence: 0.95
        },
        approvalRequired: {
          actionType: 'Infrastructure Action',
          description: `Execute request: "${promptToSubmit}"`,
          target: 'Microfyxd LangGraph Core',
          status: 'pending'
        }
      };

      setMessages(prev => [...prev, approvalMsg]);
      return;
    }

    executeGraph(promptToSubmit);
  };

  const executeGraph = async (promptText: string) => {
    try {
      await onRunLangGraph(promptText);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'msg-err-' + Date.now(),
        role: 'assistant',
        content: `Execution error encountered: ${err.message || 'Unknown error'}. Auto-healing system initiated.`,
        timestamp: new Date().toLocaleTimeString(),
        statusChip: 'Error'
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const handleApproveAction = (msgId: string, goal: string) => {
    setMessages(prev =>
      prev.map(m => {
        if (m.id === msgId && m.approvalRequired) {
          return {
            ...m,
            statusChip: 'Executing',
            approvalRequired: { ...m.approvalRequired, status: 'approved' }
          };
        }
        return m;
      })
    );
    executeGraph(goal);
  };

  const handleRejectAction = (msgId: string) => {
    setMessages(prev =>
      prev.map(m => {
        if (m.id === msgId && m.approvalRequired) {
          return {
            ...m,
            statusChip: 'Done',
            approvalRequired: { ...m.approvalRequired, status: 'rejected' },
            content: m.content + '\n\n*(Action rejected by operator)*'
          };
        }
        return m;
      })
    );
  };

  const toggleSpeechRecognition = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputPrompt(transcript);
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleSpeak = (text: string, id: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (speakingMsgId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#`-]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(id);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col h-full flex-1 w-full min-h-0 bg-slate-900/90 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      
      {/* HEADER */}
      <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-tight">
                Operator Chat Command Center
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full font-bold">
                LangGraph v0.2
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Conversational command interface for agent orchestration
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <button
            onClick={() => setAutonomyMode(prev => prev === 'autonomous' ? 'approval_required' : 'autonomous')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
              autonomyMode === 'autonomous'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30 font-bold'
            }`}
            title="Toggle Autonomy Approval Gate"
          >
            {autonomyMode === 'autonomous' ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{autonomyMode === 'autonomous' ? 'Full Autonomy' : 'Approval Gate'}</span>
          </button>

          {/* Inspector Toggle */}
          <button
            onClick={() => setShowInspector(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
              showInspector
                ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Telemetry</span>
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        
        {/* MESSAGES THREAD */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-slate-950/40">
          
          {/* Quick Presets */}
          <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto text-xs shrink-0 scrollbar-none">
            <span className="text-slate-500 font-mono text-[11px] font-bold shrink-0">Quick Prompts:</span>
            {[
              { label: 'Scrape HVAC Permits', prompt: 'Scrape HVAC permits across Los Angeles county, verify contacts, and store in vault.' },
              { label: 'Run Diagnostic & Self-Heal', prompt: 'Run complete system diagnostic, check graph node health, and self-heal errors.' },
              { label: 'Rebalance GPU VRAM', prompt: 'Optimize GPU H100 SXM5 allocation and rebalance VRAM registers.' },
              { label: 'Sync Workspace Data', prompt: 'Sync recent Gmail threads, Google Drive files, and Cloud SQL logs.' }
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(preset.prompt)}
                disabled={isRunning}
                className="px-2.5 py-1 bg-slate-800/80 hover:bg-indigo-600/30 hover:border-indigo-500/40 border border-slate-700/60 rounded-lg text-slate-300 transition-all text-[11px] font-mono shrink-0 cursor-pointer disabled:opacity-50"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 min-h-0">
            {messages.map((msg, index) => (
              <div
                key={msg.id || `msg-${index}`}
                className={`flex gap-3 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.role === 'user' 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                    : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                }`}>
                  {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className="space-y-2 max-w-xl">
                  <div className={`flex items-center gap-2 text-[11px] font-mono text-slate-400 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    <span className="font-bold text-slate-300">
                      {msg.role === 'user' ? 'Operator' : 'Microfyxd Agent'}
                    </span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                    {msg.statusChip && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {msg.statusChip}
                      </span>
                    )}
                  </div>

                  <div className={`p-4 rounded-2xl text-xs leading-relaxed shadow-lg font-sans ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-tr-none' 
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}>
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {/* Intent Preview Card */}
                    {msg.intentPreview && (
                      <div className="mt-3 p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                        <div className="flex items-center justify-between font-mono font-bold text-cyan-400 text-[11px]">
                          <span className="flex items-center gap-1.5">
                            <Brain className="w-3.5 h-3.5" /> Parsed Plan Steps
                          </span>
                          <span>Confidence: {(msg.intentPreview.confidence * 100).toFixed(0)}%</span>
                        </div>
                        <ul className="space-y-1 text-[11px] text-slate-300 pl-2 border-l-2 border-cyan-500/40">
                          {msg.intentPreview.subtasks.map((task, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <ChevronRight className="w-3 h-3 text-cyan-400 shrink-0" />
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Approval Card */}
                    {msg.approvalRequired && (
                      <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                        <div className="flex items-center gap-2 text-amber-400 font-bold text-[11px]">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>Action Approval Required</span>
                        </div>
                        {msg.approvalRequired.status === 'pending' ? (
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => handleApproveAction(msg.id, msg.intentPreview?.goal || msg.content)}
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-all flex items-center gap-1 text-[11px] cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectAction(msg.id)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg transition-all flex items-center gap-1 text-[11px] cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Approved & Executed
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <button
                        onClick={() => handleSpeak(msg.content, msg.id)}
                        className="hover:text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {speakingMsgId === msg.id ? <VolumeX className="w-3 h-3 text-cyan-400" /> : <Volume2 className="w-3 h-3" />}
                        {speakingMsgId === msg.id ? 'Stop Voice' : 'Vocalize'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isRunning && (
              <div className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-indigo-300 font-mono animate-pulse max-w-xl">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-400 shrink-0" />
                <span>Orchestrating LangGraph nodes & processing task instructions...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* INPUT FORM */}
          <div className="p-3 sm:p-4 bg-slate-950/90 border-t border-slate-800 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isListening
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
                title="Voice Dictation"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                ref={inputRef}
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Enter command or goal (e.g., Scrape permits, run self-repair, sync database)..."
                disabled={isRunning}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-sans"
              />

              <button
                type="submit"
                disabled={isRunning || !inputPrompt.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 fill-current" />
                <span>Execute</span>
              </button>
            </form>
          </div>
        </div>

        {/* TELEMETRY INSPECTOR (TOGGLEABLE) */}
        {showInspector && (
          <div className="w-80 bg-slate-950 border-l border-slate-800 flex flex-col shrink-0">
            <div className="flex items-center border-b border-slate-800 bg-slate-900 text-xs font-mono">
              <button
                onClick={() => setActiveInspectorTab('plan')}
                className={`flex-1 py-2.5 font-bold transition-colors ${activeInspectorTab === 'plan' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-slate-950' : 'text-slate-400'}`}
              >
                Plan
              </button>
              <button
                onClick={() => setActiveInspectorTab('traces')}
                className={`flex-1 py-2.5 font-bold transition-colors ${activeInspectorTab === 'traces' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-slate-950' : 'text-slate-400'}`}
              >
                Traces ({traces.length})
              </button>
              <button
                onClick={() => setActiveInspectorTab('metrics')}
                className={`flex-1 py-2.5 font-bold transition-colors ${activeInspectorTab === 'metrics' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-slate-950' : 'text-slate-400'}`}
              >
                Metrics
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs font-mono">
              {activeInspectorTab === 'plan' && (
                <div className="space-y-3">
                  <span className="text-slate-400 font-bold text-[11px]">Execution Status</span>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-indigo-300 text-[11px]">
                      <span>LangGraph Pipeline</span>
                      <span className="text-emerald-400 font-bold">ACTIVE</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full w-[85%]" />
                    </div>
                  </div>
                </div>
              )}

              {activeInspectorTab === 'traces' && (
                <div className="space-y-2">
                  {traces.slice(-5).map((tr, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px]">
                      <div className="flex items-center justify-between text-indigo-400 font-bold">
                        <span>{tr.nodeId}</span>
                        <span className="text-[10px] text-slate-500">{tr.timestamp}</span>
                      </div>
                      <p className="text-slate-400 text-[10px] mt-1">{tr.label}</p>
                    </div>
                  ))}
                  {traces.length === 0 && (
                    <div className="text-slate-500 text-center py-6 font-sans text-xs">
                      No trace nodes recorded yet.
                    </div>
                  )}
                </div>
              )}

              {activeInspectorTab === 'metrics' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                      <span className="text-[10px] text-slate-500 block">CPU</span>
                      <span className="font-bold text-white">{metrics?.cpu || 15}%</span>
                    </div>
                    <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                      <span className="text-[10px] text-slate-500 block">RAM</span>
                      <span className="font-bold text-white">{metrics?.ram || 28}%</span>
                    </div>
                  </div>
                  {onAutoHeal && (
                    <button
                      onClick={onAutoHeal}
                      className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl font-bold transition-all text-xs cursor-pointer"
                    >
                      Trigger Auto-Heal
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
