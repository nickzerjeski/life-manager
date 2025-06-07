'use client';
import { useEffect, useState } from 'react';
import {initialClients} from '@/data/initialClients';
import DashboardContent from '@/components/ui/dashboard-content';
import { GoalHandler } from '@/models/GoalHandler';
import { ProjectHandler } from '@/models/ProjectHandler';

// initialize handlers on first load
const goals = GoalHandler.getInstance();
ProjectHandler.getInstance(goals);

export default function Home() {
/* ---------- single source of truth for client list ---------- */
  const [clients, setClients] = useState(initialClients);

  /* load / persist in localStorage */
  useEffect(() => {
    const saved = localStorage.getItem('betreuerAppClients');
    if (saved) setClients(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('betreuerAppClients', JSON.stringify(clients));
  }, [clients]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      <main className="container mx-auto max-w-7xl space-y-8">
        <DashboardContent />
      </main>
      <footer className="text-center text-sm text-gray-500 mt-8">
        © {new Date().getFullYear()} Lifemanager App Prototype.
      </footer>
    </div>
  );
}
