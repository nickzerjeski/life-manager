import { Calendar } from '@/components/ui/calendar';

export default function CalendarPage() {
  return (
    <section className="space-y-4">
      <div className="bg-white shadow rounded p-4 text-gray-800">
        <h1 className="text-xl font-bold mb-4">Calendar</h1>
        <Calendar />
      </div>
    </section>
  );
}

