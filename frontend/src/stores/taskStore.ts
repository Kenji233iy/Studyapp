import { create } from 'zustand'

export interface Task {
  id: string
  user_id: string
  text: string
  priority: 'alta' | 'media' | 'baja'
  done: boolean
  due_date?: string
  source: 'manual' | 'ai'
  related_document_id?: string
  position: number
  created_at: string
  updated_at: string
}

interface TaskStore {
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTaskDone: (id: string) => void
  reorderTasks: (tasks: Task[]) => void
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(t => t.id !== id)
  })),
  toggleTaskDone: (id) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
  })),
  reorderTasks: (tasks) => set({ tasks }),
}))
