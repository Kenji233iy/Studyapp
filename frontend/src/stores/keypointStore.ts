import { create } from 'zustand'

export interface Keypoint {
  id: string
  user_id: string
  document_id: string
  topic: string
  type: 'core' | 'exam' | 'trap'
  text: string
  related_concepts: string[]
  source_hint?: string
  created_at: string
}

interface KeypointStore {
  keypoints: Keypoint[]
  setKeypoints: (points: Keypoint[]) => void
  addKeypoint: (point: Keypoint) => void
  updateKeypoint: (id: string, updates: Partial<Keypoint>) => void
  deleteKeypoint: (id: string) => void
  filterByType: (type: 'core' | 'exam' | 'trap') => Keypoint[]
}

export const useKeypointStore = create<KeypointStore>((set, get) => ({
  keypoints: [],
  setKeypoints: (points) => set({ keypoints: points }),
  addKeypoint: (point) => set((state) => ({ keypoints: [...state.keypoints, point] })),
  updateKeypoint: (id, updates) => set((state) => ({
    keypoints: state.keypoints.map(k => k.id === id ? { ...k, ...updates } : k)
  })),
  deleteKeypoint: (id) => set((state) => ({
    keypoints: state.keypoints.filter(k => k.id !== id)
  })),
  filterByType: (type) => get().keypoints.filter(k => k.type === type),
}))
