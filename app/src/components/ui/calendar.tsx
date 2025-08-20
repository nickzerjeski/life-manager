import React, { useMemo, useState, useEffect } from "react";
import { addDays, addMonths, endOfMonth, endOfWeek, format, getDate, getDay, getDaysInMonth, getMonth, getYear, isSameDay, isSameMonth, isSameWeek, isToday, parseISO, setHours, setMinutes, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { enAU } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, LayoutGrid, LayoutList, Clock, BarChart as BarChartIcon, KanbanSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

// ------------------------------
// Mock Data
// ------------------------------

// Projects
const projects = [
  { id: "thesis", name: "Thesis", color: "#8b5cf6" },
  { id: "lifemgr", name: "LifeManager", color: "#10b981" },
  { id: "fitness", name: "Fitness", color: "#f59e0b" },
  { id: "social", name: "Social", color: "#3b82f6" },
];

// Events (times are local to Australia/Melbourne context)
const now = new Date();
const baseMonth = new Date(getYear(now), getMonth(now), 1);

function d(y: number, m: number, day: number, h = 9, min = 0) {
  return new Date(y, m, day, h, min, 0, 0);
}

const mockEvents = [
  { id: "e1", title: "Deep Work – Thesis", start: d(getYear(now), getMonth(now), 6, 9, 0), end: d(getYear(now), getMonth(now), 6, 11, 30), project: "thesis" },
  { id: "e2", title: "Supervisor Meeting", start: d(getYear(now), getMonth(now), 7, 15, 0), end: d(getYear(now), getMonth(now), 7, 16, 0), project: "thesis" },
  { id: "e3", title: "Ship MVP milestone", start: d(getYear(now), getMonth(now), 8, 10, 0), end: d(getYear(now), getMonth(now), 8, 12, 0), project: "lifemgr" },
  { id: "e4", title: "Gym – Push Day", start: d(getYear(now), getMonth(now), 8, 18, 0), end: d(getYear(now), getMonth(now), 8, 19, 15), project: "fitness" },
  { id: "e5", title: "Coffee: John", start: d(getYear(now), getMonth(now), 10, 13, 0), end: d(getYear(now), getMonth(now), 10, 14, 0), project: "social" },
  { id: "e6", title: "Design DB schema", start: d(getYear(now), getMonth(now), 12, 9, 30), end: d(getYear(now), getMonth(now), 12, 11, 0), project: "lifemgr" },
  { id: "e7", title: "Run – Tan Track", start: d(getYear(now), getMonth(now), 13, 7, 15), end: d(getYear(now), getMonth(now), 13, 8, 0), project: "fitness" },
  { id: "e8", title: "Reading Group", start: d(getYear(now), getMonth(now), 13, 17, 0), end: d(getYear(now), getMonth(now), 13, 18, 0), project: "thesis" },
  { id: "e9", title: "Demo – LifeManager", start: d(getYear(now), getMonth(now), 16, 10, 0), end: d(getYear(now), getMonth(now), 16, 11, 0), project: "lifemgr" },
  { id: "e10", title: "Dinner – Family", start: d(getYear(now), getMonth(now), 18, 19, 0), end: d(getYear(now), getMonth(now), 18, 21, 0), project: "social" },
  { id: "e11", title: "Code Review", start: d(getYear(now), getMonth(now), 20, 14, 0), end: d(getYear(now), getMonth(now), 20, 15, 30), project: "lifemgr" },
  { id: "e12", title: "Presentation Prep", start: d(getYear(now), getMonth(now), 24, 9, 0), end: d(getYear(now), getMonth(now), 24, 11, 0), project: "thesis" },
];

// Tasks for Kanban + Gantt
const mockTasks = [
  { id: "t1", title: "Outline Literature Review", status: "Backlog", project: "thesis", start: addDays(baseMonth, 2), end: addDays(baseMonth, 8), assignee: "Nick" },
  { id: "t2", title: "Schema v1", status: "In Progress", project: "lifemgr", start: addDays(baseMonth, 4), end: addDays(baseMonth, 12), assignee: "Nick" },
  { id: "t3", title: "Auth integration", status: "Todo", project: "lifemgr", start: addDays(baseMonth, 10), end: addDays(baseMonth, 18), assignee: "Nick" },
  { id: "t4", title: "Prototype UI polish", status: "Blocked", project: "lifemgr", start: addDays(baseMonth, 13), end: addDays(baseMonth, 20), assignee: "Nick" },
  { id: "t5", title: "Experiment design", status: "In Progress", project: "thesis", start: addDays(baseMonth, 7), end: addDays(baseMonth, 22), assignee: "Nick" },
  { id: "t6", title: "Strength block A", status: "Todo", project: "fitness", start: addDays(baseMonth, 1), end: addDays(baseMonth, 28), assignee: "Nick" },
  { id: "t7", title: "Networking coffees", status: "Todo", project: "social", start: addDays(baseMonth, 3), end: addDays(baseMonth, 26), assignee: "Nick" },
  { id: "t8", title: "MVP demo", status: "Done", project: "lifemgr", start: addDays(baseMonth, 6), end: addDays(baseMonth, 9), assignee: "Nick" },
];

const statuses = ["Backlog", "Todo", "In Progress", "Blocked", "Done"] as const;

// ------------------------------
// Utilities
// ------------------------------

function monthMatrix(viewDate: Date) {
  const start = startOfWeek(startOfMonth(viewDate), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(viewDate), { weekStartsOn: 1 });
  const days: Date[] = [];
  let d0 = start;
  while (d0 <= end) {
    days.push(d0);
    d0 = addDays(d0, 1);
  }
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
}

function hoursArray() {
  return Array.from({ length: 24 }, (_, i) => i);
}

function getProjectMeta(id: string) {
  return projects.find(p => p.id === id) || projects[0];
}

function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)); }

