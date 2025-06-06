'use client';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';
import TaskOverview from '@/components/TaskOverview';
import TaskDetailView from '@/components/TaskDetailView';
import { TaskStatus } from '@/components/types/types';

export default function TaskPage({ clients, setClients }) {
  /* ---------- local state ---------- */
  const [selectedTask, setSelectedTask] = useState(null);
  const [sortField, setSortField] = useState('dueDate');
  const [sortDir, setSortDir] = useState('asc');

  const statusOrder = {
    [TaskStatus.OPEN]: 0,
    [TaskStatus.IN_PROGRESS]: 1,
    [TaskStatus.DONE]: 2,
  };

  /* ---------- derive tasks ---------- */
  const allTasks = clients.flatMap(c =>
    (c.tasks ?? []).map(t => ({
      ...t,
      client: c,
    })),
  );

  const completeTask = taskId => {
    setClients(prev =>
      prev.map(c => ({
        ...c,
        tasks: c.tasks.map(t =>
          t.id === taskId ? { ...t, completed: true } : t,
        ),
      })),
    );
    console.log(`Task ${taskId} completed!`);
  };

  const tasks = useMemo(() => {
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...allTasks].sort((a, b) => {
      switch (sortField) {
        case 'dueDate':
          return ((+new Date(a.dueDate ?? 0)) - (+new Date(b.dueDate ?? 0))) * dir;
        case 'client':
          return a.client.lastName.localeCompare(b.client.lastName) * dir;
        case 'status':
          return (statusOrder[a.status] - statusOrder[b.status]) * dir;
        default:
          return 0;
      }
    });
  }, [allTasks, sortField, sortDir]);

  const onSelectedTask = task => {
    setSelectedTask(task);
    // If you later build a modal or side-panel, open it here.
    console.log("Selected task:", task);
  }

  /* ---------- UI ---------- */
  return (
    <section className="mb-6 p-4 sm:p-6 rounded-lg shadow border bg-white">
          {selectedTask ? (
            <TaskDetailView
              task={selectedTask}
              onBack={() => setSelectedTask(null)}
              onComplete={completeTask}
            />
          ) : (
            <>
              {/* ----- header & sort controls ----- */}
              <h2 className="text-2xl font-bold mb-2">Aufgabenübersicht</h2>
              <div className="flex flex-wrap items-center gap-4 mb-4">
        <Select defaultValue={sortField} onValueChange={setSortField}>
          <SelectTrigger className="w-44 sm:w-56">
            <SelectValue placeholder="Sortieren nach" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dueDate">Fälligkeitsdatum</SelectItem>
            <SelectItem value="client">Klient</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))}
        >
          <ArrowUpDown
            className={`h-4 w-4 transition-transform ${
              sortDir === 'desc' ? 'rotate-180' : ''
            }`}
          />
        </Button>
      </div>
            <TaskOverview tasks={tasks} onSelectTask={setSelectedTask} />
            </>
          )}
    </section>
  );
}
