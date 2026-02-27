-- StudyFlow Database Schema for Supabase

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  storage_path TEXT,
  topics JSONB,
  page_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Summaries table
CREATE TABLE summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  document_id UUID REFERENCES documents NOT NULL,
  topic TEXT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  tags TEXT[],
  key_terms TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flashcards table
CREATE TABLE flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  document_id UUID REFERENCES documents NOT NULL,
  topic TEXT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  difficulty TEXT,
  hint TEXT,
  status TEXT DEFAULT 'new',
  next_review_at TIMESTAMPTZ,
  ease_factor FLOAT DEFAULT 2.5,
  interval INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Keypoints table
CREATE TABLE keypoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  document_id UUID REFERENCES documents NOT NULL,
  topic TEXT,
  type TEXT,
  text TEXT NOT NULL,
  related_concepts TEXT[],
  source_hint TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  session_id UUID,
  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  content TEXT NOT NULL,
  document_id UUID REFERENCES documents,
  page_reference INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  text TEXT NOT NULL,
  priority TEXT DEFAULT 'media',
  done BOOLEAN DEFAULT FALSE,
  due_date DATE,
  source TEXT DEFAULT 'manual',
  related_document_id UUID REFERENCES documents,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pomodoro sessions table
CREATE TABLE pomodoro_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  duration_minutes INTEGER,
  type TEXT CHECK (type IN ('focus', 'short_break', 'long_break')),
  completed BOOLEAN DEFAULT TRUE,
  document_id UUID REFERENCES documents,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User preferences table
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users NOT NULL,
  pomodoro_focus INTEGER DEFAULT 25,
  pomodoro_short_break INTEGER DEFAULT 5,
  pomodoro_long_break INTEGER DEFAULT 15,
  theme TEXT DEFAULT 'light',
  language TEXT DEFAULT 'es',
  ai_density TEXT DEFAULT 'standard',
  auto_start_timer BOOLEAN DEFAULT FALSE,
  sound_enabled BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE keypoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pomodoro_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users own documents" ON documents
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own summaries" ON summaries
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own flashcards" ON flashcards
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own keypoints" ON keypoints
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own chat messages" ON chat_messages
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own tasks" ON tasks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own pomodoro sessions" ON pomodoro_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Create storage bucket for PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('pdfs', 'pdfs', FALSE) ON CONFLICT DO NOTHING;

-- Storage policy
CREATE POLICY "Users can upload PDFs" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'pdfs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their PDFs" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'pdfs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
