import React from 'react';
import { ListTodo, Repeat, Target } from 'lucide-react';
import { useAppShell } from '@/components/ui/app-shell-context';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const features = [
  {
    name: 'Goals',
    icon: Target,
    description: 'Track long-term objectives and monitor progress.',
  },
  {
    name: 'Projects',
    icon: ListTodo,
    description: 'Organise projects that lead to your goals.',
  },
  {
    name: 'Habits',
    icon: Repeat,
    description: 'Build daily routines for lasting change.',
  },
] as const;

export default function HomePage() {
  const { setActiveTab } = useAppShell();

  return (
    <section className="space-y-6">
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome to LifeManager
        </h1>
        <p className="text-gray-600">
          Manage your habits, projects and goals from a single dashboard.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ name, icon: Icon, description }) => (
          <Card key={name} className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-2 p-4 pb-2">
              <Icon className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-lg">{name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 p-4 pt-0">
              <CardDescription>{description}</CardDescription>
              <Button
                className="w-fit"
                onClick={() => setActiveTab(name)}
              >
                View {name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
