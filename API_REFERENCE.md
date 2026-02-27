# StudyFlow - Quick Reference & API Documentation

## 🚀 Run it Locally

```bash
# 1. Install all dependencies
npm install && cd frontend && npm install && cd ../backend && npm install && cd ..

# 2. Create env files (see SETUP.md for values)
echo "VITE_SUPABASE_URL=..." > frontend/.env.local
echo "NEXT_PUBLIC_SUPABASE_URL=..." > backend/.env.local

# 3. Start dev servers
npm run dev

# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

## 🔌 API Endpoints (The Backbone)

### 1. **Analyze PDF**
Extract topics + key information from uploaded PDF

```bash
POST /api/analyze-pdf
Content-Type: application/json

{
  "documentId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response:**
```json
{
  "topics": [
    { "id": "t1", "name": "Introduction", "pageRange": "1-5", "importance": "high" },
    { "id": "t2", "name": "Chapter 1", "pageRange": "6-15", "importance": "medium" }
  ],
  "documentSummary": "A comprehensive guide to...",
  "totalTopics": 8
}
```

### 2. **Generate Summaries**
Create AI-powered study summaries

```bash
POST /api/generate/summaries
Content-Type: application/json

{
  "documentId": "550e8400-e29b-41d4-a716-446655440000",
  "selectedTopics": ["Introduction", "Chapter 1"],
  "density": "standard",
  "language": "es"
}
```

**Response:**
```json
{
  "summaries": [
    {
      "id": "uuid",
      "topic": "Introduction",
      "title": "Overview del Tema",
      "body": "Comprehensive summary text here...",
      "tags": ["Core", "Examen"],
      "keyTerms": ["term1", "term2", "term3"],
      "estimatedReadTime": 5,
      "created_at": "2024-02-27T10:30:00Z"
    }
  ]
}
```

### 3. **Generate Flashcards**
Create spaced-repetition study cards

```bash
POST /api/generate/flashcards
Content-Type: application/json

{
  "documentId": "550e8400-e29b-41d4-a716-446655440000",
  "selectedTopics": ["Introduction"],
  "count": 10,
  "language": "es"
}
```

**Response:**
```json
{
  "flashcards": [
    {
      "id": "uuid",
      "question": "What is the main topic?",
      "answer": "The main topic is...",
      "category": "definition",
      "difficulty": "medium",
      "hint": "Think about the introduction",
      "status": "new",
      "ease_factor": 2.5,
      "interval": 1,
      "next_review_at": null
    }
  ]
}
```

### 4. **Generate Key Points**
Extract critical concepts, exam points, and common misconceptions

```bash
POST /api/generate/keypoints
Content-Type: application/json

{
  "documentId": "550e8400-e29b-41d4-a716-446655440000",
  "selectedTopics": ["Introduction", "Chapter 1"],
  "language": "es"
}
```

**Response:**
```json
{
  "keypoints": [
    {
      "id": "uuid",
      "topic": "Introduction",
      "type": "core",
      "text": "The **fundamental concept** is that...",
      "relatedConcepts": ["concept1", "concept2"],
      "sourceHint": "Chapter 1, Page 5-7"
    },
    {
      "id": "uuid",
      "topic": "Chapter 1",
      "type": "exam",
      "text": "Students frequently encounter this question: **'How to...'**"
    },
    {
      "id": "uuid",
      "topic": "Introduction",
      "type": "trap",
      "text": "⚠️ Common misconception: It's NOT about... Instead, it's..."
    }
  ]
}
```

### 5. **Chat with AI** (Streaming)
Ask questions about your PDFs with AI context

```bash
POST /api/chat
Content-Type: application/json

{
  "messages": [
    {
      "role": "user",
      "content": "Explain the main topic in the context of page 5"
    }
  ],
  "documentId": "550e8400-e29b-41d4-a716-446655440000",
  "currentPage": 5,
  "language": "es",
  "density": "standard"
}
```

**Response:** Server-Sent Events (Streaming)
```
data: {"type":"content_block_start"}
data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"The"}}
data: {"type":"content_block_delta","delta":{"type":"text_delta","text":" answer"}}
...
data: {"type":"message_stop"}
```

### 6. **Review Flashcard** (SM-2 Algorithm)
Update flashcard review status and calculate next review date

```bash
PATCH /api/flashcards/:id/review
Content-Type: application/json

{
  "rating": "easy"  // "hard" | "medium" | "easy"
}
```

**Response:**
```json
{
  "id": "uuid",
  "question": "...",
  "answer": "...",
  "status": "review",
  "ease_factor": 2.65,
  "interval": 3,
  "next_review_at": "2024-03-05T10:30:00Z"
}
```

**SM-2 Algorithm Logic:**
- **Hard** → days_until_next = 1, ease_factor = max(1.3, ease - 0.2)
- **Medium** → days_until_next = 3, ease_factor unchanged
- **Easy** → days_until_next = 7+, ease_factor = ease + 0.1

## 📦 Environment Variables

### Frontend (.env.local)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### Backend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
ANTHROPIC_API_KEY=sk-ant-v0-...
```

## 🗄️ Supabase Tables

### documents
```sql
SELECT * FROM documents WHERE user_id = auth.uid();
-- Columns: id, user_id, name, storage_path, topics (JSONB), page_count
```

### summaries
```sql
SELECT * FROM summaries WHERE user_id = auth.uid();
-- Columns: id, topic, title, body, tags[], key_terms[], created_at, updated_at
```

### flashcards
```sql
SELECT * FROM flashcards WHERE user_id = auth.uid() AND next_review_at <= NOW();
-- Get due cards for today's study session
```

### keypoints
```sql
SELECT * FROM keypoints WHERE type = 'exam' ORDER BY document_id;
-- Filter by type: 'core', 'exam', 'trap'
```

### tasks
```sql
SELECT * FROM tasks WHERE user_id = auth.uid() AND done = FALSE ORDER BY position;
-- All pending tasks ordered by drag-drop position
```

### user_preferences
```sql
SELECT * FROM user_preferences WHERE user_id = auth.uid();
-- Theme, language, pomodoro settings, AI density
```

## 🎨 Frontend Components by Path

```
/frontend/src/
├── App.tsx                      # Router setup + auth check
├── main.tsx                     # React entry
├── index.css                    # Global styles + Frosted Glass design
│
├── components/
│   ├── DashboardLayout.tsx      # Layout wrapper (Sidebar + Topbar)
│   ├── Sidebar.tsx              # Navigation + Pomodoro + Tasks
│   ├── Topbar.tsx               # Page title + Settings
│   ├── Pomodoro.tsx             # Timer widget (SVG ring + countdown)
│   ├── SettingsModal.tsx        # Modal for preferences
│   └── [More components...]
│
├── pages/
│   ├── LoginPage.tsx            # Supabase Auth UI
│   ├── UploadPage.tsx           # Drag-drop PDF upload
│   ├── SummariesPage.tsx       # Display + manage summaries
│   ├── FlashcardsPage.tsx      # Grid + 3D flip + study mode
│   ├── KeypointsPage.tsx       # List + filter by type
│   └── ChatPage.tsx             # PDF viewer + chat side-by-side
│
├── stores/
│   ├── documentStore.ts         # Zustand: documents[]
│   ├── summaryStore.ts          # Zustand: summaries[]
│   ├── flashcardStore.ts        # Zustand: flashcards[] + getDueFlashcards()
│   ├── keypointStore.ts         # Zustand: keypoints[] + filterByType()
│   ├── taskStore.ts             # Zustand: tasks[] + reorder
│   └── settingsStore.ts         # Zustand (persisted): user preferences
│
├── lib/
│   └── supabase.ts              # Supabase client init
│
└── types/
    └── [TypeScript interfaces]
```

## 🔄 User Flow

```
1. User lands on app
   ↓
2. Not authenticated? → LoginPage (Supabase Auth)
   ↓
3. Authenticate (email or Google OAuth)
   ↓
4. Create user_preferences record
   ↓
5. Redirected to /upload (UploadPage)
   ↓
6. User uploads PDF
   ├─→ Stored in Supabase Storage (/pdfs/user_id/filename)
   ├─→ Document record created in Postgres
   └─→ Appears in document list
       ↓
7. User clicks "Analizar"
   ├─→ Backend extracts PDF text
   ├─→ Claude identifies topics
   └─→ Topics stored + displayed as chips
       ↓
8. User selects topics + action
   ├─→ "Generar Resúmenes" → /resumenes + generate
   ├─→ "Generar Flashcards" → /flashcards + generate
   ├─→ "Puntos Clave" → /puntos + generate
   └─→ "Abrir Chat" → /chat with context
       ↓
9. Material generated by Claude
   ├─→ Saved to Postgres
   ├─→ Displayed in UI
   └─→ User can edit, copy, or use for studying
       ↓
10. User studies
    ├─→ Flashcard study mode (SM-2 spacing)
    ├─→ Chat Q&A with PDF context
    ├─→ Pomodoro breaks
    └─→ Task management
        ↓
11. Preferences synced
    └─→ Settings saved to user_preferences table
```

## 💾 Common Database Queries

### Get all user's documents with topic count
```sql
SELECT d.id, d.name, array_length(d.topics, 1) as topic_count
FROM documents d
WHERE d.user_id = auth.uid()
ORDER BY d.created_at DESC;
```

### Get flashcards due today
```sql
SELECT * FROM flashcards
WHERE user_id = auth.uid()
  AND next_review_at IS NOT NULL
  AND next_review_at <= NOW()
ORDER BY next_review_at ASC;
```

### Get exam-type keypoints for a document
```sql
SELECT * FROM keypoints
WHERE user_id = auth.uid()
  AND document_id = '{document_uuid}'
  AND type = 'exam'
ORDER BY created_at DESC;
```

### Incomplete tasks
```sql
SELECT * FROM tasks
WHERE user_id = auth.uid()
  AND done = FALSE
ORDER BY position ASC;
```

## 🐛 Debugging Tips

### Check if auth session exists
```javascript
const { data: { session } } = await supabase.auth.getSession();
console.log(session?.user?.id);
```

### Test API from frontend
```javascript
const response = await fetch('/api/analyze-pdf', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ documentId: 'your-id' })
});
const data = await response.json();
console.log(data);
```

### View Supabase data
1. Go to Supabase Dashboard
2. Click "Table Editor"
3. Select any table
4. Filter by your user_id (top-right filter icon)

### Check Claude API
```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: sk-ant-..." \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 100,
    "messages": [{"role":"user","content":"Hi"}]
  }'
```

## 📄 Database Backup

```bash
# Export Supabase data
pg_dump --url=postgres://user:pass@host/db > backup.sql

# Restore
psql --url=postgres://user:pass@host/db < backup.sql
```

## 🚀 Performance Tips

- **Frontend**: Use `getDueFlashcards()` instead of filtering all
- **Backend**: Index on `user_id` and `next_review_at` (already in schema)
- **API**: Stream responses for chat (don't wait for full response)
- **PDF**: Cache extracted text in localStorage
- **Images**: Use Supabase CDN for images

## 📞 Support

- **Supabase Docs**: https://supabase.com/docs
- **Anthropic API**: https://docs.anthropic.com/
- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev

---

**v1.0 - StudyFlow Complete Stack**
