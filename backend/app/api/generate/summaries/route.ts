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
    const { documentId, selectedTopics, density, language } = await request.json()

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

    const prompt = `Eres un catedrático universitario experto en didáctica. El usuario está estudiando
y necesita resúmenes de alta calidad para retener y comprender el material.

Contexto del documento: ${documentText.substring(0, 2000)}

Genera un resumen para cada uno de estos temas: ${selectedTopics.join(', ')}

Para cada tema devuelve un JSON con este formato:
{
  "summaries": [
    {
      "topic": "Nombre del tema",
      "title": "Título atractivo y descriptivo del resumen",
      "body": "Resumen claro, preciso y didáctico. Mínimo 3 párrafos bien desarrollados.",
      "tags": ["Core"|"Examen"|"Trampa"],
      "keyTerms": ["término1", "término2"],
      "estimatedReadTime": 3
    }
  ]
}

Densidad de contenido solicitada: ${density}
- concise: resúmenes de 150-200 palabras
- standard: 300-400 palabras
- detailed: 500-700 palabras con ejemplos y comparaciones

Idioma: ${language === 'es' ? 'Español' : language === 'en' ? 'English' : language === 'fr' ? 'Français' : 'Deutsch'}`

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const summariesText =
      response.content[0].type === 'text' ? response.content[0].text : ''
    const summariesData = JSON.parse(summariesText)

    // Save summaries to database
    const { data: { user } } = await supabase.auth.getUser()

    const summariesToInsert = summariesData.summaries.map((s: any) => ({
      user_id: user?.id,
      document_id: documentId,
      topic: s.topic,
      title: s.title,
      body: s.body,
      tags: s.tags,
      key_terms: s.keyTerms,
    }))

    const { data: savedSummaries, error: insertError } = await supabase
      .from('summaries')
      .insert(summariesToInsert)
      .select()

    if (insertError) {
      return NextResponse.json(
        { error: 'Could not save summaries' },
        { status: 500 }
      )
    }

    return NextResponse.json({ summaries: savedSummaries })
  } catch (error) {
    console.error('Summaries error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
