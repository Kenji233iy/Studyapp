# StudyFlow - Architecture & Component Map

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React 18 + Vite)                   │
│  http://localhost:5173                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │  LoginPage   │  │ DashboardLay │  │   Sidebar    │            │
│  │ (AuthSupa)   │  │     out      │  │ (Nav + Tasks)│            │
│  └──────────────┘  ├──────────────┤  └──────────────┘            │
│                    │              │                              │
│  Pages:            │  ┌─────────┐ │  ┌──────────────┐            │
│  ├─ UploadPage     │  │ Topbar  │ │  │  Pomodoro    │            │
│  ├─ SummariesPage  │  └─────────┘ │  │  (Timer)     │            │
│  ├─ FlashcardsPage │              │  └──────────────┘            │
│  ├─ KeypointsPage  │  ┌─────────┐ │                              │
│  ├─ ChatPage       │  │ Content │ │  SettingsModal              │
│  └─ LoginPage      │  │  Area   │ │  (Theme, Lang, etc)         │
│                    │  └─────────┘ │                              │
│  Zustand Stores:   │              │                              │
│  ├─ documentStore  └──────────────┘                              │
│  ├─ summaryStore                                                 │
│  ├─ flashcardStore                                               │
│  ├─ keypointStore      Supabase Auth                              │
│  ├─ taskStore          (Email + Google OAuth)                     │
│  └─ settingsStore                                                │
│                                                                   │
│  UI Components:                                                   │
│  ├─ All use Frosted Glass design                                 │
│  ├─ TailwindCSS + Framer Motion                                  │
│  ├─ CSS Variables for theming                                    │
│  └─ Responsive layout (sidebar + main)                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
         ↓ API Proxy (vite.config.ts)                  ↓
         └────────────────────────────────────────────┘
                                                  HTTP
                                                   ↓
┌─────────────────────────────────────────────────────────────────┐
│              BACKEND (Next.js 14 App Router + API Routes)        │
│  http://localhost:3000                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  API Routes:                                                      │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ POST /api/analyze-pdf                                      │  │
│  │   ├─ Get PDF from Supabase Storage                         │  │
│  │   ├─ Extract text (pdf-parse)                              │  │
│  │   └─ Call Claude API → Get topics                          │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ POST /api/generate/summaries                               │  │
│  │   ├─ Receive: documentId, selectedTopics, density, lang    │  │
│  │   ├─ Call Claude API with custom prompt                    │  │
│  │   ├─ Save to summaries table                               │  │
│  │   └─ Return summaries[]                                    │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ POST /api/generate/flashcards                              │  │
│  │   ├─ Claude generates cards (definition, process, etc)     │  │
│  │   ├─ Save with SM-2 algorithm defaults                     │  │
│  │   └─ Return flashcards[] (with id, q, a, category, etc)   │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ POST /api/generate/keypoints                               │  │
│  │   ├─ Extract core, exam, trap type points                  │  │
│  │   ├─ Include related concepts & source hints               │  │
│  │   └─ Return keypoints[]                                    │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ POST /api/chat (STREAMING)                                 │  │
│  │   ├─ Receive: messages[], documentId, currentPage          │  │
│  │   ├─ Build system prompt with PDF context                  │  │
│  │   ├─ Stream response from Claude (token-by-token)          │  │
│  │   └─ Detect tool calls (create_task, save_flashcard)      │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ PATCH /api/flashcards/:id/review                           │  │
│  │   ├─ Receive: rating ('hard'|'medium'|'easy')              │  │
│  │   ├─ Calculate next_review_at using SM-2                   │  │
│  │   ├─ Update ease_factor & interval                         │  │
│  │   └─ Return updated flashcard                              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
         ↓                                            ↓
    Supabase SDK                              Anthropic SDK
         ↓                                            ↓
┌──────────────────────┐          ┌──────────────────────────────┐
│   SUPABASE           │          │ ANTHROPIC CLAUDE API         │
│ (PostgreSQL)         │          │ (claude-3-5-sonnet)          │
├──────────────────────┤          ├──────────────────────────────┤
│ • Auth               │          │ • Analyze PDFs               │
│ • documents table    │          │ • Generate summaries         │
│ • summaries table    │          │ • Create flashcards          │
│ • flashcards table   │          │ • Extract key points         │
│ • keypoints table    │          │ • Stream chat responses      │
│ • chat_messages tbl  │          │ • Detect tool calls          │
│ • tasks table        │          └──────────────────────────────┘
│ • user_preferences   │
│ • Storage (pdfs)     │
│ • RLS Policies       │
└──────────────────────┘
```

## Data Flow Diagrams

### PDF Upload Flow
```
User Upload
    ↓
