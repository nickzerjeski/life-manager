// Use the traditional API for React 19 compatibility
import { create } from 'zustand/traditional'
import type { Goal, Project, Task } from './types'

interface State {
  goals: Goal[]
  addGoal: (goal: Goal) => void
  removeGoal: (goalId: string) => void
  addProject: (goalId: string, project: Project) => void
  removeProject: (goalId: string, projectId: string) => void
  addTask: (projectId: string, task: Task) => void
  removeTask: (projectId: string, taskId: string) => void
}

export const useStore = create<State>((set) => ({
  goals: [],
  addGoal: (goal) => set((s) => ({ goals: [...s.goals, goal] })),
  removeGoal: (goalId) =>
    set((s) => ({ goals: s.goals.filter((g) => g.id !== goalId) })),
  addProject: (goalId, project) =>
    set((s) => ({
      goals: s.goals.map((g) =>
        g.id === goalId ? { ...g, projects: [...g.projects, project] } : g
      ),
    })),
  removeProject: (goalId, projectId) =>
    set((s) => ({
      goals: s.goals.map((g) =>
        g.id === goalId
          ? {
              ...g,
              projects: g.projects.filter((p) => p.id !== projectId),
            }
          : g
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
  removeTask: (projectId, taskId) =>
    set((s) => ({
      goals: s.goals.map((g) => ({
        ...g,
        projects: g.projects.map((p) =>
          p.id === projectId
            ? { ...p, tasks: p.tasks.filter((t) => t.id !== taskId) }
            : p
        ),
      })),
    })),
}))
