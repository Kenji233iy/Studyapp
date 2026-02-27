import { useState } from 'react'
import { useSettingsStore } from '../stores/settingsStore'
import { supabase } from '../lib/supabase'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { preferences, setPreferences } = useSettingsStore()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Save to Supabase
        const { error } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            ...preferences,
            updated_at: new Date().toISOString(),
          })
        if (!error) {
          onClose()
        }
      }
    } catch (err) {
      console.error('Error saving preferences:', err)
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="glass max-w-md w-full mx-4 p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-display font-bold mb-6" style={{ color: 'var(--text)' }}>
          Configuración
        </h2>

        {/* Theme */}
        <div className="mb-6">
          <label className="text-sm font-semibold mb-2 block" style={{ color: 'var(--text2)' }}>
            Tema Visual
          </label>
          <select
            value={preferences.theme}
            onChange={(e) => setPreferences({ theme: e.target.value as any })}
            className="w-full px-3 py-2 glass rounded-lg border border-white/30 focus:outline-none"
            style={{ color: 'var(--text)' }}
          >
            <option value="light">Claro</option>
            <option value="dark">Oscuro</option>
            <option value="green">Verde</option>
          </select>
        </div>

        {/* Language */}
        <div className="mb-6">
          <label className="text-sm font-semibold mb-2 block" style={{ color: 'var(--text2)' }}>
            Idioma
          </label>
          <select
            value={preferences.language}
            onChange={(e) => setPreferences({ language: e.target.value as any })}
            className="w-full px-3 py-2 glass rounded-lg border border-white/30 focus:outline-none"
            style={{ color: 'var(--text)' }}
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>

        {/* AI Density */}
        <div className="mb-6">
          <label className="text-sm font-semibold mb-2 block" style={{ color: 'var(--text2)' }}>
            Densidad de Contenido IA
          </label>
          <select
            value={preferences.ai_density}
            onChange={(e) => setPreferences({ ai_density: e.target.value as any })}
            className="w-full px-3 py-2 glass rounded-lg border border-white/30 focus:outline-none"
            style={{ color: 'var(--text)' }}
          >
            <option value="concise">Conciso</option>
            <option value="standard">Estándar</option>
            <option value="detailed">Detallado</option>
          </select>
        </div>

        {/* Pomodoro Focus */}
        <div className="mb-6">
          <label className="text-sm font-semibold mb-2 block" style={{ color: 'var(--text2)' }}>
            Duración Enfoque (minutos)
          </label>
          <select
            value={preferences.pomodoro_focus}
            onChange={(e) => setPreferences({ pomodoro_focus: parseInt(e.target.value) })}
            className="w-full px-3 py-2 glass rounded-lg border border-white/30 focus:outline-none"
            style={{ color: 'var(--text)' }}
          >
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={45}>45</option>
            <option value={60}>60</option>
          </select>
        </div>

        {/* Pomodoro Short Break */}
        <div className="mb-6">
          <label className="text-sm font-semibold mb-2 block" style={{ color: 'var(--text2)' }}>
            Descanso Corto (minutos)
          </label>
          <select
            value={preferences.pomodoro_short_break}
            onChange={(e) => setPreferences({ pomodoro_short_break: parseInt(e.target.value) })}
            className="w-full px-3 py-2 glass rounded-lg border border-white/30 focus:outline-none"
            style={{ color: 'var(--text)' }}
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>

        {/* Pomodoro Long Break */}
        <div className="mb-6">
          <label className="text-sm font-semibold mb-2 block" style={{ color: 'var(--text2)' }}>
            Descanso Largo (minutos)
          </label>
          <select
            value={preferences.pomodoro_long_break}
            onChange={(e) => setPreferences({ pomodoro_long_break: parseInt(e.target.value) })}
            className="w-full px-3 py-2 glass rounded-lg border border-white/30 focus:outline-none"
            style={{ color: 'var(--text)' }}
          >
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>
        </div>

        {/* Sound */}
        <div className="mb-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={preferences.sound_enabled}
              onChange={(e) => setPreferences({ sound_enabled: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span style={{ color: 'var(--text2)' }}>Sonido de Notificaciones</span>
          </label>
        </div>

        {/* Auto-start */}
        <div className="mb-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={preferences.auto_start_timer}
              onChange={(e) => setPreferences({ auto_start_timer: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span style={{ color: 'var(--text2)' }}>Auto-iniciar Siguiente Sesión</span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg transition-all"
            style={{
              backgroundColor: 'rgba(0,0,0,0.1)',
              color: 'var(--text)',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-4 py-2 rounded-lg transition-all text-white disabled:opacity-50"
            style={{
              backgroundColor: 'var(--accent)',
            }}
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
