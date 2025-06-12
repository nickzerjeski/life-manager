import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  APP_CONFIG,
  loadWorkweekConfig,
  saveWorkweekConfig,
} from '@/config/appConfig';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function SettingPage() {
  const [days, setDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [start, setStart] = useState('08:00');
  const [end, setEnd] = useState('17:00');

  useEffect(() => {
    loadWorkweekConfig();
    const cfg = APP_CONFIG.workweek;
    setDays(cfg.days);
    setStart(cfg.start);
    setEnd(cfg.end);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleDay = (day: string) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const save = () => {
    saveWorkweekConfig({ days, start, end });
  };

  return (
    <section className="bg-white p-4 sm:p-6 rounded-lg shadow space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div>
        <p className="text-sm font-medium mb-2">Workdays</p>
        <div className="grid grid-cols-4 gap-2">
          {DAYS.map((d) => (
            <label key={d} className="flex items-center space-x-2">
              <Checkbox
                id={d}
                checked={days.includes(d)}
                onCheckedChange={() => toggleDay(d)}
              />
              <span className="text-sm">{d}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col flex-1">
          <label className="text-sm font-medium mb-1" htmlFor="start">
            Start time
          </label>
          <Input
            id="start"
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>
        <div className="flex flex-col flex-1">
          <label className="text-sm font-medium mb-1" htmlFor="end">
            End time
          </label>
          <Input
            id="end"
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>
      </div>

      <div className="pt-2">
        <Button onClick={save}>Save</Button>
      </div>
    </section>
  );
}