[UploadPage Component]
    ↓
    ├─→ Validate file type (PDF)
    ├─→ Upload to Supabase Storage (/pdfs/user_id/filename)
    ├─→ Create document record in Postgres
    ├─→ Add to documentStore (Zustand)
    ├─→ Display in uploaded list
    └─→ User clicks "Analyze"
            ↓
        POST /api/analyze-pdf
            ↓
        [Backend: analyze-pdf/route.ts]
            ├─→ Fetch PDF from Supabase Storage
            ├─→ Extract text (pdf-parse library)
            ├─→ Call Claude API (system: analyze topics prompt)
            ├─→ Parse JSON response → topics[]
            ├─→ Update document.topics in Postgres
            └─→ Return topics to frontend
```

### Generate Summaries Flow
```
User selects topics → Clicks "Generar Resúmenes"
    ↓
[SummariesPage Component]
    ↓
POST /api/generate/summaries {
  documentId, selectedTopics, density, language
}
    ↓
[Backend: generate/summaries/route.ts]
    ├─→ Get document from Postgres
    ├─→ Build Claude prompt (user settings)
    ├─→ Call Claude API
    ├─→ Parse JSON (summaries[])
    ├─→ Insert into summaries table
    └─→ Return to frontend
            ↓
        useSummaryStore.setSummaries()
            ↓
        [Display in cards with tags, key terms, read time]
```

### Flashcard Study Flow
```
User in Study Mode
    ↓
[FlashcardsPage - studyMode component]
    ↓
    ├─→ getDueFlashcards() from Zustand
    ├─→ Display card (question facing)
    ├─→ User clicks card (3D flip animation)
    ├─→ Show answer
    ├─→ User clicks "No lo sabía" / "Con dificultad" / "Lo sabía bien"
    │       ↓
    │   PATCH /api/flashcards/:id/review { rating }
    │       ↓
    │   [Backend: Calculate SM-2]
    │   ├─ ease_factor = 1.3 to 2.5 based on performance
    │   ├─ interval = days until next review
    │   ├─ next_review_at = now + interval days
    │   └─ status = 'new' | 'review' | 'mastered'
    │       ↓
    │   Return updated card → Update Zustand
    │
    ├─→ Load next due card
    └─→ Repeat until no more due cards
```

### Chat with PDF Context Flow
```
User in ChatPage
    ├─→ Select PDF from dropdown
    ├─→ Select page number
    ├─→ Type question + press Enter
    │
    └─→ POST /api/chat {
          messages: [{role:'user', content:'...'}],
          documentId, currentPage, language, density
        }
            ↓
        [Backend: chat/route.ts]
            ├─→ Get document text (Supabase Storage)
            ├─→ Get current page text
            ├─→ Build system prompt with all context
            ├─→ Add document topics meta info
            ├─→ Stream messages.create() from Claude
            ├─→ Return EventSource stream
            └─→ Detect tool calls (create_task, save_flashcard)
                    ↓
                Handle tool functions
                    ↓
                INSERT into tasks or flashcards table
                    ↓
        [Frontend: Parse streaming response]
            ├─→ Display token by token
            ├─→ Detect markdown syntax
            ├─→ Render with react-markdown
            ├─→ Highlight citations from PDF
            └─→ Show "Save" button for generated material
```

## Component Relationships

```
App
├─ LoginPage (not authenticated)
│   └─ Supabase Auth UI
│
└─ DashboardLayout (authenticated)
   ├─ Sidebar
   │  ├─ Logo
   │  ├─ NavItems (Links to pages)
   │  ├─ Pomodoro (Timer widget)
   │  ├─ TaskList (5 recent tasks)
   │  └─ SettingsModal (Modal)
   │
   ├─ Topbar
   │  ├─ Page title (from route)
   │  ├─ Settings button → Opens SettingsModal
   │  └─ Logout button
   │
   └─ MainContent (Outlet)
      ├─ /upload → UploadPage
      │  └─ DocumentUpload component
      │
      ├─ /resumenes → SummariesPage
      │  ├─ SummaryCard component
      │  └─ Tabs, Filters
      │
      ├─ /flashcards → FlashcardsPage
      │  ├─ FlashcardGrid
      │  ├─ FlashcardCard (3D flip)
      │  └─ StudyMode component
      │
      ├─ /puntos → KeypointsPage
      │  ├─ KeypointList
      │  └─ TypeFilter tabs
      │
      └─ /chat → ChatPage
         ├─ PDFViewer (react-pdf)
         ├─ ChatContainer
         │  ├─ MessageBubbles (user + AI)
         │  ├─ ChatInput
         │  └─ SuggestedChips
         └─ StreamingResponse (markdown)
