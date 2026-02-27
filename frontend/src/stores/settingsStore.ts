import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserPreferences {
  pomodoro_focus: number
  pomodoro_short_break: number
  pomodoro_long_break: number
  theme: 'light' | 'dark' | 'green'
  language: 'es' | 'en' | 'fr' | 'de'
  ai_density: 'concise' | 'standard' | 'detailed'
  auto_start_timer: boolean
  sound_enabled: boolean
}

interface SettingsStore {
  preferences: UserPreferences
  setPreferences: (prefs: Partial<UserPreferences>) => void
  resetPreferences: () => void
}

const defaultPreferences: UserPreferences = {
  pomodoro_focus: 25,
  pomodoro_short_break: 5,
  pomodoro_long_break: 15,
  theme: 'light',
  language: 'es',
  ai_density: 'standard',
  auto_start_timer: false,
  sound_enabled: true,
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      setPreferences: (prefs) => set((state) => ({
        preferences: { ...state.preferences, ...prefs }
      })),
      resetPreferences: () => set({ preferences: defaultPreferences }),
    }),
    {
      name: 'studyflow-settings',
    }
  )
)
