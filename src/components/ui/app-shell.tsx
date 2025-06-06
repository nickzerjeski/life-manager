'use client';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, ListTodo, Settings, Target, Repeat } from 'lucide-react';
import { AppShellProvider, useAppShell } from './app-shell-context';

/* ----- icons mapping for sidebar items ----- */
const nav = [
  { name: 'Habits', icon: Repeat },
  { name: 'Projects', icon: ListTodo }, 
  { name: 'Goals', icon: Target },
] as const;

function ShellInner({ children }: { children: React.ReactNode }) {
  const { activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen } = useAppShell();

  return (
    <div className="relative min-h-screen md:flex">
      {/* ----- mobile top bar ----- */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white border-b sticky top-0 z-20">
        <h1 className="text-lg font-bold text-blue-700">Betreuer App</h1>
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* ----- dark overlay for mobile ----- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ----- sidebar ----- */}
      <nav
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r p-4 flex flex-col transform transition-transform duration-300
        md:static md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* header + close btn */}
        <div className="px-2 mb-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-700 hidden md:block">Lifemanager</h1>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* nav items */}
        <div className="flex-grow space-y-1">
          {nav.map(({ name, icon: Icon }) => {
            const active = activeTab === name;
            return (
              <button
                key={name}
                onClick={() => {
                  setActiveTab(name as any);
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2.5 rounded-md text-sm font-medium
                  ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {name}
              </button>
            );
          })}
        </div>

        {/* logout */}
        <div className="mt-auto pt-4 border-t">
        <button className="w-full flex items-center px-3 py-2.5 rounded-md text-sm text-gray-600 hover:bg-gray-100">
            <Settings className="w-5 h-5 mr-3" />
            Einstellungen
          </button>
          <button className="w-full flex items-center px-3 py-2.5 rounded-md text-sm text-gray-600 hover:bg-gray-100">
            <LogOut className="w-5 h-5 mr-3" />
            Ausloggen
          </button>
        </div>
      </nav>

      {/* ----- main area ----- */}
      <main className="flex-1 bg-gray-50 overflow-y-auto pt-16 md:pt-0">{children}</main>
    </div>
  );
}

/* Exposed wrapper */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AppShellProvider>
      <ShellInner>{children}</ShellInner>
    </AppShellProvider>
  );
}
