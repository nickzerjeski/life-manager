'use client'
import { useEffect } from 'react'
import { useAuthTokens } from './use-auth-tokens'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gapi?: any
  }
}

export function useGoogleCalendar() {
  const { providerToken } = useAuthTokens()

  useEffect(() => {
    if (!providerToken || !window.gapi) return

    function init() {
      const auth = window.gapi.auth2?.getAuthInstance()
      if (auth && auth.isSignedIn.get()) {
        window.gapi.client.setToken({ access_token: providerToken })
      }
    }

    window.gapi.load('client:auth2', init)
  }, [providerToken])
}
