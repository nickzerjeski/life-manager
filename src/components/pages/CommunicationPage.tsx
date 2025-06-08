'use client'
import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend, CartesianGrid, LineChart, Line } from 'recharts'
import { initialClients, Client } from '@/data/initialClients'
import { Analytics } from '@/models/Analytics'
import { TaskStatusCounts, AolStatusCounts, DeadlineItem } from '@/types/analytics'
import { GoalHandler } from '@/models/GoalHandler'
import { ProjectHandler } from '@/models/ProjectHandler'
import { Status } from '@/types/Status'

const goals = GoalHandler.getInstance()
const projectHandler = ProjectHandler.getInstance(goals)

const STATUS_COLORS = ['var(--chart-1)','var(--chart-2)','var(--chart-3)','var(--chart-4)','var(--chart-5)']

export default function CommunicationPage() {
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [taskCounts, setTaskCounts] = useState<TaskStatusCounts>()
  const [projectData, setProjectData] = useState<AolStatusCounts>()
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('betreuerAppClients')
    const data = saved ? (JSON.parse(saved) as Client[]) : initialClients
    setClients(data)
    setTaskCounts(Analytics.countTasksByStatus(data))
    setDeadlines(Analytics.upcomingDeadlines(data))
  }, [])

  useEffect(() => {
    Analytics.projectsByAolAndStatus(projectHandler).then(setProjectData).catch(() => setProjectData(undefined))
  }, [])

  const pieData = taskCounts ? Object.entries(taskCounts).map(([name, value]) => ({ name, value })) : []
  const barData = projectData
    ? Object.entries(projectData).map(([aol, counts]) => ({ aol, ...counts }))
    : []
  const timelineData = deadlines.map(d => ({ date: d.dueDate.toISOString().slice(0,10), value: 1 }))

  return (
    <section className="bg-white p-4 sm:p-6 rounded-lg shadow border space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white shadow rounded p-4 text-gray-800">
          <h2 className="text-lg font-semibold mb-2">Tasks by Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white shadow rounded p-4 text-gray-800">
          <h2 className="text-lg font-semibold mb-2">Projects by AOL and Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="aol" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              {Object.values(Status).map((status, index) => (
                <Bar key={status} dataKey={status} stackId="a" fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white shadow rounded p-4 text-gray-800">
        <h2 className="text-lg font-semibold mb-2">Upcoming Deadlines</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={timelineData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis hide domain={[0,1]} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="var(--chart-1)" dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
