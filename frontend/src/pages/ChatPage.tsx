import { useState, useRef, useEffect } from 'react'
import { useDocumentStore } from '../stores/documentStore'

export default function ChatPage() {
  const documents = useDocumentStore((state) => state.documents)
  const [messages, setMessages] = useState<Array<{ id: string; role: 'user' | 'assistant'; content: string }>>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: text,
    }

    setMessages([...messages, userMessage])
    setInput('')
    setIsLoading(true)

    // TODO: Call /api/chat endpoint
    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: 'Esta es una respuesta de demostración. Pronto estará conectado a Claude API.',
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 500)
  }

  const quickSuggestions = [
    '📝 Explica este párrafo',
    '🎴 Genera flashcards',
    '⭐ ¿Qué es importante?',
    '📋 Resumir'
  ]

  return (
    <div className="flex h-full">
      {/* PDF Viewer Panel */}
      <div className="flex-1 border-r p-4" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
        <div className="glass rounded-2xl h-full p-4 flex flex-col items-center justify-center">
          <p className="text-4xl mb-4">📄</p>
          <h3 className="font-display text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>
            Visualizador de PDF
          </h3>
          <p style={{ color: 'var(--text2)' }} className="text-center">
            {documents.length > 0
              ? 'Selecciona un documento para ver su contenido'
              : 'Sube un PDF desde la pestaña de Upload'}
          </p>
        </div>
      </div>

      {/* Chat Panel */}
      <div className="flex-1 flex flex-col p-4 gap-4">
        <div className="glass rounded-2xl flex-1 flex flex-col">
          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-4xl mb-4">💬</p>
                <h3 className="font-display text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>
                  Comienza a preguntar
                </h3>
                <p style={{ color: 'var(--text2)' }}>
                  Haz preguntas sobre tus documentos
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl"
                    style={{
                      backgroundColor:
                        msg.role === 'user'
                          ? 'var(--accent)'
                          : 'rgba(0, 0, 0, 0.05)',
                      color:
                        msg.role === 'user'
                          ? 'white'
                          : 'var(--text)',
                    }}
                  >
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))
            )}

            {isLoading && (
              <div className="mb-4 flex justify-start">
                <div className="px-4 py-3 rounded-2xl" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
                  <div className="flex gap-1">
                    <span className="animate-pulse-dot">●</span>
                    <span className="animate-pulse-dot" style={{ animationDelay: '0.2s' }}>●</span>
                    <span className="animate-pulse-dot" style={{ animationDelay: '0.4s' }}>●</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length === 0 && (
            <div className="px-4 pb-4 flex flex-wrap gap-2">
              {quickSuggestions.map((sugg) => (
                <button
                  key={sugg}
                  onClick={() => handleSendMessage(sugg)}
                  className="px-3 py-2 rounded-lg text-xs transition-all hover:scale-105"
                  style={{
                    backgroundColor: 'rgba(91, 106, 245, 0.1)',
                    color: 'var(--accent)',
                  }}
                >
                  {sugg}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="border-t p-4" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage(input)
                  }
                }}
                placeholder="Escribe tu pregunta..."
                className="flex-1 rounded-lg p-3 border-0 focus:outline-none resize-none"
                rows={2}
                style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
              />
              <button
                onClick={() => handleSendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="px-4 py-2 rounded-lg transition-all hover:scale-105"
                style={{
                  backgroundColor: input.trim() && !isLoading ? 'var(--accent)' : 'rgba(0,0,0,0.1)',
                  color: input.trim() && !isLoading ? 'white' : 'var(--text3)',
                }}
              >
                ➜
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
