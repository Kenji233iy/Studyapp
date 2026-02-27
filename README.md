# StudyFlow - AI-Powered Study Assistant

A fullstack web application that combines PDF analysis, intelligent study material generation, spaced repetition flashcards, productivity tools, and AI-powered chat—all with a beautiful frosted glass design.

## 🚀 Features

- **📄 PDF Upload & Analysis**: Upload PDFs and let Claude AI extract key topics
- **📝 Smart Summaries**: Generate customizable summaries (concise/standard/detailed)
- **🎴 Spaced Repetition Flashcards**: Study with SM-2 algorithm for optimal learning
- **⭐ Key Points**: Extract critical concepts, exam-relevant material, and common misconceptions
- **💬 Interactive Chat**: Ask questions about your PDFs with AI context awareness
- **📊 PDF Viewer**: Side-by-side PDF viewing with highlights and annotations
- **⏱️ Pomodoro Timer**: Built-in productivity timer with customizable intervals
- **✅ Task Management**: AI-generated task suggestions with drag & drop organizing
- **⚙️ Personalization**: Theme, language, AI density, and Pomodoro preferences

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- TailwindCSS
- Framer Motion (animations)
- Zustand (state management)
- React Router (navigation)
- React-PDF (PDF viewer)
- React-Markdown

### Backend
- Next.js 14 (App Router)
- Node.js

### Database & Auth
- Supabase (PostgreSQL, Auth, Storage)

### AI
- Anthropic Claude Sonnet API

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier works)
- Anthropic API key

## 🏁 Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd /workspaces/Studyapp

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && npm install && cd ..
```

### 2. Setup Supabase

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor and run the SQL commands in `database.sql`:
   ```bash
   cat database.sql
   ```
   Copy all SQL commands and paste into Supabase SQL Editor

3. Create a Storage bucket for PDFs:
   - Go to Storage
   - Create a new bucket named `pdfs`
   - Make it private (RLS enabled)

4. Get your credentials:
   - Project URL: Settings → General → Project URL
   - Anon Key: Settings → API → Project API keys → `anon`
   - Service Role: Settings → API → Project API keys → `service_role`

### 3. Configure Environment Variables

**Frontend** (`frontend/.env.local`):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

**Backend** (`backend/.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ANTHROPIC_API_KEY=sk-ant-...
```

Get your Anthropic API key from: https://console.anthropic.com/

### 4. Run Development Server

```bash
# From root directory, run both frontend and backend
npm run dev

# Or run separately in different terminals:
cd frontend && npm run dev      # Runs on http://localhost:5173
cd backend && npm run dev       # Runs on http://localhost:3000
```

## 📁 Project Structure

```
StudyFlow/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components (Upload, Summaries, etc.)
│   │   ├── stores/          # Zustand state management
│   │   ├── lib/             # Utilities (Supabase client)
│   │   ├── types/           # TypeScript type definitions
│   │   └── App.tsx          # Main app component
│   └── vite.config.ts
├── backend/                  # Next.js 14 API server
│   ├── app/
│   │   └── api/             # API routes
│   │       ├── analyze-pdf/
│   │       ├── generate/
│   │       │   ├── summaries/
│   │       │   ├── flashcards/
│   │       │   └── keypoints/
│   │       └── chat/
│   └── next.config.js
├── database.sql             # SQL schema
└── package.json             # Root workspace config
```

## 🎨 Design System

All components use a **Frosted Glass** aesthetic:
- **Colors**: Lavender accent (#5b6af5), mint (#34d399), orange (#fb923c), pink (#f472b6)
- **Typography**: DM Serif Display (titles), DM Sans (body), JetBrains Mono (code)
- **Effects**: Blur (24px), saturate (180%), smooth animations
- **Layout**: Fixed 260px sidebar, flexible main content area

## 🔐 Authentication

The app uses Supabase Auth with email/password and Google OAuth. 

1. First time users will be prompted to sign up
2. User preferences are saved to the database
3. All data is automatically filtered by user_id via RLS (Row Level Security)

## 📚 API Endpoints

### POST `/api/analyze-pdf`
Extract and analyze topics from a PDF
- Body: `{ documentId: string }`
- Returns: `{ topics: [], documentSummary: string }`

### POST `/api/generate/summaries`
Generate study summaries
- Body: `{ documentId, selectedTopics, density, language }`

### POST `/api/generate/flashcards`
Generate flashcards with SM-2 spacing
- Body: `{ documentId, selectedTopics, count, language }`

### POST `/api/generate/keypoints`
Extract key points from topics
- Body: `{ documentId, selectedTopics, language }`

### POST `/api/chat`
Streaming chat with Claude (context-aware)
- Body: `{ messages, documentId, currentPage, language, density }`

### PATCH `/api/flashcards/:id/review`
Update flashcard review status
- Body: `{ rating: 'hard' | 'medium' | 'easy' }`

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel deploy
```

### Backend (Vercel)
```bash
cd backend
vercel deploy
```

Update environment variables in Vercel project settings.

## 🐛 Troubleshooting

### "Supabase key not found"
- Check `.env.local` files are created with correct values
- Restart dev server after adding env vars

### "CORS errors"
- Backend proxy is configured in `frontend/vite.config.ts`
- Make sure backend runs on port 3000

### "PDF extraction failing"
- Ensure `pdf-parse` is installed: `npm install pdf-parse`
- PDF must be valid and not encrypted

### "Claude API key invalid"
- Get key from https://console.anthropic.com/
- Ensure in `backend/.env.local`

## 📖 Learn More

- [Supabase Documentation](https://supabase.com/docs)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Router](https://reactrouter.com/)
- [TailwindCSS](https://tailwindcss.com/)

## 📝 License

MIT License - feel free to use for personal or commercial projects

## 👨‍💻 Development Checklist

- [x] Project structure scaffolded
- [x] Authentication setup (Supabase Auth)
- [x] Database schema created
- [x] Frosted glass design system
- [ ] PDF upload and analysis
- [ ] Summaries generation
- [ ] Flashcards with spaced repetition
- [ ] Key points extraction
- [ ] Chat with PDF context
- [ ] Pomodoro timer
- [ ] Task management
- [ ] Settings modal
- [ ] Error handling
- [ ] Testing & optimization

---

**Built with ❤️ for efficient learning**