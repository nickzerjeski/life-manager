import { create } from 'zustand'
import type { Goal, Project, Task } from './types'

interface State {
  goals: Goal[]
  addGoal: (goal: Goal) => void
  addProject: (goalId: string, project: Project) => void
  addTask: (projectId: string, task: Task) => void
}

export const useStore = create<State>((set) => ({
  goals: [],
  addGoal: (goal) => set((s) => ({ goals: [...s.goals, goal] })),
  addProject: (goalId, project) =>
    set((s) => ({
      goals: s.goals.map((g) =>
        g.id === goalId ? { ...g, projects: [...g.projects, project] } : g
      ),
    })),
  addTask: (projectId, task) =>
    set((s) => ({
      goals: s.goals.map((g) => ({
        ...g,
        projects: g.projects.map((p) =>
          p.id === projectId ? { ...p, tasks: [...p.tasks, task] } : p
        ),
      })),
    })),
}))
