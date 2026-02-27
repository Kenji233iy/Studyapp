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
    const { documentId, selectedTopics, language } = await request.json()

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

    const prompt = `Eres un tutor universitario experto en identificar lo más importante de un tema
y en señalar trampas cognitivas frecuentes en estudiantes.

Contexto del documento: ${documentText.substring(0, 2000)}
Temas: ${selectedTopics.join(', ')}

Para cada tema, identifica los puntos más importantes y devuélvelos en este JSON:
{
  "keypoints": [
    {
      "topic": "Tema",
      "type": "core|exam|trap",
      "text": "El punto clave explicado de forma directa y precisa. Usa negritas para resaltar términos críticos con **término**. Sé específico.",
      "relatedConcepts": ["concepto1", "concepto2"],
      "sourceHint": "Indicación de dónde encontrar esto en el documento (ej: Cap. 3, pág 12)"
    }
  ]
}

TIPOS:
- core: conceptos fundamentales que todo el tema se basa en ellos
- exam: alta probabilidad de aparecer en evaluaciones
- trap: conceptos que los estudiantes suelen malinterpretar o confundir

Genera mínimo 3 puntos de cada tipo por tema seleccionado.
Idioma: ${language === 'es' ? 'Español' : language === 'en' ? 'English' : language === 'fr' ? 'Français' : 'Deutsch'}`

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 3000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const keypointsText =
      response.content[0].type === 'text' ? response.content[0].text : ''
    const keypointsData = JSON.parse(keypointsText)

    // Save keypoints to database
    const { data: { user } } = await supabase.auth.getUser()

    const pointsToInsert = keypointsData.keypoints.map((kp: any) => ({
      user_id: user?.id,
      document_id: documentId,
      topic: kp.topic,
      type: kp.type,
      text: kp.text,
      related_concepts: kp.relatedConcepts,
      source_hint: kp.sourceHint,
    }))

    const { data: savedPoints, error: insertError } = await supabase
      .from('keypoints')
      .insert(pointsToInsert)
      .select()

    if (insertError) {
      return NextResponse.json(
        { error: 'Could not save keypoints' },
        { status: 500 }
      )
    }

    return NextResponse.json({ keypoints: savedPoints })
  } catch (error) {
    console.error('Keypoints error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