```

## Database Relationships

```
users (Supabase auth)
    ↓
    ├─ documents (1:N)
    │   │
    │   ├─ summaries (1:N)
    │   │   └─ topic, title, body, tags, key_terms
    │   │
    │   ├─ flashcards (1:N)
    │   │   └─ q, a, category, difficulty, SM-2 fields
    │   │
    │   ├─ keypoints (1:N)
    │   │   └─ type (core/exam/trap), text, concepts
    │   │
    │   └─ chat_messages (1:N)
    │       └─ user/assistant content, page_reference
    │
    ├─ tasks (1:N)
    │   └─ priority, done, due_date, source
    │
    ├─ pomodoro_sessions (1:N)
    │   └─ duration, type, completed
    │
    └─ user_preferences (1:1)
        └─ theme, language, ai_density, pomodoro times, etc.
```

## State Management (Zustand Stores)

```
useDocumentStore
├─ documents: Document[]
├─ selectedDocument: Document | null
├─ setDocuments()
├─ addDocument()
├─ setSelectedDocument()
└─ deleteDocument()

useSummaryStore
├─ summaries: Summary[]
├─ setSummaries()
├─ addSummary()
├─ updateSummary()
└─ deleteSummary()

useFlashcardStore
├─ flashcards: Flashcard[]
├─ setFlashcards()
├─ addFlashcard()
├─ updateFlashcard()
├─ deleteFlashcard()
└─ getDueFlashcards() → filters by next_review_at

useKeypointStore
├─ keypoints: Keypoint[]
├─ setKeypoints()
├─ addKeypoint()
├─ updateKeypoint()
├─ deleteKeypoint()
└─ filterByType(type)

useTaskStore
├─ tasks: Task[]
├─ setTasks()
├─ addTask()
├─ updateTask()
├─ deleteTask()
├─ toggleTaskDone()
└─ reorderTasks()

useSettingsStore (persisted to localStorage + Supabase)
├─ preferences: UserPreferences
├─ setPreferences()
└─ resetPreferences()
```

## API Route Details

### POST /api/analyze-pdf
**Purpose:** Extract topics from uploaded PDF
**Request:**
```json
{
  "documentId": "uuid"
}
```
**Response:**
```json
{
  "topics": [
    {
      "id": "t1",
      "name": "Tema nombre",
      "pageRange": "1-8",
      "importance": "high|medium|low"
    }
  ],
  "documentSummary": "2 sentence summary",
  "totalTopics": 5
}
```

### POST /api/generate/summaries
**Purpose:** Generate study summaries for selected topics
**Request:**
```json
{
  "documentId": "uuid",
  "selectedTopics": ["Tema 1", "Tema 2"],
  "density": "concise|standard|detailed",
  "language": "es|en|fr|de"
}
```
**Response:**
```json
{
  "summaries": [
    {
      "topic": "Tema",
      "title": "Resumen de Tema",
      "body": "...",
      "tags": ["Core", "Examen"],
      "keyTerms": ["term1", "term2"],
      "estimatedReadTime": 5
    }
  ]
}
```

### POST /api/chat (SERVER-SENT EVENTS / STREAMING)
**Purpose:** AI chat with PDF context
**Request:**
```json
{
  "messages": [
    {"role": "user", "content": "Explain..."}
  ],
  "documentId": "uuid",
  "currentPage": 5,
  "language": "es",
  "density": "standard"
}
```
**Response:** EventSource stream (token-by-token)
```
data: {"type":"content_block_start","content_block":{"type":"text"}}
data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"The"}}
data: {"type":"content_block_delta","delta":{"type":"text_delta","text":" response"}}
...
```

---

**This architecture supports the complete StudyFlow workflow from PDF upload → AI analysis → material generation → spaced repetition study → personalized chat.**
