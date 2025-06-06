'use client';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskStatus } from './types/types';

export default function TaskDetailView({
  task,
  onBack,
  onComplete,
}: {
  task: any;
  onBack: () => void;
  onComplete: (taskId: string | number) => void;
}) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow border border-gray-200">
      {/* header */}
      <button
        onClick={onBack}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4 text-sm"
      >
        <ArrowLeft size={16} className="mr-1" /> Zurück zu Aufgaben
      </button>

      <h2 className="text-2xl font-bold mb-1">{task.title}</h2>
      <p className="text-sm text-gray-500 mb-6">
        Fällig am: {task.dueDate ?? '—'} &nbsp;|&nbsp; Klient: {task.client?.firstName} {task.client?.lastName}
      </p>

      <div className="space-y-6">
        <section>
          <h3 className="font-semibold mb-1">Beschreibung</h3>
          <p className="text-sm text-gray-700">{task.description}</p>
        </section>

        <section>
            <h3 className="font-semibold mb-1">
              Schritte:
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Rechungslegung erstellen</li>
              <li>Rechungslegung unter Dokumenten speichern</li>
              <li>Rechungslegung ans Amtsgericht schicken</li>
            </ul>
          </section>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        {task.status === TaskStatus.OPEN && (
            <Button
            onClick={() => {
                onComplete(task.id);
                onBack();
            }}
            >
            Aufgabe erledigen
            </Button>
        )}
      </div>
    </div>
  );
}
