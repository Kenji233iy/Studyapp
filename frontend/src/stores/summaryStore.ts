import { create } from 'zustand'

export interface Summary {
  id: string
  user_id: string
  document_id: string
  topic: string
  title: string
  body: string
  tags: string[]
  key_terms: string[]
  created_at: string
  updated_at: string
}

interface SummaryStore {
  summaries: Summary[]
  setSummaries: (summaries: Summary[]) => void
  addSummary: (summary: Summary) => void
  updateSummary: (id: string, summary: Partial<Summary>) => void
  deleteSummary: (id: string) => void
}

export const useSummaryStore = create<SummaryStore>((set) => ({
  summaries: [],
  setSummaries: (summaries) => set({ summaries }),
  addSummary: (summary) => set((state) => ({ summaries: [...state.summaries, summary] })),
  updateSummary: (id, updates) => set((state) => ({
    summaries: state.summaries.map(s => s.id === id ? { ...s, ...updates } : s)
  })),
  deleteSummary: (id) => set((state) => ({
    summaries: state.summaries.filter(s => s.id !== id)
  })),
}))
