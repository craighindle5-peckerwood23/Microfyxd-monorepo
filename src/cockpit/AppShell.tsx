import React, { useEffect, useState } from 'react';
import { SideNav } from './SideNav';
import { TopBar } from './TopBar';
import { MainContent } from './MainContent';
import { Footer } from './Footer';
import { CommandPalette } from './CommandPalette';

interface AppShellProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  metrics: any;
  currentUser: any;
  runLangGraphFlow: (promptToRun?: string) => Promise<void>;
  runAutoHealing: () => void;
  isRunning: boolean;
  traces: any[];
  messages: any[];
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  diagnosticState: any;
  agentMemories: any[];
  handleAddMemoryNode: (memory: any) => void;
  handleDeleteMemoryNode: (id: string) => void;
  handleAccessMemoryNode: (id: string) => void;
  coherence: number;
  setCoherence: React.Dispatch<React.SetStateAction<number>>;
}

export const AppShell: React.FC<AppShellProps> = ({
  theme,
  toggleTheme,
  activeTab,
  setActiveTab,
  metrics,
  currentUser,
  runLangGraphFlow,
  runAutoHealing,
  isRunning,
  traces,
  messages,
  setMessages,
  diagnosticState,
  agentMemories,
  handleAddMemoryNode,
  handleDeleteMemoryNode,
  handleAccessMemoryNode,
  coherence,
  setCoherence,
}) => {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleCommand = (action: string) => {
    switch (action) {
      case 'runLangGraph':
        runLangGraphFlow();
        break;
      case 'autoHeal':
        runAutoHealing();
        break;
      case 'navcommandcenter':
        setActiveTab('command_center');
        break;
      case 'navcognitivearch':
        setActiveTab('cognitive_arch');
        break;
      case 'nav_leads':
        setActiveTab('leads');
        break;
      case 'nav_memory':
        setActiveTab('memory');
        break;
      case 'nav_engines':
        setActiveTab('autonomous_engines');
        break;
      case 'nav_sandbox':
        setActiveTab('sandbox');
        break;
      case 'nav_cockpit':
        setActiveTab('cockpit');
        break;
    }
    setPaletteOpen(false);
  };

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden ${
        theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-[#05060a] text-gray-200'
      }`}
    >
      <SideNav activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />

      <div className="flex flex-col flex-1 basis-[95%] min-w-[800px] overflow-hidden h-full">
        <TopBar
          theme={theme}
          toggleTheme={toggleTheme}
          metrics={metrics}
          currentUser={currentUser}
          onOpenPalette={() => setPaletteOpen(true)}
        />

        <MainContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          theme={theme}
          runLangGraphFlow={runLangGraphFlow}
          runAutoHealing={runAutoHealing}
          isRunning={isRunning}
          traces={traces}
          metrics={metrics}
          messages={messages}
          setMessages={setMessages}
          diagnosticState={diagnosticState}
          currentUser={currentUser}
          agentMemories={agentMemories}
          handleAddMemoryNode={handleAddMemoryNode}
          handleDeleteMemoryNode={handleDeleteMemoryNode}
          handleAccessMemoryNode={handleAccessMemoryNode}
          coherence={coherence}
          setCoherence={setCoherence}
        />

        <Footer />
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onCommand={handleCommand}
        theme={theme}
      />
    </div>
  );
};
