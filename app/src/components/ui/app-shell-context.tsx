'use client';
import { createContext, useContext, useState } from 'react';

type TabName = 'Home' | 'Habits' | 'Projects' | 'Goals' | 'Calendar' | 'Settings';

interface ShellCtx {
  activeTab: TabName;
  setActiveTab: (t: TabName) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (b: boolean) => void;
}

const Ctx = createContext<ShellCtx | null>(null);

export function AppShellProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabName>('Home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Ctx.Provider value={{ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAppShell = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppShell must be inside <AppShellProvider>');
  return ctx;
};
