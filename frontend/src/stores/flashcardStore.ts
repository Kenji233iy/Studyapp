import { create } from 'zustand'

export interface Flashcard {
  id: string
  user_id: string
  document_id: string
  topic: string
  question: string
  answer: string
  category: 'definition' | 'process' | 'comparison' | 'exam' | 'error' | 'data'
  difficulty: 'easy' | 'medium' | 'hard'
  hint?: string
  status: 'new' | 'review' | 'mastered'
  next_review_at?: string
  ease_factor: number
  interval: number
  created_at: string
}

interface FlashcardStore {
  flashcards: Flashcard[]
  setFlashcards: (cards: Flashcard[]) => void
  addFlashcard: (card: Flashcard) => void
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => void
  deleteFlashcard: (id: string) => void
  getDueFlashcards: () => Flashcard[]
}

export const useFlashcardStore = create<FlashcardStore>((set, get) => ({
  flashcards: [],
  setFlashcards: (cards) => set({ flashcards: cards }),
  addFlashcard: (card) => set((state) => ({ flashcards: [...state.flashcards, card] })),
  updateFlashcard: (id, updates) => set((state) => ({
    flashcards: state.flashcards.map(c => c.id === id ? { ...c, ...updates } : c)
  })),
  deleteFlashcard: (id) => set((state) => ({
    flashcards: state.flashcards.filter(c => c.id !== id)
  })),
  getDueFlashcards: () => {
    const now = new Date()
    return get().flashcards.filter(card => {
      if (!card.next_review_at) return false
      return new Date(card.next_review_at) <= now
    })
  },
}))
