import { Button } from '@/components/ui/button'
import { SpeedDial } from '@/components/ui/speed-dial'
import FolderModal from '@/modals/FolderModal'
import { useState } from 'react'
import supabase from '../../supabase'
import { useAuth } from '@/hooks/use-auth'

export default function HabitPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const { session } = useAuth()

  async function insertMockData() {
    if (!session?.user) return
    const userId = session.user.id

    const { data: goal, error: goalError } = await supabase
      .from('goals')
      .insert({
        user_id: userId,
        name: 'Mock Goal',
        description: 'Inserted from HabitPage',
        start: 0,
        current: 0,
        objective: 1,
        period_from: new Date().toISOString().slice(0, 10),
        period_to: new Date(Date.now() + 7 * 86400000)
          .toISOString()
          .slice(0, 10),
        status: 'Not Started',
        area_of_life: 'Health',
      })
      .select()
      .single()

    if (goalError || !goal) {
      console.error(goalError)
      return
    }

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        goal_id: goal.id,
        name: 'Mock Project',
        short_description: 'Seed project',
        description: 'Inserted from HabitPage',
        start: 0,
        current: 0,
        objective: 1,
        period_from: goal.period_from,
        period_to: goal.period_to,
        contribution_pct: 100,
        status: 'Not Started',
      })
      .select()
      .single()

    if (projectError || !project) {
      console.error(projectError)
      return
    }

    await supabase.from('topics').insert({
      user_id: userId,
      project_id: project.id,
      name: 'Mock Topic',
      short_description: 'Seed topic',
    })

    await supabase.from('tasks').insert({
      user_id: userId,
      project_id: project.id,
      name: 'Mock Task',
      description: 'Seed task',
      deadline: new Date().toISOString(),
      duration: 60,
      priority: 1,
    })
  }

  const mockData = [
    {
      name: 'Mock Wallet A',
      icon: <div className="h-5 w-5 bg-blue-500 rounded" />,
      badge: 'Mock',
    },
    {
      name: 'Mock Wallet B',
      icon: <div className="h-5 w-5 bg-green-500 rounded" />,
    },
  ];

  return (
    <>
      <section className="bg-white p-4 sm:p-6 rounded-lg shadow space-y-2">
        <SpeedDial />
        <Button onClick={insertMockData} className="w-full">
          Insert Mock Data
        </Button>
      </section>

      <FolderModal open={modalOpen} onClose={() => setModalOpen(false)} items={mockData} />
    </>
  );
}
