import React from 'react';
import { Plus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const habits = [
  { id: 1, name: 'Daily Meditation', progress: 40 },
  { id: 2, name: 'Read 30 pages', progress: 70 },
  { id: 3, name: 'Exercise', progress: 20 },
];

export default function HabitPage() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Habits</h2>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Add Habit
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {habits.map((h) => (
          <div key={h.id} className="bg-white p-4 rounded shadow">
            <p className="font-medium mb-2">{h.name}</p>
            <Progress value={h.progress} />
          </div>
        ))}
      </div>
    </section>
  );
}
