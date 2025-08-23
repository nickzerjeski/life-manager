'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import supabase from '../../supabase'
import { useAuth } from './use-auth'

interface TokenState {
  providerToken: string | null
  refreshToken: string | null
}

const AuthTokenContext = createContext<TokenState>({
  providerToken: null,
  refreshToken: null,
})

export function AuthTokenProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth()
  const [providerToken, setProviderToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)

  useEffect(() => {
    const url = new URL(window.location.href)
    const code = url.searchParams.get('code')
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
        if (!error) {
          setProviderToken(data.session?.provider_token ?? null)
          setRefreshToken(data.session?.refresh_token ?? null)
        }
        window.history.replaceState({}, document.title, url.pathname)
      })
    } else {
      setProviderToken(session?.provider_token ?? null)
      setRefreshToken(session?.refresh_token ?? null)
    }
  }, [session])

  return (
    <AuthTokenContext.Provider value={{ providerToken, refreshToken }}>
      {children}
    </AuthTokenContext.Provider>
  )
}

export const useAuthTokens = () => useContext(AuthTokenContext)
