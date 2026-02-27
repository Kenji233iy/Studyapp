import { useState } from 'react'
import { useDocumentStore } from '../stores/documentStore'
import { supabase } from '../lib/supabase'

export default function UploadPage() {
  const { documents, addDocument } = useDocumentStore()
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf')
    if (files.length > 0) {
      await uploadFiles(files as File[])
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.currentTarget.files || [])
    if (files.length > 0) {
      await uploadFiles(files as File[])
    }
  }

  const uploadFiles = async (files: File[]) => {
    setUploading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    for (const file of files) {
      try {
        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from('pdfs')
          .upload(`${user.id}/${Date.now()}-${file.name}`, file)

        if (uploadError) continue

        // Create document record
        const { data: docData, error: dbError } = await supabase
          .from('documents')
          .insert({
            user_id: user.id,
            name: file.name,
            storage_path: data?.path,
            topics: [],
            page_count: 0,
          })
          .select()
          .single()

        if (!dbError && docData) {
          addDocument(docData)
        }
      } catch (err) {
        console.error('Upload error:', err)
      }
    }
    setUploading(false)
  }

  return (
    <div className="p-8">
      <div
        className="glass p-12 rounded-3xl border-2 border-dashed text-center cursor-pointer transition-all"
        style={{
          borderColor: isDragging ? 'var(--accent)' : 'rgba(0,0,0,0.1)',
          backgroundColor: isDragging ? 'rgba(91, 106, 245, 0.05)' : 'var(--glass)',
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <p className="text-4xl mb-4">📄</p>
        <h2 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>
          Arrastra tus PDFs aquí
        </h2>
        <p className="mb-6" style={{ color: 'var(--text2)' }}>
          o selecciona archivos para comenzar
        </p>
        <label>
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
          <button
            className="px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'white',
            }}
            disabled={uploading}
          >
            {uploading ? '⏳ Subiendo...' : '📁 Seleccionar archivos'}
          </button>
        </label>
      </div>

      {documents.length > 0 && (
        <div className="mt-8">
          <h3 className="font-display text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>
            Documentos Subidos ({documents.length})
          </h3>
          <div className="grid gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="glass p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📄</span>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--text)' }}>
                      {doc.name}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text3)' }}>
                      {doc.page_count} páginas • {doc.topics?.length || 0} temas
                    </p>
                  </div>
                </div>
                <button
                  className="px-4 py-2 rounded-lg text-sm transition-all"
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: 'white',
                  }}
                >
                  Analizar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
