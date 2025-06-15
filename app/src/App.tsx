import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import RootLayout from '@/components/RootLayout'
import Home from '@/pages/Page'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'

export default function App() {
  const { session } = useAuth()
  const [view, setView] = useState<'login' | 'register'>('login')

  if (!session) {
    return view === 'login' ? (
      <LoginPage onShowRegister={() => setView('register')} />
    ) : (
      <RegisterPage onShowLogin={() => setView('login')} />
    )
  }

  return (
    <RootLayout>
      <Home />
    </RootLayout>
  )
}
