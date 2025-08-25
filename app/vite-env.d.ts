/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_STORAGE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_DOCUMENT_ENCODING_WEBHOOK?: string;
  readonly VITE_RAG_AGENT_WEBHOOK?: string;
  readonly VITE_SETUP_AGENT_WEBHOOK?: string;
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_GOOGLE_API_KEY?: string;
  // add more as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