// Event layout for week/day: compute top/bottom percentages
function layoutEventInDay(ev: { start: Date; end: Date }) {
  const startMins = ev.start.getHours() * 60 + ev.start.getMinutes();
  const endMins = ev.end.getHours() * 60 + ev.end.getMinutes();
  const top = (startMins / (24 * 60)) * 100;
  const height = Math.max(2, ((endMins - startMins) / (24 * 60)) * 100);
  return { top, height };
}

function formatTime(d: Date) {
  return format(d, "HH:mm");
}

// ------------------------------
// Subcomponents
// ------------------------------

function Toolbar({ date, setDate, view, setView, project, setProject, search, setSearch }: any) {
  const monthYear = format(date, "LLLL yyyy", { locale: enAU });
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => setDate(subMonths(date, 1))}><ChevronLeft className="h-4 w-4" /></Button>
        <Button variant="outline" onClick={() => setDate(new Date())}>Today</Button>
        <Button variant="outline" size="icon" onClick={() => setDate(addMonths(date, 1))}><ChevronRight className="h-4 w-4" /></Button>
        <div className="text-lg font-semibold ml-2 flex items-center gap-2"><CalendarIcon className="h-5 w-5" />{monthYear}</div>
      </div>
      <div className="flex items-center gap-2">
        <Input placeholder="Search events/tasks" value={search} onChange={(e) => setSearch(e.target.value)} className="w-56" />
        <Select value={project} onValueChange={setProject}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Project" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map(p => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}
          </SelectContent>
        </Select>
        <TabsList>
          <TabsTrigger value="year" className="gap-1"><LayoutGrid className="h-4 w-4"/>Year</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="day" className="gap-1"><Clock className="h-4 w-4"/>Day</TabsTrigger>
          <TabsTrigger value="kanban" className="gap-1"><KanbanSquare className="h-4 w-4"/>Kanban</TabsTrigger>
          <TabsTrigger value="gantt" className="gap-1"><BarChartIcon className="h-4 w-4"/>Gantt</TabsTrigger>
        </TabsList>
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {projects.map(p => (
        <div key={p.id} className="flex items-center gap-2 text-sm"><span className="h-3 w-3 rounded" style={{ backgroundColor: p.color }}></span>{p.name}</div>
      ))}
    </div>
  );
}

