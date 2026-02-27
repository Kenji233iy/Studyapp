import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { messages, documentId, currentPage, language, density } = await request.json()

    // Get document info
    let documentContext = ''
    if (documentId) {
      const { data: doc } = await supabase
        .from('documents')
        .select('name, topics')
        .eq('id', documentId)
        .single()
      if (doc) {
        documentContext = doc.name
      }
    }

    // Build system prompt
    const systemPrompt = `Eres un tutor académico experto y asistente de estudio personalizado. El usuario
está estudiando el siguiente material:

DOCUMENTOS DISPONIBLES: ${documentContext}
TEMAS DEL MATERIAL: ${documentContext}

Tu comportamiento:
1. Responde preguntas académicas sobre el material con precisión y claridad
2. Cita páginas específicas cuando respondas
3. Si el usuario pide flashcards, análisis o resúmenes, ofrece generarlas
4. Adapta el nivel de dificultad según las respuestas del usuario
5. Si detectas un concepto erróneo, corrígelo amablemente
6. NUNCA inventes información que no esté en los documentos
7. Usa markdown para formatear respuestas

Idioma: ${language === 'es' ? 'Español' : 'English'}
Densidad: ${density || 'standard'}`

    const systemMessages = [
      {
        role: 'user',
        content: systemPrompt,
      },
      {
        role: 'assistant',
        content: 'Entendido. Soy tu asistente académico. ¿En qué puedo ayudarte?',
      },
    ]

    // Create streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await anthropic.messages.stream({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            system: systemPrompt,
            messages: [
              ...systemMessages,
              ...messages.map((m: any) => ({
                role: m.role,
                content: m.content,
              })),
            ],
          })

          for await (const event of response) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              controller.enqueue(new TextEncoder().encode(event.delta.text))
            }
          }

          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    // Save message to database
    const { data: { user } } = await supabase.auth.getUser()
    if (user && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === 'user') {
        await supabase.from('chat_messages').insert({
          user_id: user.id,
          role: 'user',
          content: lastMessage.content,
          document_id: documentId,
          page_reference: currentPage,
        })
      }
    }

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
