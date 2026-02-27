import { create } from 'zustand'

export interface Document {
  id: string
  user_id: string
  name: string
  storage_path: string
  topics: any[]
  page_count: number
  created_at: string
}

interface DocumentStore {
  documents: Document[]
  selectedDocument: Document | null
  setDocuments: (docs: Document[]) => void
  addDocument: (doc: Document) => void
  setSelectedDocument: (doc: Document | null) => void
  deleteDocument: (id: string) => void
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  documents: [],
  selectedDocument: null,
  setDocuments: (docs) => set({ documents: docs }),
  addDocument: (doc) => set((state) => ({ documents: [...state.documents, doc] })),
  setSelectedDocument: (doc) => set({ selectedDocument: doc }),
  deleteDocument: (id) => set((state) => ({
    documents: state.documents.filter(d => d.id !== id)
  })),
}))
