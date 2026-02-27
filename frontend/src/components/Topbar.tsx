import { useLocation } from 'react-router-dom'

const pageNames: Record<string, string> = {
  '/upload': 'Subir PDFs',
  '/resumenes': 'Resúmenes',
  '/flashcards': 'Flashcards',
  '/puntos': 'Puntos Clave',
  '/chat': 'Chat + PDF',
}

export default function Topbar() {
  const location = useLocation()
  const pageTitle = pageNames[location.pathname] || 'StudyFlow'

  return (
    <div className="glass m-2 rounded-3xl px-8 py-6 flex items-center justify-between" style={{ height: '80px' }}>
      <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>
        {pageTitle}
      </h1>
      <div className="flex items-center gap-4">
        <button
          className="px-4 py-2 rounded-lg transition-all hover:scale-105"
          style={{
            backgroundColor: 'var(--accent)',
            color: 'white',
          }}
        >
          ✨ Generar Material
        </button>
      </div>
    </div>
  )
}
