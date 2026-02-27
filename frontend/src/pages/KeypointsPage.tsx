import { useKeypointStore } from '../stores/keypointStore'
import { useState } from 'react'

export default function KeypointsPage() {
  const keypoints = useKeypointStore((state) => state.keypoints)
  const [filterType, setFilterType] = useState<'all' | 'core' | 'exam' | 'trap'>('all')

  const filteredPoints = filterType === 'all'
    ? keypoints
    : keypoints.filter(k => k.type === filterType)

  const typeColors = {
    core: 'var(--accent)',
    exam: 'var(--accent4)',
    trap: 'var(--accent5)',
  }

  const typeLabels = {
    core: '⭐ Core',
    exam: '📝 Examen',
    trap: '⚠️ Trampa',
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>
          Puntos Clave
        </h2>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'core', 'exam', 'trap'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className="px-4 py-2 rounded-lg transition-all"
              style={{
                backgroundColor: filterType === type ? 'var(--accent)' : 'var(--glass)',
                color: filterType === type ? 'white' : 'var(--text2)',
              }}
            >
              {type === 'all' ? 'Todos' : typeLabels[type]}
            </button>
          ))}
        </div>
      </div>

      {filteredPoints.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center">
          <p className="text-4xl mb-4">⭐</p>
          <h3 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>
            No hay puntos clave yet
          </h3>
          <p className="mb-6" style={{ color: 'var(--text2)' }}>
            Sube un PDF y extrae los puntos clave
          </p>
          <button
            className="px-6 py-2 rounded-lg"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'white',
            }}
          >
            Extraer Puntos Clave
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPoints.map((point) => (
            <div
              key={point.id}
              className="glass rounded-2xl p-6 hover:translate-x-1 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap mt-1"
                    style={{
                      backgroundColor: typeColors[point.type],
                      color: 'white',
                    }}
                  >
                    {typeLabels[point.type]}
                  </span>
                  <div className="flex-1">
                    <p style={{ color: 'var(--text)' }} className="font-semibold mb-1">
                      {point.topic}
                    </p>
                    <p style={{ color: 'var(--text2)' }}>
                      {point.text}
                    </p>
                  </div>
                </div>
              </div>

              {point.related_concepts && point.related_concepts.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {point.related_concepts.map((concept) => (
                    <button
                      key={concept}
                      className="text-xs px-2 py-1 rounded hover:glass transition-all"
                      style={{ color: 'var(--accent)', border: '1px solid var(--accent)' }}
                    >
                      {concept}
                    </button>
                  ))}
                </div>
              )}

              {point.source_hint && (
                <p className="text-xs mt-2" style={{ color: 'var(--text3)' }}>
                  📖 {point.source_hint}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
