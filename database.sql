-- StudyFlow Database Schema
-- Run these SQL commands in Supabase SQL Editor

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  storage_path TEXT,
  topics JSONB,
  page_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create summaries table
CREATE TABLE IF NOT EXISTS summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  topic TEXT,
  title TEXT,
  body TEXT,
  tags TEXT[],
  key_terms TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create flashcards table
CREATE TABLE IF NOT EXISTS flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  topic TEXT,
  question TEXT,
  answer TEXT,
  category TEXT CHECK (category IN ('definition', 'process', 'comparison', 'exam', 'error', 'data')),
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  hint TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'review', 'mastered')),
  next_review_at TIMESTAMPTZ,
  ease_factor FLOAT DEFAULT 2.5,
  interval INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create keypoints table
CREATE TABLE IF NOT EXISTS keypoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  topic TEXT,
  type TEXT CHECK (type IN ('core', 'exam', 'trap')),
  text TEXT,
  related_concepts TEXT[],
  source_hint TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT,
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  page_reference INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  priority TEXT DEFAULT 'media' CHECK (priority IN ('alta', 'media', 'baja')),
  done BOOLEAN DEFAULT FALSE,
  due_date DATE,
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'ai')),
  related_document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create pomodoro_sessions table
CREATE TABLE IF NOT EXISTS pomodoro_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  duration_minutes INTEGER,
  type TEXT NOT NULL CHECK (type IN ('focus', 'short_break', 'long_break')),
  completed BOOLEAN DEFAULT TRUE,
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  pomodoro_focus INTEGER DEFAULT 25,
  pomodoro_short_break INTEGER DEFAULT 5,
  pomodoro_long_break INTEGER DEFAULT 15,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'green')),
  language TEXT DEFAULT 'es' CHECK (language IN ('es', 'en', 'fr', 'de')),
  ai_density TEXT DEFAULT 'standard' CHECK (ai_density IN ('concise', 'standard', 'detailed')),
  auto_start_timer BOOLEAN DEFAULT FALSE,
  sound_enabled BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE keypoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pomodoro_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (Users can only see their own data)
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

-- Create indexes for performance
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_summaries_user_id ON summaries(user_id);
CREATE INDEX idx_summaries_document_id ON summaries(document_id);
CREATE INDEX idx_flashcards_user_id ON flashcards(user_id);
CREATE INDEX idx_flashcards_next_review ON flashcards(next_review_at);
CREATE INDEX idx_keypoints_user_id ON keypoints(user_id);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_pomodoro_user_id ON pomodoro_sessions(user_id);
