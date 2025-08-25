'use client'
/* global gapi, google */
import { useEffect, useRef, useState } from 'react'

declare const gapi: any
declare const google: any

type TokenClient = {
  requestAccessToken: (options?: { prompt?: string }) => void
}

export default function useGoogleCalendar() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const tokenClient = useRef<TokenClient | null>(null)

  useEffect(() => {
    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        const script = document.createElement('script')
        script.src = src
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => reject()
        document.body.appendChild(script)
      })

    const initGapiClient = async () => {
      await gapi.client.init({
        apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      })
      tokenClient.current = google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/calendar',
        callback: () => {
          setIsSignedIn(!!gapi.client.getToken())
        },
      })
      setIsSignedIn(!!gapi.client.getToken())
    }

    Promise.all([
      loadScript('https://apis.google.com/js/api.js'),
      loadScript('https://accounts.google.com/gsi/client'),
    ]).then(() => {
      gapi.load('client', initGapiClient)
    })
  }, [])

  const signIn = () => {
    tokenClient.current?.requestAccessToken()
  }

  const signOut = () => {
    const token = gapi.client.getToken()
    if (token?.access_token) {
      google.accounts.oauth2.revoke(token.access_token, () => {
        gapi.client.setToken(null)
        setIsSignedIn(false)
      })
    }
  }

  return { isSignedIn, signIn, signOut }
}