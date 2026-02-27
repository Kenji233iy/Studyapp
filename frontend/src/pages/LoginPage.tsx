import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #f0f2f7 0%, #e8f4f8 50%, #f0e8f8 100%)' }}>
      <div className="glass max-w-md w-full p-8">
        <h1 className="text-4xl font-display font-bold mb-2 text-center" style={{ color: 'var(--text)' }}>
          StudyFlow
        </h1>
        <p className="text-center mb-8" style={{ color: 'var(--text2)' }}>
          AI-Powered Study Assistant
        </p>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google']}
          redirectTo={`${window.location.origin}/`}
        />
      </div>
    </div>
  )
}
