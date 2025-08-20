import { eachDayOfInterval, endOfMonth, format, startOfMonth } from 'date-fns';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function Calendar() {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  const days = eachDayOfInterval({ start, end });
  const offset = start.getDay();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">{format(now, 'MMMM yyyy')}</h2>
      <div className="grid grid-cols-7 text-sm text-center mb-2">
        {weekDays.map(day => (
          <div key={day} className="font-medium">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-sm text-center">
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map(day => (
          <div
            key={day.toISOString()}
            className="p-2 rounded hover:bg-blue-50"
          >
            {format(day, 'd')}
          </div>
        ))}
      </div>
    </div>
  );
}

