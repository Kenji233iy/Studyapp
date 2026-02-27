import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import LoginPage from './pages/LoginPage'
import DashboardLayout from './components/DashboardLayout'
import UploadPage from './pages/UploadPage'
import SummariesPage from './pages/SummariesPage'
import FlashcardsPage from './pages/FlashcardsPage'
import KeypointsPage from './pages/KeypointsPage'
import ChatPage from './pages/ChatPage'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session)
    })
  }, [])

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">StudyFlow</h1>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/upload" />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/resumenes" element={<SummariesPage />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route path="/puntos" element={<KeypointsPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