function YearView({ date, events, onPickMonth }: { date: Date; events: any[]; onPickMonth: (m: number) => void }) {
  const y = getYear(date);
  const months = Array.from({ length: 12 }, (_, i) => new Date(y, i, 1));

  function countEventsInMonth(m: number) {
    return events.filter(e => getMonth(e.start) === m && getYear(e.start) === y).length;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {months.map((m, i) => (
        <Card key={i} className="hover:shadow-lg transition">
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{format(m, "LLLL yyyy", { locale: enAU })}</div>
              <Badge variant="secondary">{countEventsInMonth(i)} events</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => <div key={d} className="text-center py-1">{d}</div>)}
              {monthMatrix(m).flat().map((d0, idx) => {
                const inMonth = isSameMonth(d0, m);
                const has = events.some(e => isSameDay(e.start, d0));
                return (
                  <button key={idx} onClick={() => onPickMonth(getMonth(m))} className={`h-8 rounded border text-center ${inMonth ? "" : "opacity-40"} ${has ? "border-primary" : "border-transparent"} hover:bg-accent`}>{getDate(d0)}</button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function MonthView({ date, events, search, project, onSelectEvent }: any) {
  const weeks = monthMatrix(date);

  const filtered = useMemo(() => events.filter(e => {
    const pOk = project === "all" || e.project === project;
    const qOk = !search || e.title.toLowerCase().includes(search.toLowerCase());
    return pOk && qOk;
  }), [events, search, project]);

  return (
    <div className="grid grid-cols-7 gap-2">
      {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => <div key={d} className="text-xs text-muted-foreground text-center pb-1">{d}</div>)}
      {weeks.flat().map((d0, i) => {
        const inMonth = isSameMonth(d0, date);
        const dayEvents = filtered.filter(e => isSameDay(e.start, d0));
        return (
          <Card key={i} className={`min-h-[120px] ${!inMonth ? "opacity-40" : ""}`}>
            <CardHeader className="py-2 px-3">
              <div className="flex items-center justify-between">
                <div className={`text-sm ${isToday(d0) ? "font-bold text-primary" : ""}`}>{getDate(d0)}</div>
                <div className="text-xs text-muted-foreground">{dayEvents.length} evt</div>
              </div>
            </CardHeader>
            <CardContent className="px-2 pb-2">
              <div className="flex flex-col gap-1">
                {dayEvents.slice(0, 4).map((e: any) => (
                  <button key={e.id} onClick={() => onSelectEvent(e)} className="group flex items-center gap-2 rounded px-2 py-1 hover:bg-accent text-left">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: getProjectMeta(e.project).color }}></span>
                    <span className="text-xs truncate">{format(e.start, "HH:mm")} {e.title}</span>
                  </button>
                ))}
                {dayEvents.length > 4 && <div className="text-xs text-muted-foreground">+{dayEvents.length - 4} more</div>}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function WeekView({ date, events, search, project, onSelectEvent }: any) {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const filtered = useMemo(() => events.filter(e => {
    const inWeek = isSameWeek(e.start, date, { weekStartsOn: 1 });
    const pOk = project === "all" || e.project === project;
    const qOk = !search || e.title.toLowerCase().includes(search.toLowerCase());
    return inWeek && pOk && qOk;
  }), [events, date, project, search]);

  return (
    <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-2">
      <div></div>
      {days.map((d0, i) => (
        <div key={i} className="text-xs text-center text-muted-foreground pb-1">{format(d0, "EEE dd")}</div>
      ))}
      {/* Time rail */}
      <div className="relative">
        {hoursArray().map(h => (
          <div key={h} className="h-12 text-[10px] text-muted-foreground pr-1 flex items-start justify-end">{String(h).padStart(2, "0")}:00</div>
        ))}
      </div>
      {days.map((d0, idx) => (
        <div key={idx} className="relative border rounded">
          {/* Hour grid */}
          {hoursArray().map(h => (
            <div key={h} className="h-12 border-b last:border-b-0" />
          ))}
          {/* Events */}
          {filtered.filter(e => isSameDay(e.start, d0)).map((e: any) => {
            const { top, height } = layoutEventInDay(e);
            const color = getProjectMeta(e.project).color;
            return (
              <button key={e.id} onClick={() => onSelectEvent(e)}
                className="absolute left-1 right-1 rounded px-2 py-1 text-xs shadow"
                style={{ top: `${top}%`, height: `${height}%`, backgroundColor: color, color: "white" }}>
                <div className="font-semibold truncate">{e.title}</div>
                <div className="opacity-90">{format(e.start, "HH:mm")}–{format(e.end, "HH:mm")}</div>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function DayView({ date, events, project, search, onSelectEvent }: any) {
  const filtered = useMemo(() => events.filter(e => isSameDay(e.start, date)).filter(e => {
    const pOk = project === "all" || e.project === project;
    const qOk = !search || e.title.toLowerCase().includes(search.toLowerCase());
    return pOk && qOk;
  }), [events, date, project, search]);

  return (
    <div className="grid grid-cols-[80px_1fr] gap-3">
      <div className="">
        {hoursArray().map(h => (
          <div key={h} className="h-12 text-[10px] text-muted-foreground pr-1 flex items-start justify-end">{String(h).padStart(2, "0")}:00</div>
        ))}
      </div>
      <div className="relative border rounded min-h-[720px]">
        {hoursArray().map(h => (
          <div key={h} className="h-12 border-b last:border-b-0" />
        ))}
        {filtered.map((e: any) => {
          const { top, height } = layoutEventInDay(e);
          const color = getProjectMeta(e.project).color;
          return (
            <button key={e.id} onClick={() => onSelectEvent(e)}
              className="absolute left-2 right-2 rounded px-2 py-1 text-xs shadow"
              style={{ top: `${top}%`, height: `${height}%`, backgroundColor: color, color: "white" }}>
              <div className="font-semibold truncate">{e.title}</div>
              <div className="opacity-90">{format(e.start, "HH:mm")}–{format(e.end, "HH:mm")}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function EventDrawer({ event, onClose }: any) {
  if (!event) return null;
  const p = getProjectMeta(event.project);
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="fixed right-4 top-4 bottom-4 z-50 w-[360px]"
      >
        <Card className="h-full flex flex-col">
          <CardHeader className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-lg pr-4">{event.title}</div>
              <Button variant="ghost" onClick={onClose}>Close</Button>
            </div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded" style={{ backgroundColor: p.color }}></span>{p.name}</div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">{format(event.start, "EEE d LLL yyyy HH:mm")} – {format(event.end, "HH:mm")}</div>
            <Separator />
            <div className="space-y-2">
              <div className="text-sm">Notes</div>
              <div className="text-sm text-muted-foreground">Mock notes. Use this area to add description or links.</div>
            </div>
            <Separator />
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary">Focus</Badge>
              <Badge variant="secondary">Deep Work</Badge>
              <Badge variant="secondary">No Meetings</Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

function KanbanBoard({ tasks, onMove }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3">
      {statuses.map((col) => (
        <Card key={col} className="min-h-[340px]">
          <CardHeader className="py-3 flex flex-row items-center justify-between">
            <div className="font-semibold">{col}</div>
            <Badge variant="secondary">{tasks.filter((t: any) => t.status === col).length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tasks.filter((t: any) => t.status === col).map((t: any) => (
                <div key={t.id} className="rounded border p-2 bg-card/40">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium text-sm truncate">{t.title}</div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => onMove(t.id, -1)}>&lt;</Button>
                      <Button variant="ghost" size="sm" onClick={() => onMove(t.id, +1)}>&gt;</Button>
                    </div>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="h-2 w-2 rounded" style={{ backgroundColor: getProjectMeta(t.project).color }}></span>
                    <span>{getProjectMeta(t.project).name}</span>
                    <span>•</span>
                    <span>{format(t.start, "d LLL")} – {format(t.end, "d LLL")}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ganttDataForMonth(date: Date, tasks: any[]) {
  const start = startOfMonth(date);
  const days = getDaysInMonth(date);
  const monthStart = new Date(getYear(date), getMonth(date), 1, 0, 0, 0, 0);
  return tasks.map(t => {
    const s = new Date(t.start);
    const e = new Date(t.end);
    // Clamp within month for display
    const sDay = clamp(Math.floor((s.getTime() - monthStart.getTime()) / (1000*60*60*24)) + 1, 1, days);
    const eDay = clamp(Math.floor((e.getTime() - monthStart.getTime()) / (1000*60*60*24)) + 1, 1, days);
    const duration = Math.max(1, eDay - sDay + 1);
    return {
      id: t.id,
      task: t.title,
      project: t.project,
      startDay: sDay - 1, // zero-based for offset bar
      duration,
      color: getProjectMeta(t.project).color,
    };
  });
}

function GanttView({ date, tasks }: any) {
  const data = ganttDataForMonth(date, tasks);
  const days = getDaysInMonth(date);
  // Prepare two bars per task: offset (transparent) + duration (colour)
  const chartData = data.map(d => ({ task: d.task, offset: d.startDay, duration: d.duration, color: d.color }));
  return (
    <div className="h-[420px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ left: 120, right: 20, top: 10, bottom: 10 }}>
          <XAxis type="number" domain={[0, days]} tickCount={Math.min(16, days)} />
          <YAxis type="category" dataKey="task" width={140} />
          <Tooltip formatter={(v: any, n: any) => n === "duration" ? `${v} days` : v} labelFormatter={() => format(date, "LLLL yyyy")} />
          <Bar dataKey="offset" stackId="a" fillOpacity={0} />
          <Bar dataKey="duration" stackId="a" radius={[4, 4, 4, 4]}>
            {chartData.map((entry, index) => (
              <rect key={`bar-${index}`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-3 mt-3 text-sm">
        {projects.map(p => (
          <div key={p.id} className="flex items-center gap-2"><span className="h-3 w-3 rounded" style={{ backgroundColor: p.color }}></span>{p.name}</div>
        ))}
      </div>
    </div>
  );
}

// ------------------------------
// Main Component
// ------------------------------

export default function CalendarPro() {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<string>("month");
  const [project, setProject] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>(mockTasks);

  function filteredEvents() {
    return mockEvents.filter(e => {
      const pOk = project === "all" || e.project === project;
      const qOk = !search || e.title.toLowerCase().includes(search.toLowerCase());
      return pOk && qOk;
    });
  }

  function moveTask(id: string, dir: number) {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const i = statuses.indexOf(t.status as any);
      const j = clamp(i + dir, 0, statuses.length - 1);
      return { ...t, status: statuses[j] };
    }));
  }

  // Keyboard shortcuts: ←/→ to move month, T to go today
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") setDate(d => subMonths(d, 1));
      if (e.key === "ArrowRight") setDate(d => addMonths(d, 1));
      if (e.key.toLowerCase() === "t") setDate(new Date());
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto space-y-4">
      <Card>
        <CardContent className="pt-6">
          <Tabs value={view} onValueChange={setView}>
            <Toolbar date={date} setDate={setDate} view={view} setView={setView} project={project} setProject={setProject} search={search} setSearch={setSearch} />
            <Separator className="my-4" />

            <TabsContent value="year">
              <YearView date={date} events={mockEvents} onPickMonth={(m) => setDate(d => new Date(getYear(d), m, 1))} />
            </TabsContent>

            <TabsContent value="month">
              <Legend />
              <div className="h-2" />
              <MonthView date={date} events={filteredEvents()} project={project} search={search} onSelectEvent={setSelectedEvent} />
            </TabsContent>

            <TabsContent value="week">
              <Legend />
              <div className="h-2" />
              <WeekView date={date} events={filteredEvents()} project={project} search={search} onSelectEvent={setSelectedEvent} />
            </TabsContent>

            <TabsContent value="day">
              <Legend />
              <div className="h-2" />
              <DayView date={date} events={filteredEvents()} project={project} search={search} onSelectEvent={setSelectedEvent} />
            </TabsContent>

            <TabsContent value="kanban">
              <KanbanBoard tasks={tasks} onMove={moveTask} />
            </TabsContent>

            <TabsContent value="gantt">
              <GanttView date={date} tasks={tasks} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <EventDrawer event={selectedEvent} onClose={() => setSelectedEvent(null)} />

      <Card>
        <CardHeader>
          <div className="font-semibold">Shortcuts</div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <div>← / →: Move month</div>
          <div>T: Jump to today</div>
          <div>Click an event to open details</div>
          <div>Use Kanban view to move tasks with arrows</div>
        </CardContent>
      </Card>
    </div>
  );
}
