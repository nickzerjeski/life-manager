import React from 'react';
import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns';
import { Task } from '@/models/Task';
import { TaskHandler } from '@/models/TaskHandler';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type View = 'day' | 'week' | 'month';

export function Calendar() {
  const [current, setCurrent] = React.useState(new Date());
  const [view, setView] = React.useState<View>('month');
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const handler = React.useMemo(() => TaskHandler.getInstance(), []);

  React.useEffect(() => {
    handler
      .getTasks()
      .then(setTasks)
      .catch(() => setTasks([]));
  }, [handler]);

  const tasksByDay = React.useMemo(() => {
    const map: Record<string, Task[]> = {};
    tasks.forEach(t => {
      const key = format(t.deadline, 'yyyy-MM-dd');
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [tasks]);

  const goPrev = () => {
    setCurrent(prev =>
      view === 'month'
        ? subMonths(prev, 1)
        : view === 'week'
        ? subWeeks(prev, 1)
        : subDays(prev, 1)
    );
  };

  const goNext = () => {
    setCurrent(prev =>
      view === 'month'
        ? addMonths(prev, 1)
        : view === 'week'
        ? addWeeks(prev, 1)
        : addDays(prev, 1)
    );
  };

  const start =
    view === 'month' ? startOfMonth(current) : view === 'week' ? startOfWeek(current) : current;
  const end =
    view === 'month' ? endOfMonth(current) : view === 'week' ? endOfWeek(current) : current;
  const days = eachDayOfInterval({ start, end });
  const offset = view === 'month' ? start.getDay() : 0;

  const headingFormat =
    view === 'month'
      ? 'MMMM yyyy'
      : view === 'week'
      ? "MMM d, yyyy"
      : 'EEEE, MMM d';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Prev
          </button>
          <h2 className="text-lg font-semibold">
            {format(current, headingFormat)}
          </h2>
          <button
            onClick={goNext}
            className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Next
          </button>
        </div>
        <div className="flex gap-2">
          {(['day', 'week', 'month'] as View[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-2 py-1 rounded border ${
                view === v ? 'bg-blue-600 text-white border-blue-600' : 'bg-white'
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {view === 'month' && (
        <>
          <div className="grid grid-cols-7 text-sm text-center mb-2">
            {weekDays.map(day => (
              <div key={day} className="font-medium">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-sm">
            {Array.from({ length: offset }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {days.map(day => {
              const key = format(day, 'yyyy-MM-dd');
              const dayTasks = tasksByDay[key] || [];
              return (
                <div
                  key={day.toISOString()}
                  className="p-2 rounded hover:bg-blue-50 space-y-1"
                >
                  <div className="text-center font-medium">
                    {format(day, 'd')}
                  </div>
                  {dayTasks.map(t => (
                    <div
                      key={t.id}
                      className="text-xs text-left truncate"
                    >
                      {t.name}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </>
      )}

      {view === 'week' && (
        <div className="grid grid-cols-7 gap-1 text-sm">
          {days.map(day => {
            const key = format(day, 'yyyy-MM-dd');
            const dayTasks = tasksByDay[key] || [];
            return (
              <div
                key={day.toISOString()}
                className="p-2 rounded hover:bg-blue-50 space-y-1 text-center"
              >
                <div className="font-medium">{format(day, 'EEE')}</div>
                <div>{format(day, 'd')}</div>
                {dayTasks.map(t => (
                  <div key={t.id} className="text-xs text-left truncate">
                    {t.name}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {view === 'day' && (
        <div className="p-4 rounded border">
          <div className="text-center mb-2">
            <div className="text-2xl font-bold">{format(current, 'd')}</div>
            <div>{format(current, 'EEEE, MMMM yyyy')}</div>
          </div>
          <ul className="space-y-1">
            {(tasksByDay[format(current, 'yyyy-MM-dd')] || []).map(t => (
              <li key={t.id} className="text-sm text-gray-800">
                {t.name}
              </li>
            ))}
            {!(tasksByDay[format(current, 'yyyy-MM-dd')] || []).length && (
              <li className="text-sm text-gray-500 italic">No tasks</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

