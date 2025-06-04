import { create } from 'zustand'

export type Page = 'Home' | 'Habits' | 'Projects' | 'Goals'

interface NavState {
  page: Page
  setPage: (p: Page) => void
}

export const useNavStore = create<NavState>((set) => ({
  page: 'Home',
  setPage: (p) => set({ page: p }),
}))
