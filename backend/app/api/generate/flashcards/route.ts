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
    const { documentId, selectedTopics, count, language } = await request.json()

    // Get document
    const { data: document } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // TODO: Extract actual PDF text
    const documentText = 'Extracted document text would go here'

    const prompt = `Eres un experto en técnicas de memorización basadas en evidencia (espaciado,
recuperación activa, elaboración). Genera flashcards de alta calidad educativa.

Contexto: ${documentText.substring(0, 2000)}
Temas seleccionados: ${selectedTopics.join(', ')}

Crea ${count} flashcards. Para cada una usa este JSON:
{
  "flashcards": [
    {
      "id": "fc_uuid",
      "question": "Pregunta clara, específica y que invite a recuperar activamente",
      "answer": "Respuesta completa pero concisa. Incluye el mecanismo o razonamiento",
      "category": "definition|process|comparison|exam|error|data",
      "topic": "Tema al que pertenece",
      "difficulty": "easy|medium|hard",
      "hint": "Pista opcional si la pregunta es compleja"
    }
  ]
}

REGLAS IMPORTANTES:
- definition: para conceptos y términos clave
- process: para pasos secuenciales o mecanismos
- comparison: para diferencias/similitudes entre dos cosas
- exam: preguntas que aparecen frecuentemente en exámenes
- error: conceptos que los estudiantes suelen confundir
- data: fechas, fórmulas, valores numéricos específicos

Prioriza categorías 'exam' y 'error'. Distribuye entre dificultades.
Idioma: ${language === 'es' ? 'Español' : language === 'en' ? 'English' : language === 'fr' ? 'Français' : 'Deutsch'}`

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const flashcardsText =
      response.content[0].type === 'text' ? response.content[0].text : ''
    const flashcardsData = JSON.parse(flashcardsText)

    // Save flashcards to database
    const { data: { user } } = await supabase.auth.getUser()

    const calculateNextReview = () => {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      return date.toISOString()
    }

    const cardsToInsert = flashcardsData.flashcards.map((fc: any) => ({
      user_id: user?.id,
      document_id: documentId,
      topic: fc.topic,
      question: fc.question,
      answer: fc.answer,
      category: fc.category,
      difficulty: fc.difficulty,
      hint: fc.hint,
      status: 'new',
      next_review_at: calculateNextReview(),
      ease_factor: 2.5,
      interval: 1,
    }))

    const { data: savedCards, error: insertError } = await supabase
      .from('flashcards')
      .insert(cardsToInsert)
      .select()

    if (insertError) {
      return NextResponse.json(
        { error: 'Could not save flashcards' },
        { status: 500 }
      )
    }

    return NextResponse.json({ flashcards: savedCards })
  } catch (error) {
    console.error('Flashcards error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
