import { useEffect, useState } from 'react';

interface GCalEvent {
  id: string;
  summary?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  project: string;
}

export function mapEvent(ev: GCalEvent): CalendarEvent {
  const startStr = ev.start?.dateTime || ev.start?.date || '';
  const endStr = ev.end?.dateTime || ev.end?.date || '';
  return {
    id: ev.id,
    title: ev.summary || '(no title)',
    start: new Date(startStr),
    end: new Date(endStr),
    project: 'google',
  };
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY as string;
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

export function useGoogleCalendar() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [gapiLoaded, setGapiLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = initClient;
    document.body.appendChild(script);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function initClient() {
    // @ts-expect-error gapi provided by external script
    gapi.load('client', async () => {
      // @ts-expect-error gapi provided by external script
      await gapi.client.init({ apiKey: API_KEY, clientId: CLIENT_ID, discoveryDocs: [DISCOVERY_DOC], scope: SCOPES });
      // @ts-expect-error gapi provided by external script
      const auth = gapi.auth2.getAuthInstance();
      setIsSignedIn(auth.isSignedIn.get());
      auth.isSignedIn.listen(setIsSignedIn);
      setGapiLoaded(true);
    });
  }

  async function loadEvents() {
    if (!gapiLoaded) return;
    // @ts-expect-error gapi provided by external script
    const resp = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 50,
      orderBy: 'startTime',
    });
    const items: GCalEvent[] = resp.result.items || [];
    setEvents(items.map(mapEvent));
  }

  const signIn = () => {
    if (!gapiLoaded) return;
    // @ts-expect-error gapi provided by external script
    gapi.auth2.getAuthInstance().signIn();
  };

  const signOut = () => {
    if (!gapiLoaded) return;
    // @ts-expect-error gapi provided by external script
    gapi.auth2.getAuthInstance().signOut();
    setEvents([]);
  };

  return { isSignedIn, events, signIn, signOut, loadEvents };
}

export default useGoogleCalendar;

