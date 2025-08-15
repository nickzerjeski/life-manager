'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Menu,
  X,
  LogOut,
  ListTodo,
  Settings,
  Target,
  Repeat,
  Home,
} from 'lucide-react';
import supabase from '../../../supabase';
import { AppShellProvider, useAppShell } from './app-shell-context';

/* ----- icons mapping for sidebar items ----- */
const nav = [
  { name: 'Home', icon: Home },
  { name: 'Habits', icon: Repeat },
  { name: 'Projects', icon: ListTodo },
  { name: 'Goals', icon: Target },
] as const;
const bottomNav = [...nav, { name: 'Settings', icon: Settings }] as const;

function ShellInner({ children }: { children: React.ReactNode }) {
  const { activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen } =
    useAppShell();

  return (
    <div className="relative flex h-screen overflow-hidden">
      {/* ---- desktop sidebar ---- */}
      <nav className="hidden md:flex md:w-64 md:flex-col md:bg-gray-800 md:text-white md:border-r">
        <div className="p-4 text-xl font-bold">Lifemanager</div>
        <div className="flex-1 space-y-1 p-2">
          {nav.map(({ name, icon: Icon }) => {
            const active = activeTab === name;
            return (
              <button
                key={name}
                onClick={() => setActiveTab(name)}
                className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors
                  ${active ? 'bg-blue-600' : 'hover:bg-gray-700'}
                `}
              >
                <Icon className="mr-3 h-5 w-5" />
                {name}
              </button>
            );
          })}
          <button
            onClick={() => setActiveTab('Settings')}
            className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors
              ${activeTab === 'Settings' ? 'bg-blue-600' : 'hover:bg-gray-700'}
            `}
          >
            <Settings className="mr-3 h-5 w-5" /> Settings
          </button>
        </div>
      </nav>

      {/* ---- mobile sidebar ---- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <nav
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 text-white border-r p-4 flex flex-col transform transition-transform duration-300 md:hidden
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-xl font-bold">Lifemanager</h1>
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex-1 space-y-1">
          {nav.map(({ name, icon: Icon }) => {
            const active = activeTab === name;
            return (
              <button
                key={name}
                onClick={() => {
                  setActiveTab(name);
                  setIsSidebarOpen(false);
                }}
                className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors
                  ${active ? 'bg-blue-600' : 'hover:bg-gray-700'}
                `}
              >
                <Icon className="mr-3 h-5 w-5" />
                {name}
              </button>
            );
          })}
          <button
            onClick={() => {
              setActiveTab('Settings');
              setIsSidebarOpen(false);
            }}
            className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors
              ${activeTab === 'Settings' ? 'bg-blue-600' : 'hover:bg-gray-700'}
            `}
          >
            <Settings className="mr-3 h-5 w-5" /> Settings
          </button>
          <button
            onClick={() => supabase.auth.signOut()}
            className="mt-auto flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700"
          >
            <LogOut className="mr-3 h-5 w-5" /> Logout
          </button>
        </div>
      </nav>

      {/* ---- main area ---- */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between bg-blue-600 px-4 py-3 text-white md:pl-8">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white md:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-bold md:text-xl">{activeTab}</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => supabase.auth.signOut()}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 pb-20 md:p-8 md:pb-8">
          {children}
        </main>
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 flex justify-around border-t bg-white py-2">
          {bottomNav.map(({ name, icon: Icon }) => {
            const active = activeTab === name;
            return (
              <button
                key={name}
                onClick={() => setActiveTab(name)}
                className={`flex flex-col items-center text-xs ${active ? 'text-blue-600' : 'text-gray-500'}`}
              >
                <Icon className="mb-1 h-5 w-5" />
                {name}
              </button>
            );
          })}
        </nav>
      </div>
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
