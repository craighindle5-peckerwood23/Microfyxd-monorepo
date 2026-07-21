import React, { useState, useEffect, useRef } from 'react';
import { Database, Plus, Search, Trash2, Zap, RefreshCw, Cpu, Brain, Tag, Sparkles, Activity, Eye, ShieldAlert, BarChart2 } from 'lucide-react';

export interface MemoryNode {
  id: string;
  category: 'episodic' | 'semantic' | 'working' | 'procedural' | 'system';
  summary: string;
  importance: number; // 1 - 10
  accessCount: number;
  decayRate: number; // 0 - 1
  tags: string[];
  createdAt: string;
  associatedIds?: string[];
  embeddingVector?: number[];
}

interface MemoryVisualizerProps {
  memories: MemoryNode[];
  onAddMemory: (category: string, summary: string, importance: number, tags: string[]) => Promise<void>;
  onDeleteMemory: (id: string) => Promise<void>;
  onAccessMemory: (id: string) => Promise<void>;
  theme?: 'dark' | 'light';
}

export const MemoryVisualizer: React.FC<MemoryVisualizerProps> = ({
  memories,
  onAddMemory,
  onDeleteMemory,
  onAccessMemory,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedMemory, setSelectedMemory] = useState<MemoryNode | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isConsolidating, setIsConsolidating] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Memory Form
  const [newSummary, setNewSummary] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'episodic' | 'semantic' | 'working' | 'procedural' | 'system'>('semantic');
  const [newImportance, setNewImportance] = useState<number>(7);
  const [newTagsStr, setNewTagsStr] = useState<string>('ai, context, cognition');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Filtered memory list
  const filteredMemories = memories.filter(m => {
    const matchesCat = filterCategory === 'all' || m.category === filterCategory;
    const matchesQuery = searchQuery === '' || 
      m.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  // Default selection if none selected
  useEffect(() => {
    if (filteredMemories.length > 0 && !selectedMemory) {
      setSelectedMemory(filteredMemories[0]);
    }
  }, [filteredMemories, selectedMemory]);

  // Canvas interactive Memory Graph rendering
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 340;
    canvas.width = width * (window.devicePixelRatio || 1);
    canvas.height = height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    // Compute positions for memory nodes on canvas
    const nodes = filteredMemories.map((m, idx) => {
      const angle = (idx / Math.max(1, filteredMemories.length)) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.32;
      const cx = width / 2 + Math.cos(angle) * radius;
      const cy = height / 2 + Math.sin(angle) * radius * 0.75;
      return {
        ...m,
        x: cx,
        y: cy,
        size: 8 + (m.importance || 5) * 1.5
      };
    });

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Draw background grid lines
      ctx.strokeStyle = isLight ? 'rgba(226, 232, 240, 0.6)' : 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw connections between nodes
      ctx.lineWidth = 1.2;
      nodes.forEach((n1, i) => {
        nodes.forEach((n2, j) => {
          if (i < j) {
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 260) {
              const alpha = (1 - dist / 260) * 0.35;
              ctx.strokeStyle = isLight ? `rgba(99, 102, 241, ${alpha})` : `rgba(6, 182, 212, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(n1.x, n1.y);
              ctx.lineTo(n2.x, n2.y);
              ctx.stroke();

              // Animated synapse particle moving along connection
              if (isConsolidating) {
                const particleProgress = (time * 1.5 + i + j) % 1;
                const px = n1.x + dx * particleProgress;
                const py = n1.y + dy * particleProgress;
                ctx.fillStyle = '#a855f7';
                ctx.beginPath();
                ctx.arc(px, py, 3, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }
        });
      });

      // Draw Memory Nodes
      nodes.forEach(node => {
        const isSelected = selectedMemory?.id === node.id;
        const pulse = Math.sin(time * 3 + node.x) * 2;

        // Node Glow
        if (isSelected) {
          ctx.fillStyle = isLight ? 'rgba(79, 70, 229, 0.25)' : 'rgba(6, 182, 212, 0.3)';
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size + 12 + pulse, 0, Math.PI * 2);
          ctx.fill();
        }

        // Category color
        let nodeColor = '#3b82f6';
        if (node.category === 'episodic') nodeColor = '#8b5cf6';
        else if (node.category === 'semantic') nodeColor = '#06b6d4';
        else if (node.category === 'working') nodeColor = '#f59e0b';
        else if (node.category === 'procedural') nodeColor = '#10b981';
        else if (node.category === 'system') nodeColor = '#ec4899';

        ctx.fillStyle = nodeColor;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = isSelected ? '#ffffff' : (isLight ? '#ffffff' : '#0f172a');
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label
        ctx.fillStyle = isLight ? '#1e293b' : '#f8fafc';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        const labelStr = node.summary.length > 18 ? node.summary.substring(0, 16) + '...' : node.summary;
        ctx.fillText(labelStr, node.x, node.y + node.size + 14);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    // Canvas click detection
    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      for (const node of nodes) {
        const dx = clickX - node.x;
        const dy = clickY - node.y;
        if (Math.sqrt(dx * dx + dy * dy) <= node.size + 6) {
          setSelectedMemory(node);
          break;
        }
      }
    };

    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [filteredMemories, selectedMemory, isConsolidating, theme]);

  const handleConsolidate = () => {
    setIsConsolidating(true);
    setTimeout(() => {
      setIsConsolidating(false);
    }, 2800);
  };

  const handleSubmitNewMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSummary.trim()) return;
    setIsSubmitting(true);
    try {
      const tags = newTagsStr.split(',').map(t => t.trim()).filter(Boolean);
      await onAddMemory(newCategory, newSummary, newImportance, tags);
      setNewSummary('');
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Header & Metrics Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            <Brain className="w-5 h-5 text-indigo-500" />
            ASSOCIATIVE COGNITIVE MEMORY MATRIX (HAM)
          </h3>
          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
            Interactive vector space representation of episodic, semantic, working, and system memories.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleConsolidate}
            disabled={isConsolidating}
            className={`px-3.5 py-2 rounded-lg font-mono text-xs font-semibold flex items-center gap-2 border transition cursor-pointer ${
              isConsolidating
                ? 'bg-purple-600/20 text-purple-400 border-purple-500/40 animate-pulse'
                : isLight
                  ? 'bg-white hover:bg-slate-50 text-indigo-600 border-indigo-200 shadow-sm'
                  : 'bg-gray-900 hover:bg-gray-800 text-cyan-400 border-cyan-500/30'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isConsolidating ? 'animate-spin' : ''}`} />
            {isConsolidating ? 'CONSOLIDATING VECTOR MATRIX...' : 'RUN CONSOLIDATION'}
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold rounded-lg flex items-center gap-2 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            NEW MEMORY NODE
          </button>
        </div>
      </div>

      {/* Memory Stats Metric Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#0a0c13] border-gray-850'
        }`}>
          <span className={`text-[10.5px] font-mono font-semibold ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
            TOTAL MEMORY NODES
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-xl font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {memories.length}
            </span>
            <span className="text-[10px] text-emerald-500 font-mono">100% ONLINE</span>
          </div>
        </div>

        <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#0a0c13] border-gray-850'
        }`}>
          <span className={`text-[10.5px] font-mono font-semibold ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
            MATRIX CAPACITY
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-xl font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
              78.4%
            </span>
            <span className="text-[10px] text-indigo-500 font-mono">1,024 KB ALLOCATED</span>
          </div>
        </div>

        <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#0a0c13] border-gray-850'
        }`}>
          <span className={`text-[10.5px] font-mono font-semibold ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
            AVERAGE IMPORTANCE
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-xl font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {(memories.reduce((acc, m) => acc + (m.importance || 5), 0) / Math.max(1, memories.length)).toFixed(1)} / 10
            </span>
          </div>
        </div>

        <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#0a0c13] border-gray-850'
        }`}>
          <span className={`text-[10.5px] font-mono font-semibold ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
            COGNITIVE DENSITY
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold font-mono text-cyan-500">
              0.942
            </span>
            <span className="text-[10px] text-gray-400 font-mono">COSINE SIMILARITY</span>
          </div>
        </div>
      </div>

      {/* Main Memory Split View: Interactive Graph + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Interactive Graph & Search Filters (8 cols) */}
        <div className={`lg:col-span-8 rounded-2xl border p-4 flex flex-col gap-4 relative overflow-hidden ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0a0c13] border-gray-850'
        }`}>
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-64">
              <Search className={`w-3.5 h-3.5 absolute left-3 top-2.5 ${isLight ? 'text-slate-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search memories or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-8 pr-3 py-1.5 rounded-lg font-mono text-xs outline-none border transition ${
                  isLight 
                    ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500' 
                    : 'bg-[#05060a] border-gray-800 text-white focus:border-cyan-500'
                }`}
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {['all', 'episodic', 'semantic', 'working', 'procedural', 'system'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 rounded-md text-[10.5px] font-mono capitalize transition cursor-pointer shrink-0 ${
                    filterCategory === cat
                      ? 'bg-indigo-600 text-white font-bold'
                      : isLight
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-gray-900 text-gray-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Graph Canvas */}
          <div 
            ref={containerRef} 
            className={`w-full h-[360px] rounded-xl relative border overflow-hidden cursor-crosshair ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#05060b] border-gray-850'
            }`}
          >
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

            <div className="absolute top-3 left-3 z-10 pointer-events-none">
              <span className={`text-[10px] font-mono font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-cyan-400'}`}>
                <Activity className="w-3 h-3 text-indigo-500 animate-pulse" />
                ASSOCIATION GRAPH MAP ({filteredMemories.length} VISIBLE)
              </span>
              <span className="text-[8.5px] font-mono text-gray-500 block">CLICK A NODE TO INSPECT VECTOR DATA</span>
            </div>
          </div>

          {/* Category Color Legend */}
          <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 pt-1 border-t border-gray-850/60">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Episodic</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Semantic</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Working</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Procedural</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> System</span>
          </div>
        </div>

        {/* Right Column: Selected Memory Inspector Drawer (4 cols) */}
        <div className={`lg:col-span-4 rounded-2xl border p-4 flex flex-col justify-between gap-4 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0a0c13] border-gray-850'
        }`}>
          {selectedMemory ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b pb-3 border-gray-850">
                <span className="text-xs font-mono font-bold uppercase text-indigo-400 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  MEMORY INSPECTOR
                </span>
                <span className={`px-2 py-0.5 rounded text-[9.5px] font-mono uppercase font-bold ${
                  selectedMemory.category === 'episodic' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                  selectedMemory.category === 'semantic' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                  selectedMemory.category === 'working' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {selectedMemory.category}
                </span>
              </div>

              {/* Memory Summary Card */}
              <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#05060a] border-gray-850'}`}>
                <span className="text-[10px] font-mono text-gray-500 block mb-1">SUMMARY / CONTENT</span>
                <p className={`text-xs font-semibold leading-relaxed ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {selectedMemory.summary}
                </p>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className={`p-2.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#05060a] border-gray-850'}`}>
                  <span className="text-[9.5px] text-gray-500 block">IMPORTANCE</span>
                  <span className="font-bold text-indigo-400">{selectedMemory.importance || 5} / 10</span>
                </div>
                <div className={`p-2.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#05060a] border-gray-850'}`}>
                  <span className="text-[9.5px] text-gray-500 block">ACCESS COUNT</span>
                  <span className="font-bold text-emerald-400">{selectedMemory.accessCount || 1} hits</span>
                </div>
                <div className={`p-2.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#05060a] border-gray-850'}`}>
                  <span className="text-[9.5px] text-gray-500 block">DECAY FACTOR</span>
                  <span className="font-bold text-amber-400">{(selectedMemory.decayRate || 0.05).toFixed(3)}</span>
                </div>
                <div className={`p-2.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#05060a] border-gray-850'}`}>
                  <span className="text-[9.5px] text-gray-500 block">NODE ID</span>
                  <span className="font-bold text-gray-400 truncate block">{selectedMemory.id}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-indigo-400" /> ASSOCIATED TAGS
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMemory.tags && selectedMemory.tags.length > 0 ? (
                    selectedMemory.tags.map((t, idx) => (
                      <span key={idx} className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                        isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-gray-900 border-gray-800 text-gray-300'
                      }`}>
                        #{t}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-gray-500 italic">No tags attached</span>
                  )}
                </div>
              </div>

              {/* Embedding Vector Mock Preview */}
              <div className={`p-3 rounded-xl border flex flex-col gap-1 font-mono text-[9.5px] ${
                isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-[#05060a] border-gray-850 text-gray-400'
              }`}>
                <span className="text-gray-500 font-bold block">EMBEDDING VECTOR PREVIEW (1536-D)</span>
                <span className="text-cyan-500 truncate">
                  [0.0821, -0.4192, 0.8812, 0.1044, -0.0021, 0.3812, ...]
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => onAccessMemory(selectedMemory.id)}
                  className="flex-1 py-2 bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 text-indigo-400 font-mono text-xs font-bold rounded-lg cursor-pointer transition flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" /> STIMULATE NODE
                </button>
                <button
                  onClick={() => onDeleteMemory(selectedMemory.id)}
                  className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg cursor-pointer transition"
                  title="Evict Memory Node"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-center p-6">
              <Brain className="w-10 h-10 text-gray-600 mb-2 animate-bounce" />
              <p className={`text-xs font-mono font-bold ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
                NO MEMORY NODE SELECTED
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                Click any node on the association graph map to inspect vector parameters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add New Memory */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl border p-6 flex flex-col gap-5 ${
            isLight ? 'bg-white border-slate-200 shadow-2xl' : 'bg-[#0f111a] border-gray-800 text-white'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-gray-850">
              <h4 className="text-sm font-bold font-mono text-indigo-400 flex items-center gap-2">
                <Plus className="w-4 h-4" /> INJECT NEW MEMORY NODE
              </h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white font-mono text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNewMemory} className="flex flex-col gap-4 font-mono text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-gray-400">Memory Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className={`p-2 rounded.lg border outline-none ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-[#05060a] border-gray-800 text-white'
                  }`}
                >
                  <option value="episodic">Episodic (Operational History)</option>
                  <option value="semantic">Semantic (Factual Concept)</option>
                  <option value="working">Working Memory (Active State)</option>
                  <option value="procedural">Procedural (Execution Rules)</option>
                  <option value="system">System (Core Instruction)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-gray-400">Memory Summary / Content</label>
                <textarea
                  required
                  rows={3}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="e.g., ECU boost pressure set to 22 PSI for vehicle diagnostic profile"
                  className={`p-2.5 rounded-lg border outline-none ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-[#05060a] border-gray-800 text-white'
                  }`}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-gray-400">Importance Score (1 - 10): {newImportance}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newImportance}
                  onChange={(e) => setNewImportance(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-gray-400">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newTagsStr}
                  onChange={(e) => setNewTagsStr(e.target.value)}
                  placeholder="ecu, telemetry, tuning"
                  className={`p-2 rounded-lg border outline-none ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-[#05060a] border-gray-800 text-white'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-850">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-gray-400 hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Injecting...' : 'Commit Node'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
