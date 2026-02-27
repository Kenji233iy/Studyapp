import { useSummaryStore } from '../stores/summaryStore'

export default function SummariesPage() {
  const summaries = useSummaryStore((state) => state.summaries)

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>
          Resúmenes
        </h2>
        <div className="flex gap-2 mb-4">
          <button className="px-4 py-2 rounded-lg glass text-sm">Todos</button>
          <button className="px-4 py-2 rounded-lg glass text-sm" style={{ color: 'var(--text3)' }}>Por Tema</button>
        </div>
      </div>

      {summaries.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center">
          <p className="text-4xl mb-4">📝</p>
          <h3 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>
            No hay resúmenes yet
          </h3>
          <p className="mb-6" style={{ color: 'var(--text2)' }}>
            Sube un PDF y genera resúmenes con IA
          </p>
          <button
            className="px-6 py-2 rounded-lg"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'white',
            }}
          >
            Generar Resúmenes
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {summaries.map((summary) => (
            <div key={summary.id} className="glass rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold" style={{ color: 'var(--text)' }}>
                    {summary.title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text3)' }}>
                    {summary.topic}
                  </p>
                </div>
                <div className="flex gap-2">
                  {summary.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: 'var(--accent)',
                        color: 'white',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <p style={{ color: 'var(--text2)' }} className="line-clamp-3 mb-4">
                {summary.body}
              </p>
              <div className="flex gap-2">
                <button className="text-sm px-3 py-1 rounded hover:glass">✏️ Editar</button>
                <button className="text-sm px-3 py-1 rounded hover:glass">🎴 Flashcards</button>
                <button className="text-sm px-3 py-1 rounded hover:glass">📋 Copiar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
