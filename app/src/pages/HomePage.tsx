import React, { useEffect, useState } from 'react';
import { GoalHandler } from '@/models/GoalHandler';
import { ProjectHandler } from '@/models/ProjectHandler';
import { Target, ListTodo, Repeat } from 'lucide-react';
import { StatsCard } from '@/components/ui/stats-card';

export default function HomePage() {
  const [goalCount, setGoalCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    GoalHandler.getInstance().getGoals().then((g) => setGoalCount(g.length));
    ProjectHandler.getInstance().getProjects().then((p) => setProjectCount(p.length));
  }, []);

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="Goals" value={goalCount} icon={Target} />
        <StatsCard title="Projects" value={projectCount} icon={ListTodo} />
        <StatsCard title="Habits" value={0} icon={Repeat} />
      </div>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow space-y-2">
        <h1 className="text-2xl font-bold">Welcome to LifeManager</h1>
        <p className="text-gray-700">
          Manage your habits, projects and goals from a single dashboard.
        </p>
      </div>
    </section>
  );
}
