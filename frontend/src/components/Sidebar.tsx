import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useTaskStore } from '../stores/taskStore'
import { useSettingsStore } from '../stores/settingsStore'
import Pomodoro from './Pomodoro'

export default function Sidebar() {
  const navigate = useNavigate()
  const tasks = useTaskStore((state) => state.tasks)
  const [showSettings, setShowSettings] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const navItems = [
    { icon: '📤', label: 'Subir PDFs', path: '/upload' },
    { icon: '📝', label: 'Resúmenes', path: '/resumenes' },
    { icon: '🎴', label: 'Flashcards', path: '/flashcards' },
    { icon: '⭐', label: 'Puntos Clave', path: '/puntos' },
    { icon: '💬', label: 'Chat + PDF', path: '/chat' },
  ]

  return (
    <aside className="w-64 glass m-2 rounded-3xl p-6 flex flex-col" style={{ height: 'calc(100vh - 1rem)' }}>
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3">
        <div className="text-3xl font-display font-bold" style={{ color: 'var(--accent)' }}>
          S
        </div>
        <div>
          <h2 className="font-display font-bold" style={{ color: 'var(--text)' }}>StudyFlow</h2>
          <p className="text-xs" style={{ color: 'var(--text3)' }}>AI Study</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 mb-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'glass font-semibold'
                  : 'text-gray-600 hover:text-gray-800'
              }`
            }
            style={({ isActive }) => ({
              color: isActive ? 'var(--accent)' : 'var(--text2)',
            })}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Pomodoro */}
      <div className="mb-6 pb-6 border-b" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
        <Pomodoro />
      </div>

      {/* Tasks Section */}
      <div className="mb-6 pb-6 border-b" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
        <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text3)' }}>TAREAS</p>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {tasks.slice(0, 5).map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-2 text-xs p-2 rounded hover:glass transition-all"
            >
              <input
                type="checkbox"
                checked={task.done}
                className="mt-1"
                readOnly
              />
              <span
                style={{
                  color: 'var(--text2)',
                  textDecoration: task.done ? 'line-through' : 'none',
                }}
                className="flex-1"
              >
                {task.text}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs mt-2" style={{ color: 'var(--text3)' }}>
          {tasks.filter(t => !t.done).length} por hacer
        </p>
      </div>

      {/* Footer */}
      <div className="space-y-2 pt-4 border-t" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-full text-left text-sm px-3 py-2 rounded-lg hover:glass transition-all"
          style={{ color: 'var(--text2)' }}
        >
          ⚙️ Configuración
        </button>
        <button
          onClick={handleLogout}
          className="w-full text-left text-sm px-3 py-2 rounded-lg hover:glass transition-all"
          style={{ color: 'var(--text2)' }}
        >
          🚪 Salir
        </button>
        <div className="flex items-center gap-2 px-3 py-2 text-xs" style={{ color: 'var(--accent3)' }}>
          <span className="w-2 h-2 rounded-full animate-pulse-dot" style={{ backgroundColor: 'var(--accent3)' }} />
          IA Conectada
        </div>
      </div>
    </aside>
  )
}
