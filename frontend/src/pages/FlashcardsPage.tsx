import { useFlashcardStore } from '../stores/flashcardStore'
import { useState } from 'react'

export default function FlashcardsPage() {
  const flashcards = useFlashcardStore((state) => state.flashcards)
  const [isStudyMode, setIsStudyMode] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  if (isStudyMode && flashcards.length > 0) {
    const card = flashcards[currentIndex]
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-screen">
        <button
          onClick={() => setIsStudyMode(false)}
          className="absolute top-8 left-8 px-4 py-2 rounded-lg glass"
        >
          ← Salir
        </button>

        <div className="w-full max-w-2xl">
          <p className="text-center mb-8" style={{ color: 'var(--text3)' }}>
            {currentIndex + 1} de {flashcards.length}
          </p>

          <div
            className="glass rounded-3xl p-12 min-h-96 flex flex-col items-center justify-center cursor-pointer transition-all"
            onClick={() => setIsFlipped(!isFlipped)}
            style={{
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="text-center">
              {!isFlipped ? (
                <>
                  <p className="text-sm mb-4" style={{ color: 'var(--accent)' }}>
                    Pregunta
                  </p>
                  <p className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>
                    {card.question}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm mb-4" style={{ color: 'var(--accent)' }}>
                    Respuesta
                  </p>
                  <p className="text-lg" style={{ color: 'var(--text)' }}>
                    {card.answer}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() =>
                setCurrentIndex(Math.max(0, currentIndex - 1))
              }
              className="px-6 py-2 rounded-lg glass"
            >
              ← Anterior
            </button>
            <button
              onClick={() =>
                setCurrentIndex(Math.min(flashcards.length - 1, currentIndex + 1))
              }
              className="px-6 py-2 rounded-lg glass"
            >
              Siguiente →
            </button>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button
              className="px-6 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: 'var(--accent5)',
                color: 'white',
              }}
            >
              ❌ No lo sabía
            </button>
            <button
              className="px-6 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: 'var(--accent4)',
                color: 'white',
              }}
            >
              🤔 Con dificultad
            </button>
            <button
              className="px-6 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: 'var(--accent3)',
                color: 'white',
              }}
            >
              ✅ Lo sabía bien
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>
          Flashcards
        </h2>
        <button
          onClick={() => setIsStudyMode(true)}
          disabled={flashcards.length === 0}
          className="px-6 py-2 rounded-lg transition-all hover:scale-105"
          style={{
            backgroundColor: flashcards.length > 0 ? 'var(--accent)' : 'rgba(0,0,0,0.1)',
            color: flashcards.length > 0 ? 'white' : 'var(--text3)',
          }}
        >
          🎓 Modo Estudio
        </button>
      </div>

      {flashcards.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center">
          <p className="text-4xl mb-4">🎴</p>
          <h3 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>
            No hay flashcards yet
          </h3>
          <p className="mb-6" style={{ color: 'var(--text2)' }}>
            Sube un PDF y genera flashcards con IA
          </p>
          <button
            className="px-6 py-2 rounded-lg"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'white',
            }}
          >
            Generar Flashcards
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flashcards.map((card) => (
            <div
              key={card.id}
              className="glass rounded-2xl p-4 min-h-48 flex flex-col justify-between cursor-pointer hover:translate-y-[-4px] transition-all"
            >
              <div>
                <div className="flex gap-2 mb-3">
                  <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                    {card.category}
                  </span>
                  <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--text3)', color: 'white' }}>
                    {card.difficulty}
                  </span>
                </div>
                <p className="font-semibold" style={{ color: 'var(--text)' }}>
                  {card.question}
                </p>
              </div>
              <p className="text-sm" style={{ color: 'var(--text3)' }}>
                {card.status === 'new' ? '🆕 Nuevo' : card.status === 'review' ? '🔄 Por repasar' : '✅ Dominado'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
