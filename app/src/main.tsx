import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './hooks/use-auth'
import { AuthTokenProvider } from './hooks/use-auth-tokens'
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <AuthTokenProvider>
        <App />
      </AuthTokenProvider>
    </AuthProvider>
  </React.StrictMode>
)
