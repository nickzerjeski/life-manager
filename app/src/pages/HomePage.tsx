import React from 'react';
import { Repeat, ListTodo, Target } from 'lucide-react';
import { useAppShell } from '@/components/ui/app-shell-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const { setActiveTab } = useAppShell();
  const features = [
    {
      name: 'Habits',
      description: 'Build consistent routines and track daily progress.',
      icon: Repeat,
      tab: 'Habits',
    },
    {
      name: 'Projects',
      description: 'Organise work into actionable tasks.',
      icon: ListTodo,
      tab: 'Projects',
    },
    {
      name: 'Goals',
      description: 'Track long-term objectives and progress.',
      icon: Target,
      tab: 'Goals',
    },
  ] as const;

  return (
    <section className="space-y-6">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(({ name, description, icon: Icon, tab }) => (
          <Card
            key={name}
            className="bg-white shadow rounded p-4 text-gray-800 flex flex-col"
          >
            <div className="flex items-center mb-2">
              <Icon className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold">{name}</h2>
            </div>
            <p className="text-sm flex-1 text-gray-600">{description}</p>
            <Button
              className="mt-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 self-start"
              onClick={() => setActiveTab(tab)}
            >
              Open
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}
