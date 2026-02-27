import { useState, useEffect } from 'react'
import { useSettingsStore } from '../stores/settingsStore'

type TimerMode = 'focus' | 'short_break' | 'long_break'

export default function Pomodoro() {
  const prefs = useSettingsStore((state) => state.preferences)
  const [mode, setMode] = useState<TimerMode>('focus')
  const [timeLeft, setTimeLeft] = useState(prefs.pomodoro_focus * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    } else if (timeLeft === 0 && isRunning) {
      // Notify user and switch mode
      if (prefs.sound_enabled) {
        const audio = new Audio('data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==')
        audio.play().catch(() => {})
      }
      switchMode()
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft, prefs.sound_enabled])

  const switchMode = () => {
    if (mode === 'focus') {
      setSessionsCompleted((s) => s + 1)
      setMode(sessionsCompleted % 4 === 3 ? 'long_break' : 'short_break')
      const newTime =
        sessionsCompleted % 4 === 3
          ? prefs.pomodoro_long_break * 60
          : prefs.pomodoro_short_break * 60
      setTimeLeft(newTime)
    } else {
      setMode('focus')
      setTimeLeft(prefs.pomodoro_focus * 60)
    }
    if (!prefs.auto_start_timer) {
      setIsRunning(false)
    }
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(prefs.pomodoro_focus * 60)
    setMode('focus')
    setSessionsCompleted(0)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const modeLabels = {
    focus: 'Enfoque',
    short_break: 'Descanso Corto',
    long_break: 'Descanso Largo',
  }

  const radius = 45
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (timeLeft / (prefs.pomodoro_focus * 60)) * circumference

  return (
    <div className="flex flex-col items-center">
      <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text3)' }}>
        POMODORO
      </p>
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="4"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <p
            className="font-display font-bold text-2xl"
            style={{ color: 'var(--text)' }}
          >
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </p>
          <p className="text-xs" style={{ color: 'var(--text3)' }}>
            {modeLabels[mode]}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-3 py-1 rounded-lg text-sm transition-all hover:scale-110"
          style={{
            backgroundColor: isRunning ? 'var(--accent)' : 'var(--glass)',
            color: isRunning ? 'white' : 'var(--text)',
          }}
        >
          {isRunning ? '⏸' : '▶'}
        </button>
        <button
          onClick={resetTimer}
          className="px-3 py-1 rounded-lg text-sm transition-all hover:scale-110"
          style={{
            backgroundColor: 'var(--glass)',
            color: 'var(--text)',
          }}
        >
          ↺
        </button>
      </div>

      <div className="flex gap-1 mt-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-all"
            style={{
              backgroundColor:
                i < sessionsCompleted ? 'var(--accent)' : 'rgba(0,0,0,0.2)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
