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
    const { documentId } = await request.json()

    // Get document from database
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (docError || !document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // Download PDF from Supabase Storage
    const { data: pdfData, error: downloadError } = await supabase.storage
      .from('pdfs')
      .download(document.storage_path)

    if (downloadError || !pdfData) {
      return NextResponse.json(
        { error: 'Could not download PDF' },
        { status: 500 }
      )
    }

    // TODO: Extract text from PDF using pdf-parse
    const pdfText = 'Extracted PDF text would go here'

    // Call Claude to analyze PDF and detect topics
    const analysisPrompt = `Eres un asistente académico experto. Se te proporcionará el texto completo de un documento académico. Tu tarea es:
1. Identificar los temas principales del documento (mínimo 5, máximo 15)
2. Devuelve SOLO un JSON con este formato exacto:
{
  "topics": [
    { "id": "t1", "name": "Nombre del tema", "pageRange": "1-8", "importance": "high|medium|low" }
  ],
  "documentSummary": "Resumen en 2 oraciones del documento completo",
  "totalTopics": 8
}
No añadas explicación extra ni markdown. Solo el JSON puro.

Documento:
${pdfText.substring(0, 4000)}`

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: analysisPrompt,
        },
      ],
    })

    const analysisText =
      response.content[0].type === 'text' ? response.content[0].text : ''
    const analysis = JSON.parse(analysisText)

    // Update document with detected topics
    const { error: updateError } = await supabase
      .from('documents')
      .update({
        topics: analysis.topics,
      })
      .eq('id', documentId)

    if (updateError) {
      return NextResponse.json(
        { error: 'Could not update document' },
        { status: 500 }
      )
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
